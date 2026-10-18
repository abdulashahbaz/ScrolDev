// All copy and media for the page. Edit here, not in components.

export const brand = {
  name: "fonds",
  year: 2026,
  credit: "Concept by ScrolDev",
};

export const caption =
  "fonds is an archive label. Each season we go back to our own rail of samples, one-offs and pieces that never left the studio, and reissue one body of work in a numbered run of 300. Nº 04 gathers ten looks under one name: Low Light.";

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

// Desktop scrubs these with the cursor; touch devices play them back to back.
export const videos = {
  left: "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4",
  right:
    "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4",
};

const look = (file: string) =>
  `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(
    `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/${file}`,
  )}&w=1920&q=85`;

// The ten looks of Nº 04, in gallery order.
export const looks = [
  "hf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png",
  "hf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png",
  "hf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png",
  "hf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png",
  "hf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png",
  "hf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png",
  "hf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png",
  "hf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png",
  "hf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png",
  "hf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png",
].map((file, i) => ({ src: look(file), alt: `${collection.label}, look ${i + 1}` }));
