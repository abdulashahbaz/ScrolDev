import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ButtonLink } from "@/components/button";
import { CoverArt } from "@/components/cover-art";
import { CtaSection } from "@/components/cta-section";
import { FakeLogo } from "@/components/fake-logo";
import { CountUp } from "@/components/motion";
import { caseStudies } from "@/content/customers";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  return cs ? { title: `${cs.company} customer story`, description: cs.summary } : {};
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const cs = caseStudies[index];
  const others = caseStudies.filter((c) => c.slug !== slug);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(50%_60%_at_30%_0%,rgb(245_166_91/0.14),transparent)]"
        />
        <div className="container-x relative">
          <Link
            href="/customers"
            className="group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-bone"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            All customers
          </Link>
          <div className="mt-10 max-w-4xl animate-fade-up">
            <FakeLogo name={cs.company} className="text-bone/80" />
            <h1 className="display mt-8 text-[clamp(2.5rem,5.6vw,4.75rem)] text-bone">{cs.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">{cs.summary}</p>
          </div>
        </div>
      </section>

      <section aria-label="Results" className="border-y border-white/[0.06]">
        <dl className="container-x grid sm:grid-cols-3">
          {cs.metrics.map((m, i) => (
            <div
              key={m.label}
              className="border-white/[0.06] py-10 sm:px-8 sm:first:pl-0 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r"
            >
              <dt className="sr-only">{m.label}</dt>
              <dd className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-bone">
                <CountUp value={m.value} duration={1.2 + i * 0.2} />
              </dd>
              <dd className="mt-3 text-sm text-mute">{m.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_320px] lg:gap-24">
          <article className="min-w-0 max-w-2xl">
            <h2 className="eyebrow text-ember">The challenge</h2>
            {cs.challenge.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[1.0625rem] leading-[1.75] text-bone/85">
                {p}
              </p>
            ))}

            <h2 className="eyebrow mt-16 text-ember">What they built with Halvo</h2>
            <ol className="mt-6 grid gap-6">
              {cs.solution.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[40px_1fr] gap-4">
                  <span className="grid size-9 place-items-center rounded-full border border-white/10 font-mono text-[12px] text-ember">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[1.0625rem] font-medium text-bone">{s.title}</h3>
                    <p className="mt-1.5 text-[1rem] leading-[1.7] text-mute">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <figure className="relative my-16 overflow-hidden rounded-[28px] border border-white/[0.08] p-8 sm:p-10">
              <CoverArt hue={cs.hue} seed={index + 3} className="absolute inset-0 opacity-60" />
              <div className="absolute inset-0 bg-ink-950/60" aria-hidden="true" />
              <blockquote className="relative font-serif text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.25] text-bone">
                “{cs.quote.quote}”
              </blockquote>
              <figcaption className="relative mt-8 flex items-center gap-3">
                <Avatar name={cs.quote.name} hue={cs.hue} className="size-10 text-sm" />
                <span>
                  <span className="block text-[15px] font-medium text-bone">{cs.quote.name}</span>
                  <span className="block text-sm text-mute">
                    {cs.quote.role}, {cs.quote.company}
                  </span>
                </span>
              </figcaption>
            </figure>

            <h2 className="eyebrow text-ember">The results</h2>
            <ul className="mt-6 grid gap-4">
              {cs.results.map((r) => (
                <li key={r} className="flex gap-3 text-[1.0625rem] leading-[1.6] text-bone/85">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="surface grid gap-5 rounded-[24px] p-7 text-sm">
              {[
                ["Company", cs.company],
                ["Industry", cs.industry],
                ["Size", cs.size],
                ["Team", cs.team],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] pb-4">
                  <dt className="text-dim">{k}</dt>
                  <dd className="text-right text-bone">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="text-dim">Connected tools</dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {cs.stack.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-bone/85">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-4 rounded-[24px] border border-ember/25 bg-ember/[0.06] p-7">
              <p className="text-[15px] font-medium text-bone">
                See what Halvo could do for your {cs.team.toLowerCase()} team.
              </p>
              <ButtonLink href="/contact" className="mt-5 w-full" arrow>
                Book a demo
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-20 sm:py-24">
        <div className="container-x">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-bone">More customer stories</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/customers/${o.slug}`}
                className="group surface flex items-start justify-between gap-6 rounded-[24px] p-7 transition-colors hover:border-white/15"
              >
                <div>
                  <FakeLogo name={o.company} className="text-bone/70" />
                  <p className="mt-5 text-[1.0625rem] font-medium leading-snug text-bone">{o.headline}</p>
                </div>
                <ArrowUpRight
                  className="size-5 shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
