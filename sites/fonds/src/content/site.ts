// All copy and media for the page. Edit here, not in components.

export const brand = {
  name: "fonds",
  year: 2026,
  credit: "Concept by ScrolDev",
};

export const caption =
  "fonds is an archive label. Each season we go back to our own rail of samples, one-offs and pieces that never left the studio, and reissue one body of work in a numbered run of 300. Nº 04 is seven pieces of headwear under one name: Low Light.";

export const nav = {
  about: "About",
  bag: "[ Bag ]",
};

export const collection = {
  label: "Archive Nº 04",
  title: "Low Light",
  price: "€240",
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

// The pieces of Nº 04, in gallery order: 1024px WebP, about 50 KB each.
export const looks = [
  "3a988b44-c675-44f8-a280-9a837bf94c33", // washed green cap
  "4bd399a8-7bf4-488f-909f-e26029b24e30", // black cap, profile
  "7fed7412-93f5-46ca-9c41-6eab50f261b3", // ribbed beanie, profile
  "a7c93e5d-9362-4578-9a06-0c0231c582d7", // washed bucket hat
  "4e7e1a25-dc66-40ff-bf53-fd18652b0618", // ribbed beanie
  "93cb8b46-b0e3-4bc2-943f-b8ea4eb74705", // bleached denim cap
  "d059b207-a84c-47f8-90cc-a679ec817b57", // full length
].map((id, i) => ({ src: `${media}/${id}.webp`, alt: `${collection.label}, piece ${i + 1}` }));
