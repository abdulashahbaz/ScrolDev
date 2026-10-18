import { cn } from "@/lib/cn";

// Generative cover art for posts and case studies: an eclipse and orbit lines,
// tinted by `hue` and varied by `seed`. Pure SVG, so no image files needed.
// It fills its nearest positioned ancestor.
export function CoverArt({ hue, seed = 0, className }: { hue: number; seed?: number; className?: string }) {
  const cx = 62 + ((seed * 17) % 24);
  const cy = 38 + ((seed * 11) % 20);
  const id = `cover-${hue}-${seed}`;
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-ink-850", className)} aria-hidden="true">
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id={`${id}-glow`} cx={`${cx / 1.6}%`} cy={`${cy}%`} r="60%">
            <stop offset="0" stopColor={`hsl(${hue} 85% 65%)`} stopOpacity="0.55" />
            <stop offset="1" stopColor={`hsl(${hue} 85% 65%)`} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={`hsl(${hue} 70% 40%)`} />
            <stop offset="0.6" stopColor={`hsl(${hue} 90% 68%)`} />
            <stop offset="1" stopColor={`hsl(${hue} 100% 92%)`} />
          </linearGradient>
          <pattern id={`${id}-dots`} width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.25" fill="rgb(243 238 228 / 0.12)" />
          </pattern>
        </defs>
        <rect width="160" height="100" fill={`url(#${id}-dots)`} />
        <rect width="160" height="100" fill={`url(#${id}-glow)`} />
        {[18, 28, 40, 54].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgb(243 238 228)"
            strokeOpacity={0.09 - i * 0.015}
            strokeWidth="0.3"
            strokeDasharray={i % 2 ? "1 2" : undefined}
          />
        ))}
        <circle cx={cx} cy={cy} r="13" fill={`url(#${id}-rim)`} />
        <circle cx={cx - 1.4} cy={cy + 1.4} r="12.4" fill="#0f1014" />
        <circle cx={cx + 9.2} cy={cy - 9.2} r="0.9" fill={`hsl(${hue} 100% 92%)`} />
      </svg>
    </div>
  );
}
