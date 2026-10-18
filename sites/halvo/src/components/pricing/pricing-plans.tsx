"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { plans } from "@/content/pricing";
import { cn } from "@/lib/cn";

export function PricingPlans() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="relative flex rounded-full border border-white/10 bg-white/[0.03] p-1"
        >
          {[
            { value: false, label: "Monthly" },
            { value: true, label: "Annual" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              role="radio"
              aria-checked={annual === opt.value}
              onClick={() => setAnnual(opt.value)}
              className={cn(
                "relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                annual === opt.value ? "text-ink-950" : "text-mute hover:text-bone",
              )}
            >
              {annual === opt.value && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-bone"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {opt.label}
              {opt.value && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    annual ? "bg-ink-950/10" : "bg-ember/15 text-ember",
                  )}
                >
                  −20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-[28px] p-8",
                plan.featured
                  ? "border border-ember/35 bg-[linear-gradient(180deg,rgb(245_166_91/0.1),rgb(245_166_91/0.02)_40%,transparent)] shadow-[0_0_0_1px_rgb(245_166_91/0.1),0_40px_100px_-40px_rgb(245_166_91/0.35)]"
                  : "surface",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-ember px-3 py-1 text-[11px] font-semibold text-ink-950">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-medium text-bone">{plan.name}</h2>
              <p className="mt-1.5 min-h-[44px] text-[14px] leading-relaxed text-mute">{plan.blurb}</p>
              <div className="mt-8 flex h-14 items-end gap-2">
                {price === null ? (
                  <span className="text-[2.75rem] font-medium leading-none tracking-[-0.04em] text-bone">Custom</span>
                ) : (
                  <>
                    <span className="relative overflow-hidden text-[3.25rem] font-medium leading-none tracking-[-0.05em] text-bone">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={price}
                          className="inline-block"
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "-100%", opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          ${price}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="pb-1.5 text-sm text-mute">{price === 0 ? "forever" : "/ month"}</span>
                  </>
                )}
              </div>
              <p className="mt-3 text-[13px] text-dim">
                {plan.included}
                {plan.id === "growth" && annual && " · billed annually"}
              </p>
              <Link
                href={plan.cta.href}
                className={cn(
                  "mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                  plan.featured
                    ? "bg-ember text-ink-950 hover:bg-ember-2"
                    : "border border-white/10 bg-white/[0.03] text-bone hover:bg-white/[0.07]",
                )}
              >
                {plan.cta.label}
              </Link>
              <ul className="mt-8 grid gap-3 border-t border-white/[0.07] pt-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] text-bone/90">
                    <Check
                      className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-ember" : "text-mute")}
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
