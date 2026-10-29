import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/book/booking-form";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/content/photos";
import { rooms } from "@/content/rooms";

export const metadata: Metadata = {
  title: "Book a stay",
  description: "Choose your dates and room at The Bridgekeepers' House in Mostar. Breakfast is included in every stay.",
};

export default function BookPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Book a stay"
        title="Choose your dates."
        intro="Breakfast on the terrace is included in every stay. We confirm every request personally, usually within a few hours."
        photo={photos.mostarDuskArch}
        alt="Stari Most at dusk between its two stone towers"
      />
      <section className="section">
        <div className="wrap">
          <Suspense>
            <BookingForm rooms={rooms.map((r) => ({ slug: r.slug, name: r.name, from: r.from, sleeps: r.sleeps }))} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
