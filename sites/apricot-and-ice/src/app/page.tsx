import Link from "next/link";
import { Cinema } from "@/components/home/cinema";
import { Icon } from "@/components/icon";
import { JourneyCard } from "@/components/journey-card";
import { Landscape, SceneBack, SceneBridge, SceneCliff, SceneSky } from "@/components/scene/landscape";
import { journeys } from "@/content/journeys";
import { featuredPlaces } from "@/content/places";
import { seasons } from "@/content/seasons";

const principles = [
  { figure: "8", label: "travellers at most", body: "Small enough to fit around one family's table, which is where you'll eat more than once." },
  { figure: "2", label: "nights at every stop", body: "No dawn departures to make up time. You wake in the same place and see it in a second light." },
  { figure: "1", label: "guide, start to finish", body: "Born in Hunza or Gojal, and with you from the first evening in Gilgit to the last goodbye." },
];

export default function HomePage() {
  return (
    <>
      <Cinema
        sky={<SceneSky />}
        back={<SceneBack uid="cinema" />}
        bridge={<SceneBridge />}
        cliffLeft={<SceneCliff side="left" uid="cinema" />}
        cliffRight={<SceneCliff side="right" uid="cinema" />}
        places={featuredPlaces}
      />

      <section className="section section-night">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Journeys</p>
            <h2 className="display">Four ways into the valley.</h2>
            <p className="lede">Every journey is small, slow and led by someone who grew up here. Pick the season, we&apos;ll handle the rest.</p>
          </div>
          <div className="journey-grid">
            {journeys.map((journey, i) => (
              <JourneyCard key={journey.slug} journey={journey} delay={(i % 2) * 0.12} />
            ))}
          </div>
          <Link href="/journeys" className="text-link text-link-light">
            Compare every journey <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">How we travel</p>
            <h2 className="display">Slow is the whole point.</h2>
          </div>
          <ol className="principles">
            {principles.map((p, i) => (
              <li key={p.label} data-reveal style={{ "--reveal-delay": `${i * 0.1}s` } as React.CSSProperties}>
                <span className="principle-figure">{p.figure}</span>
                <h3>{p.label}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head section-head-row" data-reveal>
            <div>
              <p className="eyebrow">Seasons</p>
              <h2 className="display">Four valleys in one year.</h2>
            </div>
            <Link href="/seasons" className="text-link">
              When to go <Icon name="arrow" size={18} />
            </Link>
          </div>
          <ul className="season-strip">
            {seasons.map((s, i) => (
              <li key={s.id} data-reveal style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}>
                <Link href={`/seasons#${s.id}`} className="season-tile">
                  <div className="season-tile-art">
                    <Landscape time={s.scene.time} season={s.scene.season} uid={`tile-${s.id}`} />
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.months}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="statement">
        <Landscape time={0.7} season="autumn" uid="statement" foreground className="statement-scene" />
        <div className="statement-shade" aria-hidden="true" />
        <figure className="wrap statement-inner" data-reveal>
          <blockquote>We would rather show you one valley properly than ten in a hurry.</blockquote>
          <figcaption>The Apricot &amp; Ice promise</figcaption>
        </figure>
      </section>
    </>
  );
}
