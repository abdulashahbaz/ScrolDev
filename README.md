# ScrolDev — website and portfolio

**scroldev.com** and the websites ScrolDev has designed and built, in one repository.

- `hub/` is scroldev.com: the agency's own site (idea, what we build, agency, process, pricing, contact), built from the brand book.
- Each portfolio site lives in its own folder under `sites/` and keeps whatever stack it was built with (Next.js, plain HTML, anything).
- Each site has a small `scroldev.json` file describing it (name, summary, live link, cover image). scroldev.com doesn't show the portfolio right now; `npm run check` keeps the metadata valid so it's ready when a Work section comes back.
- The build has no dependencies, only Node 20 or newer.

```
scroldev/
├── sites/
│   └── <site-slug>/          one folder per portfolio site
│       ├── scroldev.json     name, summary, link and cover for the site
│       ├── cover.jpg         cover screenshot
│       └── …                 the site's own code
├── hub/                      scroldev.com
│   ├── config.json           site URL, contact email, description, social links
│   ├── template.html         the page: every section and all the copy
│   ├── 404.html              the not-found page
│   ├── assets/               copied to the site as-is
│   │   ├── styles.css        design (brand tokens at the top)
│   │   ├── main.js           motion and interaction
│   │   ├── fonts/            Geist and Geist Mono, self-hosted
│   │   ├── icons/            favicons and app icons from the logo kit
│   │   └── patterns/         brand pattern tiles
│   ├── build.mjs             validates sites/ and config, builds dist/
│   └── new-site.mjs          scaffolds a new site entry
└── vercel.json               deploys scroldev.com
```

---

## Add a portfolio site

```bash
npm run new-site -- bella-cucina
```

This creates `sites/bella-cucina/scroldev.json` as a **draft**. Then:

1. Put the site's code in `sites/bella-cucina/`, unless it's already there.
2. Fill in `scroldev.json` (fields below).
3. Add a cover screenshot, ideally 1600×1000 (16:10), e.g. `sites/bella-cucina/cover.jpg`, and set `"cover": "cover.jpg"`.
4. Set `"draft": false`.
5. Run `npm run check` to validate it.

Folder names must be lowercase words joined by hyphens. Folders starting with `_` or `.` are ignored, so `sites/_scratch/` is a safe place for experiments.

### `scroldev.json`

```json
{
  "name": "Bella Cucina",
  "client": "Bella Cucina Trattoria",
  "category": "Restaurant",
  "summary": "Menu, reservations and private-dining enquiries for a family trattoria.",
  "type": "client",
  "year": 2026,
  "url": "https://bellacucina.example",
  "cover": "cover.jpg",
  "stack": ["Next.js", "Tailwind CSS"],
  "featured": false,
  "draft": false
}
```

| Field | Required | What it does |
| --- | --- | --- |
| `name` | yes | Card title. |
| `category` | yes | Industry or kind of site, shown under the title. |
| `summary` | yes | One or two sentences on what the site does. |
| `type` | yes | `"client"` for paid client work, `"concept"` for a self-initiated design. Concept work gets a visible **Concept** badge. |
| `year` | yes | Year it launched, e.g. `2026`. |
| `client` | no | Client's name, shown next to the category. |
| `url` | no | Live link. The whole card becomes clickable. Leave `""` if the site isn't live. |
| `cover` | no | Image file inside the site's folder (`.jpg`, `.png`, `.webp`, `.avif`). Without one, the card shows the site name. |
| `stack` | no | Tools it was built with, shown as tags. |
| `featured` | no | `true` pins it to the top. |
| `draft` | no | `true` marks it unpublished and skips validation. |

**Be honest with `type`.** Prospects will assume any portfolio piece is real client work unless it says otherwise. Label demo and spec sites `"concept"`. It's still strong proof of skill, and it protects the agency's credibility.

---

## scroldev.com

| Command | What it does |
| --- | --- |
| `npm run build` | Validates `hub/config.json` and builds the site into `dist/` |
| `npm run check` | Validates the config and every `scroldev.json`; writes nothing |
| `npm run new-site -- <slug>` | Creates a draft entry for a new site |

Both fail with a clear message on a problem (missing contact email, bad link, missing field, broken cover path). Portfolio metadata never blocks a website deploy: only `npm run check` reads it.

### Preview locally

```bash
npm run build
npx http-server dist -p 4173
```

Open http://localhost:4173. Use a server rather than opening the file directly: the site loads its fonts, styles and script from `/`.

### Edit it

