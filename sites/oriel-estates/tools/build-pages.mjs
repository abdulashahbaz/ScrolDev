// Builds the inner pages from index.html's shared header, menu and footer plus
// one body fragment per page in src/pages/. Run after editing either:
//   npm run pages        (inside sites/oriel-estates)
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HERE = path.join(SITE, "src", "pages");
const index = readFileSync(path.join(SITE, "index.html"), "utf8");
const cut = (a, b) => index.slice(index.indexOf(a), index.indexOf(b) + b.length);
const chrome = cut("<!-- chrome:start -->", "<!-- chrome:end -->");
const footer = cut("<!-- footer:start -->", "<!-- footer:end -->");
const headStart = index.slice(0, index.indexOf("<title>"));
const headTail = index.slice(index.indexOf('  <link rel="stylesheet" href="assets/css/fonts.css">'), index.indexOf("</head>"))
  .replace(/  <link rel="preload" as="image"[^\n]*\n/g, "");
if (!headTail.includes("main.css")) throw new Error("head anchor not found in index.html");
const scriptsEnd = index.indexOf('  <script src="assets/js/home.js"');
if (scriptsEnd < 0) throw new Error("home.js script tag not found in index.html");
const scripts = index.slice(index.indexOf('  <script src="assets/js/vendor/gsap.min.js"'), scriptsEnd);

const pages = [
  { file: "residences.html", page: "residences", title: "The Collection — Oriel", desc: "Seven singular residences across four continents, offered privately by Oriel.", js: "residences.js" },
  { file: "residence.html", page: "residence", title: "Residence — Oriel", desc: "A singular residence, offered privately by Oriel.", js: "residence.js" },
  { file: "studio.html", page: "studio", title: "Studio — Oriel", desc: "A quieter kind of agency: how Oriel chooses, places and cares for singular homes.", js: "studio.js" },
  { file: "contact.html", page: "contact", title: "Private enquiries — Oriel", desc: "Speak with an Oriel partner in Mallorca, New York, Dubai or Kyoto.", js: "contact.js" },
  { file: "journal.html", page: "journal", title: "Journal — Oriel", desc: "Notes on light, stone and patience from the Oriel journal.", js: "journal.js" },
  { file: "404.html", page: "lost", title: "Address not found — Oriel", desc: "This address does not exist.", js: "page.js", nofooter: true },
];

for (const p of pages) {
  const main = readFileSync(path.join(HERE, p.page + ".html"), "utf8");
  const base = p.page === "lost" ? '<base href="/">\n  ' : "";
  const html = `${headStart}${base}<title>${p.title}</title>
  <meta name="description" content="${p.desc}">
  <meta name="theme-color" content="#0d0c0b">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.desc}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/img/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
${headTail}</head>
<body data-page="${p.page}">
  <a class="skip" href="#main">Skip to content</a>

  ${chrome}

  <main id="main">
${main.trimEnd()}
  </main>

  ${p.nofooter ? "" : footer}

  <div class="grain" aria-hidden="true"></div>

${scripts}  <script src="assets/js/${p.js}" defer></script>
</body>
</html>
`;
  writeFileSync(path.join(SITE, p.file), html);
  console.log("wrote", p.file);
}
