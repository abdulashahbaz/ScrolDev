import Image from "next/image";
import Link from "next/link";
import { BookingBar } from "@/components/booking-bar";
import { Cinema, type HouseCard } from "@/components/home/cinema";
import { RoomCard } from "@/components/room-card";
import { experiences } from "@/content/experiences";
import { photos } from "@/content/photos";
import { rooms } from "@/content/rooms";

const cards: HouseCard[] = [
  { kicker: "Rooms & suites", title: "River Rooms", body: "Arched windows over the Neretva, limestone walls, linen and oak.", href: "/rooms/river-room", icon: "icon1" },
  { kicker: "At dusk", title: "The Bridge Divers", body: "Watch the divers leap from Stari Most into the river below.", href: "/experiences#divers", icon: "icon3" },
  { kicker: "Dining", title: "Terrace & Kitchen", body: "Herzegovinian produce, river trout and Žilavka by the glass.", href: "/dining", icon: "icon2" },
  { kicker: "Day trip", title: "Blagaj Tekke", body: "A dervish house at the spring of the Buna, a short drive south.", href: "/experiences#blagaj", icon: "icon1" },
  { kicker: "Day trip", title: "Kravica Falls", body: "Turquoise pools under a wide curtain of waterfalls.", href: "/experiences#kravice", icon: "icon3" },
];

const numbers = [
  { figure: "21", label: "rooms and suites" },
  { figure: "4", label: "minutes' walk to Stari Most" },
  { figure: "1", label: "terrace facing the arch" },
  { figure: "2", label: "native grapes on the wine list" },
];

export default function HomePage() {
  const featured = experiences.filter((e) => ["divers", "kujundziluk", "blagaj"].includes(e.slug));

  return (
    <>
      <Cinema cards={cards} />

      <section className="section welcome">
        <div className="wrap welcome-grid">
          <div data-reveal>
            <p className="eyebrow">Welcome</p>
            <p className="welcome-lead">
              Twenty-one rooms in a restored stone house on the river side of the old town, with a terrace that looks straight at the
              arch. <em>Close enough to hear the divers&apos; crowd; far enough to sleep.</em>
            </p>
          </div>
          <dl className="numbers" data-reveal style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
            {numbers.map((n) => (
              <div key={n.label}>
                <dt>{n.figure}</dt>
                <dd>{n.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="booking-band">
        <div className="wrap booking-band-inner" data-reveal>
          <div>
            <p className="eyebrow">Plan your stay</p>
            <h2 className="display-sm">Choose your dates. We&apos;ll do the rest.</h2>
          </div>
          <BookingBar />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head section-head-row" data-reveal>
            <div>
              <p className="eyebrow">Rooms &amp; suites</p>
              <h2 className="display">Four ways to wake up in Mostar.</h2>
            </div>
            <Link href="/rooms" className="text-link">
              All rooms
            </Link>
          </div>
          <div className="room-grid">
            {rooms.map((room, i) => (
              <RoomCard key={room.slug} room={room} delay={(i % 2) * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap feature" data-reveal>
          <div className="feature-photo">
            <Image src={photos.diningTable} alt="Dinner plates, wine glasses and bread on a candlelit table" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 55vw" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">Terrace &amp; Kitchen</p>
            <h2 className="display">Dinner facing the arch.</h2>
            <p>
              Our kitchen cooks Herzegovina: trout from the Buna, lamb slow-baked under the sač, Livno cheese with figs and honey, and a wine list built on Žilavka and
              Blatina.
            </p>
            <Link href="/dining" className="button button-dark">
              See the kitchen
            </Link>
          </div>
        </div>
      </section>

      <section className="dusk">
        <Image src={photos.mostarDuskArch} alt="Stari Most at dusk between its two stone towers" fill placeholder="blur" sizes="100vw" className="dusk-photo" />
        <div className="dusk-shade" aria-hidden="true" />
        <figure className="wrap dusk-inner" data-reveal>
          <blockquote>Every evening the arch turns gold. The terrace has the best seat in town for it.</blockquote>
          <figcaption>From seven, on the river terrace</figcaption>
        </figure>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head section-head-row" data-reveal>
            <div>
              <p className="eyebrow">Around Mostar</p>
              <h2 className="display">Your days, planned by people who grew up here.</h2>
            </div>
            <Link href="/experiences" className="text-link">
              All experiences
            </Link>
          </div>
          <div className="experience-grid">
            {featured.map((e, i) => (
              <Link key={e.slug} href={`/experiences#${e.slug}`} className="experience-card" data-reveal style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}>
                <div className="experience-card-media">
                  {e.photo ? (
                    <Image src={e.photo} alt={e.alt ?? ""} fill placeholder="blur" sizes="(max-width: 860px) 100vw, 33vw" />
                  ) : (
                    <span className="icon-panel">
                      <Image src={`/scene/${e.icon}.webp`} alt="" width={120} height={120} />
                    </span>
                  )}
                </div>
                <p className="eyebrow">{e.distance}</p>
                <h3>{e.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
