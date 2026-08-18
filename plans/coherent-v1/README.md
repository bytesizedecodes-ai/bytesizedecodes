# Coherent V1 planning

Current product direction: one coherent learning journey —

> Choose a goal → daily plan → learn actively → review → build → verified progress

## Reality check (read first)

**Codebase truth is under [`docs/`](../../docs/)**, not this folder. As of the
current site, several roadmap items are partially or fully **already shipped**
in product form:

| Area | Shipped (see `docs/`) | Still planned |
| --- | --- | --- |
| Auth | Social OAuth (Google live; GitHub env/UI ready); no anonymous UI session; privacy/export on Profile | Optional progress migration polish; peer social |
| Free content | Free courses public SEO; login to save progress | — |
| Freemium narrative | `/plans`, lead forms | Stripe/Pro pricing |
| Gallery | Opt-in project gallery | Peer review, squads |
| Habit core | Daily plan, SRS, streaks, XP | Externals: email/push, weekly minutes tracking |

Historical phase writeups (especially Phase 4 “add Google”) may describe work
as future; treat them as strategy history unless exit criteria still apply.

## Strategy docs

| Doc | Topic |
| --- | --- |
| [`01-repository-product-audit.md`](./01-repository-product-audit.md) | Audit snapshot (may lag; verify against `docs/`) |
| [`02-hooked-engagement-strategy.md`](./02-hooked-engagement-strategy.md) | Habit / Hooked model for retention |
| [`03-course-and-track-roadmap.md`](./03-course-and-track-roadmap.md) | Tracks, skills, curriculum |
| [`04-interactive-learning-design.md`](./04-interactive-learning-design.md) | Active learning interaction patterns |
| [`05-product-execution-roadmap.md`](./05-product-execution-roadmap.md) | Strategy overview, shared backend/metrics, decision gates |
| [`06-ai-observability-intermediate-and-advanced.md`](./06-ai-observability-intermediate-and-advanced.md) | Proposed intermediate and expert AI observability curriculum |
| [`release-and-deploy.md`](./release-and-deploy.md) | `dev` → `main`, CI, Netlify, Convex production |

## Delivery phases

Phased execution plans (split from the roadmap). Many items remain valid;
auth/free-content status has moved forward — re-check exit criteria against
[`docs/overview.md`](../../docs/overview.md).

| Phase | Doc |
| --- | --- |
| 0 — Truthful and testable | [`phases/phase-0-truthful-and-testable.md`](./phases/phase-0-truthful-and-testable.md) |
| 1 — Unify learning loop | [`phases/phase-1-unify-learning-loop.md`](./phases/phase-1-unify-learning-loop.md) |
| 2 — Active AI Foundations | [`phases/phase-2-active-ai-foundations.md`](./phases/phase-2-active-ai-foundations.md) |
| 3 — Python and projects | [`phases/phase-3-python-and-projects.md`](./phases/phase-3-python-and-projects.md) |
| 4 — Auth and social | [`phases/phase-4-auth-and-social.md`](./phases/phase-4-auth-and-social.md) |
| 5 — AI Product Builder | [`phases/phase-5-ai-product-builder.md`](./phases/phase-5-ai-product-builder.md) |
| 6 — Expand curriculum | [`phases/phase-6-expand-curriculum.md`](./phases/phase-6-expand-curriculum.md) |

For agent-facing “how the codebase works today”, use [`../../docs/`](../../docs/).
