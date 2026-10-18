import type { StaticImageData } from "next/image";
import { photos } from "@/content/photos";

export type Room = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  body: string[];
  size: number;
  sleeps: number;
  bed: string;
  view: string;
  count: number;
  from: number;
  features: string[];
  photo: StaticImageData;
  gallery: { photo: StaticImageData; alt: string }[];
  alt: string;
};

export const rooms: Room[] = [
  {
    slug: "courtyard-room",
    name: "Courtyard Room",
    kicker: "Nine rooms",
    summary: "Quiet rooms around the stone courtyard and its old fig tree, with deep window seats and linen the colour of limestone.",
    body: [
      "Our Courtyard Rooms face inward, away from the river and the evening crowds, onto a paved courtyard shaded by a fig tree older than the restoration.",
      "Thick stone walls keep them cool through Mostar's long summers. Mornings start with the bells and the call to prayer drifting across the rooftops.",
    ],
    size: 24,
    sleeps: 2,
    bed: "Queen bed",
    view: "Courtyard",
    count: 9,
    from: 180,
    features: ["Walk-in rain shower", "Window seat", "Copper džezva and Bosnian coffee", "Air conditioning"],
    photo: photos.roomCourtyard,
    alt: "A Courtyard Room with a tufted sofa, a made bed and tall curtained windows",
    gallery: [{ photo: photos.mostarTown, alt: "The old town of Mostar along the emerald Neretva" }],
  },
  {
    slug: "river-room",
    name: "River Room",
    kicker: "Eight rooms",
    summary: "Arched windows over the emerald Neretva. Leave them open at night and fall asleep to the river.",
    body: [
      "Every River Room sits on the water side of the house, with oak floors, carved timber and arched windows that frame the Neretva running green below.",
      "The light changes all day: white in the morning, gold after five, and silver when the bridge is lit at night.",
    ],
    size: 30,
    sleeps: 2,
    bed: "King bed",
    view: "Neretva river",
    count: 8,
    from: 240,
    features: ["Arched river windows", "Oak floors", "Deep soaking tub", "Copper džezva and Bosnian coffee"],
    photo: photos.roomRiver,
    alt: "A River Room in warm timber, with a low king bed and doors open to greenery",
    gallery: [{ photo: photos.mostarDuskTown, alt: "Mostar's old town at dusk, minarets above the river" }],
  },
  {
    slug: "tower-suite",
    name: "Tower Suite",
    kicker: "Three suites",
    summary: "Two floors in the oldest part of the house: a lounge under bare beams, a glass rain shower and a view up the river.",
    body: [
      "The Tower Suites occupy the house's old stone tower, rebuilt by local masons over four years with the original stone wherever it could be saved.",
      "A lounge on the lower level opens to the river; the bedroom above has a glass rain shower and long views up the valley.",
    ],
    size: 48,
    sleeps: 3,
    bed: "King bed and day bed",
    view: "River and mountains",
    count: 3,
    from: 360,
    features: ["Two levels", "Separate lounge", "Glass rain shower", "Evening turndown with rakija"],
    photo: photos.roomTower,
    alt: "A Tower Suite with a low timber bed, stone walls and a glass-walled shower",
    gallery: [{ photo: photos.mostarTower, alt: "A stone tower and timber-framed house above the river" }],
  },
  {
    slug: "bridgekeepers-suite",
    name: "The Bridgekeeper's Suite",
    kicker: "One suite",
    summary: "Our only suite with a private terrace facing Stari Most. Watch the divers by day and the lit arch by night, from your own chair.",
    body: [
      "The suite takes the whole top floor on the river side. Its terrace looks straight at the Old Bridge, close enough to hear the divers' audience counting down.",
      "Inside, a freestanding stone bath sits by the window, and a private dinner can be served on the terrace any evening of your stay.",
    ],
    size: 62,
    sleeps: 2,
    bed: "King bed",
    view: "Stari Most",
    count: 1,
    from: 520,
    features: ["Private terrace facing the bridge", "Freestanding stone bath", "Private terrace dinner", "Daily hammam ritual for two"],
    photo: photos.mostarArch,
    alt: "Stari Most framed by its two stone towers above the emerald Neretva",
    gallery: [{ photo: photos.roomBath, alt: "A freestanding bath against a textured stone wall" }],
  },
];

export const amenities = [
  "Breakfast on the river terrace",
  "Hammam access for every guest",
  "Concierge who grew up in the old town",
  "Airport and station transfers",
  "Fast Wi-Fi in every room",
  "Toiletries made with Herzegovinian herbs",
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}
