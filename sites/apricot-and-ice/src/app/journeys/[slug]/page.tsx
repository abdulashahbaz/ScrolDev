import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { JourneyCard } from "@/components/journey-card";
import { Itinerary } from "@/components/journey/itinerary";
import { PageHero } from "@/components/page-hero";
import { formatPrice, getJourney, journeys } from "@/content/journeys";

export function generateStaticParams() {
  return journeys.map((j) => ({ slug: j.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/journeys/[slug]">): Promise<Metadata> {
  const journey = getJourney((await params).slug);
  return journey ? { title: journey.name, description: journey.summary } : {};
}

export default async function JourneyPage({ params }: PageProps<"/journeys/[slug]">) {
  const journey = getJourney((await params).slug);
  if (!journey) notFound();

  const others = journeys.filter((j) => j.slug !== journey.slug).slice(0, 2);
  const facts = [
    { label: "Length", value: `${journey.days} days` },
    { label: "Level", value: journey.level },
    { label: "When", value: journey.window },
    { label: "Group", value: "8 travellers at most" },
    { label: "From", value: `${formatPrice(journey.priceFrom)} pp` },
  ];

  return (
    <>
      <PageHero eyebrow={`${journey.days}-day journey`} title={journey.name} intro={journey.summary} time={journey.scene.time} season={journey.scene.season} uid={`hero-${journey.slug}`} foreground>
        <Link href={`/enquire?journey=${journey.slug}`} className="button button-apricot">
          Enquire about this journey <Icon name="arrow" size={18} />
        </Link>
      </PageHero>

      <section className="facts-bar">
        <dl className="wrap facts-bar-inner">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">The route</p>
            <h2 className="display">{journey.route[0]} and back, the slow way.</h2>
            <p className="lede">{journey.levelNote}</p>
          </div>
          <ol className="route-line" data-reveal>
            {journey.route.map((stop, i) => (
              <li key={`${stop}-${i}`}>
                <span className="route-dot" />
                {stop}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap itinerary-layout">
          <div className="itinerary-intro" data-reveal>
            <p className="eyebrow">Day by day</p>
            <h2 className="display">How the days unfold.</h2>
            <p>Flights to Gilgit are weather-dependent. When the planes don&apos;t fly, we drive the Karakoram Highway instead and reshuffle the days, never the experience.</p>
          </div>
          <Itinerary days={journey.itinerary} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">Departures</p>
            <h2 className="display">2027 dates.</h2>
            <ul className="departures">
              {journey.departures.map((date) => (
                <li key={date}>
                  <span>{date}</span>
                  <Link href={`/enquire?journey=${journey.slug}&date=${encodeURIComponent(date)}`} className="text-link">
                    Enquire <Icon name="arrow" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}>
            <p className="eyebrow">Included</p>
            <h2 className="display">Everything on the ground.</h2>
            <ul className="checklist">
              {journey.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fine-print">Not included: international flights, flights between Islamabad and Gilgit, visas and travel insurance.</p>
          </div>
        </div>
      </section>

      <section className="section section-night">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Also in the valley</p>
            <h2 className="display">Other journeys.</h2>
          </div>
          <div className="journey-grid">
            {others.map((j, i) => (
              <JourneyCard key={j.slug} journey={j} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
