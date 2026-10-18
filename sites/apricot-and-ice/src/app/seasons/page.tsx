import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { Landscape } from "@/components/scene/landscape";
import { journeys } from "@/content/journeys";
import { seasons } from "@/content/seasons";

export const metadata: Metadata = {
  title: "When to go",
  description: "Blossom in spring, open roads in summer, gold in autumn and snow in winter: how Hunza changes through the year, and which journey fits each season.",
};

export default function SeasonsPage() {
  return (
    <>
      <PageHero
        eyebrow="When to go"
        title="Four valleys in one year."
        intro="Hunza changes completely with the seasons. There's no wrong time to come, only a different valley waiting for you."
        time={0.64}
        season="autumn"
        uid="hero-seasons"
      />

      {seasons.map((season, i) => (
        <section key={season.id} id={season.id} className="section season-section">
          <div className="wrap">
            <div className="season-panel" data-reveal>
              <Landscape time={season.scene.time} season={season.scene.season} uid={`season-${season.id}`} />
              <div className="season-panel-label">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h2>{season.name}</h2>
              </div>
            </div>
            <div className="season-copy">
              <div data-reveal>
                <p className="eyebrow">{season.months}</p>
                <h3 className="display">{season.headline}</h3>
              </div>
              <div data-reveal style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}>
                <p className="lede">{season.body}</p>
                <dl className="place-details">
                  <div>
                    <dt>Good for</dt>
                    <dd className="chips">
                      {season.goodFor.map((g) => (
                        <span key={g} className="chip chip-static">
                          {g}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Journeys</dt>
                    <dd className="chips">
                      {season.journeys.map((slug) => (
                        <Link key={slug} href={`/journeys/${slug}`} className="chip">
                          {journeys.find((j) => j.slug === slug)!.name}
                        </Link>
                      ))}
                      {season.note && (
                        <Link href="/enquire" className="text-link">
                          {season.note} <Icon name="arrow" size={16} />
                        </Link>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
