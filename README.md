# ScrolDev — website and portfolio

**scroldev.com** and the websites ScrolDev has designed and built, in one repository.

- `hub/` is scroldev.com: the agency's own site (idea, work, agency, process, pricing, contact), built from the brand book.
- Each portfolio site lives in its own folder under `sites/` and keeps whatever stack it was built with (Next.js, plain HTML, anything).
- Each site has a small `scroldev.json` file describing it (name, summary, live link, cover image). The **Work** section of scroldev.com is generated from these files, so a new site shows up there on the next build.
- The build has no dependencies, only Node 20 or newer.

```
scroldev/
├── sites/
│   └── <site-slug>/          one folder per portfolio site
│       ├── scroldev.json     how the site appears on scroldev.com
│       ├── cover.jpg         screenshot shown in the Work section
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

This creates `sites/bella-cucina/scroldev.json` as a **draft** (hidden from scroldev.com). Then:

1. Put the site's code in `sites/bella-cucina/`, unless it's already there.
2. Fill in `scroldev.json` (fields below).
3. Add a cover screenshot, ideally 1600×1000 (16:10), e.g. `sites/bella-cucina/cover.jpg`, and set `"cover": "cover.jpg"`.
4. Set `"draft": false`.
5. Run `npm run build` and preview `dist/` (see **Preview locally** below).

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
| `draft` | no | `true` hides it from scroldev.com and skips validation. |

The Work section is sorted by featured first, then newest year, then name. It always ends with an empty "Your site, next." frame that links to the contact form.

**Be honest with `type`.** Prospects will assume everything on the site is real client work unless it says otherwise. Label demo and spec sites `"concept"`. It's still strong proof of skill, and it protects the agency's credibility.

---

## scroldev.com

| Command | What it does |
| --- | --- |
| `npm run build` | Validates the config and every `scroldev.json`, then builds the site into `dist/` |
| `npm run check` | Validates only; writes nothing |
| `npm run new-site -- <slug>` | Creates a draft entry for a new site |

The build fails with a clear message if anything published is invalid (missing field, broken cover path, bad link, missing contact email), so a broken entry never reaches the live site.

### Preview locally

```bash
npm run build
npx http-server dist -p 4173
```

Open http://localhost:4173. Use a server rather than opening the file directly: the site loads its fonts, styles and script from `/`.

### Edit it

- **Contact email, site URL, description, social links:** `hub/config.json`. `contactEmail` is where the project brief form sends to and is shown in the footer. Social links with an empty `url` are hidden.
- **Copy and sections:** `hub/template.html`. Placeholders like `{{email}}` and `{{work}}` are filled in by the build; an unknown placeholder fails the build.
- **Design:** `hub/assets/styles.css`. Colors, type sizes, spacing and the easing curve are tokens in `:root`, straight from the brand book.
- **Motion:** `hub/assets/main.js`. Everything is scroll-linked through one frame loop and respects reduced motion (fades only, no intro, no loop).

### How the page works

- **Intro:** the logo draws on once per browser session, then dissolves. Click or press any key to skip.
- **Hero:** the pill grid reacts to the cursor; the arch's thumb scrolls down its track as you leave.
- **The Endless Thumb:** a pinned section that builds the mark one part at a time: track, thumb, fade.
- **Contact:** the brief form opens the visitor's email app with the brief filled in, addressed to `contactEmail`. No backend or third-party form service.
- **The loop:** on desktop a frozen copy of the hero sits after the footer. When it reaches the top of the screen the page jumps back to the real hero, so the scroll never ends. It is off on touch devices and with reduced motion.

### Deploy (Vercel)

1. In Vercel: **Add New → Project**, import this repository.
2. Leave **Root Directory** as the repo root. `vercel.json` already sets the build command and the `dist` output.
3. Deploy, then add `scroldev.com` under **Settings → Domains**. Every push to `main` rebuilds the site.

## Deploy each portfolio site

Each site is its own Vercel project pointing at the same repository:

1. **Add New → Project**, import this repository again.
2. Set **Root Directory** to `sites/<slug>`. Vercel detects the framework from that folder.
3. Under **Settings → Git → Ignored Build Step**, use `git diff HEAD^ HEAD --quiet -- .` so the site only rebuilds when its own folder changes, not on every push to the repo.
4. Once it's live, put the URL in that site's `scroldev.json` → `url`.

Never commit `.env` files or API keys for a site. Set them in that site's Vercel project instead. The root `.gitignore` blocks `.env*` files everywhere in the repo.
