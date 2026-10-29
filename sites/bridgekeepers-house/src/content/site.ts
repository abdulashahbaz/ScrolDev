export const site = {
  name: "The Bridgekeepers' House",
  short: "Bridgekeepers' House",
  title: "The Bridgekeepers' House — A hotel above the Neretva, Mostar",
  description:
    "Twenty-one rooms in a stone house above the Neretva in Mostar's old town, with a terrace facing Stari Most.",
  place: "Old Town · Mostar · Bosnia and Herzegovina",
  nav: [
    { href: "/rooms", label: "Rooms" },
    { href: "/dining", label: "Dining" },
    { href: "/experiences", label: "Experiences" },
    { href: "/story", label: "Our story" },
  ],
  credit: "A ScrolDev concept. The Bridgekeepers' House is not a real hotel and takes no bookings.",
} as const;

export const formatEuro = (n: number) => `€${n.toLocaleString("en-GB")}`;
