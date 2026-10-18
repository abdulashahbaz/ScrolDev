import { cn } from "@/lib/cn";

// The Halvo mark: an eclipse, a lit crescent around a dark disc.
// `id` keeps the gradient and mask ids unique when the mark appears twice.
export function HalvoMark({ className, id = "mark" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b35f1b" />
          <stop offset="0.55" stopColor="#f5a65b" />
          <stop offset="1" stopColor="#ffe6c4" />
        </linearGradient>
        <mask id={`${id}-m`}>
          <rect width="32" height="32" fill="white" />
          <circle cx="14.1" cy="17.9" r="10.4" fill="black" />
        </mask>
      </defs>
      <circle cx="16" cy="16" r="13" fill={`url(#${id}-g)`} mask={`url(#${id}-m)`} />
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeOpacity="0.14" />
      <circle cx="25.4" cy="6.6" r="1.6" fill="#fff4e3" />
    </svg>
  );
}

export function Logo({ className, id }: { className?: string; id?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.03em]", className)}>
      <HalvoMark id={id} className="size-[1.6em]" />
      halvo
    </span>
  );
}
