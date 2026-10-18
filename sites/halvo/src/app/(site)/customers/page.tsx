import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CoverArt } from "@/components/cover-art";
import { CtaSection } from "@/components/cta-section";
import { FakeLogo } from "@/components/fake-logo";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Accent, SectionHeading } from "@/components/section-heading";
import { caseStudies, logos, testimonials } from "@/content/customers";

export const metadata: Metadata = {
  title: "Customers",
  description: "How operations teams at Northpeak, Lumio and Copperline got their week back with Halvo.",
};

const HUES = [28, 160, 215, 330, 45, 265];

export default function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title={
          <>
            The teams getting <Accent>their week back.</Accent>
          </>
        }
        body="From freight marketplaces to consumer health apps, operations teams use Halvo to hand off the repetitive work and keep the judgment calls."
      />

      <section aria-label="Customer logos" className="pb-20">
        <div className="container-x">
          <ul className="grid grid-cols-2 border-l border-t border-white/[0.07] sm:grid-cols-3 lg:grid-cols-5">
            {logos.map((name) => (
              <li
                key={name}
                className="grid h-28 place-items-center border-b border-r border-white/[0.07] text-bone/55 transition-colors duration-300 hover:bg-white/[0.02] hover:text-bone"
              >
                <FakeLogo name={name} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Stories" title="Featured customer stories" />
          <div className="mt-12 grid gap-6">
            {caseStudies.map((cs, i) => (
              <Reveal key={cs.slug}>
                <Link
                  href={`/customers/${cs.slug}`}
                  className="group surface grid overflow-hidden rounded-[28px] transition-colors hover:border-white/15 lg:grid-cols-[1.1fr_1fr]"
                >
                  <div className="relative min-h-[260px] lg:min-h-[380px]">
                    <CoverArt
                      hue={cs.hue}
                      seed={i}
                      className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    />
                    <div className="absolute left-8 top-8 rounded-full border border-white/10 bg-ink-950/60 px-3 py-1.5 text-bone backdrop-blur">
                      <FakeLogo name={cs.company} className="text-[0.85rem]" />
                    </div>
                  </div>
                  <div className="flex flex-col p-8 sm:p-10">
                    <p className="eyebrow text-dim">
                      {cs.industry} · {cs.team}
                    </p>
                    <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.12] tracking-[-0.03em] text-bone">
                      {cs.headline}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-mute">{cs.summary}</p>
                    <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6 max-lg:mt-8">
                      {cs.metrics.map((m) => (
                        <div key={m.label}>
                          <dt className="sr-only">{m.label}</dt>
                          <dd className="text-[1.5rem] font-medium leading-none tracking-[-0.04em] text-bone">
                            {m.value}
                          </dd>
                          <dd className="mt-2 text-[12px] leading-snug text-mute">{m.label}</dd>
                        </div>
                      ))}
                    </dl>
                    <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-bone">
                      Read the story
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="In their words"
            title={
              <>
                What operations leaders <Accent>tell us.</Accent>
              </>
            }
          />
          <div className="mt-12 columns-1 gap-4 md:columns-2 lg:columns-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid">
                <figure className="surface rounded-[24px] p-7">
                  <blockquote className="text-[15px] leading-relaxed text-bone/90">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Avatar name={t.name} hue={HUES[i % HUES.length]} className="size-9 text-xs" />
                    <span>
                      <span className="block text-sm font-medium text-bone">{t.name}</span>
                      <span className="block text-[13px] text-mute">
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection title="Be our next" accent="customer story." />
    </>
  );
}
