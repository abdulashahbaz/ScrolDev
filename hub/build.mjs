// Builds the showcase hub: reads sites/*/scroldev.json, validates it, and
// writes a static page to dist/. No dependencies; run with `npm run build`.
// `npm run check` validates the metadata without writing anything.

import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = path.join(root, "sites");
const distDir = path.join(root, "dist");
const checkOnly = process.argv.includes("--check");

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TYPES = ["client", "concept"];
const COVER_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

const config = JSON.parse(await readFile(path.join(root, "hub", "config.json"), "utf8"));
const { sites, errors, warnings } = await loadSites();

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} problem(s) in sites/. Fix them and run again.`);
  process.exit(1);
}

if (checkOnly) {
  console.log(`OK: ${sites.length} published site(s).`);
} else {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(path.join(distDir, "covers"), { recursive: true });
  for (const site of sites) {
    if (!site.coverSrc) continue;
    site.coverHref = `covers/${site.slug}${path.extname(site.coverSrc).toLowerCase()}`;
    await copyFile(site.coverSrc, path.join(distDir, site.coverHref));
  }
  await copyFile(path.join(root, "hub", "styles.css"), path.join(distDir, "styles.css"));
  await writeFile(path.join(distDir, "index.html"), renderPage(sites));
  console.log(`Built dist/ with ${sites.length} published site(s).`);
}

async function loadSites() {
  const sites = [];
  const errors = [];
  const warnings = [];
  const entries = await readdir(sitesDir, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const slug = entry.name;
    const dir = path.join(sitesDir, slug);
    const where = `sites/${slug}/scroldev.json`;

    let raw;
    try {
      raw = await readFile(path.join(dir, "scroldev.json"), "utf8");
    } catch {
      warnings.push(`sites/${slug}/ has no scroldev.json, so it is not on the hub. Run: npm run new-site -- ${slug}`);
      continue;
    }
    let meta;
    try {
      meta = JSON.parse(raw);
    } catch (err) {
      errors.push(`${where} is not valid JSON (${err.message})`);
      continue;
    }
    if (meta.draft === true) continue;

    const problems = [];
    if (!SLUG.test(slug)) problems.push(`folder name must be lowercase words joined by hyphens, e.g. "bella-cucina"`);
    for (const field of ["name", "category", "summary"]) {
      if (typeof meta[field] !== "string" || !meta[field].trim()) problems.push(`"${field}" is required`);
    }
    if (!Number.isInteger(meta.year) || meta.year < 2000 || meta.year > 2100) problems.push(`"year" must be a year like 2026`);
    if (!TYPES.includes(meta.type)) problems.push(`"type" must be "client" or "concept"`);
    if (meta.client !== undefined && typeof meta.client !== "string") problems.push(`"client" must be text`);
    if (meta.url && !/^https?:\/\/[^\s]+$/.test(meta.url)) problems.push(`"url" must be a full link starting with https://`);
    if (meta.stack !== undefined && !(Array.isArray(meta.stack) && meta.stack.every((s) => typeof s === "string"))) {
      problems.push(`"stack" must be a list of names, e.g. ["Next.js", "Tailwind CSS"]`);
    }
    if (meta.featured !== undefined && typeof meta.featured !== "boolean") problems.push(`"featured" must be true or false`);

    let coverSrc = null;
    if (meta.cover) {
      coverSrc = path.resolve(dir, meta.cover);
      if (!coverSrc.startsWith(dir + path.sep)) {
        problems.push(`"cover" must point to a file inside sites/${slug}/`);
      } else if (!COVER_EXTS.includes(path.extname(coverSrc).toLowerCase())) {
        problems.push(`"cover" must be one of ${COVER_EXTS.join(", ")}`);
      } else if (!(await stat(coverSrc).then((s) => s.isFile(), () => false))) {
        problems.push(`"cover" file ${meta.cover} does not exist`);
      }
    }

    if (problems.length) {
      errors.push(...problems.map((p) => `${where}: ${p}`));
      continue;
    }
    sites.push({ ...meta, slug, coverSrc, stack: meta.stack ?? [] });
  }

  sites.sort(
    (a, b) =>
      Number(b.featured === true) - Number(a.featured === true) ||
      b.year - a.year ||
      a.name.localeCompare(b.name),
  );
  return { sites, errors, warnings };
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCard(site) {
  const cover = site.coverHref
    ? `<img src="${esc(site.coverHref)}" alt="" loading="lazy" decoding="async">`
    : `<span class="card-placeholder" aria-hidden="true">${esc(site.name)}</span>`;
  const badge = site.type === "concept" ? `<span class="badge" title="Self-initiated design, not client work">Concept</span>` : "";
  const meta = [site.category, site.client, site.year].filter(Boolean).map(esc).join(" · ");
  const tags = site.stack.length
    ? `<ul class="tags" aria-label="Built with">${site.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
    : "";
  const title = site.url
    ? `<a class="card-link" href="${esc(site.url)}" target="_blank" rel="noopener">${esc(site.name)}<span class="arrow" aria-hidden="true">↗</span></a>`
    : esc(site.name);

  return `
      <li class="card">
        <div class="card-cover">${cover}${badge}</div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <p class="card-meta">${meta}</p>
          <p class="card-summary">${esc(site.summary)}</p>
          ${tags}
        </div>
      </li>`;
}

function renderPage(sites) {
  const name = esc(config.name);
  const email = config.contactEmail?.trim();
  const cta = email ? `<a class="button" href="mailto:${esc(email)}">${esc(config.ctaLabel || "Start a project")}</a>` : "";
  const count = sites.length === 1 ? "1 project" : `${sites.length} projects`;
  const work = sites.length
    ? `<ul class="grid">${sites.map(renderCard).join("")}
    </ul>`
    : `<div class="empty"><p>Our first projects are being polished. Check back soon.</p></div>`;
  const hasConcepts = sites.some((s) => s.type === "concept");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name} · ${esc(config.pageTitle || "Work")}</title>
  <meta name="description" content="${esc(config.intro)}">
  <meta property="og:title" content="${name} · ${esc(config.pageTitle || "Work")}">
  <meta property="og:description" content="${esc(config.intro)}">
  <meta property="og:type" content="website">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23111'/%3E%3Ctext x='16' y='22.5' font-family='Arial,sans-serif' font-size='18' font-weight='700' text-anchor='middle' fill='%23fff'%3ES%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="wrap header">
    <span class="logo"><span class="logo-mark" aria-hidden="true">S</span>${name}</span>
    ${cta}
  </header>

  <main class="wrap">
    <section class="hero">
      <p class="eyebrow">${esc(config.tagline)}</p>
      <h1>${esc(config.headline)}</h1>
      <p class="intro">${esc(config.intro)}</p>
    </section>

    <section aria-labelledby="work-heading">
      <div class="section-head">
        <h2 id="work-heading">Selected work</h2>
        ${sites.length ? `<p class="count">${count}</p>` : ""}
      </div>
      ${work}
      ${hasConcepts ? `<p class="note"><span class="badge badge-inline">Concept</span> marks a self-initiated design, not client work.</p>` : ""}
    </section>
  </main>

  <footer class="wrap">
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${name}</p>
      ${email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : ""}
    </div>
  </footer>
</body>
</html>
`;
}
