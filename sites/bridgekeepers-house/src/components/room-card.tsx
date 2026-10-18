import Image from "next/image";
import Link from "next/link";
import { formatEuro } from "@/content/site";
import type { Room } from "@/content/rooms";

export function RoomCard({ room, delay = 0 }: { room: Room; delay?: number }) {
  return (
    <Link href={`/rooms/${room.slug}`} className="room-card" data-reveal style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}>
      <div className="room-card-photo">
        <Image src={room.photo} alt={room.alt} fill placeholder="blur" sizes="(max-width: 760px) 100vw, 50vw" />
      </div>
      <div className="room-card-body">
        <p className="eyebrow">{room.kicker}</p>
        <h3>{room.name}</h3>
        <p className="room-card-summary">{room.summary}</p>
        <p className="room-card-meta">
          <span>{room.size} m²</span>
          <span>{room.view}</span>
          <span>From {formatEuro(room.from)}</span>
        </p>
      </div>
    </Link>
  );
}
