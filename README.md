# bytesizedecodes

Learn AI visually. Practise it. Build something real.

**ByteSizeDecodes** is a goal-based AI learning platform for curious beginners,
students, working professionals, and aspiring founders. Free courses are public
to read; progress, streaks, and the daily plan require a free **social account**
(Google OAuth live; GitHub ready when configured).

## Run locally

Prerequisites: `npm install`, and `.env.local` with `CONVEX_DEPLOYMENT` and
`NEXT_PUBLIC_CONVEX_URL` (from `npx convex dev`). Auth flags and OAuth setup:
[`.env.example`](.env.example).

```bash
# Terminal 1 — Convex (start first)
npx convex dev

# Terminal 2 — Next.js → http://localhost:3000
npm run dev
```

```bash
npm test        # vitest
npm run typecheck
npm run build
```

## Product in brief

| Audience | Experience |
| --- | --- |
| Guest | Free courses/lessons SEO, Learn catalog, Plans, legal, advertise/subscribe |
| Signed-in | Onboarding → Today · Learn · Courses · Build · Progress · Profile |

Stack: Next.js 16 · React 19 · TypeScript · Tailwind v4 · Convex · Vitest · Convex Auth.

## Branches and production

- **`dev`** — day-to-day development
- **`main`** — production (Netlify production branch)
- Promote with a PR: `dev` → `main`
- Full release ritual: [`plans/coherent-v1/release-and-deploy.md`](plans/coherent-v1/release-and-deploy.md)

## What's in here

| Area | Path |
| --- | --- |
| Agent docs (current truth) | [`docs/`](docs/) |
| Product plans | [`plans/`](plans/) |
| Drill generators | `lib/drills/` |
| Spaced repetition | `lib/srs.ts` |
| Day keys (IST) | `lib/day.ts` |
| Convex backend | `convex/` |
| Frontend data provider | `lib/data/` |
| Learning + plans content | `content/` |
| App routes | `app/` |

## Current prototype checklist

- [x] Scaffold (Next.js + Tailwind + Convex)
- [x] Social auth (Google live; GitHub placeholder/env ready)
- [x] Free public course reading; login to save progress
- [x] Generators with diagnostic distractors; SM-2 review
- [x] Daily plan, streaks, XP, onboarding tracks
- [x] Visual courses, bytes, Pyodide code cell
- [x] Build projects + opt-in gallery
- [x] Plans page, footer, About/Contact/Privacy/Terms
- [x] Advertise / Subscribe lead capture
- [x] Admin console + feedback widget
- [ ] Enable GitHub OAuth for production if desired
- [ ] Outbound reminders (email/push)
- [ ] Stripe / Pro pricing for paid courses
- [ ] Cohort leaderboard or none (no global XP rank)
- [ ] Deeper curriculum and peer social features

## Docs and plans

- Agent-facing docs: [`docs/README.md`](docs/README.md)
- Agent entrypoint: [`CLAUDE.md`](CLAUDE.md)
- Current product direction: [`plans/coherent-v1/`](plans/coherent-v1/)
- Historical (not current truth): [`plans/historical/`](plans/historical/)
