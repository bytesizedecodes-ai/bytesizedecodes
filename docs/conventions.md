# Conventions

Hard rules for agents. Also summarized in [`../CLAUDE.md`](../CLAUDE.md).

## DataLayer

1. Components/pages import hooks only from `@/lib/data/provider`.
2. Direct Convex imports stay in the provider/backend boundary.
3. Direct anonymous storage access stays in `lib/data/identity.ts`.

## Pure modules

These must stay free of `Math.random()`, `Date.now()`, DOM, React, and storage:

- `lib/drills/`
- `lib/srs.ts`
- `lib/day.ts`
- `lib/data/streak.ts`
- `lib/data/xp.ts`
- shared helpers under `convex/lib/` that mirror them

`today: DayKey` is always a parameter.

## Generators

- Pure functions of `(seed, difficulty)`.
- Burn one `int(r, 0, 7)` draw first so adjacent seeds differ.
- Dispatch on difficulty, then override `seed` on the returned question.
- Use `buildChoices` (dedupes; throws if distractors run short).
- Every distractor needs `misconception` > 20 chars (asserted across 2000 seeds).

## DrillPlayer

Key by `(generatorId, difficulty, seed)` or `(itemKey, seed)` so it remounts per
question.

## Practice vs review

- Practice grades; review advances SRS.
- `submitAttempt` may create the card; `gradeReview` schedules it.

## DayKey

Branded `"YYYY-MM-DD"` in IST. Cast with `asDayKey()`, never blind `as DayKey`.

## TypeScript

- No `any`. Prefer `Doc<>` / `Id<>` and branded types.
- `noUncheckedIndexedAccess`: array access is `T | undefined`.

## Tests and finish line

- Colocated `*.test.ts`.
- Generator changes: run generator tests (`npm test`).
- Data-layer / Convex changes: keep the seam intact.
- Before declaring done: `npm run typecheck` (and relevant tests).

## Tailwind

Use existing `@theme` tokens and utilities. Do not invent a parallel visual
system unless explicitly redesigning.
