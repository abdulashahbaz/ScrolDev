# Halvo (ScrolDev concept)

A complete marketing site for **Halvo**, a fictional SaaS that runs AI agents for finance, support and revenue operations. It is a ScrolDev portfolio piece: everything about Halvo (customers, people, numbers, certifications) is invented, and every page says so in the footer and the "A ScrolDev concept" badge.

## What's in it

- **27 static pages:** home, product, pricing, customers and 3 case studies, 4 solution pages, changelog, company, contact, blog and 3 posts, security, legal, login and 404, plus a generated social card, sitemap and robots.
- **Signature pieces:**
  - an animated product console in the hero, where the agent runs, asks for approval and gets approved
  - a pinned "how it works" section
  - a cursor-lit feature bento
  - a scroll-lit statement
  - an integrations orbit
  - a closing eclipse whose light follows the cursor
  - a pricing ROI calculator
- **No images to manage.** Every visual is code: SVG, CSS and live UI.
- **Quality bar:** Lighthouse desktop 100 performance / 97–100 accessibility / 100 best practices / 100 SEO. Respects `prefers-reduced-motion`.

## Stack

Next.js 16 (App Router, fully static), TypeScript, Tailwind CSS 4, Motion, Lenis, Lucide icons. Node 20+.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run format     # Prettier
```

## Where things live

- `src/content/`: all copy and data (pricing, customers, posts, changelog, team). Edit here, not in components.
- `src/content/site.ts`: site name, nav, and `studio`. **Set `studio.url` to the ScrolDev hub or contact page** so the badge and the contact form's success state link back to the studio.
- `src/components/home/`: homepage sections.
- `src/components/visuals/`: the animated product UI pieces, reused across pages.
- `src/app/globals.css`: design tokens (colors, type, motion) at the top.

## Deploy

Vercel: import the repo and set **Root Directory** to `sites/halvo`. Nothing else to configure: `vercel.json` already makes Vercel skip rebuilds when nothing in this folder changed. Optionally set `NEXT_PUBLIC_SITE_URL` to the production URL. Without it, Vercel's production URL is used for canonical links and the social card.
