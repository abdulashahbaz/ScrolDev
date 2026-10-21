import { useEffect, useRef } from "react";

// How quickly the cursor catches up with the mouse (per second). High enough to
// feel attached, low enough to smooth out jumpy mouse input.
const FOLLOW = 28;

// Follows the mouse on desktop. Positioned by writing its transform directly
// every frame, so it never re-renders.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let seen = false;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const k = 1 - Math.exp(-FOLLOW * Math.min(0.1, (now - last) / 1000));
      last = now;
      x += (targetX - x) * k;
      y += (targetY - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!seen) {
        // Appear where the mouse is rather than gliding in from the corner.
        seen = true;
        x = targetX;
        y = targetY;
      }
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-exclusion"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22.75" stroke="#fff" strokeWidth="2.5" />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M10.5 24Q24 9.5 37.5 24Q24 38.5 10.5 24ZM24 18.25a5.75 5.75 0 1 0 0 11.5a5.75 5.75 0 1 0 0-11.5ZM24 21.6a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8Z"
        />
      </svg>
    </div>
  );
}
