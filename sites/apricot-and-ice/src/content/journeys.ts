import type { Season } from "@/lib/palette";

export type Journey = {
  slug: string;
  name: string;
  summary: string;
  days: number;
  level: "Easy" | "Moderate";
  levelNote: string;
  window: string;
  priceFrom: number;
  scene: { time: number; season: Season };
  route: string[];
  itinerary: { title: string; body: string }[];
  departures: string[];
  included: string[];
};

const included = [
  "Every night's stay, in family-run guesthouses",
  "All meals from dinner on day 1 to breakfast on the last day",
  "A guide from Hunza or Gojal for the whole journey",
  "A private vehicle and driver on every road day",
  "Entry fees for forts and museums",
];

export const journeys: Journey[] = [
  {
    slug: "hunza-classic",
    name: "The Hunza Classic",
    summary: "Forts, orchards and Attabad Lake at an unhurried pace: the valley's essentials, with two nights at every stop.",
    days: 8,
    level: "Easy",
    levelNote: "Short walks on village lanes and paths.",
    window: "April – October",
    priceFrom: 1980,
    scene: { time: 0.35, season: "summer" },
    route: ["Gilgit", "Rakaposhi View", "Karimabad", "Attabad Lake", "Passu", "Gilgit"],
    itinerary: [
      { title: "Arrive in Gilgit", body: "Fly in from Islamabad, weather permitting, and settle in by the river. An easy evening walk through the bazaar." },
      { title: "Up the Karakoram Highway", body: "Lunch at Ghulmet with Rakaposhi filling the sky, then climb to Karimabad in time for the evening light." },
      { title: "Baltit and Altit", body: "A morning inside Baltit Fort, then an afternoon in Altit's lanes, water channels and orchards." },
      { title: "Eagle's Nest at first light", body: "Up before dawn to watch the snow turn pink on Rakaposhi and Ladyfinger. The afternoon is yours." },
      { title: "Across Attabad to Passu", body: "Out on Attabad's turquoise water by boat, then on to Passu beneath the Cones." },
      { title: "Hussaini and Borith Lake", body: "Cross the Hussaini suspension bridge if you dare, then walk up to the quiet of Borith Lake." },
      { title: "Down the valley", body: "Back to Gilgit, stopping wherever the light is good." },
      { title: "Depart", body: "Fly to Islamabad. Flights are weather-dependent, so we always book a flexible onward ticket." },
    ],
    departures: ["10 April 2027", "8 May 2027", "12 June 2027", "11 September 2027", "9 October 2027"],
    included,
  },
  {
    slug: "apricot-blossom",
    name: "Apricot Blossom",
    summary: "Orchards in flower beneath peaks still deep in snow: the valley's shortest and most photographed season.",
    days: 9,
    level: "Easy",
    levelNote: "Gentle orchard walks, cool mornings.",
    window: "Late March – mid April",
    priceFrom: 2240,
    scene: { time: 0.22, season: "spring" },
    route: ["Gilgit", "Karimabad", "Altit", "Gulmit", "Passu", "Gilgit"],
    itinerary: [
      { title: "Arrive in Gilgit", body: "Fly in from Islamabad and meet your guide. Dinner and an early night." },
      { title: "Into Hunza", body: "Drive up the Karakoram Highway as the orchards begin to show white and pink." },
      { title: "Altit in flower", body: "A slow day through Altit's orchards and lanes, with the fort above and the river below." },
      { title: "Eagle's Nest sunrise", body: "First light over a valley in blossom, then tea and the rest of the day at your own pace." },
      { title: "Baltit Fort", body: "A morning inside the fort, an afternoon in Karimabad's craft workshops." },
      { title: "Attabad and Gulmit", body: "Across the lake to Gulmit, where the orchards bloom a little later." },
      { title: "Passu and Hussaini", body: "The Cones from Passu, the bridge at Hussaini and a picnic among the trees." },
      { title: "Back to Gilgit", body: "Down the valley with time for the photographs you missed." },
      { title: "Depart", body: "Fly to Islamabad, or stay on: we can extend any journey." },
    ],
    departures: ["27 March 2027", "3 April 2027"],
    included,
  },
  {
    slug: "passu-glaciers",
    name: "Passu & the Glaciers",
    summary: "Walk to the edge of the Passu and Batura glaciers and spend a night at Patundas, a high meadow facing the Cones.",
    days: 10,
    level: "Moderate",
    levelNote: "Four to six hours' walking on trekking days; one night camping.",
    window: "June – September",
    priceFrom: 2690,
    scene: { time: 0.55, season: "summer" },
    route: ["Gilgit", "Karimabad", "Passu", "Patundas", "Passu", "Gilgit"],
    itinerary: [
      { title: "Arrive in Gilgit", body: "Fly in from Islamabad. Kit check and briefing with your trekking guide." },
      { title: "To Karimabad", body: "Up the Karakoram Highway to Karimabad to start acclimatising." },
      { title: "Acclimatisation walk", body: "A morning along Altit's water channels with views over the whole valley." },
      { title: "Across Attabad to Passu", body: "By boat and road to Passu, our base for the next five nights." },
      { title: "Passu Glacier", body: "Walk to the glacier's edge and back, with Borith Lake on the way." },
      { title: "Up to Patundas", body: "A steady climb to the Patundas meadow, where we camp facing the Cones and the Passu Glacier." },
      { title: "Back down to Passu", body: "Sunrise from the meadow, then down to a hot shower and a slow lunch." },
      { title: "Batura and Hussaini", body: "The Batura Glacier viewpoint in the morning, the Hussaini bridge in the afternoon." },
      { title: "Down the valley", body: "Back to Gilgit, with a last look at Rakaposhi on the way." },
      { title: "Depart", body: "Fly to Islamabad." },
    ],
    departures: ["19 June 2027", "17 July 2027", "21 August 2027", "11 September 2027"],
    included: [...included.slice(0, 4), "Tents, mattresses and a camp cook at Patundas"],
  },
  {
    slug: "top-of-the-road",
    name: "To the Top of the Road",
    summary: "Follow the Karakoram Highway to Khunjerab Pass, at 4,693 metres on the border with China, with the valley's best stops on the way.",
    days: 7,
    level: "Easy",
    levelNote: "Mostly road days; Khunjerab is high, so we climb slowly.",
    window: "May – October",
    priceFrom: 2150,
    scene: { time: 0.66, season: "autumn" },
    route: ["Gilgit", "Karimabad", "Passu", "Khunjerab Pass", "Passu", "Gilgit"],
    itinerary: [
      { title: "Arrive in Gilgit", body: "Fly in from Islamabad and settle in." },
      { title: "To Karimabad", body: "Up the highway with a long lunch beneath Rakaposhi." },
      { title: "The forts", body: "Baltit in the morning, Altit in the afternoon, Eagle's Nest for sunset." },
      { title: "Attabad and Passu", body: "Across the lake and up to Passu, sleeping a little higher each night." },
      { title: "Khunjerab Pass", body: "Up through Sost and the national park to the border at 4,693 metres, then back down to Passu." },
      { title: "Down the valley", body: "Back to Gilgit, stopping for anything we missed on the way up." },
      { title: "Depart", body: "Fly to Islamabad." },
    ],
    departures: ["15 May 2027", "14 August 2027", "16 October 2027"],
    included,
  },
];

export function getJourney(slug: string): Journey | undefined {
  return journeys.find((j) => j.slug === slug);
}

export const formatPrice = (usd: number) => `$${usd.toLocaleString("en-US")}`;
