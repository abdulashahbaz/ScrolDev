import type { IconName } from "@/components/icon";

export type Place = {
  slug: string;
  name: string;
  kicker: string;
  short: string;
  body: string;
  bestTime: string;
  icon: IconName;
  journeys: string[];
};

// In order up the Karakoram Highway, south to north.
export const places: Place[] = [
  {
    slug: "baltit-fort",
    name: "Baltit Fort",
    kicker: "Karimabad",
    short: "Seven centuries of timber and stone above the valley.",
    body: "The former seat of Hunza's rulers looks down over Karimabad's terraces. Restored and reopened as a museum in 1996, its rooms, rooftop and carved balconies give the clearest picture of how the valley lived.",
    bestTime: "Mornings, before the day trips arrive",
    icon: "fort",
    journeys: ["hunza-classic", "apricot-blossom", "top-of-the-road"],
  },
  {
    slug: "altit-fort",
    name: "Altit Fort",
    kicker: "Altit",
    short: "The older fort, on a sheer drop to the river.",
    body: "Older than Baltit and perched on a cliff above the Hunza River, Altit Fort sits in a village of lanes, water channels and apricot orchards that reward an unhurried afternoon.",
    bestTime: "Late afternoon",
    icon: "tower",
    journeys: ["hunza-classic", "apricot-blossom", "top-of-the-road"],
  },
  {
    slug: "eagles-nest",
    name: "Eagle's Nest",
    kicker: "Viewpoint · Duikar",
    short: "First light on Rakaposhi, Ladyfinger and Golden Peak.",
    body: "A short drive above Karimabad, the ridge at Duikar looks across a ring of peaks. Arrive before sunrise and watch the snow turn pink, then gold, then white.",
    bestTime: "Sunrise",
    icon: "sunrise",
    journeys: ["hunza-classic", "apricot-blossom", "top-of-the-road"],
  },
  {
    slug: "attabad-lake",
    name: "Attabad Lake",
    kicker: "Gojal",
    short: "Turquoise water held back by the 2010 landslide.",
    body: "In January 2010 a landslide dammed the Hunza River and flooded villages upstream. The lake that rose behind it is now part of valley life, and its colour stops everyone who passes.",
    bestTime: "Midday, when the water is brightest",
    icon: "wave",
    journeys: ["hunza-classic", "apricot-blossom", "passu-glaciers", "top-of-the-road"],
  },
  {
    slug: "hussaini-bridge",
    name: "Hussaini Bridge",
    kicker: "Crossing",
    short: "Planks, wire and wind over the Hunza River.",
    body: "A suspension footbridge of widely spaced planks strung across the river near Hussaini village. Crossing is optional; watching other people cross is not.",
    bestTime: "Calm mornings",
    icon: "bridge",
    journeys: ["hunza-classic", "apricot-blossom", "passu-glaciers"],
  },
  {
    slug: "borith-lake",
    name: "Borith Lake",
    kicker: "Above Hussaini",
    short: "A small, still lake a world away from the road.",
    body: "A short climb above Hussaini, Borith Lake sits on the way toward the Passu Glacier: a quiet place for a picnic, a swim if you're brave, and long views up the valley.",
    bestTime: "Any calm day",
    icon: "lake",
    journeys: ["hunza-classic", "passu-glaciers"],
  },
  {
    slug: "passu-cones",
    name: "Passu Cones",
    kicker: "Upper Hunza",
    short: "Cathedral spires above Passu village.",
    body: "The serrated ridge of Tupopdan rises behind Passu like a row of cathedral spires: the most recognisable skyline on the Karakoram Highway.",
    bestTime: "Golden hour",
    icon: "spires",
    journeys: ["hunza-classic", "apricot-blossom", "passu-glaciers", "top-of-the-road"],
  },
  {
    slug: "khunjerab-pass",
    name: "Khunjerab Pass",
    kicker: "4,693 m",
    short: "The top of the road, on the border with China.",
    body: "The Karakoram Highway climbs to 4,693 metres at Khunjerab, the border crossing with China. The air is thin and the views are wide, and the national park around it is home to Marco Polo sheep and snow leopards.",
    bestTime: "Clear mornings, May to October",
    icon: "road",
    journeys: ["top-of-the-road"],
  },
];

/** The six places in the home page's slider, in order. */
export const featuredPlaces = ["baltit-fort", "eagles-nest", "attabad-lake", "hussaini-bridge", "passu-cones", "khunjerab-pass"].map(
  (slug) => places.find((p) => p.slug === slug)!,
);
