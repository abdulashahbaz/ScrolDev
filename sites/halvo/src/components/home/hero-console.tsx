"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  CircleCheck,
  Database,
  FileText,
  GitBranch,
  House,
  Inbox,
  LoaderCircle,
  Plug,
  ScrollText,
  Search,
  TriangleAlert,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

// One looping "run" of the reconciliation agent. Each step starts at one
// phase and finishes at a later one; PHASE_MS is how long each phase lasts.
const PHASE_MS = [700, 1000, 1300, 1100, 1100, 1500, 1000, 900, 1000, 4600];
const LAST = PHASE_MS.length - 1;

type Step = { label: string; meta: string; icon: LucideIcon; start: number; done: number; tone?: "warn" };

const STEPS: Step[] = [
  { label: "Pulled 214 new invoices from NetSuite", meta: "1.2s", icon: Database, start: 1, done: 2 },
  { label: "Matched 209 invoices to Stripe payouts", meta: "97.7% match", icon: GitBranch, start: 2, done: 3 },
  { label: "Flagged 5 mismatches over $500", meta: "$18,240", icon: TriangleAlert, start: 3, done: 4, tone: "warn" },
  { label: "Drafted 5 adjusting entries", meta: "confidence 0.96", icon: FileText, start: 4, done: 5 },
  { label: "Approval from Maya Chen, Controller", meta: "Slack", icon: UserCheck, start: 5, done: 8 },
  { label: "Posted 5 journal entries to NetSuite", meta: "0.9s", icon: CircleCheck, start: 8, done: 9 },
];

const LOG: { at: number; time: string; kind: string; text: string; tone?: "warn" | "ok" | "ember" }[] = [
  { at: 0, time: "02:00:00", kind: "trigger", text: "nightly schedule" },
  { at: 1, time: "02:00:01", kind: "read", text: "netsuite.invoices → 214 rows" },
  { at: 2, time: "02:00:06", kind: "match", text: "stripe.payouts → 209 / 214" },
  { at: 3, time: "02:00:07", kind: "flag", text: "INV-20931 Δ $4,120 duplicate", tone: "warn" },
  { at: 3, time: "02:00:07", kind: "flag", text: "INV-20977 Δ $6,880 rate mismatch", tone: "warn" },
  { at: 4, time: "02:00:11", kind: "draft", text: "5 entries · policy FIN-AP-04" },
  { at: 5, time: "02:00:12", kind: "approve", text: "requested → @maya.chen", tone: "ember" },
  { at: 7, time: "07:41:26", kind: "approve", text: "granted by Maya Chen", tone: "ok" },
  { at: 8, time: "07:41:27", kind: "write", text: "netsuite.journal → 5 posted" },
  { at: 9, time: "07:41:28", kind: "done", text: "run complete · 4.5h saved", tone: "ok" },
];

const NAV: { label: string; icon: LucideIcon; badge?: string }[] = [
  { label: "Home", icon: House },
  { label: "Runs", icon: Workflow },
  { label: "Agents", icon: Bot },
  { label: "Approvals", icon: Inbox, badge: "3" },
  { label: "Audit log", icon: ScrollText },
  { label: "Integrations", icon: Plug },
];

