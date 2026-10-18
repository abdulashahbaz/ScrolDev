import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CtaSection } from "@/components/cta-section";
import { CountUp, Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Accent, SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { investors, milestones, roles, team, values } from "@/content/team";

export const metadata: Metadata = {
  title: "Company",
  description: "Halvo is building the operations layer where people and AI agents share the work.",
};

const STATS = [
  { value: "2023", label: "Founded in San Francisco" },
  { value: "86", label: "People across two offices" },
  { value: "$28M", label: "Raised from operators and funds" },
  { value: "1,200+", label: "Companies running agents" },
];

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title={
          <>
            Back offices should <Accent>run themselves.</Accent>
          </>
        }
        body="We started Halvo after watching a finance team spend half its month copying numbers between systems. The people were brilliant. The work wasn't worthy of them."
      />

      <section aria-label="Halvo in numbers" className="border-y border-white/[0.06]">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="border-white/[0.06] py-10 sm:px-8 lg:first:pl-0 [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r max-lg:[&:nth-child(-n+2)]:border-b max-sm:px-1"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-bone">
                {i === 0 ? s.value : <CountUp value={s.value} />}
              </dd>
              <dd className="mt-3 text-sm text-mute">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our story"
            title={
              <>
                From one spreadsheet <Accent>to 38 million tasks.</Accent>
              </>
            }
          />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 0.08} className="relative bg-ink-950 p-8">
                <p className="font-serif text-5xl italic text-ember-gradient">{m.year}</p>
                <h3 className="mt-8 text-[1.0625rem] font-medium text-bone">{m.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mute">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <SectionHeading
            eyebrow="What we believe"
            title={
              <>
                Four rules <Accent>we build by.</Accent>
              </>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <SpotlightCard className="surface h-full rounded-[24px] p-7">
                  <p className="font-mono text-[12px] text-ember">0{i + 1}</p>
                  <h3 className="mt-5 text-lg font-medium tracking-[-0.015em] text-bone">{v.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-mute">{v.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Leadership"
            title={
              <>
                The people <Accent>behind the agents.</Accent>
              </>
            }
          />
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {team.map((p, i) => (
              <Reveal as="li" key={p.name} delay={(i % 4) * 0.06}>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/[0.07]">
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105"
                    style={{
                      background: `radial-gradient(120% 80% at 30% 10%, hsl(${p.hue} 55% 42% / 0.9), hsl(${p.hue} 40% 12%) 60%, #0b0c0f)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] bg-[size:14px_14px] opacity-50"
                    aria-hidden="true"
                  />
                  <Avatar
                    name={p.name}
                    hue={p.hue}
                    className="absolute bottom-4 left-4 size-11 text-sm ring-4 ring-ink-950/40 sm:bottom-5 sm:left-5 sm:size-14 sm:text-lg"
                  />
                </div>
                <h3 className="mt-5 text-[1.0625rem] font-medium text-bone">{p.name}</h3>
                <p className="text-sm text-ember-2/90">{p.role}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-mute sm:text-[14px]">{p.bio}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-20 flex flex-col gap-6 border-t border-white/[0.07] pt-10 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-dim">Backed by operators and</p>
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {investors.map((name) => (
                <li key={name} className="font-serif text-xl italic text-bone/60">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="careers" className="scroll-mt-24 border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeading
            eyebrow="Careers"
            title={
              <>
                Do the most <Accent>interesting work</Accent> of your career.
              </>
            }
            body="We hire people who care about craft and about the teams they're building for. San Francisco, London and remote."
          />
          <ul className="border-t border-white/[0.08]">
            {roles.map((r) => (
              <li key={r.title}>
                <Link
                  href="/contact"
                  className="group flex items-center justify-between gap-6 border-b border-white/[0.08] py-6 transition-colors"
                >
                  <span>
                    <span className="block text-[1.0625rem] font-medium text-bone transition-colors group-hover:text-ember-2">
                      {r.title}
                    </span>
                    <span className="mt-1 block text-sm text-mute">
                      {r.team} · {r.location}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
