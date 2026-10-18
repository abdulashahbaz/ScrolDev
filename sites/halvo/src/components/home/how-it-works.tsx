"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Accent, SectionHeading } from "../section-heading";
import { ConnectVisual } from "../visuals/connect-visual";
import { DescribeVisual } from "../visuals/describe-visual";
import { SuperviseVisual } from "../visuals/supervise-visual";

const STEPS = [
  {
    n: "01",
    title: "Connect the stack you already run.",
    body: "NetSuite, Stripe, Zendesk, Salesforce and 120 more, with exactly the read and write scopes you choose. Halvo never keeps more data than a run needs.",
    points: ["One-click OAuth for most tools", "Per-connector scopes", "Runs in our cloud or yours"],
    Visual: ConnectVisual,
  },
  {
    n: "02",
    title: "Describe the work in plain English.",
    body: "Write the process the way you'd explain it to a new hire. Halvo turns it into a workflow you can read, test and version, with no flowchart required.",
    points: ["Workflows you can read", "Versioned like code", "Replay against past runs before you ship"],
    Visual: DescribeVisual,
  },
  {
    n: "03",
    title: "Supervise it like a team, not a script.",
    body: "Approve what matters from Slack, set spending limits for each agent and watch accuracy on every run. Loosen the rules as the agents earn your trust.",
    points: ["Approvals in Slack or email", "Hard limits before every action", "Accuracy tracked on every run"],
    Visual: SuperviseVisual,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From first connection to <Accent>first agent</Accent> in an afternoon.
            </>
          }
        />

        <div className="mt-16 grid gap-16 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <ol className="min-w-0">
            {STEPS.map((step, i) => (
              <StepBlock key={step.n} index={i} step={step} active={active === i} onActive={() => setActive(i)} />
            ))}
          </ol>

          {/* Desktop: one pinned stage whose visual changes with the active step. */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-290px)] h-[580px]">
              <Stage>
                <AnimatePresence mode="popLayout">
                  {STEPS.map(
                    (step, i) =>
                      i === active && (
                        <motion.div
                          key={step.n}
                          className="absolute inset-0 grid place-items-center p-10"
                          initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <step.Visual active />
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.n}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        i === active ? "w-6 bg-ember" : "w-1.5 bg-white/15",
                      )}
                    />
                  ))}
                </div>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative size-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(245_166_91/0.12),transparent),radial-gradient(rgb(243_238_228/0.06)_1px,transparent_1px)] bg-[size:auto,22px_22px]"
      />
      {children}
    </div>
  );
}

function StepBlock({
  step,
  index,
  active,
  onActive,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // A step becomes active when it crosses the middle band of the viewport.
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const visible = useInView(ref, { margin: "0px 0px -20% 0px" });

  useEffect(() => {
    if (centered) onActive();
  }, [centered, onActive]);

  return (
    <li
      ref={ref}
      className={cn("flex flex-col justify-center lg:min-h-[72vh]", index === 0 && "lg:justify-start lg:pt-24")}
    >
      <div className={cn("transition-opacity duration-500 lg:opacity-30", active && "lg:opacity-100")}>
        <p className="font-mono text-sm text-ember">{step.n}</p>
        <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-bone">
          {step.title}
        </h3>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-mute">{step.body}</p>
        <ul className="mt-6 grid gap-2.5">
          {step.points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-[15px] text-bone/85">
              <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile and tablet: the visual sits under its step. */}
      <div className="mt-10 lg:hidden">
        <div className="relative grid min-h-[420px] place-items-center overflow-hidden rounded-[24px] border border-white/[0.08] bg-ink-900 p-5 sm:p-10">
          <step.Visual active={visible} />
        </div>
      </div>
      {index < STEPS.length - 1 && <div className="h-16 lg:hidden" aria-hidden="true" />}
    </li>
  );
}
