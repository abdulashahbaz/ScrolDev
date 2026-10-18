"use client";

import { motion } from "motion/react";
import { useSvgId } from "@/lib/use-svg-id";

// Thirty days of tasks, as a smooth curve.
const SERIES = [
  30, 34, 31, 38, 42, 40, 45, 50, 47, 52, 58, 55, 60, 63, 61, 68, 72, 70, 76, 79, 77, 83, 88, 86, 90, 94, 92, 97, 101,
  106,
];

function curve(values: number[], w: number, h: number) {
  const max = Math.max(...values) * 1.1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - (v / max) * h] as const);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

const TEAMS = [
  { name: "Support", value: 46 },
  { name: "Finance", value: 28 },
  { name: "Revenue", value: 18 },
  { name: "People", value: 8 },
];

export function InsightsVisual({ active }: { active: boolean }) {
  const id = useSvgId("insights");
  const line = curve(SERIES, 300, 100);
  return (
    <div className="surface w-full max-w-[520px] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-bone">Operations overview</p>
        <span className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[10px] text-mute">
          LAST 30 DAYS
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Tasks", value: "1.2M", delta: "+18%" },
          { label: "Hours saved", value: "18,420", delta: "+22%" },
          { label: "Cost / task", value: "$0.031", delta: "−40%" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <dt className="text-[11px] text-dim">{k.label}</dt>
            <dd className="mt-1 font-mono text-[15px] text-bone">{k.value}</dd>
            <dd className="font-mono text-[10px] text-mint">{k.delta}</dd>
          </div>
        ))}
      </dl>
      <svg
        viewBox="0 0 300 110"
        className="mt-5 h-32 w-full overflow-visible"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5a65b" stopOpacity="0.35" />
            <stop offset="1" stopColor="#f5a65b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgb(243 238 228 / 0.06)" strokeDasharray="2 4" />
        ))}
        <motion.path
          d={`${line} L300,110 L0,110 Z`}
          fill={`url(#${id}-fill)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#f5a65b"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="mt-4 grid gap-2">
        {TEAMS.map((t, i) => (
          <div key={t.name} className="grid grid-cols-[64px_1fr_36px] items-center gap-3 text-[11px]">
            <span className="text-mute">{t.name}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-ember/50 to-ember"
                initial={{ width: 0 }}
                animate={{ width: active ? `${t.value * 2}%` : 0 }}
                transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
            <span className="text-right font-mono text-bone">{t.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
