// Adds a portfolio site entry: creates sites/<slug>/scroldev.json as a draft.
// Usage: npm run new-site -- <slug>

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new-site -- <slug>   (lowercase words joined by hyphens, e.g. "bella-cucina")');
  process.exit(1);
}

const dir = path.join(root, "sites", slug);
const file = path.join(dir, "scroldev.json");
const name = slug
  .split("-")
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(" ");

const meta = {
  name,
  client: "",
  category: "",
  summary: "",
  type: "client",
  year: new Date().getFullYear(),
  url: "",
  cover: "",
  stack: [],
  featured: false,
  draft: true,
};

await mkdir(dir, { recursive: true });
try {
  await writeFile(file, JSON.stringify(meta, null, 2) + "\n", { flag: "wx" });
} catch (err) {
  if (err.code !== "EEXIST") throw err;
  console.error(`sites/${slug}/scroldev.json already exists.`);
  process.exit(1);
}

console.log(`Created sites/${slug}/scroldev.json (draft, hidden from the hub).

Next:
  1. Put the site's code in sites/${slug}/ if it isn't there yet.
  2. Fill in category, summary and type ("client" or "concept") in scroldev.json.
  3. Add a cover screenshot (e.g. sites/${slug}/cover.jpg) and set "cover": "cover.jpg".
  4. Set "draft": false, then run npm run build to see it on the hub.`);
