"use client";

import { motion } from "motion/react";
import { Headset, Landmark, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const AGENTS: {
  name: string;
  team: string;
  icon: LucideIcon;
  status: "Running" | "Idle" | "Approval";
  tasks: string;
  accuracy: string;
  points: number[];
}[] = [
  {
    name: "Recon",
    team: "Finance",
    icon: Landmark,
    status: "Running",
    tasks: "1,284",
    accuracy: "98.6%",
    points: [4, 6, 5, 8, 7, 9, 12, 11, 14],
  },
  {
    name: "Resolve",
    team: "Support",
    icon: Headset,
    status: "Running",
    tasks: "3,920",
    accuracy: "96.1%",
    points: [8, 7, 9, 11, 10, 13, 12, 15, 16],
  },
  {
    name: "Route",
    team: "Revenue",
    icon: TrendingUp,
    status: "Idle",
    tasks: "412",
    accuracy: "97.4%",
    points: [3, 5, 4, 6, 8, 7, 9, 8, 10],
  },
  {
    name: "Onboard",
    team: "People",
    icon: Users,
    status: "Approval",
    tasks: "28",
    accuracy: "99.2%",
    points: [2, 3, 3, 4, 3, 5, 6, 5, 7],
  },
];

function sparkPath(points: number[]) {
  const max = Math.max(...points);
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 100},${28 - (p / max) * 24}`)
    .join(" ");
}

// The agents a team runs, each with its status, volume and accuracy.
export function AgentRoster({ active }: { active: boolean }) {
  return (
    <div className="grid w-full max-w-[520px] gap-3 sm:grid-cols-2">
      {AGENTS.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="surface rounded-2xl p-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-ink-800 text-ember">
              <a.icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-bone">{a.name}</p>
              <p className="text-[11px] text-dim">{a.team}</p>
            </div>
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
                a.status === "Running" && "bg-mint/10 text-mint",
                a.status === "Idle" && "bg-white/[0.06] text-mute",
                a.status === "Approval" && "bg-ember/10 text-ember",
              )}
            >
              <span className={cn("size-1.5 rounded-full bg-current", a.status === "Running" && "animate-pulse-dot")} />
              {a.status === "Approval" ? "Needs approval" : a.status}
            </span>
          </div>
          <svg
            viewBox="0 0 100 30"
            className="mt-4 h-10 w-full overflow-visible"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d={sparkPath(a.points)}
              fill="none"
              stroke={a.status === "Approval" ? "#f5a65b" : "#7ee2b8"}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
            />
          </svg>
          <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3 font-mono text-[11px]">
            <div>
              <dt className="text-dim">Tasks today</dt>
              <dd className="mt-0.5 text-bone">{a.tasks}</dd>
            </div>
            <div>
              <dt className="text-dim">Accuracy</dt>
              <dd className="mt-0.5 text-bone">{a.accuracy}</dd>
            </div>
          </dl>
        </motion.div>
      ))}
    </div>
  );
}
