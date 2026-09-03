# Eben Foundry

**Turn your business into a growth system.**

A modular business growth and opportunity infrastructure platform — the Summit Experience MVP. The thesis it demonstrates:

> Different businesses have different growth mechanics, but they can run on the same underlying growth infrastructure.

One engine, many business models:

- **High-Ticket Engine** — Attract → Capture → Qualify → Book → Follow Up → Convert (real estate, law, dealerships, construction, professional services)
- **Low-Ticket Engine** — Attract → Showcase → Buy/Book → Remind → Repeat → Retain (salons, barbers, gyms, restaurants, retail, e-commerce)

## Modules

1. **Experience / Home** — entry point into "Build your growth system"
2. **Business Simulator** — choose an industry, mode, brand colours and offer; the system generates a business-specific demonstration
3. **High-Ticket Engine** — lead capture, qualification scoring (budget/need/location/timeline/intent), pipeline, booking, follow-ups, conversion tracking
4. **Low-Ticket Engine** — service showcase, booking flow, customer records, repeat-visit reminders, loyalty, campaign tracking
5. **Marketing Studio** — generates social ad, promotional offer, landing hero, WhatsApp CTA and lead-gen campaign previews from brand configuration
6. **Readiness** — 7-area self-assessment returning overall readiness, strengths, gaps and recommended next actions
7. **Opportunity Network** — demo supplier directory with requirement matching (clearly labelled DEMO DATA)
8. **Impact Dashboard** — illustrative pilot targets (clearly labelled, not real achievements)
9. **About** — scope honesty: what is working demo vs simulated

## Tech

- React 18 + Vite
- No other runtime dependencies — hash-based routing, custom UI component library
- Business configuration persisted in `localStorage`

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # local preview of the production build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project → Import** this repository.
3. Vercel auto-detects Vite. Defaults just work:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**. No environment variables needed.

`vercel.json` is included for SPA safety; routing is hash-based so no server configuration is required.

## Honesty note

Interfaces and data labelled **DEMO** or **PREVIEW** are simulated: lead scoring is demonstrated logic, suppliers are seeded records, impact figures are illustrative pilot targets. Nothing here is presented as live verification, real analytics or real achievements.
