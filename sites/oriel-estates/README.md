# Oriel — luxury real estate concept

A concept website for **Oriel**, a fictional private estate agency that represents seven singular homes. Built by ScrolDev as a portfolio piece. Every residence, price, architect and person on the site is invented, and the footer says so.

## What's in it

| Page | Highlights |
| --- | --- |
| `index.html` | Counting preloader that expands into the hero · layered hero where the headline sits *behind* the house (separate sky and foreground renders) · WebGL "living sky" with drifting clouds and a pointer lens · pinned collection strip that expands one residence at a time · sticky spotlight with chaptered image wipes · hover lists with a cursor-following image · scroll-scaled quote · live clocks · journal |
| `residences.html` | Filter by setting, sort by price/date, grid ⇄ list views, all animated with GSAP Flip · editorial asymmetric grid · cursor-follow preview in list view |
| `residence.html?id=…` | One template for all seven homes: split-letter hero, facts bar, story with drop caps, drag gallery + keyboard lightbox, floor plans that draw themselves (per level, hover-linked to the room list), generated topographic map, live finance calculator, viewing request with date picker, "next residence" footer |
| `studio.html` | Principles, draggable timeline, partners |
| `contact.html` | Intent and setting chips, budget slider, validated form, office clocks |
| `journal.html?id=…` | Three essays |
| `404.html` | Lost-address page |

Shared across pages: Lenis smooth scrolling synced to ScrollTrigger, curtain page transitions, custom cursor with contextual labels, magnetic buttons, masked line reveals (SplitText), header that hides on scroll and switches colour per section, velocity skew on imagery, film grain, and a full-screen menu with image previews.

## Imagery

All imagery was modelled and rendered from scratch in Blender (Cycles) for this project, so there are no stock-photo licences to track. The hero is rendered twice, once as sky only and once as the house with a transparent sky, so the type can be layered between them. Images ship as WebP at 800/1400/2200 px with `srcset`.

## Stack

Plain HTML, CSS and ES modules. No build step.

- [GSAP](https://gsap.com) 3.15 with ScrollTrigger, SplitText, Flip and CustomEase (GSAP standard no-charge licence), vendored in `assets/js/vendor/`
- [Lenis](https://github.com/darkroomengineering/lenis) 1.3 (MIT), vendored
- A small hand-written WebGL shader for the sky (`assets/js/gl.js`)
- Fonts from Google Fonts: Archivo (expanded), Inter Tight, Instrument Serif

## Run it locally

ES modules need a server (opening the file directly will not work):

```bash
npx serve sites/oriel-estates
# or
python3 -m http.server -d sites/oriel-estates 4173
```

## Deploy

Static. On Vercel, create a project with **Root Directory** `sites/oriel-estates`, framework preset **Other**, no build command. `404.html` is picked up automatically.

## Accessibility and fallbacks

- `prefers-reduced-motion` turns off smooth scrolling, the preloader, page transitions and scroll-driven motion; content is shown immediately.
- Keyboard: skip link, focus styles, Escape closes the menu and lightbox, arrow keys page through the lightbox.
- The custom cursor, magnetic buttons and hover previews only run on fine pointers.
- If WebGL is unavailable the hero falls back to the plain sky image.
- Forms validate and show a success state, but are **not connected** to anything; the page says so.

## Files

```
index.html  residences.html  residence.html  studio.html
contact.html  journal.html  404.html
assets/css/main.css        design tokens + all components
assets/js/core.js          shared behaviour (scroll, cursor, menu, transitions, reveals, forms)
assets/js/data.js          residences, floor plans, journal posts
assets/js/home.js …        one module per page
assets/js/gl.js            WebGL sky
assets/img/                rendered imagery (WebP)
```

Header, menu and footer markup is identical on every page; if you change it in `index.html`, copy it to the other pages.
