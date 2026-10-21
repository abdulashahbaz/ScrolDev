# fonds (ScrolDev concept)

The store front for **fonds**, a fictional headwear label, launching Collection Nº 04: summer caps and bucket hats in four colourways. It is a ScrolDev portfolio piece: the brand, the copy, the prices and the run of 300 are invented, and the footer says "Concept by ScrolDev".

## What it does

One page, two phases, all driven by scroll position:

1. **Hero.** A full-screen film of the model behind the wordmark, nav and product block. His head follows the cursor: two clips that start on the same front-facing frame turn it to either side, and the cursor scrubs whichever matches, easing towards it rather than jumping. A dead zone in the middle holds him facing forward. When the mouse rests, and on phones, he slowly looks from side to side on his own.
2. **Gallery.** A black panel rises over the hero during the first screen of scroll, then the collection scrolls past in a scattered grid of model and product shots, each one scaling up as it enters and down as it leaves. At the end the page washes to white and the "view" pill grows out of the corner.

Every overlay uses `mix-blend-mode: exclusion`, so the same white type reads on the film, on black and on white.

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, GSAP 3 (ScrollTrigger, for the panel), Lenis (smooth scrolling), Motion 12 (entry animations), Inter Tight self-hosted via Fontsource. Node 20+.

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
| `src/content/site.ts` | All copy, the video URLs and the gallery images. Edit here, not in components. |
| `src/App.tsx` | The scroll engine: one animation-frame loop that reads `scrollY`, moves the gallery, scales the cards and runs the outro. Writes only when something changed. |
| `src/components/video-stage.tsx` | The head-turn: one eased "pose" value, driven by the cursor or the idle sway, scrubs the two clips. Seeks only when the previous seek has finished. |
| `src/components/gallery-panel.tsx`, `src/lib/layout.ts` | The black panel and its scattered grid (2, 3 or 4 columns). |
| `src/components/hero-overlay.tsx` | Logo, caption, nav, product block, "view" pill, white overlay, footer. |
| `src/components/logo-mark.tsx` | The wordmark: "fonds" in Inter Tight 600, converted to outlines. |

`prefers-reduced-motion` is respected: entry animations drop their movement, the idle sway and smooth scrolling are off. The head still follows the cursor and the gallery still follows the scroll, since the visitor drives them.

## Media

URLs live in `src/content/site.ts`.

All media was generated for fonds with Higgsfield and is hosted on our Higgsfield storage.

- **Hero clips:** one still of the model (GPT Image 2.5), animated twice with Kling 3.0 Motion Control, once turning each way. They must be encoded with a keyframe on every frame, or scrubbing stutters: `ffmpeg -i in.mp4 -an -c:v libx264 -crf 20 -g 1 -pix_fmt yuv420p -movflags +faststart out.mp4`. Both clips must start on the same frame.
- **Gallery:** eight portrait WebP images (GPT Image 2): model shots that keep the hero model's face, alternating with product shots.

## Deploy

Vercel: import the repo and set **Root Directory** to `sites/fonds`. `vercel.json` sets the Vite framework and skips rebuilds when nothing in this folder changed.
