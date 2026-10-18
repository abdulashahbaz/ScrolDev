import { useEffect, useRef } from "react";

// Follows the mouse on desktop. Positioned by writing left/top directly, so it never re-renders.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-exclusion"
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
