import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/content/photos";
import { formatEuro } from "@/content/site";

export const metadata: Metadata = {
  title: "The Cellar Hammam",
  description: "A hammam in the vaulted cellars of the house: warm marble, a black-soap scrub, rose oil and massage, in the tradition of the Ottoman bathhouses.",
};

const rituals = [
  { name: "The Hammam Ritual", minutes: 60, price: 85, body: "Steam, a black-soap scrub with the kese mitt, then a foam wash on the warm marble." },
  { name: "Rose & Honey", minutes: 75, price: 110, body: "The hammam ritual, followed by a slow massage with rose oil and a honey mask." },
  { name: "After the Hills", minutes: 50, price: 75, body: "A deep massage for legs and back after a day on Mostar's cobbles and stairs." },
  { name: "Warm Stones", minutes: 80, price: 120, body: "River stones warmed and worked along the back, shoulders and feet." },
  { name: "Two by the River", minutes: 90, price: 210, body: "The hammam for two, then side-by-side massages and mint tea in the rest room." },
];

export default function SpaPage() {
  return (
    <>
      <PageHero
        eyebrow="The Cellar Hammam"
        title="Steam under stone vaults."
        intro="Below the house, in cellars that once stored wine and grain: warm marble, low light and the slow rituals of the Ottoman bathhouse."
        photo={photos.spaOil}
        alt="Hands warming a drop of oil before a massage"
        position="center 40%"
      />

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">The tradition</p>
            <h2 className="display">Heat, water, rest.</h2>
          </div>
          <div className="prose">
            <p>
              The hammam came to the Balkans with the Ottomans, and the ritual has barely changed since. Ours follows the same order: warm up on the heated marble, scrub,
              wash, and then rest in a cooler room with mint tea.
            </p>
            <p>The hammam is open to every guest. Treatments are booked through reception or the concierge, ideally a day ahead.</p>
          </div>
        </div>
      </section>

      <section className="section section-flush">
        <div className="wrap pair" data-reveal>
          <figure>
            <Image src={photos.spaStones} alt="Warm stones placed along a back during a massage" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
          </figure>
          <figure>
            <Image src={photos.roomBath} alt="A freestanding bath against a textured stone wall" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
          </figure>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Rituals</p>
            <h2 className="display">Choose your hour.</h2>
          </div>
          <ul className="ritual-list">
            {rituals.map((r, i) => (
              <li key={r.name} data-reveal style={{ "--reveal-delay": `${i * 0.06}s` } as React.CSSProperties}>
                <h3>{r.name}</h3>
                <p>{r.body}</p>
                <span className="ritual-meta">
                  {r.minutes} min · {formatEuro(r.price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="actions" data-reveal>
            <Link href="/book" className="button button-dark">
              Book a stay with the hammam
            </Link>
            <span className="fine-print">Open daily, 8:00 – 21:00. Ages 16 and over.</span>
          </div>
        </div>
      </section>
    </>
  );
}
