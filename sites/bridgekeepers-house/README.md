# The Bridgekeepers' House

A ScrolDev concept: the website of a fictional boutique hotel in the old town of Mostar, Bosnia and Herzegovina. The hotel, its rooms, prices and services are invented; the booking form sends nothing. Real-world facts are limited to well-established ones about Stari Most (completed 1566, destroyed 9 November 1993, reopened July 2004, UNESCO 2005) and the region.

**The idea:** Mostar is named for the *mostari*, the keepers of its Old Bridge, so the hotel brands itself as the house that keeps their habit of looking after everyone who crosses. The home page opens with a pinned, layered-photography scroll story. The bridge and its towers part, the old town drops into depth of field, and a card slider for the house flies in. Then the page flows into rooms, dining and experiences.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Cormorant and Jost via `next/font`. No animation libraries. Every page is prerendered.

| Page | Route |
| --- | --- |
| Home: scroll story, welcome, booking bar, rooms, dining, experiences | `/` |
| Rooms and suites | `/rooms` |
| Room detail | `/rooms/[slug]` (4 room types) |
| Dining: terrace, kitchen, cellar bar | `/dining` |
| Experiences and day trips | `/experiences` |
| Our story: the bridgekeepers and the bridge | `/story` |
| Booking: room, dates, extras, live estimate | `/book` |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## How the scroll story works

`src/components/home/cinema.tsx` reads how far the pinned section has been scrolled, smooths it, and each animation frame writes about forty CSS custom properties onto the stage: layer positions, scales, blur, brightness, panel opacity and the slider's entry. `src/styles/cinema.css` maps those properties onto the layers. Pointer movement adds parallax. Under `prefers-reduced-motion` the smoothing and parallax switch off and the story scrubs directly with the scroll.

The scene layers in `public/scene/` are WebP conversions, at 2560 and 1440 px, of the layered Mostar photography from a motionsites.org prompt. The originals were about 40 MB; these are about 2 MB.

## Photography credits

- **Mostar scenes:** the layered scene photography from motionsites.org prompt media. The full-frame Mostar images in `src/assets/photos/mostar-*.jpg` are composites of those layers, some colour-graded to dusk.
- **Hotel interiors and food:** free photographs from [Unsplash](https://unsplash.com), used under the Unsplash License and colour-graded to one look. Photo IDs are listed in `src/content/photos.ts`.

The display font is Cormorant (SIL Open Font License); the reference's paid font is not used.

## Deploy

On Vercel, import the ScrolDev repository as a new project with **Root Directory** set to `sites/bridgekeepers-house`.
