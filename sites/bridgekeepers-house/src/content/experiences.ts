import type { StaticImageData } from "next/image";
import { photos } from "@/content/photos";

export type Experience = {
  slug: string;
  name: string;
  kicker: string;
  body: string;
  distance: string;
  photo?: StaticImageData;
  alt?: string;
  icon?: "icon1" | "icon2" | "icon3";
};

export const experiences: Experience[] = [
  {
    slug: "divers",
    name: "The bridge divers",
    kicker: "In the old town, summer evenings",
    body: "Divers have leapt from Stari Most into the Neretva for centuries. On summer days the local divers jump for the crowd on the bridge; our concierge can introduce you to one of them over coffee.",
    distance: "4 minutes' walk",
    photo: photos.mostarDuskArch,
    alt: "Stari Most at dusk between its two stone towers",
  },
  {
    slug: "kujundziluk",
    name: "Kujundžiluk and the old bazaar",
    kicker: "Copper, coffee and cobbles",
    body: "The old bazaar street runs up to the bridge between copper workshops, carpet sellers and cafés. Go early, before the day trips arrive, and watch the coppersmiths start work.",
    distance: "6 minutes' walk",
    photo: photos.mostarTown,
    alt: "The old town of Mostar with its mosque and minarets above the Neretva",
  },
  {
    slug: "koski-mehmed-pasha",
    name: "Koski Mehmed Pasha Mosque",
    kicker: "The classic view",
    body: "Climb the narrow stairs of the minaret for the view that is on every postcard: the Old Bridge, the river and the rooftops of both banks.",
    distance: "8 minutes' walk",
    photo: photos.mostarDuskTown,
    alt: "Minarets and old houses above the river at dusk",
  },
  {
    slug: "blagaj",
    name: "Blagaj Tekke",
    kicker: "Day trip · south-east",
    body: "A sixteenth-century dervish house tucked under a cliff at the spring of the Buna, where the river runs out of the rock. Lunch on river trout at the water's edge.",
    distance: "About 12 km",
    icon: "icon1",
  },
  {
    slug: "kravice",
    name: "Kravica Waterfalls",
    kicker: "Day trip · south-west",
    body: "A wide curtain of waterfalls dropping into turquoise pools. Swim in summer; in spring, come for the force of the water after the snowmelt.",
    distance: "About 40 km",
    icon: "icon3",
  },
  {
    slug: "pocitelj",
    name: "Počitelj",
    kicker: "Day trip · south",
    body: "A walled hillside village of stone houses, a mosque and a fortress tower above the Neretva. Climb to the top for a view down the whole valley.",
    distance: "About 30 km",
    icon: "icon2",
  },
  {
    slug: "wine",
    name: "Herzegovina wine",
    kicker: "Afternoon, with a winemaker",
    body: "Herzegovina's sun and stone make two native grapes worth the trip: Žilavka, a white with real backbone, and Blatina, a soft red. We'll take you to a family cellar to taste both.",
    distance: "About 20 minutes' drive",
    photo: photos.diningWine,
    alt: "A glass of red wine on a terrace overlooking a vineyard",
  },
];
