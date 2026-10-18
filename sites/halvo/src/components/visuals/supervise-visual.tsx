"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

const QUEUE = [
  { title: "Refund $1,240 to Acme Health", agent: "Support agent", confidence: "0.91", amount: true },
  { title: "Pay vendor invoice $12,400", agent: "AP agent", confidence: "0.97", note: "Needs CFO" },
  { title: "Grant Salesforce admin to J. Rivera", agent: "People agent", confidence: "0.88" },
];

// An approvals queue, a spend guardrail and live accuracy: the supervisor's view.
export function SuperviseVisual({ active }: { active: boolean }) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setApproved(true), 1800);
    return () => {
      clearTimeout(t);
      setApproved(false);
    };
  }, [active]);

  return (
    <div className="grid w-full max-w-[480px] gap-3">
      <div className="surface rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-bone">Approvals</p>
          <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[11px] font-medium text-ember">
            {approved ? 2 : 3} waiting
          </span>
        </div>
        <ul className="mt-3 grid gap-2">
          {QUEUE.map((item, i) => {
            const isApproved = approved && i === 0;
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: active ? 1 : 0.5, y: active ? 0 : 10 }}
                transition={{ duration: 0.5, delay: active ? 0.1 + i * 0.12 : 0, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-500",
                  isApproved ? "border-mint/20 bg-mint/[0.06]" : "border-white/[0.07] bg-ink-850",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-bone">{item.title}</p>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-dim">
                    {item.agent} · confidence {item.confidence}
                    {item.note && <span className="text-ember"> · {item.note}</span>}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors duration-300",
                    isApproved ? "bg-mint text-ink-950" : "bg-white/[0.07] text-bone",
                  )}
                >
                  {isApproved && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}
                  {isApproved ? "Approved" : "Review"}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="surface rounded-2xl p-4">
          <p className="flex items-center gap-1.5 text-[12px] text-mute">
            <ShieldCheck className="size-3.5 text-ember" aria-hidden="true" /> Refund limit today
          </p>
          <p className="mt-2 font-mono text-lg text-bone">
            $1,480 <span className="text-[12px] text-dim">/ $2,000</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ember/60 to-ember"
              initial={{ width: "0%" }}
              animate={{ width: active ? "74%" : "0%" }}
              transition={{ duration: 1.2, delay: active ? 0.4 : 0, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
        <div className="surface rounded-2xl p-4">
          <p className="flex items-center gap-1.5 text-[12px] text-mute">
            <TrendingUp className="size-3.5 text-mint" aria-hidden="true" /> Accuracy, 30 days
          </p>
          <p className="mt-2 font-mono text-lg text-bone">
            98.6% <span className="text-[12px] text-mint">+2.1</span>
          </p>
          <div className="mt-2.5 flex h-6 items-end gap-[3px]" aria-hidden="true">
            {[62, 70, 66, 74, 72, 80, 78, 84, 86, 90, 94, 100].map((h, i) => (
              <motion.span
                key={i}
                className={cn("flex-1 rounded-sm", i === 11 ? "bg-mint" : "bg-white/15")}
                initial={{ height: "10%" }}
                animate={{ height: active ? `${h}%` : "10%" }}
                transition={{ duration: 0.6, delay: active ? 0.3 + i * 0.04 : 0, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
