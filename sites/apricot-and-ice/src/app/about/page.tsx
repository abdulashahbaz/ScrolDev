import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { sceneVars } from "@/lib/palette";

export const metadata: Metadata = {
  title: "About",
  description: "A small travel company in Karimabad: why we keep groups small, stay longer and travel with guides from the valley.",
};

const day = [
  { time: "05:30", t: 0, title: "First light", body: "Optional, always worth it: tea on a viewpoint while the snow turns pink." },
  { time: "08:00", t: 0.16, title: "Breakfast on the terrace", body: "Apricot jam, flatbread and the day's plan, which is never too full." },
  { time: "10:00", t: 0.3, title: "The morning's walk", body: "A fort, a village, a water channel: one thing, done properly." },
  { time: "13:00", t: 0.42, title: "A long lunch", body: "Often in someone's home, often longer than planned." },
  { time: "16:00", t: 0.56, title: "Time that's yours", body: "Read, wander, sleep, or follow your guide to the place they'd go anyway." },
  { time: "18:00", t: 0.69, title: "Golden hour", body: "We'll be somewhere high when the light goes gold. That part isn't optional." },
  { time: "20:30", t: 0.95, title: "Dinner and stars", body: "Lamps in the fort, cold air and a sky most of us never see at home." },
];

const commitments = [
  { title: "Local hands", body: "Guides, drivers, cooks and guesthouses from Hunza and Gojal. The money you spend stays in the valley." },
  { title: "Small footprint", body: "Eight travellers at most, two nights per stop and nothing left behind on the trail." },
  { title: "Respect first", body: "We brief every group on local customs and dress before day one, and we ask before we photograph." },
  { title: "Honest pace", body: "Altitude, weather and roads set the rhythm here. We plan around them instead of pretending otherwise." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="We keep the valley's time."
        intro="Apricot & Ice is a small travel company based in Karimabad. We started it because the best way to see Hunza is the way people who live here already do: slowly."
        time={0.06}
        uid="hero-about"
      />

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">Why we exist</p>
            <h2 className="display">Fewer places. More time in each.</h2>
          </div>
          <div className="prose">
            <p>Most visitors see Hunza through a car window: a photo at Attabad, a quick climb to the fort, back on the road before lunch. The valley rewards the opposite.</p>
            <p>So our journeys are short on distance and long on time. You&apos;ll see the same peak at dawn and at dusk, eat with the same family twice, and leave knowing a few names instead of a hundred viewpoints.</p>
          </div>
        </div>
      </section>

      <section className="section section-night">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">A day with us</p>
            <h2 className="display">From first light to the first stars.</h2>
          </div>
          <ol className="day-timeline">
            {day.map((item, i) => (
              <li key={item.time} data-reveal style={{ "--reveal-delay": `${(i % 4) * 0.06}s`, ...sceneVars(item.t) } as React.CSSProperties}>
                <span className="day-sky" aria-hidden="true" />
                <span className="day-time">{item.time}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">How we work</p>
            <h2 className="display">Four promises.</h2>
          </div>
          <ul className="commitments">
            {commitments.map((c, i) => (
              <li key={c.title} data-reveal style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}>
                <span className="commitment-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/journeys" className="button button-dark">
            See the journeys <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
