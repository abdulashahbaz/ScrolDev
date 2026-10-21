// Builds scroldev.com: renders hub/template.html with the work from sites/*/scroldev.json, copies
// hub/assets/, and writes the static site to dist/. No dependencies; run with `npm run build`.
// `npm run check` validates the config and the site metadata without writing anything.

import { createHash } from "node:crypto";
import { copyFile, cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hubDir = path.join(root, "hub");
const sitesDir = path.join(root, "sites");
const distDir = path.join(root, "dist");
const checkOnly = process.argv.includes("--check");

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TYPES = ["client", "concept"];
const COVER_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINK = /^https:\/\/[^\s]+$/;

const config = JSON.parse(await readFile(path.join(hubDir, "config.json"), "utf8"));
const configErrors = checkConfig(config);
const { sites, errors, warnings } = await loadSites();
errors.unshift(...configErrors);

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} problem(s). Fix them and run again.`);
  process.exit(1);
}

if (checkOnly) {
  console.log(`OK: config is valid, ${sites.length} published site(s).`);
} else {
  await rm(distDir, { recursive: true, force: true });
  await cp(path.join(hubDir, "assets"), distDir, { recursive: true });
  await mkdir(path.join(distDir, "covers"), { recursive: true });
  for (const site of sites) {
    if (!site.coverSrc) continue;
    site.coverHref = `covers/${site.slug}${path.extname(site.coverSrc).toLowerCase()}`;
    await copyFile(site.coverSrc, path.join(distDir, site.coverHref));
  }

  const tokens = await pageTokens(sites);
  const template = await readFile(path.join(hubDir, "template.html"), "utf8");
  await writeFile(path.join(distDir, "index.html"), fill(template, tokens, "hub/template.html"));
  const notFound = await readFile(path.join(hubDir, "404.html"), "utf8");
  await writeFile(path.join(distDir, "404.html"), fill(notFound, tokens, "hub/404.html"));
  await writeFile(path.join(distDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${tokens.siteUrl}/sitemap.xml\n`);
  await writeFile(
    path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${tokens.siteUrl}/</loc></url>\n</urlset>\n`,
  );
  await writeFile(path.join(distDir, "site.webmanifest"), JSON.stringify(manifest(), null, 2) + "\n");
  console.log(`Built dist/ with ${sites.length} published site(s).`);
}

function checkConfig(c) {
  const problems = [];
  if (typeof c.siteUrl !== "string" || !LINK.test(c.siteUrl)) problems.push(`"siteUrl" must be a full link starting with https://`);
  if (typeof c.contactEmail !== "string" || !EMAIL.test(c.contactEmail.trim())) {
    problems.push(`"contactEmail" must be the inbox that receives project briefs, e.g. "teamscroldev@gmail.com"`);
  }
  if (typeof c.description !== "string" || !c.description.trim()) problems.push(`"description" is required (used for search results and link previews)`);
  if (c.social !== undefined) {
    if (!Array.isArray(c.social)) problems.push(`"social" must be a list of { "label", "url" }`);
    else {
      for (const s of c.social) {
        if (typeof s?.label !== "string" || !s.label.trim()) problems.push(`every "social" entry needs a "label"`);
        if (s?.url && !LINK.test(s.url)) problems.push(`social link "${s.label}" must start with https://`);
      }
    }
  }
  return problems.map((p) => `hub/config.json: ${p}`);
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
      warnings.push(`sites/${slug}/ has no scroldev.json, so it is not on the site. Run: npm run new-site -- ${slug}`);
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

// Replaces {{token}} placeholders. An unknown token fails the build, so a typo never ships as literal braces.
function fill(template, tokens, file) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in tokens)) {
      console.error(`error: ${file} uses {{${key}}}, which build.mjs doesn't provide.`);
      process.exit(1);
    }
    return tokens[key];
  });
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function arrow(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function renderProject(site, i) {
  const meta = [site.client, site.category].filter(Boolean).map((s) => `<span>${esc(s)}</span>`).join("");
  const concept =
    site.type === "concept"
      ? `<span class="tag" title="Self-initiated design, not client work"><span class="pip pip--muted" aria-hidden="true"></span>Concept</span>`
      : "";
  const cover = site.coverHref
    ? `<img src="${esc(site.coverHref)}" alt="${esc(site.name)} home page" loading="lazy" decoding="async">`
    : `<span class="frame-empty">${esc(site.name)}</span>`;
  const stack = site.stack.length
    ? `<ul class="stack" aria-label="Built with">${site.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
    : "";
  const link = site.url
    ? `<a class="btn btn--secondary btn--sm project-link" href="${esc(site.url)}" target="_blank" rel="noopener"><span class="btn-label"><span>Visit the site</span></span>${arrow("arrow-up-right")}<span class="visually-hidden">(${esc(site.name)}, opens in a new tab)</span></a>`
    : "";

  return `
          <article class="project" data-reveal>
            <div class="project-head">
              <p class="label project-index">${pad(i + 1)}</p>
              <h3 class="project-name">${esc(site.name)}</h3>
              <p class="label project-meta">${meta}<span>${site.year}</span>${concept}</p>
            </div>
            <div class="frame">${cover}</div>
            <div class="project-body">
              <p class="project-summary">${esc(site.summary)}</p>
              <div class="project-side">${stack}${link}</div>
            </div>
          </article>`;
}

function renderNext(i) {
  return `
          <a class="project project--next" href="#contact" data-reveal>
            <div class="project-head">
              <p class="label project-index">${pad(i + 1)}</p>
              <h3 class="project-name">Your site, next.</h3>
              <p class="label project-meta"><span>Start a project</span>${arrow("arrow-up-right")}</p>
            </div>
            <div class="frame"><svg class="frame-cross icon" aria-hidden="true"><use href="#i-plus"/></svg></div>
          </a>`;
}

async function pageTokens(sites) {
  const siteUrl = config.siteUrl.replace(/\/+$/, "");
  const email = config.contactEmail.trim();
  const social = (config.social ?? []).filter((s) => s.url);

  const work = sites.length
    ? sites.map(renderProject).join("") + renderNext(sites.length)
    : `
          <div class="empty-work"><p>Our first projects are being polished. Check back soon.</p></div>` + renderNext(0);
  const conceptNote = sites.some((s) => s.type === "concept")
    ? `<p class="concept-note"><span class="label tag"><span class="pip pip--muted" aria-hidden="true"></span>Concept</span>marks a self-initiated design, not client work.</p>`
    : "";

  // Cache-busting: the version changes whenever the stylesheet or script does.
  const hash = createHash("sha256");
  for (const f of ["styles.css", "main.js"]) hash.update(await readFile(path.join(hubDir, "assets", f)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name || "Scroldev",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/icons/android-chrome-512.png`,
    email,
    slogan: "Websites you’d scroll for eternity.",
    description: config.description,
    ...(social.length ? { sameAs: social.map((s) => s.url) } : {}),
  };

  return {
    siteUrl: esc(siteUrl),
    description: esc(config.description),
    email: esc(email),
    version: hash.digest("hex").slice(0, 10),
    jsonLd: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
    work,
    workCount: sites.length === 1 ? "01 project" : `${pad(sites.length)} projects`,
    conceptNote,
    social: social.length
      ? `<div>
          <p class="label">Elsewhere</p>
          <ul>${social.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
        </div>`
      : "",
    yes: `<span class="yes"><span class="visually-hidden">Included</span></span>`,
    no: `<span class="no" aria-hidden="true">—</span><span class="visually-hidden">Not included</span>`,
    year: String(new Date().getFullYear()),
  };
}

function manifest() {
  return {
    name: "Scroldev",
    short_name: "Scroldev",
    description: config.description,
    start_url: "/",
    display: "browser",
    background_color: "#0D0C0B",
    theme_color: "#0D0C0B",
    icons: [
      { src: "/icons/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
      { src: "/icons/android-chrome-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
