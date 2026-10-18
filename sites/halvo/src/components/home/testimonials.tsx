import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies, testimonials } from "@/content/customers";
import { Avatar } from "../avatar";
import { FakeLogo } from "../fake-logo";
import { Reveal } from "../motion";
import { Accent, SectionHeading } from "../section-heading";

const HUES: Record<string, number> = {
  "Maya Chen": 28,
  "Daniel Okafor": 160,
  "Priya Raman": 215,
  "Tomás Alvarez": 330,
  "Hannah Lindqvist": 45,
  "Sam Whitaker": 265,
};

// The light "paper" sheet: a change of pace between the dark sections.
export function Testimonials() {
  const [featured, ...rest] = testimonials;
  const study = caseStudies[0];
  return (
    <section className="px-2 sm:px-4" aria-label="Customer stories">
      <div className="relative overflow-hidden rounded-[32px] bg-paper py-24 text-ink-950 sm:rounded-[48px] sm:py-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgb(245_166_91/0.18),transparent),radial-gradient(rgb(14_16_20/0.06)_1px,transparent_1px)] bg-[size:auto,24px_24px]"
        />
        <div className="container-x relative">
          <SectionHeading
            tone="light"
            eyebrow="Customers"
            title={
              <>
                Teams that got their <Accent tone="light">week back.</Accent>
              </>
            }
          />

          <Reveal className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <figure>
              <svg viewBox="0 0 32 24" className="h-7 w-9 text-ember-deep" aria-hidden="true">
                <path
                  d="M0 24V14C0 6 4.5 1.3 12 0l1.4 3.4C9 4.8 6.9 7.6 6.6 11H12v13H0zm19 0V14c0-8 4.5-12.7 12-14l1 3.4c-4.4 1.4-6.5 4.2-6.8 7.6H31v13H19z"
                  fill="currentColor"
                />
              </svg>
              <blockquote className="mt-6 font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.15] tracking-[-0.015em]">
                {featured.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3.5">
                <Avatar name={featured.name} hue={HUES[featured.name]} className="size-11 text-sm" />
                <span>
                  <span className="block text-[15px] font-medium">{featured.name}</span>
                  <span className="block text-sm text-stone">
                    {featured.role}, {featured.company}
                  </span>
                </span>
              </figcaption>
            </figure>

            <Link
              href={`/customers/${study.slug}`}
              className="group flex flex-col justify-between rounded-[28px] bg-ink-950 p-8 text-bone transition-transform duration-500 ease-out-expo hover:-translate-y-1"
            >
              <FakeLogo name={study.company} className="text-bone/80" />
              <dl className="mt-10 grid gap-6">
                {study.metrics.map((m) => (
                  <div key={m.label} className="border-t border-white/10 pt-4">
                    <dt className="sr-only">{m.label}</dt>
                    <dd className="text-[2.25rem] font-medium leading-none tracking-[-0.04em]">{m.value}</dd>
                    <dd className="mt-1.5 text-sm text-mute">{m.label}</dd>
                  </div>
                ))}
              </dl>
              <span className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium">
                Read the Northpeak story
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>

          <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 3).map((t, i) => (
              <Reveal as="li" key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-[24px] border border-ink-950/[0.08] bg-white/60 p-7 shadow-[0_1px_0_rgb(255_255_255/0.8)_inset] backdrop-blur">
                  <blockquote className="text-[15px] leading-relaxed text-ink-800">“{t.quote}”</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-7">
                    <Avatar name={t.name} hue={HUES[t.name]} className="size-9 text-xs" />
                    <span>
                      <span className="block text-sm font-medium">{t.name}</span>
                      <span className="block text-[13px] text-stone">
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <Link
              href="/customers"
              className="group inline-flex items-center gap-1.5 rounded-full border border-ink-950/15 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ink-950 hover:text-bone"
            >
              All customer stories
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
