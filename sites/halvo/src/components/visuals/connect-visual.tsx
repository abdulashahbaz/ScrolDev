"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { HalvoMark } from "../logo";
import { cn } from "@/lib/cn";
import { useSvgId } from "@/lib/use-svg-id";

const NODES = [
  { name: "NetSuite", angle: -90 },
  { name: "Stripe", angle: -30 },
  { name: "Slack", angle: 30 },
  { name: "Salesforce", angle: 90 },
  { name: "Zendesk", angle: 150 },
  { name: "Snowflake", angle: 210 },
].map((n) => {
  const r = 138;
  const rad = (n.angle * Math.PI) / 180;
  return { ...n, x: 200 + r * Math.cos(rad), y: 200 + r * Math.sin(rad) };
});

// Six tools connect to Halvo one by one; packets then flow along each line.
export function ConnectVisual({ active }: { active: boolean }) {
  const id = useSvgId("connect");
  return (
    <div className="flex w-full max-w-[460px] flex-col items-center gap-2">
      <div className="relative aspect-square w-full">
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx="200" cy="200" r="138" fill="none" stroke="rgb(243 238 228 / 0.06)" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="70" fill="none" stroke="rgb(243 238 228 / 0.05)" />
          {NODES.map((n, i) => (
            <g key={n.name}>
              <line x1="200" y1="200" x2={n.x} y2={n.y} stroke="rgb(243 238 228 / 0.06)" />
              <motion.line
                x1="200"
                y1="200"
                x2={n.x}
                y2={n.y}
                stroke={`url(#${id}-line)`}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: active ? 1 : 0 }}
                transition={{ duration: 0.6, delay: active ? 0.2 + i * 0.22 : 0, ease: "easeOut" }}
              />
              {active && (
                <motion.circle
                  r="2.5"
                  fill="#ffd09a"
                  initial={{ cx: n.x, cy: n.y, opacity: 0 }}
                  animate={{ cx: [n.x, 200], cy: [n.y, 200], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.6,
                    delay: 1.8 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeInOut",
                  }}
                />
              )}
            </g>
          ))}
          <defs>
            <linearGradient id={`${id}-line`} x1="60" y1="60" x2="340" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f5a65b" />
              <stop offset="1" stopColor="#ffd09a" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 -m-6 rounded-full bg-ember/25 blur-2xl" />
          <div className="relative grid size-20 place-items-center rounded-[22px] border border-white/10 bg-ink-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
            <HalvoMark id={`${id}-mark`} className="size-10" />
          </div>
        </div>

        {NODES.map((n, i) => (
          <motion.div
            key={n.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(n.x / 400) * 100}%`, top: `${(n.y / 400) * 100}%` }}
            initial={{ opacity: 0.4, scale: 0.92 }}
            animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.92 }}
            transition={{ duration: 0.4, delay: active ? 0.5 + i * 0.22 : 0 }}
          >
            <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-ink-850 px-3 py-2 text-[13px] text-bone shadow-[0_10px_30px_-10px_rgb(0_0_0/0.8)]">
              <span className="grid size-5 place-items-center rounded-md bg-white/[0.06] font-mono text-[10px] text-mute">
                {n.name[0]}
              </span>
              {n.name}
              <motion.span
                className={cn("grid size-4 place-items-center rounded-full bg-mint text-ink-950")}
                initial={{ scale: 0 }}
                animate={{ scale: active ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: active ? 0.75 + i * 0.22 : 0 }}
              >
                <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" />
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="whitespace-nowrap rounded-full border border-white/10 bg-ink-900 px-3 py-1 font-mono text-[11px] text-mute"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ delay: active ? 1.9 : 0 }}
      >
        6 of 6 connected · scopes: read, write
      </motion.p>
    </div>
  );
}
