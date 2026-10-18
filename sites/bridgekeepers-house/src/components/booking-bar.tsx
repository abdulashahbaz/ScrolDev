"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

// Quick availability search: dates and guests, handed to /book as query params.
export function BookingBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ guests });
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    router.push(`/book?${params}`);
  };

  return (
    <form className={`booking-bar booking-bar-${tone}`} onSubmit={onSubmit} aria-label="Check availability">
      <label>
        <span>Arrive</span>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      </label>
      <label>
        <span>Leave</span>
        <input type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} />
      </label>
      <label>
        <span>Guests</span>
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          {["1", "2", "3", "4"].map((n) => (
            <option key={n} value={n}>
              {n} {n === "1" ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="button button-copper">
        Check availability
      </button>
    </form>
  );
}