export function HeroConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const current = reduce ? LAST : phase;

  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setPhase((p) => (p >= LAST ? 0 : p + 1)), PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, inView, reduce]);

  const status =
    current >= 9
      ? { label: "Completed", cls: "text-mint bg-mint/10 border-mint/20" }
      : current >= 5 && current < 8
        ? { label: "Needs approval", cls: "text-ember bg-ember/10 border-ember/25" }
        : { label: "Running", cls: "text-sky bg-sky/10 border-sky/20" };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[18px] border border-white/10 bg-ink-900/90 text-left shadow-[0_50px_140px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_0_0/0.6)] backdrop-blur-xl"
    >
      {/* Window chrome */}
      <div className="flex h-11 items-center gap-3 border-b border-white/[0.07] px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <p className="truncate text-xs text-dim">
          Northpeak <span className="px-1 text-white/15">/</span> Finance <span className="px-1 text-white/15">/</span>
          <span className="text-mute">Runs</span>
        </p>
        <div className="ml-auto hidden items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 text-[11px] text-dim sm:flex">
          <Search className="size-3" aria-hidden="true" /> Search runs
          <kbd className="ml-4 rounded bg-white/[0.06] px-1 font-mono text-[10px]">⌘K</kbd>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] lg:grid-cols-[196px_1fr_300px]">
        {/* Sidebar */}
        <aside className="hidden border-r border-white/[0.07] p-3 lg:block" aria-hidden="true">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-sky/80 to-sky/30 text-[11px] font-semibold text-ink-950">
              N
            </span>
            <span className="text-[13px] font-medium text-bone">Northpeak</span>
            <ChevronDown className="ml-auto size-3.5 text-dim" />
          </div>
          <ul className="mt-4 grid gap-0.5">
            {NAV.map((item) => (
              <li
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px]",
                  item.label === "Runs" ? "bg-white/[0.06] text-bone" : "text-mute",
                )}
              >
                <item.icon className="size-4" strokeWidth={1.6} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto rounded-full bg-ember/15 px-1.5 text-[10px] font-medium text-ember">
                    {item.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[11px] text-dim">Spend today</p>
            <p className="mt-1 font-mono text-[13px] text-bone">
              $412 <span className="text-dim">/ $2,000</span>
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[21%] rounded-full bg-gradient-to-r from-ember/60 to-ember" />
            </div>
          </div>
        </aside>

        {/* Run detail */}
        <div className="min-w-0 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] text-dim">RUN #4,812 · AGENT RECON v14</p>
              <p className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] text-bone">Invoice reconciliation</p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-500",
                status.cls,
              )}
              role="status"
            >
              <span className="size-1.5 animate-pulse-dot rounded-full bg-current" aria-hidden="true" />
              {status.label}
            </span>
          </div>

          <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-white/[0.05]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ember/40 via-ember to-ember-2"
              animate={{ width: `${(current / LAST) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <ol className="mt-5 grid gap-1">
            {STEPS.map((step, i) => {
              const state = current >= step.done ? "done" : current >= step.start ? "active" : "pending";
              return (
                <li key={step.label}>
                  <StepRow step={step} state={state} />
                  {i === 4 && (
                    <AnimatePresence initial={false}>
                      {current >= 5 && current < 9 && <ApprovalCard phase={current} />}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ol>

          <AnimatePresence>
            {current >= 9 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-mint/15 bg-mint/[0.06] px-4 py-3"
              >
                <span className="flex items-center gap-2 text-[13px] text-mint">
                  <CircleCheck className="size-4" aria-hidden="true" /> Completed in 3m 12s of agent time
                </span>
                <span className="font-mono text-[11px] text-mint/80">~4.5 hours saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live log */}
        <div className="hidden border-l border-white/[0.07] bg-black/20 md:flex md:flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
            <p className="text-[12px] font-medium text-bone">Activity</p>
            <p className="flex items-center gap-1.5 font-mono text-[10px] text-dim">
              <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" /> LIVE
            </p>
          </div>
          <ul
            className="flex-1 space-y-2.5 overflow-hidden px-4 py-4 font-mono text-[11px] leading-snug"
            aria-hidden="true"
          >
            <AnimatePresence initial={false}>
              {LOG.filter((l) => l.at <= current).map((l) => (
                <motion.li
                  key={l.time + l.text}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-[52px_52px_1fr] gap-2"
                >
                  <span className="text-dim">{l.time}</span>
                  <span
                    className={cn(
                      l.tone === "warn"
                        ? "text-ember"
                        : l.tone === "ok"
                          ? "text-mint"
                          : l.tone === "ember"
                            ? "text-ember-2"
                            : "text-sky",
                    )}
                  >
                    {l.kind}
                  </span>
                  <span className="truncate text-mute">{l.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="grid grid-cols-2 border-t border-white/[0.07]">
            <div className="border-r border-white/[0.07] px-4 py-3">
              <p className="text-[10px] text-dim">Tasks today</p>
              <p className="mt-0.5 font-mono text-sm text-bone">1,284</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-dim">Auto-resolved</p>
              <p className="mt-0.5 font-mono text-sm text-bone">94.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRow({ step, state }: { step: Step; state: "pending" | "active" | "done" }) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-lg px-2.5 py-2 transition-colors duration-500",
        state === "active" && "bg-white/[0.035]",
      )}
    >
      {state === "active" && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
          initial={{ left: "-35%" }}
          animate={{ left: "110%" }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-500",
          state === "done" && step.tone === "warn" && "border-ember/30 bg-ember/10 text-ember",
          state === "done" && step.tone !== "warn" && "border-mint/25 bg-mint/10 text-mint",
          state === "active" && "border-sky/30 bg-sky/10 text-sky",
          state === "pending" && "border-white/[0.08] text-dim",
        )}
      >
        {state === "done" ? (
          step.tone === "warn" ? (
            <TriangleAlert className="size-3" aria-hidden="true" />
          ) : (
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          )
        ) : state === "active" ? (
          <LoaderCircle className="size-3 animate-spin" aria-hidden="true" />
        ) : (
          <step.icon className="size-3" aria-hidden="true" />
        )}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px] transition-colors duration-500",
          state === "pending" ? "text-dim" : "text-bone",
        )}
      >
        {step.label}
      </span>
      <span
        className={cn(
          "hidden shrink-0 font-mono text-[11px] transition-opacity duration-500 sm:block",
          state === "done" ? "text-mute opacity-100" : "opacity-0",
        )}
      >
        {step.meta}
      </span>
    </div>
  );
}

function ApprovalCard({ phase }: { phase: number }) {
  const approved = phase >= 7;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="relative mb-1 ml-[38px] mt-1 rounded-xl border border-ember/20 bg-gradient-to-b from-ember/[0.07] to-transparent p-3.5">
        <p className="text-[13px] text-bone">
          Post 5 adjustments totalling <span className="font-mono text-ember-2">$18,240</span>?
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-mute">
          2 duplicate carrier charges, 3 rate mismatches against contract. Evidence attached for each.
        </p>
        <div className="relative mt-3 flex items-center gap-2">
          <span className="rounded-md border border-white/10 px-2.5 py-1 text-[12px] text-mute">Reject</span>
          <span className="rounded-md border border-white/10 px-2.5 py-1 text-[12px] text-mute">Edit</span>
          <motion.span
            animate={approved ? { scale: [1, 0.94, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors duration-300",
              approved ? "bg-mint text-ink-950" : "bg-bone text-ink-950",
            )}
          >
            {approved ? (
              <>
                <Check className="size-3" strokeWidth={3} aria-hidden="true" /> Approved
              </>
            ) : (
              "Approve"
            )}
          </motion.span>
          {approved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-1 truncate text-[11px] text-dim"
            >
              by Maya Chen · 07:41
            </motion.span>
          )}
          {/* A cursor glides in and "clicks" Approve. */}
          <AnimatePresence>
            {phase >= 6 && phase < 8 && (
              <motion.svg
                key="cursor"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-[148px] top-[9px] size-5 drop-shadow-[0_2px_4px_rgb(0_0_0/0.6)]"
                initial={{ opacity: 0, x: 90, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: phase === 7 ? 0.85 : 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
              >
                <path
                  d="M5 3l14 7.5-6.2 1.6L10 18.5z"
                  fill="#fff"
                  stroke="#07080a"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
