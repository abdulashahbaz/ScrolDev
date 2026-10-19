# Apricot & Ice

A ScrolDev concept: the website of a fictional small-group travel company in Hunza, in Pakistan's Karakoram mountains. Apricot & Ice is not a real company; prices, departure dates and the enquiry form are illustrative, and the form sends nothing.

**The idea:** the home page is one pinned, scroll-driven scene that moves through a whole day in the valley: dawn on Rakaposhi, midday over Attabad Lake, golden hour, then night over Baltit Fort. There are no photographs. Every layer (peaks, lake, poplars, the fort, the gorge and the suspension bridge) is SVG generated in code, and every colour is a CSS variable, so the scene can be recoloured for any time of day or season.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Fraunces and Instrument Sans via `next/font`. No animation libraries. Every page is prerendered.

| Page | Route |
| --- | --- |
| Home: the scroll story, journeys, principles, seasons | `/` |
| Journeys, with a comparison table | `/journeys` |
| Journey detail: route, day by day, dates, inclusions | `/journeys/[slug]` (4 journeys) |
| Places, with a map that follows your scroll | `/places` |
| Seasons | `/seasons` |
| About | `/about` |
| Enquire | `/enquire` |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

## How the scene works

| File | Role |
| --- | --- |
| `src/lib/terrain.ts` | All geometry, in a 1600 × 1000 viewBox. Seeded and deterministic, so server and browser markup match. |
| `src/lib/palette.ts` | Colours for dawn, midday, golden hour and night, interpolated for any time `t` from 0 to 1, plus seasonal swaps. |
| `src/components/scene/landscape.tsx` | The scene as separate layers (sky, back stack, bridge, gorge walls), and `Landscape`, a still scene for heroes and cards. |
| `src/components/home/cinema.tsx` | The home page engine: scroll distance → CSS custom properties, once per animation frame, with smoothing and pointer parallax. |
| `src/styles/cinema.css` | How those properties move, blur and fade each layer. |

`prefers-reduced-motion` is respected: smoothing, parallax and ambient animation switch off, and the story still scrubs with the scroll.

## Content

Journeys, places and seasons live in `src/content/`. Real-world facts are limited to well-established ones: Rakaposhi's 7,788 m summit, Khunjerab Pass at 4,693 m, the January 2010 Attabad landslide and Baltit Fort's 1996 reopening as a museum.

## Deploy

On Vercel, import the ScrolDev repository as a new project with **Root Directory** set to `sites/apricot-and-ice`. Its `vercel.json` makes Vercel skip rebuilds when nothing in this folder changed.
