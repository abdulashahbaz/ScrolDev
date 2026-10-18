import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site, studio } from "@/content/site";

export const metadata: Metadata = {
  title: "Legal",
  description: "About this concept site, plus Halvo's privacy and terms summaries.",
};

const SECTIONS = [
  {
    id: "about",
    title: "About this site",
    body: [
      `${site.name} is a fictional company. This website is a design and engineering concept created by ${studio.name} to show what a modern SaaS marketing site can look like.`,
      "Every customer, person, quote, number, certification and price on this site is invented. Forms on this site do not send or store anything.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    body: [
      "This site sets no tracking cookies and runs no analytics. A dismissed notice is remembered in your browser's session storage and nowhere else.",
      "On a live product, this page would explain what personal data is collected, why, how long it is kept and how to exercise your rights.",
    ],
  },
  {
    id: "terms",
    title: "Terms",
    body: [
      "Nothing on this site is an offer of a product or service. On a live product, this section would hold the terms of service, acceptable use policy and data processing agreement.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="The fine print."
        body="Short, because this is a concept site. Read the first section first."
      />
      <section className="pb-24 sm:pb-32">
        <div className="container-x grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex gap-4 lg:flex-col lg:gap-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-mute transition-colors hover:text-bone">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="max-w-2xl">
            {SECTIONS.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28 border-t border-white/[0.07] pb-12 pt-10 first:border-t-0 first:pt-0"
              >
                <h2 className="text-2xl font-medium tracking-[-0.03em] text-bone">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 30)} className="mt-4 text-[1.0625rem] leading-[1.75] text-bone/80">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
