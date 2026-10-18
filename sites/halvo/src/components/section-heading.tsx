import { cn } from "@/lib/cn";
import { Reveal } from "./motion";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, body, align = "left", tone = "dark", className, as = "h2" }: Props) {
  const Heading = as;
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "eyebrow flex items-center gap-2",
            align === "center" && "justify-center",
            tone === "dark" ? "text-ember" : "text-ember-deep",
          )}
        >
          <span className="h-px w-5 bg-current opacity-60" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "mt-5 text-[clamp(2.25rem,4.6vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.04em]",
          tone === "dark" ? "text-bone" : "text-ink-950",
        )}
      >
        {title}
      </Heading>
      {body && (
        <p
          className={cn(
            "mt-5 max-w-xl text-[1.0625rem] leading-relaxed",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-mute" : "text-ink-700",
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}

// The serif italic accent used inside headings.
export function Accent({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <em
      className={cn(
        "font-serif font-normal tracking-[-0.015em] pr-[0.04em]",
        tone === "dark" ? "text-ember-gradient" : "text-ember-deep",
      )}
    >
      {children}
    </em>
  );
}
