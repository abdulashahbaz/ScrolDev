import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { JourneyCard } from "@/components/journey-card";
import { PageHero } from "@/components/page-hero";
import { formatPrice, journeys } from "@/content/journeys";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Four small-group journeys through Hunza: the valley's classics, apricot blossom, the Passu glaciers and the road to Khunjerab Pass.",
};

export default function JourneysPage() {
  return (
    <>
      <PageHero
        eyebrow="Journeys"
        title="Four ways into the valley."
        intro="Seven to ten days, never more than eight travellers, and at least two nights at every stop. Choose by season, pace or how high you want to go."
        time={0.35}
        uid="hero-journeys"
      />

      <section className="section">
        <div className="wrap">
          <div className="journey-grid">
            {journeys.map((journey, i) => (
              <JourneyCard key={journey.slug} journey={journey} delay={(i % 2) * 0.12} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">At a glance</p>
            <h2 className="display">Side by side.</h2>
          </div>
          <div className="table-scroll" data-reveal>
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">Journey</th>
                  <th scope="col">Days</th>
                  <th scope="col">Level</th>
                  <th scope="col">Season</th>
                  <th scope="col">From</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((j) => (
                  <tr key={j.slug}>
                    <th scope="row">
                      <Link href={`/journeys/${j.slug}`}>{j.name}</Link>
                    </th>
                    <td>{j.days}</td>
                    <td>
                      {j.level}
                      <span className="compare-note">{j.levelNote}</span>
                    </td>
                    <td>{j.window}</td>
                    <td>{formatPrice(j.priceFrom)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine-print">Prices are per person sharing, in US dollars, and include everything on the ground in Gilgit-Baltistan.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">Private journeys</p>
            <h2 className="display">Your dates, your pace.</h2>
          </div>
          <div>
            <p className="lede">Any journey can run privately for families and friends, on the dates you choose. We can stretch it, slow it down further or add a winter week in Karimabad.</p>
            <Link href="/enquire" className="button button-dark">
              Ask about a private journey <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
