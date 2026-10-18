import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquire/enquiry-form";
import { PageHero } from "@/components/page-hero";
import { journeys } from "@/content/journeys";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Tell us when you'd like to travel and which journey interests you. Our team in Karimabad replies within two working days.",
};

const notes = [
  { title: "Getting there", body: "Most journeys start in Gilgit. Flights from Islamabad are short but weather-dependent; the alternative is a long, spectacular drive up the Karakoram Highway." },
  { title: "Altitude", body: "Karimabad sits at around 2,500 metres and Khunjerab at 4,693. Our itineraries climb gradually, and your guide will always choose caution." },
  { title: "Before you book", body: "Check the latest visa and entry requirements for your nationality, and make sure your travel insurance covers trekking at altitude." },
];

export default function EnquirePage() {
  return (
    <>
      <PageHero
        eyebrow="Enquire"
        title="Start with a conversation."
        intro="Tell us roughly when and how you'd like to travel. Our team in Karimabad replies within two working days, usually with a few questions of our own."
        time={0.9}
        uid="hero-enquire"
      />
      <section className="section">
        <div className="wrap enquire-layout">
          <Suspense>
            <EnquiryForm journeys={journeys.map((j) => ({ slug: j.slug, name: j.name, departures: j.departures }))} />
          </Suspense>
          <aside className="enquire-notes" aria-label="Practical notes">
            {notes.map((n) => (
              <div key={n.title} data-reveal>
                <h2>{n.title}</h2>
                <p>{n.body}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
