import type { LogoName } from "@/content/customers";
import { cn } from "@/lib/cn";

// Wordmarks for the fictional customers. Each has its own type treatment so a
// row of them reads like a real logo wall.
export function FakeLogo({ name, className }: { name: LogoName | string; className?: string }) {
  const base = cn("inline-flex items-center gap-2 whitespace-nowrap", className);
  switch (name) {
    case "Northpeak":
      return (
        <span className={cn(base, "text-[1.15rem] font-semibold tracking-[-0.04em]")}>
          <svg viewBox="0 0 24 24" className="size-[1.1em]" aria-hidden="true">
            <path d="M2 20 9.5 6l4 7.5L16 9l6 11z" fill="currentColor" />
          </svg>
          northpeak
        </span>
      );
    case "Lumio":
      return (
        <span className={cn(base, "text-[1.2rem] font-bold tracking-[-0.05em]")}>
          <svg viewBox="0 0 24 24" className="size-[1em]" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          </svg>
          lumio
        </span>
      );
    case "Copperline":
      return <span className={cn(base, "font-serif text-[1.45rem] italic tracking-[-0.01em]")}>Copperline</span>;
    case "Brightwater":
      return (
        <span className={cn(base, "font-mono text-[0.8rem] font-medium tracking-[0.22em]")}>
          <svg viewBox="0 0 24 24" className="size-[1.4em]" aria-hidden="true">
            <path
              d="M2 9c3.3-3 6.7 3 10 0s6.7 3 10 0M2 15c3.3-3 6.7 3 10 0s6.7 3 10 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          BRIGHTWATER
        </span>
      );
    case "Fernhill":
      return (
        <span className={cn(base, "font-serif text-[1.35rem] tracking-[-0.01em]")}>
          <svg viewBox="0 0 24 24" className="size-[0.9em]" aria-hidden="true">
            <path
              d="M12 22V9M12 9c0-4 3-7 8-7 0 5-3 8-8 8m0-1C12 5 9 2 4 2c0 5 3 8 8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Fernhill
        </span>
      );
    case "Quantra":
      return (
        <span className={cn(base, "text-[0.95rem] font-bold tracking-[0.32em]")}>
          <span className="size-3 rotate-45 bg-current" aria-hidden="true" />
          QUANTRA
        </span>
      );
    case "Ridgeway":
      return (
        <span className={cn(base, "text-[1.2rem] font-extrabold tracking-[-0.05em]")}>
          ridgeway<span className="opacity-50">/</span>
        </span>
      );
    case "Oakline":
      return (
        <span className={cn(base, "text-[1.2rem] font-black lowercase tracking-[-0.06em]")}>
          oakline
          <span className="size-1.5 translate-y-1 rounded-full bg-current" aria-hidden="true" />
        </span>
      );
    case "Marlowe":
      return <span className={cn(base, "font-serif text-[1.15rem] uppercase tracking-[0.28em]")}>Marlowe</span>;
    case "Sable & Co":
      return <span className={cn(base, "font-serif text-[1.4rem] italic")}>Sable &amp; Co.</span>;
    default:
      return <span className={cn(base, "text-lg font-semibold tracking-tight")}>{name}</span>;
  }
}
