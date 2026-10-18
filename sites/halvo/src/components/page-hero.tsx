import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
  children?: React.ReactNode;
  className?: string;
};

// The opening block of every inner page: glow, faint grid and a big headline.
export function PageHero({ eyebrow, title, body, actions, align = "left", children, className }: Props) {
  return (
    <section className={cn("relative overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgb(243_238_228/0.03)_1px,transparent_1px),linear-gradient(90deg,rgb(243_238_228/0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(60%_60%_at_50%_0%,#000,transparent)]" />
        <div
          className={cn(
            "absolute top-0 h-[480px] w-[900px] bg-[radial-gradient(50%_50%_at_50%_0%,rgb(245_166_91/0.16),transparent)]",
            align === "center" ? "left-1/2 -translate-x-1/2" : "-left-40",
          )}
        />
      </div>
      <div className="container-x relative">
        <div className={cn("animate-fade-up", align === "center" && "mx-auto text-center", "max-w-4xl")}>
          <p className={cn("eyebrow flex items-center gap-2 text-ember", align === "center" && "justify-center")}>
            <span className="h-px w-5 bg-current opacity-60" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="display mt-6 text-[clamp(2.75rem,6.4vw,5.5rem)] text-bone">{title}</h1>
          {body && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-mute sm:text-lg",
                align === "center" && "mx-auto",
              )}
            >
              {body}
            </p>
          )}
          {actions && (
            <div className={cn("mt-9 flex flex-col gap-3 sm:flex-row", align === "center" && "justify-center")}>
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
