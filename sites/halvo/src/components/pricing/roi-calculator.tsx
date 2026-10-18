"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { GROWTH_INCLUDED, OVERAGE_PER_TASK, plans } from "@/content/pricing";

const HOURLY_COST = 55;
const MIN_TASKS = 500;
const MAX_TASKS = 100_000;
const ENTERPRISE_FROM = 50_000;

// The task slider is logarithmic so both 1,000 and 100,000 are easy to reach.
function tasksFromSlider(v: number) {
  const raw = MIN_TASKS * Math.pow(MAX_TASKS / MIN_TASKS, v / 100);
  const step = raw < 5_000 ? 100 : raw < 50_000 ? 1_000 : 5_000;
  return Math.round(raw / step) * step;
}

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function RoiCalculator() {
  const [slider, setSlider] = useState(57);
  const [minutes, setMinutes] = useState(8);
  const tasksId = useId();
  const minutesId = useId();

  const tasks = tasksFromSlider(slider);
  const growth = plans.find((p) => p.id === "growth")!;
  const plan = tasks <= 100 ? "Starter" : tasks < ENTERPRISE_FROM ? "Growth" : "Enterprise";
  const cost =
    plan === "Starter"
      ? 0
      : plan === "Growth"
        ? growth.annual! + Math.max(0, tasks - GROWTH_INCLUDED) * OVERAGE_PER_TASK
        : null;
  const hours = (tasks * minutes) / 60;
  const value = hours * HOURLY_COST;
  const roi = cost ? value / cost : null;

  return (
    <div className="surface overflow-hidden rounded-[32px]">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="p-8 sm:p-10">
          <p className="eyebrow text-ember">ROI calculator</p>
          <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.035em] text-bone">
            What would Halvo be worth to your team?
          </h3>

          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <label htmlFor={tasksId} className="text-sm text-mute">
                Tasks per month
              </label>
              <output htmlFor={tasksId} className="font-mono text-lg text-bone">
                {fmt(tasks)}
              </output>
            </div>
            <input
              id={tasksId}
              type="range"
              min={0}
              max={100}
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              aria-valuetext={`${fmt(tasks)} tasks per month`}
              className="range mt-4 w-full"
              style={{ "--fill": `${slider}%` } as React.CSSProperties}
            />
            <div className="mt-2 flex justify-between font-mono text-[11px] text-dim">
              <span>500</span>
              <span>100,000</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor={minutesId} className="text-sm text-mute">
                Minutes a person spends per task today
              </label>
              <output htmlFor={minutesId} className="font-mono text-lg text-bone">
                {minutes} min
              </output>
            </div>
            <input
              id={minutesId}
              type="range"
              min={2}
              max={30}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="range mt-4 w-full"
              style={{ "--fill": `${((minutes - 2) / 28) * 100}%` } as React.CSSProperties}
            />
            <div className="mt-2 flex justify-between font-mono text-[11px] text-dim">
              <span>2 min</span>
              <span>30 min</span>
            </div>
          </div>
          <p className="mt-8 text-[13px] leading-relaxed text-dim">
            Assumes a fully loaded cost of ${HOURLY_COST} an hour and Growth billed annually. Your numbers will vary;
            we&apos;ll model them with you on a demo.
          </p>
        </div>

        <div className="relative border-t border-white/[0.07] bg-black/25 p-8 sm:p-10 lg:border-l lg:border-t-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,rgb(245_166_91/0.14),transparent)]"
          />
          <div className="relative grid gap-8" aria-live="polite">
            <div>
              <p className="text-sm text-mute">Hours returned each month</p>
              <p className="mt-2 text-[clamp(2.75rem,5vw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-bone">
                {fmt(hours)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-white/[0.07] pt-8">
              <div>
                <p className="text-sm text-mute">Value of that time</p>
                <p className="mt-2 font-mono text-2xl text-bone">${fmt(value)}</p>
              </div>
              <div>
                <p className="text-sm text-mute">{plan} plan</p>
                <p className="mt-2 font-mono text-2xl text-bone">{cost === null ? "Custom" : `$${fmt(cost)}`}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-ember/25 bg-ember/[0.07] p-5">
              <p className="text-sm text-ember-2">Return on spend</p>
              <p className="mt-1 text-[2rem] font-medium tracking-[-0.04em] text-bone">
                {roi === null ? (plan === "Starter" ? "Free" : "Volume pricing") : `${roi.toFixed(1)}×`}
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="group relative mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-bone"
          >
            Get a tailored estimate
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
