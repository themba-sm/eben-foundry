# Eben Foundry

**Turn your business into a growth system.**

A modular business growth and opportunity infrastructure platform — the Summit Experience MVP. The thesis it demonstrates:

> Different businesses have different growth mechanics, but they can run on the same underlying growth infrastructure.

One engine, many business models:

- **High-Ticket Engine** — Attract → Capture → Qualify → Book → Follow Up → Convert (real estate, law, dealerships, construction, professional services)
- **Low-Ticket Engine** — Attract → Showcase → Buy/Book → Remind → Repeat → Retain (salons, barbers, gyms, restaurants, retail, e-commerce)

## Modules

1. **Experience / Home** — entry point into the flagship journey
2. **Build Your Business System** — the flagship 9-step journey: choose industry → define business → determine model → cinematic build → personalized system → live simulation → Marketing Studio → Readiness → the reveal
3. **Build Your System (flagship)** — as above
4. **High-Ticket Engine** — lead capture, qualification scoring (budget/need/location/timeline/intent), pipeline, booking, follow-ups, conversion tracking
5. **Low-Ticket Engine** — service showcase, booking flow, customer records, repeat-visit reminders, loyalty, campaign tracking
6. **Marketing Studio** — generates social ad, promotional offer, landing hero, WhatsApp CTA and lead-gen campaign previews from brand configuration
7. **Readiness** — 7-area self-assessment returning overall readiness, strengths, gaps and recommended next actions
8. **Opportunity Network** — demo supplier directory with requirement matching (clearly labelled DEMO DATA)
9. **Impact Dashboard** — illustrative pilot targets (clearly labelled, not real achievements)
10. **About** — scope honesty: what is working demo vs simulated

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

## Cinematic intro

The homepage opens with a 7-second, silent, muted brand intro (`public/media/eben-intro.mp4`, user-provided asset, used unmodified). Architecture: `CinematicIntro` component → video layer → 420ms opacity transition → main experience.

Behavior:
- Plays once per browser session (`sessionStorage`), not on every internal navigation.
- Respects `prefers-reduced-motion` — skips the video entirely, reveals instantly.
- Autoplay-blocked browsers get a minimal "Enter Eben Foundry" tap prompt over the poster frame.
- Slow connections / video errors auto-resolve to the site after ~4.2s — never traps the user.
- Skippable via a visible "Skip intro" control or the Escape key.
- The app mounts underneath the intro overlay immediately — it never blocks interactivity.
- A subtle "Replay intro" control lives in the homepage's world-echo band (secondary, not a primary CTA).
- The final video frame (`eben-intro-poster.jpg`) is reused, letterboxed and never cropped, as a small hero band at the top of the homepage — visual continuity without turning the whole app dark.
