import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PlacesIndex } from "@/components/places/places-index";
import { places } from "@/content/places";

export const metadata: Metadata = {
  title: "Places",
  description: "Eight places worth the journey, in order up the Karakoram Highway: Hunza's forts, viewpoints, lakes, bridges and the pass at the top of the road.",
};

export default function PlacesPage() {
  return (
    <>
      <PageHero
        eyebrow="Places"
        title="Eight places worth the journey."
        intro="In order up the Karakoram Highway, from Karimabad's forts to the border at Khunjerab. Every one of them is on at least one of our journeys."
        time={0.6}
        uid="hero-places"
      />
      <section className="section">
        <div className="wrap">
          <PlacesIndex places={places} />
        </div>
      </section>
    </>
  );
}
