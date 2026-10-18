import { cn } from "@/lib/cn";

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Initials on a soft gradient, tinted by `hue`. Stands in for photos.
export function Avatar({ name, hue = 28, className }: { name: string; hue?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-full font-medium text-white/90", className)}
      style={{
        background: `radial-gradient(circle at 30% 25%, hsl(${hue} 70% 68%), hsl(${hue} 45% 32%) 70%)`,
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.25)",
      }}
    >
      {initials(name)}
    </span>
  );
}
