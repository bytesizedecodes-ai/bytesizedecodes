# bytesizedecodes

Learn AI visually. Practise it. Build something real.

bytesizedecodes is an early learning-platform prototype for curious beginners,
students, working professionals, and aspiring AI founders. It combines visual
lessons, procedural practice, spaced review, executable Python, and project-based
learning.

The current prototype persists progress in Convex using an anonymous browser
identity. Production authentication and cross-device accounts are not implemented
yet.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test        # generator + SRS + day-key suite
npm run typecheck
npm run build
```

## What's in here

| Area | Path |
| --- | --- |
| Agent docs | `docs/` |
| Product plans | `plans/` |
| Drill generators | `lib/drills/` |
| Spaced repetition | `lib/srs.ts` |
| Day keys (IST) | `lib/day.ts` |
| Convex backend | `convex/` |
| Frontend data provider | `lib/data/` |
| Learning content | `content/` |
| App routes | `app/` |

## Current prototype

- [x] Scaffold (Next.js + Tailwind)
- [x] Generators G2, G1, G4, G8 with diagnostic distractors
- [x] SM-2 review scheduling
- [x] Reactive Convex persistence behind a DataLayer seam
- [x] Courses, practice, review, mastery, daily plan, bytes, and settings
- [x] Visual infographic lessons and three standalone bytes
- [x] Pyodide code cell (lazy, gesture-triggered)
- [ ] Add production authentication
- [ ] Unify course lessons and standalone bytes
- [ ] Add goal-based paths and active project checkpoints
- [ ] Put the coherent learning loop in front of real testers
- [ ] Measure byte authoring time (target ≤ 90 min)

## Docs and plans

- Agent-facing project docs: [`docs/`](docs/) (start at [`docs/README.md`](docs/README.md))
- Agent entrypoint: [`CLAUDE.md`](CLAUDE.md)
- Product plans by phase: [`plans/`](plans/)
  - Current direction: [`plans/coherent-v1/`](plans/coherent-v1/)
  - Delivery phases: [`plans/coherent-v1/phases/`](plans/coherent-v1/phases/)
  - Historical: [`plans/historical/`](plans/historical/)
