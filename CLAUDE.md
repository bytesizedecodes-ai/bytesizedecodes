# CLAUDE.md

Guide for AI agents working on this repo. Read before editing.

## What this is

**bytesizedecodes** — “Learn AI visually. Practise it. Build something real.” A
goal-based AI learning platform for curious beginners, students and graduates,
working professionals, and aspiring founders.

The current prototype uses **Convex Auth** (social OAuth: Google live; GitHub
ready when env is set) behind the `DataLayer` seam. Free courses are public/SEO-
readable without login; progress, streaks, and the personal loop require a
signed-in identity. **No email OTP / Resend.** Opt-in project gallery is
available; full social features are not.
`lib/data/local.ts` is the retained legacy adapter, not the active provider.

## Docs for agents (read these)

| Doc | Why |
| --- | --- |
| [`docs/overview.md`](docs/overview.md) | Product, audience, what is / isn’t shipped |
| [`docs/architecture.md`](docs/architecture.md) | Stack, folders, request flow |
| [`docs/data-layer.md`](docs/data-layer.md) | DataLayer seam, identity, practice vs review |
| [`docs/content-model.md`](docs/content-model.md) | Bytes, courses, tracks, skills, catalog |
| [`docs/engagement-and-retention.md`](docs/engagement-and-retention.md) | Habit-formation: what's built vs missing, leaderboard decision, pre-launch checklist |
| [`docs/monetization-and-subscription.md`](docs/monetization-and-subscription.md) | Free read → free social account → Pro; Plans/leads |
| [`docs/admin-and-feedback.md`](docs/admin-and-feedback.md) | /admin console, admin role + requireAdmin guard, feedback loop, email scheduling plan |
| [`docs/conventions.md`](docs/conventions.md) | Hard engineering rules |
| [`docs/release.md`](docs/release.md) | `dev` → `main` promote, CI, Netlify, Convex |
| [`docs/README.md`](docs/README.md) | Index of agent docs |

## Product plans (not codebase truth)

Whenever you create or update product plans, roadmaps, audits, or phased
delivery docs, put them under [`plans/`](plans/) (not `docs/`). Keep `docs/` for
agent-facing project understanding only.

Planning lives under [`plans/`](plans/), separated by planning phase:

| Phase | Path |
| --- | --- |
| Historical (frontend-first) | [`plans/historical/`](plans/historical/) |
| Coherent V1 (current direction) | [`plans/coherent-v1/`](plans/coherent-v1/) |
| Coherent V1 delivery phases | [`plans/coherent-v1/phases/`](plans/coherent-v1/phases/) |

Start with [`plans/coherent-v1/README.md`](plans/coherent-v1/README.md) when you
need roadmap context.

## Commands

Prerequisites: `npm install`, and a `.env.local` containing
`CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` (pointing at a dev
deployment created via `npx convex dev`). OAuth setup and flags for Google/GitHub
are documented in [`.env.example`](.env.example).

### Run the app locally (two terminals)

The frontend and backend are separate processes. **Start Convex first**, then
Next.js. Both watch for changes.

```bash
# Terminal 1 — Convex dev backend (live-syncs convex/ to the dev deployment)
npx convex dev

# Terminal 2 — Next.js dev server → http://localhost:3000
npm run dev
```

Notes:
- `npx convex dev` takes no flags when a deployment is already configured —
  `--configure` only accepts `new`/`existing`, and `--configure=never` will
  error. Run `npx convex dev` bare.
- `npm run dev` alone will boot Next.js but the app will have no working
  backend (queries hang) until Convex is running.
- If `CONVEX_DEPLOYMENT` is unset, `npx convex dev` will offer to provision a
  cloud dev deployment and write `.env.local` for you.

### Other

