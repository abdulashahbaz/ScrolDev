import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ember" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-bone text-ink-950 shadow-[inset_0_-2px_0_rgb(0_0_0/0.12),0_0_0_1px_rgb(255_255_255/0.1)] hover:shadow-[inset_0_-2px_0_rgb(0_0_0/0.12),0_8px_32px_-8px_rgb(245_166_91/0.6)]",
  ember:
    "bg-ember text-ink-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.4),inset_0_-2px_0_rgb(0_0_0/0.15)] hover:bg-ember-2 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_10px_40px_-10px_rgb(245_166_91/0.8)]",
  secondary: "border hairline bg-white/[0.03] text-bone hover:bg-white/[0.07] hover:border-white/15",
  dark: "bg-ink-950 text-bone hover:bg-ink-800",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", size = "md", arrow = false, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-all duration-300 ease-out-expo active:scale-[0.98]",
        size === "md" ? "h-10 px-4.5 text-sm" : "h-12 px-6 text-[0.9375rem]",
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 -mr-0.5 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5"
        />
      )}
    </Link>
  );
}
