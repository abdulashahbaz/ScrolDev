"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Faq as FaqItem } from "@/content/faqs";
import { cn } from "@/lib/cn";
import { Accent, SectionHeading } from "./section-heading";

export function Faq({ items, title }: { items: FaqItem[]; title?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="FAQ"
              title={
                title ?? (
                  <>
                    Questions, <Accent>answered.</Accent>
                  </>
                )
              }
            />
            <p className="mt-6 text-[15px] text-mute">
              Something else on your mind?{" "}
              <Link
                href="/contact"
                className="text-bone underline decoration-white/25 underline-offset-4 hover:decoration-ember"
              >
                Talk to our team
              </Link>
              .
            </p>
          </div>
        </div>
        <ul className="border-t border-white/[0.08]">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-white/[0.08]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-[1.0625rem] font-medium tracking-[-0.01em] text-bone transition-colors hover:text-ember-2"
                  >
                    {item.q}
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border border-white/10 transition-all duration-500 ease-out-expo",
                        isOpen && "rotate-45 border-ember/40 bg-ember/10 text-ember",
                      )}
                      aria-hidden="true"
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pr-12 text-[15px] leading-relaxed text-mute">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
