# Content model

Authored learning content lives in version-controlled TypeScript under
`content/`, not in Convex (learner state does).

## Main modules

| Module | Purpose |
| --- | --- |
| `content/types.ts` | Shared content types (`Block`, questions, etc.) |
| `content/bytes/` | Standalone short lessons |
| `content/courses/` | Course definitions, lesson sequences, `access: "free" \| "paid"` |
| `content/tracks.ts` | Goal-oriented learning tracks + time modes |
| `content/skills.ts` | Stable skill IDs and capability copy |
| `content/catalog.ts` | Unified Learn catalog surface |
| `content/plans.ts` | Marketing tiers for `/plans` (not entitlements) |
| `content/review.ts` | Authored review item helpers |
| `content/index.ts` | Public content exports |

## Course access

- **`free`:** Full SSR content, public SEO, readable without sign-in. Progress
  saves only when signed in.
- **`paid`:** Soft-gated (sign-in prompt today; Stripe later). Badge and CTA
  reflect paid intent without fake prices.

Most courses are free; the expert tier (`advanced-machine-learning`,
`rag-engineering-at-scale`, `harness-engineering-at-scale`,
`ai-observability-reliability`, `fine-tuning-at-scale`,
`ai-security-at-scale`) plus the intermediate
`ai-security-in-practice` is paid. Pricing truth
for freemium lives in
[`monetization-and-subscription.md`](./monetization-and-subscription.md) and
[`content/plans.ts`](../content/plans.ts).

## Blocks

Lessons use typed `Block[]` (`text` / `code` / `table` / `note`), not markdown
files. Infographic / animated lessons follow the `infographics-interactive_v6`
skill. Inline mini-markdown (`**bold**`, `` `code` ``) is rendered by the
shared `Inline` component (`components/Inline.tsx`) in byte/course UI.

## Course lessons (v6 anatomy)

A `Lesson` in `content/courses/` renders on `/courses/[course]/[lesson]` in
this order — **anchor-first, never quiz-first**:

| # | Layer | Field | Notes |
| --- | --- | --- | --- |
| 1 | Concept brief | `concept` | The v6 opener: **`anchor`** (one-sentence everyday metaphor, something a 10-year-old touches — rendered FIRST), then What / Why / Where (2–3 applications) / When NOT to use — 1–2 sentences each, key terms `**bold**`. Rendered by `components/ConceptBrief.tsx`. Required on every lesson (enforced in `courses.test.ts`). |
| 2 | Story infographic | `slug` → component | Bespoke scenes registered in `components/infographic/index.tsx`; the heart of the course aesthetic. The anchor metaphor is the through-line where possible. |
| 3 | System diagram | `diagram` (optional) | Compact standardized reference **below** the infographic: `flow` (Input→Process→Output), `compare` (side-by-side grid), or `decision` (tree) — plain data rendered by `components/LessonDiagram.tsx` from `components/infographic/flow.tsx`. Bracket node patterns (`[ … ]`, `< … >`); must formalize, never re-narrate. |
| 4 | Prose | `prose` | 2–4 paragraphs; supports `**bold**` / `` `code` `` via `Inline`. |
| 5 | Exercise | `exercise` (optional) | Runnable Pyodide Python; gates completion. |
| 6 | Self-check questions | `questions` | **Exactly 2 real-life scenario MCQs** (concrete actors/systems, never "What is X?" recall); the second transfers the idea to a new situation; all correct to complete. |
| 7 | Cheat-sheet | derived | Shareable card (anchor + What + When NOT + site URL) rendered after the MCQs by `components/LessonCheatSheet.tsx` — Download PNG / Share on X / Share on LinkedIn / Copy link. The PNG lives at `/courses/{course}/{lesson}/cheat-sheet` (`lib/og.tsx` `renderCheatSheetImage`) and doubles as the lesson OG image. **Derived from `concept` — never separately authored.** |

There are **no prediction cards and no application cards** in v6 — lessons
open with the anchor-led brief and close at the two scenario questions plus
the derived cheat-sheet. The completeness contract
(`content/courses.test.ts`): every lesson requires a well-formed anchor-led
`concept`, `prose ≥ 2`, exactly 2 scenario questions (prompts ≥ 40 chars);
optional `diagram` and `exercise` are validated when present. The
**plain-English gate** (`content/jargon.test.ts`, list in
`content/jargon-terms.ts`) requires a same-sentence parenthetical gloss at
the first use of each listed jargon term in beginner/intermediate lessons
(expert courses exempt). Interactive lessons with a tunable knob or
toggleable state build **continuous playgrounds** (slider/toggle, live
consequence) from `components/infographic/controls.tsx`
(`SliderControl`/`ToggleGroup`). Author with the
`infographics-interactive_v6` skill (or its level-specific v1 splits —
`infographics-interactive-beginner_v1` / `-intermediate_v1` / `-expert_v1`,
picked by the course's `level`) — see rule 11 in
[`../CLAUDE.md`](../CLAUDE.md).

## Questions

Byte-authored questions are MCQ-only with `answer: string` (a choice id).

## Generators

Procedural drills live in `lib/drills/`. They are pure `(seed, difficulty)`
functions with diagnostic distractors (`misconception` > 20 chars). See
[`conventions.md`](./conventions.md) and historical generator philosophy in
[`../plans/historical/02-drill-generators.md`](../plans/historical/02-drill-generators.md).

## Learn vs Today vs Plans

- **Learn** (`/learn`): public catalog; Begin / progress CTAs require sign-in
- **Courses** (`/courses`): free course cards open; paid soft-gated
- **Today** (`/today`): personalized daily plan from Convex (signed-in + onboarded)
- **Plans** (`/plans`): freemium marketing matrix (not Stripe entitlements yet)
- **Progress / Profile**: mastery, review, onboarding preferences, export/delete

## Export shape

`PersistedStateV1` is the export/import and legacy-local shape. Change import
handling deliberately when it evolves.
