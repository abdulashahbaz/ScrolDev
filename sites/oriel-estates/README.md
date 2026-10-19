# Oriel — luxury real estate concept

A concept website for **Oriel**, a fictional private estate agency that represents seven singular homes. Built by ScrolDev as a portfolio piece. Every residence, price, architect and person on the site is invented, and the footer says so.

## What's in it

| Page | Highlights |
| --- | --- |
| `index.html` | Counting preloader whose last frame expands to full screen and hands over to the hero without a cut · scroll-driven film hero (Casa Solenne at blue hour): the camera moves in as you scroll and holds when you stop, with the headline in front · pinned collection strip that expands one residence at a time · sticky spotlight whose film of The Monolith is scrubbed by the first chapter, then chaptered image wipes · hover lists with a cursor-following image · scroll-scaled quote · live clocks · journal |
| `residences.html` | Filter by setting, sort by price/date, grid ⇄ list views, all animated with GSAP Flip · editorial asymmetric grid · cursor-follow preview in list view |
| `residence.html?id=…` | One template for all seven homes: split-letter hero, facts bar, story, editorial gallery mosaic with a full-screen viewer (opens out of the tile, thumbnails, swipe, click-to-zoom, arrow keys), floor plans that draw themselves (per level, hover-linked to the room list), generated topographic map, live finance calculator, viewing request with date picker, "next residence" footer |
| `studio.html` | Principles, draggable timeline, partners |
| `contact.html` | Intent and setting chips, budget slider, validated form, office clocks |
| `journal.html?id=…` | Three essays |
| `404.html` | Lost-address page |

A **shortlist** works on every page: save residences from the collection or a residence page, review them in a slide-out drawer, and send one enquiry that arrives pre-filled on the contact form (stored in `localStorage`).

Shared across pages: Lenis smooth scrolling synced to ScrollTrigger, curtain page transitions, custom cursor with contextual labels, magnetic buttons, masked line reveals (SplitText), header that hides on scroll and switches colour per section, velocity skew on imagery, film grain, and a full-screen menu with image previews.

## Imagery

All photographs and both films are AI-generated for this concept with [Higgsfield](https://higgsfield.ai): stills with Seedream 4.5, each residence's interiors and details generated against its own exterior so the house stays consistent, and the two films animated from those stills with Kling. None of these places exist. Stills ship as WebP at 800/1400/2200 px with `srcset`. The films ship as WebP frame sequences (`assets/frames/`) drawn to a canvas, one frame per scroll position, so they only move when the reader scrolls; frames load coarse to fine, the hero has a portrait cut for phones, and the Monolith clip was stabilised. With reduced motion or data saver the first frame stays as a still.

## Stack

Plain HTML, CSS and JavaScript. No build step, no runtime dependencies.

- [GSAP](https://gsap.com) 3.15 with ScrollTrigger, SplitText, Flip and CustomEase (GSAP standard no-charge licence), vendored in `assets/js/vendor/`
- [Lenis](https://github.com/darkroomengineering/lenis) 1.3 (MIT), vendored
- Fonts bundled in `assets/fonts/`: Archivo (expanded), Inter Tight, Instrument Serif (SIL Open Font License)

## Open it

From a terminal (Windows cmd, PowerShell, macOS or Linux):

```bash
npm run dev                        # inside sites/oriel-estates: starts a local server and opens your browser
npm run oriel                      # same, from the repo root
node sites/oriel-estates/serve.mjs # same thing; add a port number or --no-open if you like
```

On Windows you can also double-click `start.cmd` (or run it in cmd). It uses the local server when Node.js is installed and otherwise opens `index.html` directly. The site also works opened straight from disk (`start index.html`).

## Deploy

Static files, no build step, no external requests (fonts are bundled).

- **Vercel (dashboard):** new project from this repo, **Root Directory** `sites/oriel-estates`, framework preset **Other**. `vercel.json` adds caching and security headers; `.vercelignore` keeps the launcher, sources and notes out of the deploy.
- **Vercel (command line):** `npx vercel sites/oriel-estates --prod`
- **Anywhere else** (Netlify, Cloudflare Pages, GitHub Pages, any web server): upload the folder as is. `404.html` is used for unknown addresses.

### Before launch

1. Deploy, note the address.
2. `npm run set-url -- https://your-domain.com` (inside `sites/oriel-estates`). This adds canonical and `og:url` tags, makes the share image absolute, and writes `sitemap.xml` and the Sitemap line in `robots.txt`. Commit and redeploy.
3. Put the address in `scroldev.json` → `"url"` so the hub card links to it.

## Editing

| Command (inside `sites/oriel-estates`) | What it does |
| --- | --- |
| `npm run dev` | Local server, opens the browser |
| `npm run pages` | Rebuilds the inner pages from `index.html`'s header, menu and footer plus the bodies in `src/pages/`. Run it after changing either, then rerun `set-url` if you have set one. |
| `npm run set-url -- <url>` | See "Before launch" |

Residences, floor plans and journal posts live in `assets/js/data.js`. Gallery tiles pair themselves: mark portrait images with `p: true`.

## Accessibility and fallbacks

- `prefers-reduced-motion` turns off smooth scrolling, the preloader, page transitions and scroll-driven motion; content is shown immediately.
- Keyboard: skip link, focus styles, Escape closes the menu, shortlist and gallery viewer; arrow keys page through the viewer, which traps focus while open.
- Lighthouse: Accessibility, Best Practices and SEO score 100 on the home, collection, residence and contact pages (local audit).
- The custom cursor, magnetic buttons and hover previews only run on fine pointers.
- The films' first frames are ordinary images, so if the frames can't load the still is already on screen.
- Forms validate and show a success state, but are **not connected** to anything; the page says so.

## Files

```
index.html  residences.html  residence.html  studio.html
contact.html  journal.html  404.html
assets/css/main.css        design tokens + all components
assets/js/core.js          shared behaviour (scroll, cursor, menu, transitions, reveals, forms)
assets/js/data.js          residences, floor plans, journal posts
assets/js/home.js …        one script per page (shared code lives on window.Oriel)
assets/img/                photographs (WebP)
assets/frames/             hero and spotlight films as frame sequences (WebP)
```

Header, menu and footer markup lives in `index.html`; `npm run pages` copies it to every other page.
