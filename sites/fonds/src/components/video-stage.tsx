import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { videos } from "../content/site";
import { queries } from "../hooks/use-media-query";

export type VideoStageHandle = {
  // Called by the scroll engine when the hero leaves or re-enters the screen.
  setVisible: (visible: boolean) => void;
};

// How long the mouse has to rest before the films go back to playing on their own.
const IDLE_MS = 2500;

// Two stacked videos that play back to back on their own. With a mouse, moving
// the cursor takes over and scrubs them: left of centre scrubs the right video,
// right of centre scrubs the left one, and a dead zone in the middle parks both
// on their first frame. Once the mouse rests, playback resumes from that frame.
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
    const autoplay = !window.matchMedia(queries.reducedMotion).matches;
    let active = right;
    let playing = false;

    const show = (video: HTMLVideoElement) => {
      active = video;
      left.style.display = video === left ? "block" : "none";
      right.style.display = video === right ? "block" : "none";
    };

    // Back-to-back playback: whichever video is showing plays to its end, then the other starts.
    const play = () => {
      playing = true;
      if (autoplay && visibleRef.current) active.play().catch(() => {});
    };
    const stop = () => {
      playing = false;
      left.pause();
      right.pause();
    };
    const onEnded = (e: Event) => {
      if (!playing) return;
      const next = e.target === left ? right : left;
      show(next);
      next.currentTime = 0;
      play();
    };
    left.addEventListener("ended", onEnded);
    right.addEventListener("ended", onEnded);
    playbackRef.current = {
      pause: () => active.pause(),
      resume: () => {
        if (playing) play();
      },
    };

    let cleanupPointer = () => {};
    if (window.matchMedia(queries.finePointer).matches) {
      let mouseX = window.innerWidth / 2;
      let lastMove = -Infinity;
      let raf = 0;

      // Only ask for a new frame once the browser has finished the previous
      // seek; queuing seeks while one is in flight is what makes scrubbing jitter.
      const seek = (video: HTMLVideoElement, time: number) => {
        if (!video.seeking && Math.abs(video.currentTime - time) > 0.001) video.currentTime = time;
      };

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visibleRef.current) return;
        if (now - lastMove > IDLE_MS) {
          if (!playing) play();
          return;
        }
        if (playing) stop();

        const { left: x0, width } = container.getBoundingClientRect();
        const center = width / 2;
        const deadZone = Math.max(30, width * 0.05);
        const dx = mouseX - x0 - center;

        if (Math.abs(dx) <= deadZone) {
          seek(left, 0);
          seek(right, 0);
          return;
        }
        const video = dx < 0 ? right : left;
        if (video !== active) show(video);
        if (!video.duration) return;
        const progress = Math.min(1, (Math.abs(dx) - deadZone) / (center - deadZone));
        // Stop just short of the end: seeking to the exact duration can show a blank frame.
        seek(video, progress * Math.max(0, video.duration - 0.05));
      };

      const move = (e: MouseEvent) => {
        mouseX = e.clientX;
        lastMove = performance.now();
      };
      window.addEventListener("mousemove", move, { passive: true });
      raf = requestAnimationFrame(tick);
      cleanupPointer = () => {
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(raf);
      };
    } else {
      // Touch: start with the left video.
      show(left);
      left.currentTime = 0;
      play();
    }

    return () => {
      cleanupPointer();
      left.removeEventListener("ended", onEnded);
      right.removeEventListener("ended", onEnded);
      playbackRef.current = null;
      stop();
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
