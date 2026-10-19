// All copy and media for the page. Edit here, not in components.

export const brand = {
  name: "fonds",
  year: 2026,
  credit: "Concept by ScrolDev",
};

export const caption =
  "fonds makes headwear: caps, beanies and bucket hats in washed cotton and ribbed wool, finished with one embroidered word. Collection Nº 04 comes in five colourways, black, charcoal, ecru, olive and navy, each in a numbered run of 300.";

export const nav = {
  about: "About",
  bag: "[ Bag ]",
};

export const collection = {
  label: "Collection Nº 04",
  title: "Washed Black",
  price: "€65",
  cta: "view",
};

// Shown in the small circle above the collection label; swapped at random while scrolling.
export const symbols = ["4", "§", "&", "*", "/", "%"];

// Generated for fonds and hosted on our Higgsfield storage.
const media = "https://d2ol7oe51mr4n9.cloudfront.net/user_3DigAGHsL7XlpG98dcFNpat7g9G";

// The hero clips. Both start on the same front-facing frame; "left" turns the head
// towards the right of the screen, "right" towards the left. They are encoded with
// every frame as a keyframe (ffmpeg -g 1) so scrubbing can seek to any frame
// instantly. A clip with normal keyframe spacing will stutter when scrubbed.
export const videos = {
  left: `${media}/a92b5da4-46e8-406e-bf53-d92141ba50a9.mp4`,
  right: `${media}/a02f639b-bb43-4a9e-930c-dabf2d738808.mp4`,
};

// The gallery, in order: model shots alternating with product shots. 688×1024 WebP, 20–110 KB each.
export const looks = [
  ["0964bbb6-67d7-46e3-abdd-cbcd5574f8c1", "Ecru washed cap, worn"],
  ["461e3392-df21-45d6-ac41-b0862413eb05", "Charcoal washed cap"],
  ["50fb71c8-5e86-4978-8cd2-6779a30ac682", "Charcoal washed cap, worn"],
  ["00316a57-4420-4b35-a11c-4c166adaa0ac", "Embroidery detail on the black cap"],
  ["88815373-1c4f-42e8-b2cc-d624649b11db", "Olive cap, worn, in profile"],
  ["f3989f8e-6321-4390-864a-0435642bd555", "Olive, ecru and black caps, stacked"],
  ["a60fe148-4cff-4e98-80c9-cab9b76e1d57", "Black cap with a grey sweatshirt"],
  ["69a95f18-de0d-4964-9299-bdef4d4a9752", "Navy ribbed beanie"],
  ["bddf5f25-e75b-41a0-9317-79db205fc6cf", "Washed black bucket hat, worn"],
].map(([id, alt]) => ({ src: `${media}/${id}.webp`, alt }));
