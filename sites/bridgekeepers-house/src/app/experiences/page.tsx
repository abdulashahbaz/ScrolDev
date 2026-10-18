import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { experiences } from "@/content/experiences";
import { photos } from "@/content/photos";

export const metadata: Metadata = {
  title: "Experiences",
  description: "The bridge divers, the old bazaar, the minaret view and day trips to Blagaj, Kravica and Počitelj, planned by a concierge who grew up in Mostar.",
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Around Mostar"
        title="Your days, planned by locals."
        intro="Our concierge grew up in the old town. Tell them how you like to travel and they will build your days around the light, the crowds and the heat."
        photo={photos.mostarDuskTown}
        alt="Mostar's old town at dusk, minarets above the river"
      />

      <section className="section">
        <div className="wrap experience-list">
          {experiences.map((e, i) => (
            <article key={e.slug} id={e.slug} className={i % 2 ? "experience-row experience-row-reverse" : "experience-row"} data-reveal>
              <div className="experience-media">
                {e.photo ? (
                  <Image src={e.photo} alt={e.alt ?? ""} fill placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
                ) : (
                  <span className="icon-panel icon-panel-large">
                    <Image src={`/scene/${e.icon}.webp`} alt="" width={180} height={180} />
                  </span>
                )}
              </div>
              <div className="experience-copy">
                <p className="eyebrow">{e.kicker}</p>
                <h2 className="display">{e.name}</h2>
                <p>{e.body}</p>
                <p className="experience-distance">{e.distance}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
