"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { journeys } from "@/content/journeys";
import type { Place } from "@/content/places";

// Schematic of the Karakoram Highway, south (Gilgit) at the bottom to Khunjerab at the top.
const MAP_POINTS: Record<string, [x: number, y: number, label: "left" | "right"]> = {
  "baltit-fort": [168, 468, "right"],
  "altit-fort": [124, 446, "left"],
  "eagles-nest": [214, 428, "right"],
  "attabad-lake": [172, 360, "right"],
  "hussaini-bridge": [140, 292, "left"],
  "borith-lake": [196, 266, "right"],
  "passu-cones": [152, 214, "left"],
  "khunjerab-pass": [212, 42, "left"],
};
const ROAD = "M96 622C142 586 86 544 150 504S196 432 164 384 118 322 150 272 204 184 172 132 222 72 212 42";

export function PlacesIndex({ places }: { places: Place[] }) {
  const [active, setActive] = useState(places[0].slug);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll(".place-entry").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="places-layout">
      <aside className="places-map" aria-label="Map of the places along the Karakoram Highway">
        <svg viewBox="0 0 300 660" role="img" aria-labelledby="map-title">
          <title id="map-title">Schematic map: Gilgit in the south, up the Karakoram Highway to Khunjerab Pass</title>
          <path d={ROAD} className="map-road-casing" />
          <path d={ROAD} className="map-road" />
          <g className="map-peak">
            <path d="M44 540 62 508l18 32Z" />
            <text x="62" y="560" textAnchor="middle">
              Rakaposhi
            </text>
          </g>
          <g className="map-town">
            <circle cx="96" cy="622" r="4" />
            <text x="108" y="626">
              Gilgit
            </text>
            <text x="230" y="152">
              Sost
            </text>
          </g>
          {places.map((place) => {
            const [x, y, side] = MAP_POINTS[place.slug];
            const on = place.slug === active;
            return (
              <a key={place.slug} href={`#${place.slug}`} className={on ? "map-point is-active" : "map-point"} aria-current={on ? "location" : undefined}>
                <circle cx={x} cy={y} r={on ? 8 : 5} />
                <text x={side === "right" ? x + 14 : x - 14} y={y + 4} textAnchor={side === "right" ? "start" : "end"}>
                  {place.name}
                </text>
              </a>
            );
          })}
        </svg>
        <p className="map-legend">
          <span>N</span> Up the Karakoram Highway
        </p>
      </aside>

      <ol className="place-list">
        {places.map((place, i) => (
          <li key={place.slug} id={place.slug} className="place-entry" data-reveal>
            <div className="place-entry-head">
              <span className="place-number">{String(i + 1).padStart(2, "0")}</span>
              <span className="place-entry-icon">
                <Icon name={place.icon} size={30} strokeWidth={1.3} />
              </span>
            </div>
            <p className="eyebrow">{place.kicker}</p>
            <h2>{place.name}</h2>
            <p className="place-body">{place.body}</p>
            <dl className="place-details">
              <div>
                <dt>Best time</dt>
                <dd>{place.bestTime}</dd>
              </div>
              <div>
                <dt>On these journeys</dt>
                <dd className="chips">
                  {place.journeys.map((slug) => {
                    const j = journeys.find((x) => x.slug === slug)!;
                    return (
                      <Link key={slug} href={`/journeys/${slug}`} className="chip">
                        {j.name}
                      </Link>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