```bash
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
   `lib/data/provider.tsx` is the active Convex adapter. Product identity is Convex
   Auth (social OAuth). `lib/data/identity.ts` is **legacy** browser UUID only.

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

11. **Use the `infographics-interactive_v6` skill when creating or editing courses.**
    Any new lesson, course page, or infographic **must** be built with
    `infographics-interactive_v6`
    (`.agents/skills/infographics-interactive_v6/SKILL.md`) — read it first.
    It is the **latest** course-authoring skill — a superset of
    `infographics-interactive_v5` (explanation-first, retained),
    `infographics-interactive_v4` (predict-first, retained),
    `infographics-interactive` (v3.1, retained), and `infographics-animation`
    (v2, retained). **v6 is anchor-first and plain-English:** every lesson
    opens with an **anchor-led Concept Brief** on the lesson object
    (`concept`: `anchor` — a one-sentence everyday metaphor, something a
    10-year-old touches, FIRST — then What / Why / Where 2–3 applications /
    When NOT to use; 1–2 sharp sentences each, key terms in `**bold**`).
    **A lesson never opens with a quiz** — no prediction cards, no
    application cards. Below the lesson's **story infographic** (bespoke
    scenes, unchanged aesthetic), a lesson may add a **standardized system
    diagram** as plain data (`diagram`: Input-Process-Output flowchart /
    side-by-side comparison grid / decision tree) rendered by
    `components/LessonDiagram.tsx` from the shared primitives in
    `components/infographic/flow.tsx` — the diagram **formalizes the idea, it
    must never re-tell the story**. Every lesson closes with **exactly 2
    self-check MCQs, both real-life scenario questions** (concrete
    actors/systems, never "What is X?" recall); the second transfers the idea
    to a new situation. **Continuous interactive playgrounds (v6):** when a
    lesson earns a control and the concept has a tunable knob or toggleable
    state, build it as a *continuous* playground — slider/toggle with the
    consequence rendering live while dragging — from the shared primitives in
    `components/infographic/controls.tsx` (`SliderControl`, `ToggleGroup`);
    presets are chips, never the whole control. **Plain-English gate (v6):**
    in beginner/intermediate courses, the first use of every listed jargon
    term carries a same-sentence parenthetical translation
    ("hyperparameters (the tuning dials set before training)") — enforced by
    `content/jargon.test.ts` against the curated list in
    `content/jargon-terms.ts`; expert courses are exempt. **Cheat-sheet
    (v6):** every lesson auto-derives a shareable card (anchor + What + When
    NOT + site URL) rendered after the MCQs by
    `components/LessonCheatSheet.tsx`, downloadable as a PNG from
    `/courses/{course}/{lesson}/cheat-sheet`, and doubles as the lesson's OG
    image — derive, never author it. v6 inherits v4/v5's evidence-based,
    audience-aware, story-fused core: it calibrates *how* you tell the story
    to the course's `level` — **beginner** (layman: picture-led, analogies,
    full narrative, no math), **intermediate** (enthusiast: lighter
    analogies, some code/formulas), or **expert** (practitioner: formal,
    problem-first, minimal scaffolding — the anchor stays but turns terse) —
    gives each level its **own named storytelling framework** (§1.1), adds an
    **interactivity layer** (§6) so learners *do*, not just watch (Chi's
    ICAP; aim for ≥1 *Constructive* beat per lesson), and requires **visual
    interactive storytelling** (§1.3): one through-line picture (the anchor
    dramatized), interaction on a mapped beat (not a bolted-on widget),
    BEFORE→ACT→AFTER as a story turn. Read the `level` from
    `content/courses.ts` before authoring — what helps a beginner *harms* an
    expert (the expertise reversal effect). Always build with the shared
    scene vocabulary (`CarShape`, `BikeShape`, `PictureCard`, `Operator`,
    `Scene`) and inherited motion (`Stagger`/`MotionChild`/`Reveal`).
    **Color discipline is mandatory:** one accent per scene, neutrals carry
    the load, no rainbow palettes (cognitive overload), theme-safe tokens
    only (`bg-surface-elevated` not `bg-white`; `text-canvas` not
    `text-white`; `currentColor`/`var(--*)` in SVG, never literal hex).
    Lessons must read in both dark and light themes.
   A lesson that "works" but explains via a table instead of pictures, uses
   4+ colors in one scene, or is an animated glossary with an unrelated
   widget, is a bug. The completeness contract lives in
   `content/courses.test.ts`: every lesson requires a well-formed
   anchor-led `concept` and **exactly 2 scenario MCQs** (prompts ≥ 40
   chars); optional `diagram` and `exercise` are validated when present;
   `content/jargon.test.ts` enforces the plain-English gate.

    - **Layman-First Rule (now the v6 anchor, all levels):** every concept
      brief MUST open with a physical real-world metaphor (e.g., *tuning a
      guitar*, *sorting mail*, *tasting soup*) before showing diagrams or
      math — playful for beginners, terse for experts. Never use raw AI
      terms (*loss, weights, embeddings, hyperparameters*) in
      beginner/intermediate lessons without their plain-English translation
      in parentheses at first use.

## Where things live

| Area | Path | Notes |
| --- | --- | --- |
| Agent docs | `docs/` | Overview, architecture, data layer, content, conventions |
| Product plans | `plans/` | Historical + Coherent V1 strategy and delivery phases |
| App routes | `app/` | Server components by default; `"use client"` only where needed |
| React data hooks | `lib/data/provider.tsx` | Active Convex-backed provider |
| Data mutation contract | `lib/data/contract.ts` | Spec for the mutation surface |
| Convex backend | `convex/` | Schema, queries, mutations, auth, admin, inquiries |
| Auth (social) | `convex/auth.ts`, `lib/authProviders.ts` | Google + optional GitHub; UI flags |
| Legacy browser UUID | `lib/data/identity.ts` | Not product login |
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
  (in `app/bytes/[slug]/page.tsx`) and the shared `Inline` component
  (`components/Inline.tsx`) — used by `BlockList` (drills), `LessonBody` (course
  lesson prose), and `ConceptBrief` (the v5 lesson opener), so one highlight
  syntax works everywhere.
- **Tailwind v4** with `@theme` tokens in `app/globals.css`:
  `canvas, dot, ash, ink, ink-soft, ink-faint, brand, brand-deep, brand-wash,
  good, good-wash, bad, bad-wash, gold`. Custom `@utility card` and `animate-pop`.
  Respect `prefers-reduced-motion`.
- **Byte authored questions are MCQ-only** with `answer: string` (a choice id).
- **`PersistedStateV1` is the export/import and legacy-local shape.** Update import
  handling deliberately when it changes.
- **Don't add `any`.** Use `Doc<>` / `Id<>` patterns and branded types where they exist.
- **Payment & external links:** store all public payment links (PayPal,
  Razorpay, Lemon Squeezy) and lead form destinations in
  `content/plans.ts` or `lib/site.ts` — never hardcoded directly in JSX
  components.

## When you make a change

- If you touched a generator, run the generator tests.
- If you touched the data layer, keep direct Convex imports in the provider/backend
  boundary; do not trust client-supplied userIds.
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
