"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

// The statement lights up word by word as it scrolls through the viewport.
const SEGMENTS: { text: string; style?: "ember" | "serif" }[] = [
  { text: "Operations teams lose" },
  { text: "a third of every week", style: "ember" },
  {
    text: "to copying numbers between tabs, chasing approvals and re-checking work. Halvo hands that work to agents and keeps every decision",
  },
  { text: "in your hands.", style: "serif" },
];

const WORDS = SEGMENTS.flatMap((seg) => seg.text.split(" ").map((w) => ({ w, style: seg.style })));

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section className="relative py-28 sm:py-40">
      <div className="container-x">
        <p className="eyebrow flex items-center gap-2 text-ember">
          <span className="h-px w-5 bg-current opacity-60" aria-hidden="true" />
          Why Halvo
        </p>
        <p
          ref={ref}
          className="mt-8 max-w-[22ch] text-[clamp(2rem,5vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.04em] sm:max-w-[24ch]"
        >
          {WORDS.map(({ w, style }, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / WORDS.length, (i + 1) / WORDS.length]} style={style}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  style,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  style?: "ember" | "serif";
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span
        style={{ opacity }}
        className={cn(
          style === "ember" && "text-ember",
          style === "serif" && "font-serif font-normal italic tracking-[-0.015em] text-ember-2",
        )}
      >
        {children}
      </motion.span>{" "}
    </>
  );
}
