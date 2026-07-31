# Content model

Authored learning content lives in version-controlled TypeScript under
`content/`, not in Convex (learner state does).

## Main modules

| Module | Purpose |
| --- | --- |
| `content/types.ts` | Shared content types (`Block`, questions, etc.) |
| `content/bytes/` | Standalone short lessons |
| `content/courses.ts` | Course definitions and lesson sequences |
| `content/tracks.ts` | Goal-oriented learning tracks |
| `content/skills.ts` | Stable skill IDs and capability copy |
| `content/catalog.ts` | Unified Learn catalog surface |
| `content/review.ts` | Authored review item helpers |
| `content/index.ts` | Public content exports |

## Blocks

Lessons use typed `Block[]` (`text` / `code` / `table` / `note`), not markdown
files. Inline mini-markdown (`**bold**`, `` `code` ``) is rendered by
`formatInline` / `Inline` in byte/course UI.

## Questions

Byte-authored questions are MCQ-only with `answer: string` (a choice id).

## Generators

Procedural drills live in `lib/drills/`. They are pure `(seed, difficulty)`
functions with diagnostic distractors (`misconception` > 20 chars). See
[`conventions.md`](./conventions.md) and historical generator philosophy in
[`../plans/historical/02-drill-generators.md`](../plans/historical/02-drill-generators.md).

## Learn vs Today

- **Learn** (`/learn`): catalog of courses/bytes/skills
- **Today** (`/today`): personalized daily plan from Convex
  (`convex/lib/dailyPlan.ts` + `getDailyPlan`)
- **Progress / Profile**: mastery, review status, onboarding preferences

## Export shape

`PersistedStateV1` is the export/import and legacy-local shape. Change import
handling deliberately when it evolves.
