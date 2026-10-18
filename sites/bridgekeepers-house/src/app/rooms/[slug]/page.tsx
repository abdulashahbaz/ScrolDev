import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { RoomCard } from "@/components/room-card";
import { amenities, getRoom, rooms } from "@/content/rooms";
import { formatEuro } from "@/content/site";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/rooms/[slug]">): Promise<Metadata> {
  const room = getRoom((await params).slug);
  return room ? { title: room.name, description: room.summary } : {};
}

export default async function RoomPage({ params }: PageProps<"/rooms/[slug]">) {
  const room = getRoom((await params).slug);
  if (!room) notFound();

  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 2);
  const specs = [
    { label: "Size", value: `${room.size} m²` },
    { label: "Sleeps", value: `${room.sleeps}` },
    { label: "Bed", value: room.bed },
    { label: "View", value: room.view },
    { label: "From", value: `${formatEuro(room.from)} a night` },
  ];

  return (
    <>
      <PageHero eyebrow={room.kicker} title={room.name} intro={room.summary} photo={room.photo} alt={room.alt}>
        <Link href={`/book?room=${room.slug}`} className="button button-copper">
          Book this room
        </Link>
      </PageHero>

      <section className="spec-bar">
        <dl className="wrap spec-bar-inner">
          {specs.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">The room</p>
            <h2 className="display">{room.name}.</h2>
          </div>
          <div className="prose">
            {room.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="tick-list">
              {room.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-flush">
        <div className="wrap gallery">
          {room.gallery.map((g) => (
            <figure key={g.alt} className="gallery-item" data-reveal>
              <Image src={g.photo} alt={g.alt} fill placeholder="blur" sizes="(max-width: 900px) 100vw, 90vw" />
            </figure>
          ))}
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap split" data-reveal>
          <div>
            <p className="eyebrow">With every stay</p>
            <h2 className="display-sm">Included</h2>
          </div>
          <ul className="amenity-list amenity-list-light">
            {amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Also in the house</p>
            <h2 className="display">Other rooms.</h2>
          </div>
          <div className="room-grid">
            {others.map((r, i) => (
              <RoomCard key={r.slug} room={r} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
