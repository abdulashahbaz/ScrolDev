import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/content/photos";

export const metadata: Metadata = {
  title: "Dining",
  description: "Herzegovinian cooking on a terrace facing Stari Most: Buna trout, lamb under the sač, Livno cheese and a wine list built on Žilavka and Blatina.",
};

const menu = [
  { dish: "Trout from the Buna", note: "brown butter, wild herbs, new potatoes" },
  { dish: "Lamb under the sač", note: "slow-baked under an iron bell with garden vegetables" },
  { dish: "Livno cheese", note: "fresh figs, walnuts and mountain honey" },
  { dish: "Ćevapi from the grill", note: "kajmak, raw onion and warm somun" },
  { dish: "Stuffed peppers", note: "rice, beef and a slow tomato sauce" },
  { dish: "Tufahija", note: "a poached apple filled with walnuts, under cream" },
];

const hours = [
  { name: "Breakfast", time: "7:30 – 11:00", where: "River terrace" },
  { name: "Lunch", time: "12:30 – 15:00", where: "River terrace" },
  { name: "Dinner", time: "19:00 – 22:30", where: "Terrace and dining room" },
  { name: "Cellar Bar", time: "17:00 – late", where: "Under the house" },
];

export default function DiningPage() {
  return (
    <>
      <PageHero
        eyebrow="Terrace & Kitchen"
        title="Herzegovina, on a plate."
        intro="A small kitchen cooking the food of the region, served on a terrace that faces the Old Bridge. Open to guests and to the town."
        photo={photos.diningTable}
        alt="A candlelit dinner table with plates, bread and wine glasses"
      />

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">The kitchen</p>
            <h2 className="display">Cooked the way it is at home.</h2>
          </div>
          <div className="prose">
            <p>
              Herzegovina has hot summers, stony hills and a river full of trout, and its cooking follows: slow-baked meat and vegetables under the <em>sač</em>,
              cheese from the high pastures, figs, pomegranates and honey.
            </p>
            <p>Our cooks shop the morning market and the farms around Blagaj, and the menu changes with whatever is best that week.</p>
          </div>
        </div>
      </section>

      <section className="section section-flush">
        <div className="wrap mosaic" data-reveal>
          <figure className="mosaic-tall">
            <Image src={photos.diningChef} alt="A cook chopping herbs on a board" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 40vw" />
          </figure>
          <figure>
            <Image src={photos.diningPlate} alt="Fish on vegetables in a dark sauce, with a glass of red wine" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 30vw" />
          </figure>
          <figure>
            <Image src={photos.diningWine} alt="A glass of red wine overlooking a vineyard" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 30vw" />
          </figure>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">From this week&apos;s menu</p>
            <h2 className="display">A few of the dishes.</h2>
            <p className="fine-print">The full menu changes weekly. Vegetarian dishes every service.</p>
          </div>
          <ul className="menu-list">
            {menu.map((m) => (
              <li key={m.dish}>
                <span className="menu-dish">{m.dish}</span>
                <span className="menu-note">{m.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-night">
        <div className="wrap feature feature-night" data-reveal>
          <div className="feature-photo">
            <Image src={photos.diningBar} alt="A low-lit bar with shelves of bottles and wooden stools" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 55vw" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">The Cellar Bar</p>
            <h2 className="display">Rakija, wine and slow coffee.</h2>
            <p>
              Under the house, a stone-vaulted bar for a glass of Žilavka or Blatina, the region&apos;s two native grapes, a measure of plum rakija, or Bosnian coffee
              poured from a copper džezva with a cube of rahat lokum.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">Hours</p>
            <h2 className="display">Open every day.</h2>
            <Link href="/book" className="button button-dark">
              Reserve a table
            </Link>
          </div>
          <dl className="hours">
            {hours.map((h) => (
              <div key={h.name}>
                <dt>{h.name}</dt>
                <dd>
                  <span>{h.time}</span>
                  <span>{h.where}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
