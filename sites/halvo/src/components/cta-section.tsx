"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ButtonLink } from "./button";
import { Accent } from "./section-heading";

// The closing call to action. The eclipse's lit edge turns to face the cursor.
export function CtaSection({
  title,
  accent,
  body = "See Halvo run on your own workflows in a 30-minute demo, or start free and ship your first agent today.",
}: {
  title?: string;
  accent?: string;
  body?: string;
}) {
  const dx = useMotionValue(0.7);
  const dy = useMotionValue(-0.7);
  const sx = useSpring(dx, { stiffness: 60, damping: 18 });
  const sy = useSpring(dy, { stiffness: 60, damping: 18 });
  // The dark disc moves away from the light, so the crescent faces the cursor.
  const x = useTransform(sx, (v) => `${-v * 2.4}%`);
  const y = useTransform(sy, (v) => `${-v * 2.4}%`);
  const glowX = useTransform(sx, (v) => `${50 + v * 18}%`);
  const glowY = useTransform(sy, (v) => `${50 + v * 18}%`);
  const glow = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(40% 40% at ${gx} ${gy}, rgb(245 166 91 / 0.55), transparent 70%)`,
  );

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        const len = Math.hypot(nx, ny) || 1;
        dx.set(nx / len);
        dy.set(ny / len);
      }}
    >
      <div className="container-x relative flex flex-col items-center text-center">
        <div className="relative grid aspect-square w-[min(88vw,640px)] place-items-center">
          <motion.div
            aria-hidden="true"
            className="absolute -inset-[12%] rounded-full opacity-70 blur-3xl"
            style={{ background: glow }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,#c96a1f_0%,#f5a65b_86%,#fff0db_97%,#ffb36b_100%)] shadow-[0_0_80px_-10px_rgb(245_166_91/0.7)]"
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-[1.2%] rounded-full bg-ink-950 shadow-[inset_0_0_60px_rgb(0_0_0/0.9)]"
            style={{ x, y }}
          />
          <div
            aria-hidden="true"
            className="absolute -inset-[8%] animate-spin-slow rounded-full border border-dashed border-white/[0.06]"
          />
          <h2 className="relative max-w-[11ch] px-6 text-[clamp(2.25rem,6vw,4.75rem)] font-medium leading-[1] tracking-[-0.045em] text-bone">
            {title ?? "Give your team"} <Accent>{accent ?? "its week back."}</Accent>
          </h2>
        </div>
        <p className="mt-10 max-w-md text-[1.0625rem] leading-relaxed text-mute">{body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg" arrow>
            Book a demo
          </ButtonLink>
          <ButtonLink href="/login?mode=signup" size="lg" variant="secondary">
            Start free
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
