# Agent docs

Short, **current** documentation for AI agents and contributors. Read these before
editing product or Convex code. Product plans under `plans/` are strategy and
history — **this folder is codebase truth**.

| Doc | Read when |
| --- | --- |
| [`overview.md`](./overview.md) | First orientation: product, access model, shipped vs not |
| [`architecture.md`](./architecture.md) | Stack, folders, guest vs signed-in flow, auth |
| [`data-layer.md`](./data-layer.md) | DataLayer seam, auth identity, loading, inquiries |
| [`content-model.md`](./content-model.md) | Bytes, courses, access, catalog, `/plans` content |
| [`engagement-and-retention.md`](./engagement-and-retention.md) | Habit loop: built vs gaps, leaderboard, pre-launch |
| [`monetization-and-subscription.md`](./monetization-and-subscription.md) | Free read → free social account → Pro later; Plans/leads |
| [`admin-and-feedback.md`](./admin-and-feedback.md) | `/admin`, requireAdmin, feedback, email plan |
| [`conventions.md`](./conventions.md) | Hard rules: purity, generators, SRS, auth copy, courses |
| [`release.md`](./release.md) | `dev` → `main`, CI, Netlify, Convex, env parity |

Product **plans** (roadmaps, audits, phased delivery) live under
[`../plans/`](../plans/), not here. Historical plans under `plans/historical/`
should not be assumed current.

Also read:

- [`../CLAUDE.md`](../CLAUDE.md) — agent entrypoint and must-follow rules
- [`../.env.example`](../.env.example) — Convex + Next auth env placeholders
- [`../convex/_generated/ai/guidelines.md`](../convex/_generated/ai/guidelines.md) —
  before changing Convex APIs
