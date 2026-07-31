# Data layer

## Sacred seam

UI and pages import data hooks **only** from `@/lib/data/provider`.

Do **not** import Convex React hooks or browser persistence from pages/
components (except the temporary identity helper).

| File | Role |
| --- | --- |
| `lib/data/provider.tsx` | Active Convex-backed adapter (hooks + mutations) |
| `lib/data/contract.ts` | Mutation / query surface contract |
| `lib/data/types.ts` | Shared client types |
| `lib/data/identity.ts` | Anonymous browser UUID (temporary exception) |
| `lib/data/local.ts` | Legacy localStorage adapter — **not active** |
| `lib/data/streak.ts`, `lib/data/xp.ts` | Pure streak/XP logic |

## Loading semantics

Hooks return:

1. `undefined` while loading
2. then data or `null`

Every consumer must handle the loading state. The active provider is reactive
through Convex; do not rely on local-adapter-specific behavior.

## Practice vs review

- **Practice / lesson attempts** grade and may create a review card on first
  exposure (`submitAttempt`). They do **not** advance the SRS schedule.
- **Review** advances the schedule via `gradeReview`.

## Review keys

- Generator reviews: `(generatorId, difficulty)` via `drillItemKey`
- Authored reviews: typed keys from `convex/lib/reviewKey.ts` / content helpers

Review tracks mastery of a skill (or authored item), not a random seed instance.

## Day keys and streaks

- `DayKey` is `"YYYY-MM-DD"` in IST (fixed +05:30). Use `asDayKey()`.
- Pass `today: DayKey` into pure logic; never call `Date.now()` inside pure
  modules or Convex **queries**.
- `settleOnPractice` runs on writes; `settleOnRollover` adjusts query display;
  persistence cron is disabled.

## Convex work

Before editing Convex functions, read
`convex/_generated/ai/guidelines.md`.

Public functions validate `args` and `returns`. Prefer indexes over `.filter()`.
Await all DB/scheduler promises. Schedule only `internal.*` functions.
