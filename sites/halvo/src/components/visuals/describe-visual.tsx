"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Clock, Database, FileText, GitBranch, Send, UserCheck, WandSparkles, type LucideIcon } from "lucide-react";

const PROMPT =
  "Every night, match new NetSuite invoices to Stripe payouts. Flag anything off by more than $500 and draft an adjusting entry. Ask Maya before posting anything over $5,000.";

const GENERATED: { kind: string; text: string; icon: LucideIcon; tone?: string }[] = [
  { kind: "Trigger", text: "Every day at 02:00", icon: Clock },
  { kind: "Read", text: "New NetSuite invoices", icon: Database },
  { kind: "Match", text: "Stripe payouts by amount and reference", icon: GitBranch },
  { kind: "If", text: "Difference over $500 → draft adjusting entry", icon: FileText },
  { kind: "Approve", text: "Maya Chen when total exceeds $5,000", icon: UserCheck, tone: "ember" },
  { kind: "Write", text: "Post journal entries to NetSuite", icon: Send },
];

// A plain-English instruction types itself out, then becomes a workflow.
export function DescribeVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const count = reduce ? PROMPT.length : typed;
  const done = count >= PROMPT.length;

  useEffect(() => {
    if (!active || reduce || done) return;
    const t = setTimeout(() => setTyped((n) => Math.min(PROMPT.length, n + 2)), 26);
    return () => clearTimeout(t);
  }, [active, reduce, done, typed]);

  return (
    <div className="w-full max-w-[480px]">
      <div className="surface rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[13px] font-medium text-bone">
            <WandSparkles className="size-4 text-ember" aria-hidden="true" /> New workflow
          </p>
          <span className="font-mono text-[10px] text-dim">DRAFT · v1</span>
        </div>
        <p className="mt-3 min-h-[96px] rounded-xl border border-white/[0.07] bg-black/25 p-3.5 text-[14px] leading-relaxed text-bone">
          <span className="sr-only">{PROMPT}</span>
          <span aria-hidden="true">
            {PROMPT.slice(0, count)}
            {!done && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-ember" />
            )}
          </span>
        </p>
      </div>

      <div className="relative mt-3 pl-5">
        <div
          className="absolute bottom-4 left-[9px] top-4 w-px bg-gradient-to-b from-ember/50 via-white/10 to-transparent"
          aria-hidden="true"
        />
        <ul className="grid gap-2">
          <AnimatePresence>
            {done &&
              GENERATED.map((g, i) => (
                <motion.li
                  key={g.kind}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: reduce ? 0 : 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-center gap-3 rounded-xl border border-white/[0.07] bg-ink-850 px-3 py-2.5"
                >
                  <span
                    className="absolute -left-[15px] size-[7px] rounded-full border border-ember/60 bg-ink-950"
                    aria-hidden="true"
                  />
                  <g.icon
                    className={g.tone === "ember" ? "size-4 text-ember" : "size-4 text-mute"}
                    aria-hidden="true"
                  />
                  <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-wider text-dim">
                    {g.kind}
                  </span>
                  <span className="truncate text-[13px] text-bone">{g.text}</span>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
