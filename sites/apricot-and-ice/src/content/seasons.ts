import type { Season } from "@/lib/palette";

export type SeasonGuide = {
  id: Season;
  name: string;
  months: string;
  headline: string;
  body: string;
  goodFor: string[];
  journeys: string[];
  note?: string;
  scene: { time: number; season: Season };
};

export const seasons: SeasonGuide[] = [
  {
    id: "spring",
    name: "Spring",
    months: "Late March – April",
    headline: "Blossom under snow.",
    body: "For a few short weeks the apricot and cherry orchards flower white and pink beneath peaks still deep in winter snow. Days are bright and cool; nights are cold.",
    goodFor: ["Photography", "Orchard walks", "Village life"],
    journeys: ["apricot-blossom"],
    scene: { time: 0.24, season: "spring" },
  },
  {
    id: "summer",
    name: "Summer",
    months: "May – August",
    headline: "Long days, open roads.",
    body: "Warm days, green terraces and every high road open. The best season for walking to the glaciers, sleeping in high meadows and driving to Khunjerab.",
    goodFor: ["Trekking", "Glaciers", "Khunjerab Pass"],
    journeys: ["hunza-classic", "passu-glaciers", "top-of-the-road"],
    scene: { time: 0.38, season: "summer" },
  },
  {
    id: "autumn",
    name: "Autumn",
    months: "October – mid November",
    headline: "The valley turns gold.",
    body: "Poplars and apricot trees turn gold and red, the air sharpens and the light goes long and low. For many travellers, and most of our guides, the finest season of all.",
    goodFor: ["Photography", "Walking", "Harvest"],
    journeys: ["hunza-classic", "top-of-the-road"],
    scene: { time: 0.62, season: "autumn" },
  },
  {
    id: "winter",
    name: "Winter",
    months: "December – February",
    headline: "Quiet, white and yours.",
    body: "Snow on the terraces, frozen water channels and almost no other visitors. The high passes close, but Karimabad stays reachable and wonderfully still.",
    goodFor: ["Solitude", "Snow", "Slow travel"],
    journeys: [],
    note: "We run private winter departures on request.",
    scene: { time: 0.4, season: "winter" },
  },
];
