"use client";

import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Headset, Landmark, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { solutions, type Solution } from "@/content/solutions";
import { cn } from "@/lib/cn";
import { Accent, SectionHeading } from "../section-heading";
import { FlowDiagram } from "../visuals/flow-diagram";

const ICONS: Record<Solution["slug"], LucideIcon> = {
  finance: Landmark,
  support: Headset,
  revenue: TrendingUp,
  people: Users,
};

const CYCLE_MS = 8000;

export function UseCases() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  const auto = !paused && inView && !reduce;
  const active = solutions[index];

  // Advance to the next team on a timer until the visitor picks one.
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % solutions.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [auto, index]);

  const select = (i: number) => {
    setIndex(i);
    setPaused(true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + solutions.length) % solutions.length;
    select(next);
    document.getElementById(`usecase-tab-${solutions[next].slug}`)?.focus();
  };

  return (
    <section id="use-cases" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Use cases"
          title={
            <>
              One platform, <Accent>every</Accent> back office.
            </>
          }
          body="Start with the team that has the most repetitive work. Most customers add a second team within a quarter."
        />

        <div ref={ref} className="mt-14 grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Teams"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
          >
            {solutions.map((s, i) => {
              const Icon = ICONS[s.slug];
              const selected = i === index;
              return (
                <button
                  key={s.slug}
                  id={`usecase-tab-${s.slug}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="usecase-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-colors duration-300 lg:items-start lg:px-5 lg:py-4",
                    selected ? "border-white/10 bg-white/[0.04]" : "border-transparent hover:bg-white/[0.02]",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0 transition-colors lg:mt-0.5",
                      selected ? "text-ember" : "text-dim",
                    )}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <span>
                    <span className={cn("block text-[15px] font-medium", selected ? "text-bone" : "text-mute")}>
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[13px] leading-snug text-mute transition-all duration-500 lg:block",
                        selected ? "mt-1 max-h-12 opacity-100" : "max-h-0 opacity-0",
                      )}
                    >
                      {s.tasks
                        .map((t) => t.title)
                        .slice(0, 3)
                        .join(", ")}
                    </span>
                  </span>
                  {selected && auto && (
                    <motion.span
                      key={`progress-${index}`}
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-[2px] bg-ember/70"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            id="usecase-panel"
            role="tabpanel"
            aria-labelledby={`usecase-tab-${active.slug}`}
            className="surface relative overflow-hidden rounded-[28px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(60%_70%_at_100%_0%,rgb(245_166_91/0.1),transparent)]"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid gap-10 p-6 sm:p-10 xl:grid-cols-[1fr_380px]"
              >
                <div className="flex flex-col">
                  <p className="eyebrow text-dim">{active.name} agents</p>
                  <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-bone">
                    {active.headline} <Accent>{active.accent}</Accent>
                  </h3>
                  <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mute">{active.summary}</p>
                  <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6 max-xl:mt-10">
                    {active.metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="sr-only">{m.label}</dt>
                        <dd className="text-[1.75rem] font-medium leading-none tracking-[-0.04em] text-bone sm:text-[2rem]">
                          {m.value}
                        </dd>
                        <dd className="mt-2 text-[12px] leading-snug text-mute">{m.label}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`/solutions/${active.slug}`}
                    className="group mt-8 inline-flex items-center gap-1.5 self-start text-sm font-medium text-bone"
                  >
                    Explore Halvo for {active.name.toLowerCase()}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
                <FlowDiagram flow={active.flow} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
