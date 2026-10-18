"use client";

import { motion } from "motion/react";
import { Check, CircleCheck, UserCheck, Zap } from "lucide-react";
import type { Solution } from "@/content/solutions";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

// A trigger, the agent's steps, the approval and the outcome, revealed in order.
export function FlowDiagram({ flow }: { flow: Solution["flow"] }) {
  const nodes = [
    { kind: "Trigger", text: flow.trigger, icon: Zap, tone: "sky" as const },
    ...flow.steps.map((text) => ({ kind: "Agent", text, icon: Check, tone: "plain" as const })),
    { kind: "Approval", text: flow.approval, icon: UserCheck, tone: "ember" as const },
    { kind: "Outcome", text: flow.outcome, icon: CircleCheck, tone: "mint" as const },
  ];

  return (
    <ol className="relative grid content-start gap-2.5">
      <motion.span
        aria-hidden="true"
        className="absolute left-[19px] top-5 w-px origin-top bg-gradient-to-b from-sky/50 via-ember/40 to-mint/50"
        style={{ bottom: 20 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: EASE }}
      />
      {nodes.map((node, i) => (
        <motion.li
          key={node.kind + node.text}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.13, ease: EASE }}
          className="relative flex items-center gap-3"
        >
          <span
            className={cn(
              "relative z-10 grid size-10 shrink-0 place-items-center rounded-xl border",
              node.tone === "sky" && "border-sky/25 bg-ink-850 text-sky",
              node.tone === "plain" && "border-white/10 bg-ink-850 text-mute",
              node.tone === "ember" && "border-ember/30 bg-ink-850 text-ember",
              node.tone === "mint" && "border-mint/25 bg-ink-850 text-mint",
            )}
          >
            <node.icon className="size-4" aria-hidden="true" />
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 rounded-xl border px-3.5 py-2.5",
              node.tone === "ember"
                ? "border-ember/20 bg-ember/[0.06]"
                : node.tone === "mint"
                  ? "border-mint/15 bg-mint/[0.05]"
                  : "border-white/[0.07] bg-white/[0.02]",
            )}
          >
            <span className="block font-mono text-[10px] uppercase tracking-wider text-dim">{node.kind}</span>
            <span className="mt-0.5 block truncate text-[13px] text-bone">{node.text}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
