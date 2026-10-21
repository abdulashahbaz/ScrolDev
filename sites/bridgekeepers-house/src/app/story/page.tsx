import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/content/photos";

export const metadata: Metadata = {
  title: "Our story",
  description: "Mostar is named for the mostari, the keepers of its Old Bridge. The story of the bridge, and of the house that borrows their name.",
};

const timeline = [
  { year: "1566", body: "Stari Most is completed, a single stone arch over the Neretva. The town grows around it and takes its name from the mostari who keep it." },
  { year: "1993", body: "On 9 November, during the war, the bridge is shelled and falls into the river." },
  { year: "2004", body: "Rebuilt with traditional methods and stone from local quarries, the bridge reopens in July." },
  { year: "2005", body: "UNESCO inscribes the Old Bridge Area of the Old City of Mostar as a World Heritage Site." },
];

export default function StoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Named for the keepers."
        intro="Mostar takes its name from the mostari, the men who kept the Old Bridge. We borrowed their name, and their job description."
        photo={photos.mostarArch}
        alt="Stari Most framed by its two stone towers above the emerald Neretva"
      />

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">The keepers</p>
            <h2 className="display">A town that grew around a crossing.</h2>
          </div>
          <div className="prose">
            <p>
              For centuries the bridge was the heart of Mostar: the crossing that joined its two banks and carried its trade. The keepers who guarded it gave the town its
              name.
            </p>
            <p>
              We are not a historic institution, and we don&apos;t pretend to be. We are a small hotel that thinks the old job is still a good one: watch over the people who
              cross, know the town by heart, and keep the light on.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-night">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">The bridge</p>
            <h2 className="display">Four dates every guest should know.</h2>
          </div>
          <ol className="timeline">
            {timeline.map((t, i) => (
              <li key={t.year} data-reveal style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}>
                <span className="timeline-year">{t.year}</span>
                <p>{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap feature" data-reveal>
          <div className="feature-photo feature-photo-tall">
            <Image src={photos.mostarTower} alt="A stone tower and a timber-framed house above the river" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">The house</p>
            <h2 className="display">Restored by hand, slowly.</h2>
            <p>
              Local masons spent four years on the house, saving original stone wherever they could and cutting new stone from the same hills where they couldn&apos;t.
              The carpentry, copper and textiles are from workshops a short walk away.
            </p>
            <Link href="/rooms" className="button button-dark">
              See the rooms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
