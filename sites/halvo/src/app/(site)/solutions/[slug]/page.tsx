import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ButtonLink } from "@/components/button";
import { CtaSection } from "@/components/cta-section";
import { CountUp, Reveal } from "@/components/motion";
import { Accent, SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { FlowDiagram } from "@/components/visuals/flow-diagram";
import { caseStudies } from "@/content/customers";
import { getSolution, solutions } from "@/content/solutions";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getSolution((await params).slug);
  return s ? { title: `Halvo for ${s.name.toLowerCase()}`, description: s.summary } : {};
}

export default async function SolutionPage({ params }: Params) {
  const solution = getSolution((await params).slug);
  if (!solution) notFound();
  const study = caseStudies.find((c) => c.slug === solution.caseStudy);
  const others = solutions.filter((s) => s.slug !== solution.slug);

  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgb(243_238_228/0.03)_1px,transparent_1px),linear-gradient(90deg,rgb(243_238_228/0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(60%_60%_at_70%_20%,#000,transparent)]" />
          <div className="absolute right-0 top-0 h-[600px] w-[900px] bg-[radial-gradient(50%_50%_at_60%_20%,rgb(245_166_91/0.16),transparent)]" />
        </div>
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="eyebrow flex items-center gap-2 text-ember">
              <span className="h-px w-5 bg-current opacity-60" aria-hidden="true" />
              Halvo for {solution.name.toLowerCase()}
            </p>
            <h1 className="display mt-6 text-[clamp(2.75rem,6vw,5.25rem)] text-bone">
              {solution.headline} <Accent>{solution.accent}</Accent>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{solution.summary}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg" arrow>
                Book a demo
              </ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <div className="surface rounded-[28px] p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[13px] font-medium text-bone">Example run</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-medium text-mint">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-current" aria-hidden="true" /> Live
                </span>
              </div>
              <FlowDiagram flow={solution.flow} />
            </div>
          </div>
        </div>
      </section>

      <section aria-label={`${solution.name} results`} className="border-y border-white/[0.06]">
        <dl className="container-x grid grid-cols-3">
          {solution.metrics.map((m) => (
            <div
              key={m.label}
              className="border-white/[0.06] py-10 pr-4 sm:px-8 sm:first:pl-0 [&:not(:last-child)]:border-r"
            >
              <dt className="sr-only">{m.label}</dt>
              <dd className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-bone">
                <CountUp value={m.value} />
              </dd>
              <dd className="mt-3 text-[13px] text-mute sm:text-sm">{m.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="What agents handle"
            title={
              <>
                The work your {solution.name.toLowerCase()} team <Accent>hands off first.</Accent>
              </>
            }
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {solution.tasks.map((t, i) => (
              <Reveal key={t.title} delay={(i % 2) * 0.08}>
                <SpotlightCard className="surface h-full rounded-[24px] p-8">
                  <p className="font-mono text-[12px] text-ember">0{i + 1}</p>
                  <h3 className="mt-6 text-xl font-medium tracking-[-0.02em] text-bone">{t.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{t.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Connects to"
            title={
              <>
                Works inside <Accent>your stack.</Accent>
              </>
            }
            body={`Two-way connectors for the ${solution.name.toLowerCase()} tools you already run, with the scopes you choose.`}
          />
          <Reveal className="flex flex-wrap content-center gap-2.5">
            {solution.integrations.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[14px] text-bone/90"
              >
                {name}
              </span>
            ))}
            <Link
              href="/product#integrations"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] text-ember hover:text-ember-2"
            >
              and 110+ more <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {study && (
        <section className="py-12 sm:py-16">
          <div className="container-x">
            <Reveal>
              <Link
                href={`/customers/${study.slug}`}
                className="group relative block overflow-hidden rounded-[32px] bg-paper p-8 text-ink-950 sm:p-14"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(50%_70%_at_100%_0%,rgb(245_166_91/0.25),transparent)]"
                />
                <p className="eyebrow relative text-ember-deep">Customer story · {study.company}</p>
                <blockquote className="relative mt-6 max-w-3xl font-serif text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.18]">
                  “{study.quote.quote}”
                </blockquote>
                <div className="relative mt-8 flex flex-wrap items-center justify-between gap-6">
                  <span className="flex items-center gap-3">
                    <Avatar name={study.quote.name} hue={study.hue} className="size-10 text-sm" />
                    <span>
                      <span className="block text-[15px] font-medium">{study.quote.name}</span>
                      <span className="block text-sm text-stone">
                        {study.quote.role}, {study.quote.company}
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    Read the story
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-bone">Halvo for other teams</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/solutions/${o.slug}`}
                className="group surface flex flex-col rounded-[24px] p-7 transition-colors hover:border-white/15"
              >
                <span className="flex items-center justify-between">
                  <span className="text-lg font-medium text-bone">{o.name}</span>
                  <ArrowUpRight
                    className="size-5 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 text-[14px] leading-relaxed text-mute">
                  {o.headline} {o.accent}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
