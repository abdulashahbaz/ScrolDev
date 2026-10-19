# ScrolDev — website portfolio

The websites **ScrolDev** has designed and built, in one repository, plus a showcase hub that lists them all on one page you can send to prospects.

- Each portfolio site lives in its own folder under `sites/` and keeps whatever stack it was built with (Next.js, plain HTML, anything).
- Each site has a small `scroldev.json` file describing it (name, summary, live link, cover image).
- The hub reads those files and builds a static page. It has no dependencies, only Node 20 or newer.

```
scroldev/
├── sites/
│   └── <site-slug>/          one folder per portfolio site
│       ├── scroldev.json     how the site appears on the hub
│       ├── cover.jpg         screenshot shown on the hub card
│       └── …                 the site's own code
├── hub/
│   ├── config.json           agency name, headline, intro, contact email
│   ├── styles.css            hub design (brand colors are tokens at the top)
│   ├── build.mjs             validates sites/ and builds dist/
│   └── new-site.mjs          scaffolds a new site entry
└── vercel.json               deploys the hub
```

---

## Add a portfolio site

```bash
npm run new-site -- bella-cucina
```

This creates `sites/bella-cucina/scroldev.json` as a **draft** (hidden from the hub). Then:

1. Put the site's code in `sites/bella-cucina/`, unless it's already there.
2. Fill in `scroldev.json` (fields below).
3. Add a cover screenshot, ideally 1600×1000 (16:10), e.g. `sites/bella-cucina/cover.jpg`, and set `"cover": "cover.jpg"`.
4. Set `"draft": false`.
5. Run `npm run build` and open `dist/index.html` to check it.

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
| `draft` | no | `true` hides it from the hub and skips validation. |

The hub is sorted by featured first, then newest year, then name.

**Be honest with `type`.** Prospects will assume everything on the hub is real client work unless it says otherwise. Label demo and spec sites `"concept"`. It's still strong proof of skill, and it protects the agency's credibility.

---

## The hub

| Command | What it does |
| --- | --- |
| `npm run build` | Validates every `scroldev.json` and builds the hub into `dist/` |
| `npm run check` | Validates only; writes nothing |
| `npm run new-site -- <slug>` | Creates a draft entry for a new site |

The build fails with a clear message if any published entry is invalid (missing field, broken cover path, bad link), so a broken entry never reaches the live hub.

**Edit the copy** in `hub/config.json`. Set `contactEmail` to show a "Start a project" button in the header and the email in the footer; leave it `""` to hide both.

**Change the look** in `hub/styles.css`. Colors are tokens in `:root` (light) and the `prefers-color-scheme: dark` block. `--accent` is the brand color.

### Deploy the hub (Vercel)

1. In Vercel: **Add New → Project**, import this repository.
2. Leave **Root Directory** as the repo root. `vercel.json` already sets the build command and the `dist` output.
3. Deploy. Every push to `main` rebuilds the hub.

## Deploy each portfolio site

Each site is its own Vercel project pointing at the same repository:

1. **Add New → Project**, import this repository again.
2. Set **Root Directory** to `sites/<slug>`. Vercel detects the framework from that folder.
3. Deploy. Leave the Ignored Build Step setting alone: the site's own `vercel.json` already makes Vercel skip a rebuild when nothing in that folder changed since its last successful deploy. The first deploy always builds.
4. Once it's live, put the URL in that site's `scroldev.json` → `url`, and push so the hub picks it up.

To check a site locally before deploying it: `cd sites/<slug> && npm ci && npm run build && npm run start`, then open http://localhost:3000. Use `npm run dev` while editing.

New sites need the same `vercel.json`; copy it from `sites/halvo/`.

Never commit `.env` files or API keys for a site. Set them in that site's Vercel project instead. The root `.gitignore` blocks `.env*` files everywhere in the repo.
