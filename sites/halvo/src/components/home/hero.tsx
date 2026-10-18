"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../button";
import { HeroConsole } from "./hero-console";

export function Hero() {
  const consoleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: consoleRef, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40">
      <HeroBackdrop />

      {/* The copy animates with CSS so it paints before hydration (better LCP). */}
      <div className="container-x relative text-center">
        <div className="animate-fade-up">
          <Link
            href="/changelog"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-[13px] text-mute backdrop-blur transition-colors hover:border-white/20 hover:text-bone"
          >
            <span className="rounded-full bg-ember px-2 py-0.5 text-[11px] font-semibold text-ink-950">New</span>
            Agents 2.0 now hand work to each other
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <h1 className="display mx-auto mt-8 max-w-[14ch] text-[clamp(3rem,8.4vw,7.25rem)]">
          <span className="block animate-fade-up [animation-delay:80ms]">Operations that</span>
          <span className="block animate-fade-up pb-[0.1em] [animation-delay:200ms]">
            run{" "}
            <em className="font-serif font-normal tracking-[-0.02em] text-ember-gradient pr-[0.05em]">themselves.</em>
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-[34rem] animate-fade-up text-[1.0625rem] leading-relaxed text-mute [animation-delay:400ms] sm:text-lg">
          Halvo puts AI agents to work across finance, support and revenue operations, with the approvals, audit trails
          and guardrails your team needs to trust them.
        </p>

        <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:500ms] sm:flex-row">
          <ButtonLink href="/contact" size="lg" arrow>
            Book a demo
          </ButtonLink>
          <ButtonLink href="/login?mode=signup" size="lg" variant="secondary">
            Start free
          </ButtonLink>
        </div>
        <p className="mt-5 animate-fade-up text-[13px] text-dim [animation-delay:650ms]">
          Free for 14 days · No card required · SOC 2 Type II
        </p>
      </div>

      <div className="container-x relative mt-16 sm:mt-24 [perspective:1800px]">
        <Horizon />
        <motion.div
          ref={consoleRef}
          style={{ rotateX, scale, y, transformOrigin: "50% 0%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative mx-auto max-w-[1120px]"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-x-10 -top-24 h-64 bg-[radial-gradient(50%_60%_at_50%_100%,rgb(245_166_91/0.32),transparent)] blur-2xl"
          />
          <HeroConsole />
        </motion.div>
      </div>
    </section>
  );
}

// The eclipse: a dark planet with a lit rim, rising just behind the console,
// circled by slow orbit rings. Anchored to the console so it lines up at any size.
function Horizon() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="absolute left-1/2 top-[-40px] size-[1500px] -translate-x-1/2 sm:top-[-120px] sm:size-[2200px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,transparent_97%,rgb(245_166_91/0.4)_99.5%,transparent)] blur-[24px]" />
        <div className="absolute inset-0 rounded-full bg-ink-950 shadow-[inset_0_2px_0_rgb(255_221_180/0.7),inset_0_40px_90px_-50px_rgb(245_166_91/0.55),0_-50px_180px_-40px_rgb(245_166_91/0.6)]" />
      </div>
      <svg
        className="absolute left-1/2 top-[-40px] size-[1800px] -translate-x-1/2 -translate-y-1/2 sm:top-[-120px] sm:size-[2400px]"
        viewBox="-100 -100 200 200"
      >
        <g className="origin-center animate-spin-slower">
          <circle r="40" fill="none" stroke="rgb(243 238 228 / 0.06)" strokeWidth="0.08" />
          <circle r="40" fill="none" stroke="rgb(245 166 91 / 0.55)" strokeWidth="0.12" strokeDasharray="5 300" />
        </g>
        <g className="origin-center animate-spin-slow [animation-direction:reverse]">
          <circle r="52" fill="none" stroke="rgb(243 238 228 / 0.05)" strokeWidth="0.08" strokeDasharray="0.4 1.2" />
        </g>
        <circle r="66" fill="none" stroke="rgb(243 238 228 / 0.035)" strokeWidth="0.08" />
      </svg>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
      {/* Faint grid that fades out toward the bottom. */}
      <div className="absolute inset-0 bg-[linear-gradient(rgb(243_238_228/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(243_238_228/0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(70%_55%_at_50%_0%,#000,transparent)]" />

      {/* Ember glow at the top, behind the headline. */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_0%,rgb(245_166_91/0.14),transparent)]" />
    </div>
  );
}
