"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatEuro } from "@/content/site";

type RoomOption = { slug: string; name: string; from: number; sleeps: number };

const extras = [
  { id: "transfer", label: "Airport or station transfer", price: 35 },
  { id: "ritual", label: "Hammam ritual on arrival", price: 85 },
  { id: "dinner", label: "Dinner on the terrace, first night", price: 90 },
];

const DAY = 24 * 60 * 60 * 1000;

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const n = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / DAY);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function BookingForm({ rooms }: { rooms: RoomOption[] }) {
  const params = useSearchParams();
  const [room, setRoom] = useState(rooms.some((r) => r.slug === params.get("room")) ? params.get("room")! : rooms[1].slug);
  const [checkIn, setCheckIn] = useState(params.get("checkin") ?? "");
  const [checkOut, setCheckOut] = useState(params.get("checkout") ?? "");
  const [guests, setGuests] = useState(params.get("guests") ?? "2");
  const [chosen, setChosen] = useState<string[]>([]);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const selected = rooms.find((r) => r.slug === room)!;
  const nights = nightsBetween(checkIn, checkOut);
  const extrasTotal = extras.filter((x) => chosen.includes(x.id)).reduce((sum, x) => sum + x.price, 0);
  const total = nights * selected.from + extrasTotal;

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    setSentTo(name.split(" ")[0] || "there");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (sentTo) {
    return (
      <div className="form-done" role="status">
        <p className="eyebrow">Request received</p>
        <h2 className="display">Thank you, {sentTo}.</h2>
        <p className="lede">
          This is a concept site by ScrolDev, so no booking was made and nothing was sent. On a live site, the team in Mostar would now be confirming your{" "}
          {selected.name}.
        </p>
        <button type="button" className="button button-dark" onClick={() => setSentTo(null)}>
          Back to the booking
        </button>
      </div>
    );
  }

  return (
    <form className="booking-layout" onSubmit={onSubmit}>
      <div className="booking-fields">
        <fieldset className="field">
          <legend>Room</legend>
          <div className="room-options">
            {rooms.map((r) => (
              <label key={r.slug} className="room-option">
                <input type="radio" name="room" value={r.slug} checked={room === r.slug} onChange={() => setRoom(r.slug)} />
                <span>
                  <strong>{r.name}</strong>
                  <em>From {formatEuro(r.from)} a night · sleeps {r.sleeps}</em>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-row field-row-3">
          <label className="field">
            <span>Arrive</span>
            <input type="date" name="checkin" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </label>
          <label className="field">
            <span>Leave</span>
            <input type="date" name="checkout" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} required />
          </label>
          <label className="field">
            <span>Guests</span>
            <select name="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
              {["1", "2", "3", "4"].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="field">
          <legend>Add to your stay</legend>
          <div className="extras">
            {extras.map((x) => (
              <label key={x.id} className="extra">
                <input type="checkbox" checked={chosen.includes(x.id)} onChange={() => toggle(x.id)} />
                <span>{x.label}</span>
                <em>{formatEuro(x.price)}</em>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span>Your name</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
        </div>
        <label className="field">
          <span>Anything we should know?</span>
          <textarea name="notes" rows={4} placeholder="Arrival time, celebrations, dietary needs, a room on a higher floor…" />
        </label>
      </div>

      <aside className="booking-summary" aria-live="polite">
        <p className="eyebrow">Your stay</p>
        <h2>{selected.name}</h2>
        <dl>
          <div>
            <dt>Nights</dt>
            <dd>{nights || "Choose dates"}</dd>
          </div>
          <div>
            <dt>Guests</dt>
            <dd>{guests}</dd>
          </div>
          <div>
            <dt>Room</dt>
            <dd>{nights ? `${formatEuro(selected.from)} × ${nights}` : `From ${formatEuro(selected.from)}`}</dd>
          </div>
          {extrasTotal > 0 && (
            <div>
              <dt>Extras</dt>
              <dd>{formatEuro(extrasTotal)}</dd>
            </div>
          )}
        </dl>
        <p className="booking-total">
          <span>Estimated total</span>
          <strong>{nights ? formatEuro(total) : "—"}</strong>
        </p>
        <p className="fine-print">Breakfast and the hammam are included. Nothing is charged until we confirm.</p>
        <button type="submit" className="button button-copper button-wide">
          Request this stay
        </button>
        <p className="fine-print">Concept site: this form doesn&apos;t send anything.</p>
      </aside>
    </form>
  );
}
