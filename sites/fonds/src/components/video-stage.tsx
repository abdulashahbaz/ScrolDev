import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { videos } from "../content/site";
import { queries } from "../hooks/use-media-query";

export type VideoStageHandle = {
  // Called by the scroll engine when the hero leaves or re-enters the screen.
  setVisible: (visible: boolean) => void;
};

// How quickly the head catches up with where it should be looking (per second).
const EASE = 6;
// How long the mouse has to rest before the idle sway takes over again.
const IDLE_MS = 2500;
// The idle sway: a slow look to one side, back, then the other side.
const SWAY_PERIOD_MS = 14000;
const SWAY_AMPLITUDE = 0.8;

// Two clips that both start on the same front-facing frame and turn the head
// to opposite sides. A single "pose" from -1 to 1 drives them: positive scrubs
// the left clip, negative the right one, and 0 is the shared first frame, so
// crossing the centre is seamless. The cursor sets the target pose (with a dead
// zone in the middle); when the mouse rests, or on touch screens, a slow sway
// does. The pose eases towards its target every frame, and the clips are
// encoded with every frame as a keyframe, so each seek lands immediately.
export function VideoStage({ ref }: { ref: Ref<VideoStageHandle> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLVideoElement>(null);
  const rightRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(true);

  useImperativeHandle(
    ref,
    () => ({
      setVisible(visible) {
        visibleRef.current = visible;
        containerRef.current!.style.visibility = visible ? "" : "hidden";
      },
    }),
    [],
  );

  // Fade in once both videos have had a frame to show. Each one is counted the
  // first time it loads: readyState dips again during every seek, so checking it
  // later could miss the moment and leave the hero blank.
  useEffect(() => {
    const container = containerRef.current!;
    const pair = [leftRef.current!, rightRef.current!];
    const loaded = new Set<HTMLVideoElement>();
    const mark = (video: HTMLVideoElement) => {
      loaded.add(video);
      if (loaded.size === pair.length) container.style.opacity = "1";
    };
    const onLoaded = (e: Event) => mark(e.currentTarget as HTMLVideoElement);
    for (const video of pair) {
      video.addEventListener("loadeddata", onLoaded);
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) mark(video);
    }
    return () => pair.forEach((v) => v.removeEventListener("loadeddata", onLoaded));
  }, []);

  useEffect(() => {
    const container = containerRef.current!;
    const left = leftRef.current!;
    const right = rightRef.current!;
    const sway = !window.matchMedia(queries.reducedMotion).matches;
    const pointer = window.matchMedia(queries.finePointer).matches;

    // Some mobile browsers only fetch video data once playback has started.
    for (const video of [left, right]) {
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    }

    let shown = right;
    let pose = 0;
    let mouseX = window.innerWidth / 2;
    let lastMove = -Infinity;
    let swayStart = performance.now();
    let last = performance.now();
    let raf = 0;

    // Only ask for a new frame once the browser has finished the previous seek,
    // and only when it is at least half a frame (at 30 fps) away.
    const seek = (video: HTMLVideoElement, time: number) => {
      if (!video.seeking && Math.abs(video.currentTime - time) > 1 / 60) video.currentTime = time;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!visibleRef.current) return;

      let target = 0;
      if (pointer && now - lastMove <= IDLE_MS) {
        const { left: x0, width } = container.getBoundingClientRect();
        const center = width / 2;
        const deadZone = Math.max(30, width * 0.05);
        const dx = mouseX - x0 - center;
        if (Math.abs(dx) > deadZone) target = Math.sign(dx) * Math.min(1, (Math.abs(dx) - deadZone) / (center - deadZone));
        swayStart = now;
      } else if (sway) {
        target = SWAY_AMPLITUDE * Math.sin(((now - swayStart) / SWAY_PERIOD_MS) * 2 * Math.PI);
      }
      pose += (target - pose) * (1 - Math.exp(-EASE * dt));

      // Cursor right of centre turns the head with the left clip, left of centre with the right clip.
      const video = pose >= 0 ? left : right;
      const parked = video === left ? right : left;
      if (video !== shown) {
        shown = video;
        video.style.opacity = "1";
        parked.style.opacity = "0";
      }
      if (video.duration) seek(video, Math.abs(pose) * Math.max(0, video.duration - 0.05));
      // Keep the hidden clip on the shared first frame, ready for the next crossing.
      seek(parked, 0);
    };

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      lastMove = performance.now();
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // The two clips' first frames are near-identical, not pixel-identical, so the
  // swap at the centre crossfades rather than cuts.
  const video = "absolute inset-0 size-full object-cover transition-opacity duration-200";
  return (
    <div
      ref={containerRef}
      id="main-canvas"
      aria-hidden
      className="pointer-events-none fixed top-[220px] left-0 z-0 h-[calc(100vh-220px)] w-screen overflow-hidden opacity-0 transition-opacity duration-300 ease-[ease] sm:inset-0 sm:h-full sm:w-full"
    >
      <video ref={leftRef} className={video} style={{ opacity: 0 }} src={videos.left} muted playsInline preload="auto" />
      <video ref={rightRef} className={video} style={{ opacity: 1 }} src={videos.right} muted playsInline preload="auto" />
    </div>
  );
}