- **Contact email, site URL, description, social links:** `hub/config.json`. `contactEmail` is where the project brief form sends to and is shown in the footer. Social links with an empty `url` are hidden.
- **Copy and sections:** `hub/template.html`. Placeholders like `{{email}}` are filled in by the build; an unknown placeholder fails the build.
- **Design:** `hub/assets/styles.css`. Colors, type sizes, spacing and the easing curve are tokens in `:root`, straight from the brand book.
- **Motion:** `hub/assets/main.js`. Everything is scroll-linked through one frame loop and respects reduced motion (fades only, no scroll dive).

### How the page works

- **Hero:** the logo mark, drawn live on a canvas so it stays sharp at any size. It draws itself on load and its thumb scrolls down its track and back, like the logo animation. Scrolling pins the hero: the copy dissolves, the mark moves to the centre and grows, and the view dives into the thumb until the screen is Ember: a page in the style of the brand book's chapter openers, with the all-white mark drawing itself in beside "Every scroll earns the next."
- **Pill grid:** the brand's pill-grid tile is drawn live in one fixed layer behind every dark section (the Paper section uses the light tile). Pills near the cursor warm toward Ember, curve around it and cool slowly behind it, leaving a soft orange trail. On phones the trail follows the finger. The grid also answers the scroll: it drifts up at a fraction of the page's speed, so it reads as a layer behind, and its pills stretch with scroll speed like a long exposure, then settle.
- **Glass and light:** the header, cards, demos and the brief form are frosted glass over the pill grid, over Ember light that is the same strength all the way down: one soft pool per dark section, alternating sides, each fading out on its own so no section edge ever shows as a line. With a mouse, an Ember glint follows the pointer across each card's edge and surface, and buttons lean toward the pointer.
- **Headlines:** each section headline rises word by word through its line as it arrives, like the hero's. Screen readers get the headline whole.
- **Agency:** the Paper section is a rounded sheet laid over the Ink, growing to full width as it rises.
- **What we build:** on desktop the section pins and five panels slide past sideways; each has a small demo (scroll motion, layout, speed score, CMS edit, package timelines) that plays as it arrives. On phones the panels stack.
- **Contact:** a glass brief form over a pool of Ember light, which opens the visitor's email app with the brief filled in, addressed to `contactEmail`. No backend or third-party form service.
- **The end:** the page finishes on the Scroldev logo, full width. It draws itself in when it arrives; then its thumb follows the pointer up and down the track and the letters lift as the pointer passes over them.
- **Small things:** leave the tab and its title asks you to keep scrolling; open the browser console and there's a note from the studio. Links shared on social media show `og-image.png`, the mark glowing Ember over the pill grid.
- **Reduced motion:** with the system setting on, all of the above is still: no pinning, drifting, rising or leaning, only fades.

### Deploy (Vercel)

1. In Vercel: **Add New → Project**, import this repository.
2. Leave **Root Directory** empty (`./`, the repo root). Vercel may offer one of the apps in `sites/` instead; don't pick it, or Vercel builds that portfolio site rather than scroldev.com. `vercel.json` sets the framework (none: a static site), the build command and the `dist` output, whatever the dashboard says.
3. Deploy, then add `scroldev.com` under **Settings → Domains**. Every push to `main` rebuilds the site.

### Launch checklist

1. Merge this branch into `main` (Vercel deploys `main`).
2. In Vercel: **Add New → Project**, import the repository, leave **Root Directory** as the repo root, and deploy. `vercel.json` sets the build, the output folder, security headers and caching.
3. Under **Settings → Domains**, add `scroldev.com` and `www.scroldev.com` (redirect `www` to the bare domain), then point your DNS where Vercel tells you.
4. Open the live site and send yourself a test brief from the contact form; it should open your email app addressed to `contactEmail`.
5. Add your LinkedIn and Instagram links in `hub/config.json` when they're ready.
6. Optional: add the site to Google Search Console and submit `https://scroldev.com/sitemap.xml`.

Before launch the site was checked with Lighthouse (mobile: performance 96–99 depending on the run, accessibility 100, best practices 100, SEO 100; desktop: 100 across the board), html-validate, and a link and asset check of `dist/`.

## Deploy each portfolio site

Each site is its own Vercel project pointing at the same repository:

1. **Add New → Project**, import this repository again.
2. Set **Root Directory** to `sites/<slug>`. Vercel detects the framework from that folder.
3. Under **Settings → Git → Ignored Build Step**, use `git diff HEAD^ HEAD --quiet -- .` so the site only rebuilds when its own folder changes, not on every push to the repo.
4. Once it's live, put the URL in that site's `scroldev.json` → `url`.

Never commit `.env` files or API keys for a site. Set them in that site's Vercel project instead. The root `.gitignore` blocks `.env*` files everywhere in the repo.
