# fonds (ScrolDev concept)

The drop page for **fonds**, a fictional archive fashion label, launching its fourth collection, Archive Nº 04 "Low Light". It is a ScrolDev portfolio piece: the brand, the copy, the price and the run of 300 are invented, and the footer says "Concept by ScrolDev".

## What it does

One page, two phases, all driven by scroll position:

1. **Hero.** A full-screen film behind the wordmark, nav and product block. The two clips play back to back on their own. With a mouse, moving the cursor takes over and scrubs them: move left of centre and one clip scrubs forward; move right and the other does. A dead zone in the middle parks both on their first frame, so crossing the centre never jumps. When the mouse rests for a moment, playback picks up again from that frame.
2. **Gallery.** A black panel rises over the hero during the first screen of scroll, then the ten looks scroll past in a scattered grid, each one scaling up as it enters and down as it leaves. At the end the page washes to white and the "view" pill grows out of the corner.

Every overlay uses `mix-blend-mode: exclusion`, so the same white type reads on the film, on black and on white.

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, GSAP 3 (ScrollTrigger, for the panel), Motion 12 (entry animations), Inter Tight self-hosted via Fontsource. Node 20+.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run lint
npm run typecheck
```

## Where things live

| File | Role |
| --- | --- |
| `src/content/site.ts` | All copy, the video URLs and the ten look images. Edit here, not in components. |
| `src/App.tsx` | The scroll engine: one animation-frame loop that reads `scrollY`, moves the gallery, scales the cards and runs the outro. Writes only when something changed. |
| `src/components/video-stage.tsx` | Back-to-back playback, and cursor scrubbing whenever the mouse moves. Seeks only when the previous seek has finished, which is what keeps scrubbing smooth. |
| `src/components/gallery-panel.tsx`, `src/lib/layout.ts` | The black panel and its scattered grid (2, 3 or 4 columns). |
| `src/components/hero-overlay.tsx` | Logo, caption, nav, product block, "view" pill, white overlay, footer. |
| `src/components/logo-mark.tsx` | The wordmark: "fonds" in Inter Tight 600, converted to outlines. |

`prefers-reduced-motion` is respected: entry animations drop their movement and the films do not play on their own. Scrubbing and the gallery still follow the cursor and scroll, since the visitor drives them.

## Media

The films and look images are loaded from external CDN URLs (`src/content/site.ts`). Before showing this to prospects, download them into `public/media/` and point the URLs there, so the page doesn't depend on someone else's CDN staying up.

## Deploy

Vercel: import the repo and set **Root Directory** to `sites/fonds`. `vercel.json` sets the Vite framework and skips rebuilds when nothing in this folder changed.
