import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/content/photos";
import { amenities, rooms } from "@/content/rooms";
import { formatEuro } from "@/content/site";

export const metadata: Metadata = {
  title: "Rooms & suites",
  description: "Twenty-one rooms and suites in a stone house above the Neretva: Courtyard Rooms, River Rooms, Tower Suites and the Bridgekeeper's Suite.",
};

export default function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rooms & suites"
        title="Twenty-one rooms, one river."
        intro="Limestone walls, oak floors and linen, arranged around a fig-tree courtyard and the Neretva. Breakfast and the hammam come with every stay."
        photo={photos.roomRiver}
        alt="A River Room in warm timber with a low king bed"
      />

      <section className="section">
        <div className="wrap room-list">
          {rooms.map((room, i) => (
            <article key={room.slug} className={i % 2 ? "room-row room-row-reverse" : "room-row"} data-reveal>
              <Link href={`/rooms/${room.slug}`} className="room-row-photo" aria-label={room.name}>
                <Image src={room.photo} alt={room.alt} fill placeholder="blur" sizes="(max-width: 900px) 100vw, 58vw" />
              </Link>
              <div className="room-row-copy">
                <p className="eyebrow">{room.kicker}</p>
                <h2 className="display">{room.name}</h2>
                <p>{room.summary}</p>
                <dl className="spec-list">
                  <div>
                    <dt>Size</dt>
                    <dd>{room.size} m²</dd>
                  </div>
                  <div>
                    <dt>Bed</dt>
                    <dd>{room.bed}</dd>
                  </div>
                  <div>
                    <dt>View</dt>
                    <dd>{room.view}</dd>
                  </div>
                  <div>
                    <dt>From</dt>
                    <dd>{formatEuro(room.from)} a night</dd>
                  </div>
                </dl>
                <div className="actions">
                  <Link href={`/rooms/${room.slug}`} className="button button-dark">
                    View the room
                  </Link>
                  <Link href={`/book?room=${room.slug}`} className="text-link">
                    Book
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-night">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">In every room</p>
            <h2 className="display">The small things, done properly.</h2>
          </div>
          <ul className="amenity-list">
            {amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
