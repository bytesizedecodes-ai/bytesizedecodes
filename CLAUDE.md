# CLAUDE.md

Guide for AI agents working on this repo. Read before editing.

## What this is

**ByteSizedCodes** — “Learn AI visually. Practise it. Build something real.” A
goal-based AI learning platform for curious beginners, students and graduates,
working professionals, and aspiring founders.

The current prototype uses **Convex persistence** behind the `DataLayer` seam.
Identity is still an anonymous browser UUID trusted by the backend; production auth,
cross-device accounts, scheduled email, and public social features are not ready.
`lib/data/local.ts` is the retained legacy adapter, not the active provider.

Read `docs/04-repository-product-audit.md` through
`docs/08-product-execution-roadmap.md` for the current direction. Documents
`00`–`03` capture earlier planning assumptions.

## Commands

```bash
npm install
npm run dev          # Next.js dev server → http://localhost:3000
npm test             # vitest run (colocated *.test.ts)
npm run test:watch
npm run typecheck    # tsc --noEmit
npm run build
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Convex ·
Vitest. Path alias `@/*` → repo root. Pyodide loads from CDN at runtime.

## The rules that matter (read these before editing)

1. **The `DataLayer` seam is sacred.** Components and pages import hooks only from
   `@/lib/data/provider`; they do not import Convex or browser persistence directly.
   `lib/data/provider.tsx` is the active Convex adapter. `lib/data/identity.ts` is
   the temporary exception that owns the anonymous browser UUID.

2. **`lib/drills/`, `lib/srs.ts`, `lib/day.ts`, `lib/data/streak.ts`, `lib/data/xp.ts`
   are pure TypeScript.** No `Math.random()`, `Date.now()`, DOM, React, or storage
   imports. They must import cleanly into Convex later for server-side grading.
   `today: DayKey` is always a parameter — never derived inside pure logic.

3. **Hooks return `undefined` while loading**, then data or `null`. Every consumer
   must handle the loading state. The active provider is reactive through Convex;
   do not rely on behavior specific to the retained local adapter.

4. **Generators are pure functions of `(seed, difficulty)`.** Always burn one
   `int(r, 0, 7)` draw first so adjacent seeds differ, then dispatch on difficulty,
   then override `seed` on the returned question. Use `buildChoices` — it dedupes
   and throws if distractors run short. **Every distractor must carry a
   `misconception` string >20 chars** (asserted at 2000 seeds in tests).

5. **`<DrillPlayer>` must be `key`-ed** by `(generatorId, difficulty, seed)` or
   `(itemKey, seed)` so it remounts cleanly per question.

6. **Practice mode only grades; review mode advances SRS.** `submitAttempt`
   creates the review card on first exposure but does not advance the schedule —
   that is what `gradeReview` is for.

7. **Review keys by `(generatorId, difficulty)`** via `drillItemKey` — review
   tracks mastery of a skill, not of a specific random instance.

8. **`DayKey` is a branded string** (`"YYYY-MM-DD"` in IST, fixed +05:30, no DST).
   Use `asDayKey()` to cast raw strings, never `as DayKey` blindly.

9. **Streak settlement is pure.** `settleOnPractice` runs on writes.
   `settleOnRollover` currently adjusts query display; the persistence cron is
   disabled. One freeze is earned per 7 streak days.

10. **Strict TS with `noUncheckedIndexedAccess`.** Array access is `T | undefined`;
    hence the pervasive `!` assertions after `.find()`.

## Where things live

| Area | Path | Notes |
| --- | --- | --- |
| Current product direction | `docs/04-*.md`–`docs/08-*.md` | Audit, engagement, curriculum, interaction design, execution |
| Historical plans | `docs/00-*.md`–`docs/03-*.md` | Earlier product, architecture, generator, and Phase-0 assumptions |
| App routes | `app/` | Server components by default; `"use client"` only where needed |
| React data hooks | `lib/data/provider.tsx` | Active Convex-backed provider |
| Data mutation contract | `lib/data/contract.ts` | Spec for the mutation surface |
| Convex backend | `convex/` | Schema, queries, mutations, and shared pure logic |
| Anonymous identity | `lib/data/identity.ts` | Temporary browser UUID; replace with auth |
| Legacy local adapter | `lib/data/local.ts` | Retained but not active |
| Drill generators | `lib/drills/` | Registry order = practice-picker order |
| Spaced repetition | `lib/srs.ts` | SM-2; `dueQueue` cap of 20 (anti-abandonment) |
| IST day keys | `lib/day.ts` | `todayKey()`, `addDays()`, `daysBetween()` |
| Streak / XP | `lib/data/streak.ts`, `lib/data/xp.ts` | Pure; deterministic XP seeded by `(userId, day, itemKey)` |
| Byte content | `content/` | Typed TS modules (not MDX); `order` sets listing order |
| Shared components | `components/` | `Shell`, `DrillPlayer`, `CodeCell` (Pyodide), `StatsHud`, `RewardBanner`, `BlockList` |

## Conventions

- **Tests are colocated** (`*.test.ts` next to the module). Generator tests iterate
  2000 seeds × all difficulties. Run `npm test` before claiming a generator change works.
- **Generated content uses typed `Block[]`** (text/code/table/note), never markdown
  strings. Inline mini-markdown (`**bold**`, `` `code` ``) is rendered by `formatInline`
  (in `app/bytes/[slug]/page.tsx`) and `Inline` (in `components/BlockList.tsx`).
- **Tailwind v4** with `@theme` tokens in `app/globals.css`:
  `canvas, dot, ash, ink, ink-soft, ink-faint, brand, brand-deep, brand-wash,
  good, good-wash, bad, bad-wash, gold`. Custom `@utility card` and `animate-pop`.
  Respect `prefers-reduced-motion`.
- **Byte authored questions are MCQ-only** with `answer: string` (a choice id).
- **`PersistedStateV1` is the export/import and legacy-local shape.** Update import
  handling deliberately when it changes.
- **Don't add `any`.** Use `Doc<>` / `Id<>` patterns and branded types where they exist.

## When you make a change

- If you touched a generator, run the generator tests.
- If you touched the data layer, keep direct Convex imports in the provider/backend
  boundary and direct anonymous-storage access in `lib/data/identity.ts`.
- Run `npm run typecheck` before declaring done.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
