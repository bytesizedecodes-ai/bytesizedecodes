# Content model

Authored learning content lives in version-controlled TypeScript under
`content/`, not in Convex (learner state does).

## Main modules

| Module | Purpose |
| --- | --- |
| `content/types.ts` | Shared content types (`Block`, questions, etc.) |
| `content/bytes/` | Standalone short lessons |
| `content/courses.ts` | Course definitions, lesson sequences, `access: "free" \| "paid"` |
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

Both current courses are free. Pricing truth for freemium lives in
[`monetization-and-subscription.md`](./monetization-and-subscription.md) and
[`content/plans.ts`](../content/plans.ts).

## Blocks

Lessons use typed `Block[]` (`text` / `code` / `table` / `note`), not markdown
files. Infographic / animated lessons follow the `infographics-animation` skill.
Inline mini-markdown (`**bold**`, `` `code` ``) is rendered by `formatInline` /
`Inline` in byte/course UI.

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
