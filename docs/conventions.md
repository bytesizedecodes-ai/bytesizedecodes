# Conventions

Hard rules for agents. Also summarized in [`../CLAUDE.md`](../CLAUDE.md).

## DataLayer

1. Components/pages import hooks only from `@/lib/data/provider`.
2. Direct Convex imports stay in the provider/backend boundary.
3. Product identity = Convex Auth social session (`getUserId` server-side).
4. Do not reintroduce anonymous auto-login.

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

## Auth copy and UI

- Prefer “sign in”, “social account”, “signed-in identity” in product copy.
- Provider names belong on OAuth buttons (`Continue with Google` / `Continue with GitHub`).
- Wire new providers in `convex/auth.ts` + flags in `lib/authProviders.ts` +
  `.env.example` / Netlify env.

## Courses / infographics

Use the `infographics-animation` skill (v2) for new or edited visual courses:
audience-aware level, scene vocabulary, theme-safe tokens, one accent per scene.
See rule 11 in [`../CLAUDE.md`](../CLAUDE.md).

## Tests and finish line

- Colocated `*.test.ts`.
- Generator changes: run generator tests (`npm test`).
- Data-layer / Convex changes: keep the seam intact; do not trust client userIds.
- Before declaring done: `npm run typecheck` (and relevant tests).

## Tailwind

Use existing `@theme` tokens and utilities. Do not invent a parallel visual
system unless explicitly redesigning.
