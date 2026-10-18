import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { videos } from "../content/site";
import { queries } from "../hooks/use-media-query";

export type VideoStageHandle = {
  // Called by the scroll engine when the hero leaves or re-enters the screen.
  setVisible: (visible: boolean) => void;
};

type Side = "left" | "right";

// Two stacked videos. With a mouse, the cursor scrubs them: left of centre
// scrubs the right video, right of centre scrubs the left one, and a dead zone
// in the middle parks both on their first frame. Touch devices play them back
// to back instead.
export function VideoStage({ ref }: { ref: Ref<VideoStageHandle> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLVideoElement>(null);
  const rightRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(true);
  const playbackRef = useRef<{ pause: () => void; resume: () => void } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setVisible(visible) {
        visibleRef.current = visible;
        containerRef.current!.style.visibility = visible ? "" : "hidden";
        if (visible) playbackRef.current?.resume();
        else playbackRef.current?.pause();
      },
    }),
    [],
  );

  // Fade in once both videos have a frame to show.
  useEffect(() => {
    const container = containerRef.current!;
    const pair = [leftRef.current!, rightRef.current!];
    const check = () => {
      if (pair.every((v) => v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA)) container.style.opacity = "1";
    };
    pair.forEach((v) => v.addEventListener("loadeddata", check));
    check();
    return () => pair.forEach((v) => v.removeEventListener("loadeddata", check));
  }, []);

  useEffect(() => {
    const container = containerRef.current!;
    const left = leftRef.current!;
    const right = rightRef.current!;
    const show = (side: Side) => {
      left.style.display = side === "left" ? "block" : "none";
      right.style.display = side === "right" ? "block" : "none";
    };

    if (window.matchMedia(queries.finePointer).matches) {
      let mouseX = window.innerWidth / 2;
      let active: Side = "right";
      let raf = 0;

      // Only ask for a new frame once the browser has finished the previous
      // seek; queuing seeks while one is in flight is what makes scrubbing jitter.
      const seek = (video: HTMLVideoElement, time: number) => {
        if (!video.seeking && Math.abs(video.currentTime - time) > 0.001) video.currentTime = time;
      };

      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visibleRef.current) return;
        const { left: x0, width } = container.getBoundingClientRect();
        const center = width / 2;
        const deadZone = Math.max(30, width * 0.05);
        const dx = mouseX - x0 - center;

        if (Math.abs(dx) <= deadZone) {
          seek(left, 0);
          seek(right, 0);
          return;
        }
        const side: Side = dx < 0 ? "right" : "left";
        if (side !== active) {
          active = side;
          show(side);
        }
        const video = side === "left" ? left : right;
        if (!video.duration) return;
        const progress = Math.min(1, (Math.abs(dx) - deadZone) / (center - deadZone));
        // Stop just short of the end: seeking to the exact duration can show a blank frame.
        seek(video, progress * Math.max(0, video.duration - 0.05));
      };

      const move = (e: MouseEvent) => (mouseX = e.clientX);
      window.addEventListener("mousemove", move, { passive: true });
      raf = requestAnimationFrame(tick);
      return () => {
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(raf);
      };
    }

    // Touch: left plays first, then right, then left again.
    let active = left;
    const autoplay = !window.matchMedia(queries.reducedMotion).matches;
    const play = (video: HTMLVideoElement) => {
      active = video;
      show(video === left ? "left" : "right");
      video.currentTime = 0;
      if (autoplay && visibleRef.current) video.play().catch(() => {});
    };
    const onLeftEnded = () => play(right);
    const onRightEnded = () => play(left);
    left.addEventListener("ended", onLeftEnded);
    right.addEventListener("ended", onRightEnded);
    playbackRef.current = {
      pause: () => active.pause(),
      resume: () => {
        if (autoplay) active.play().catch(() => {});
      },
    };
    play(left);
    return () => {
      left.removeEventListener("ended", onLeftEnded);
      right.removeEventListener("ended", onRightEnded);
      playbackRef.current = null;
      active.pause();
    };
  }, []);

  const video = "absolute inset-0 size-full object-cover";
  return (
    <div
      ref={containerRef}
      id="main-canvas"
      aria-hidden
      className="pointer-events-none fixed top-[220px] left-0 z-0 h-[calc(100vh-220px)] w-screen overflow-hidden opacity-0 transition-opacity duration-300 ease-[ease] sm:inset-0 sm:h-full sm:w-full"
    >
      <video ref={leftRef} className={video} style={{ display: "none" }} src={videos.left} muted playsInline preload="auto" />
      <video ref={rightRef} className={video} style={{ display: "block" }} src={videos.right} muted playsInline preload="auto" />
    </div>
  );
}
