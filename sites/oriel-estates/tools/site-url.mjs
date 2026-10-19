// Run once you know the live address:
//   npm run set-url -- https://oriel.example.com
// Adds canonical + og:url tags, makes og:image absolute, and writes
// sitemap.xml and the Sitemap line in robots.txt. Safe to run again.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = process.argv[2];
if (!arg || !/^https?:\/\/[^\s]+$/.test(arg)) {
  console.error("Usage: npm run set-url -- https://your-domain.com");
  process.exit(1);
}
const base = arg.replace(/\/+$/, "");

const pages = readdirSync(SITE).filter((f) => f.endsWith(".html") && f !== "404.html");
for (const file of pages) {
  const url = file === "index.html" ? `${base}/` : `${base}/${file}`;
  let html = readFileSync(path.join(SITE, file), "utf8");
  html = html
    .replace(/\s*<link rel="canonical"[^>]*>/g, "")
    .replace(/\s*<meta property="og:url"[^>]*>/g, "")
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${base}/assets/img/og.jpg">`)
    .replace(/(\s*)<meta property="og:type"/, `$1<link rel="canonical" href="${url}">$1<meta property="og:url" content="${url}">$1<meta property="og:type"`);
  writeFileSync(path.join(SITE, file), html);
}

// data.js is plain script; pull the ids out without executing it
const data = readFileSync(path.join(SITE, "assets/js/data.js"), "utf8");
const residenceIds = [...data.matchAll(/^\s{4}id: "([\w-]+)",\n\s{4}name:/gm)].map((m) => m[1]);
const postIds = [...data.matchAll(/^\s{4}id: "([\w-]+)",\n\s{4}title:/gm)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...pages.map((f) => (f === "index.html" ? `${base}/` : `${base}/${f}`)).filter((u) => !/\/(residence|journal)\.html$/.test(u)),
  ...residenceIds.map((id) => `${base}/residence.html?id=${id}`),
  ...postIds.map((id) => `${base}/journal.html?id=${id}`),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.replace(/&/g, "&amp;")}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync(path.join(SITE, "sitemap.xml"), xml);
writeFileSync(path.join(SITE, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

console.log(`Set ${base} on ${pages.length} pages; sitemap.xml lists ${urls.length} URLs.`);
