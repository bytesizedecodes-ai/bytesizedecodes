# Changelog

A precise log of code changes. Newest first. One entry per logical change; group
related edits. See `CLAUDE.md` for the rules that govern edits here.

## 2026-08-23 (AI Security trilogy — 3 new courses, 28 lessons, new Cybersecurity domain)

### Added
- New level-tiered course trilogy in `content/courses.ts` under the
  previously-empty **Cybersecurity** domain (first courses there), following
  the `-foundations | -in-practice | -at-scale` precedent, authored with the
  level-specific v1 skills per `plans/coherent-v1/11-ai-security-track.md`:
  1. **AI Security Foundations** (`ai-security-foundations`, beginner, free,
     10 lessons × 4–5 min, 48 min) — Anchored Story-Mountain; everyday
     anchors (new doors on a shop, the waiter obeying slipped notes, the
     master-key intern, the too-careful airport); 3-choice scenario MCQs;
     full jargon gate; no code; scope split vs `ai-observability-reliability`
     (which keeps detect+govern via telemetry).
  2. **AI Security in Practice** (`ai-security-in-practice`, intermediate,
     **paid**, 10 lessons × 7–10 min incl. capstone, 74 min) — PIC +
     First-Principles Ladders on the running case **PaisaShield** (fintech
     chat assistant with refund power); 3 runnable Pyodide exercises
     (injection scorer, PII redactor, allow-list gate evaluator — all
     verified against their hidden tests); 4-choice MCQs with Q2 re-deriving
     a rung.
  3. **AI Security at Scale** (`ai-security-at-scale`, expert, **paid**,
     8 lessons × 10–15 min incl. capstone, 87 min) — Problem-First Diagnostic
     (CER) with mandatory Boundary beats on the production case **Setu**
     (national citizen-services agent federation); adversarial robustness,
     multi-agent identity propagation, AI incident command, design-review
     delta gates, obligations→living-artifacts (EU AI Act / NIST AI RMF
     classes), continuous red-teaming by fix-rate, risk register governance.
- 28 new infographic components under `components/infographic/` (10 beginner,
  10 intermediate, 8 expert), registered in `index.tsx` under
  `// AI Security courses` comments.
- 23 new SkillIds in `content/types.ts` + definitions in `content/skills.ts`
  (9 foundations, 8 in-practice, 6 at-scale; reused existing
  `ai-red-teaming`, `eval-gates`, `eu-ai-act`, `nist-ai-rmf`,
  `ai-incident-response`).
- `NEXT_COURSE`: security F→P→S chain; `harness-engineering-at-scale` →
  `ai-security-foundations`; `ai-observability-reliability` now points to
  `ai-security-at-scale` (was `undefined`).

### Changed
- `convex/lib/dailyPlan.ts`: `AI_SECURITY_FOUNDATIONS_UNITS` (beginner+grad),
  `AI_SECURITY_PRACTICE_UNITS` (grad+engineer), `AI_SECURITY_AT_SCALE_UNITS`
  (engineer+founder) added to `TRACK_UNITS`.
- `content/catalog.ts`: trackPriority for the three security courses
  ([beginner, grad] / [grad, engineer] / [engineer, founder]).

## 2026-08-23 (LLM Fine-Tuning trilogy — 3 new courses, 42 lessons)

### Added
- New level-tiered course trilogy in `content/courses.ts`, following the
  RAG/Harness naming precedent (`-foundations | -in-practice | -at-scale`),
  authored with the level-specific v1 skills:
  1. **LLM Fine-Tuning Foundations** (`fine-tuning-foundations`, beginner,
     free, 16 lessons × ~5 min, 73 min total) — Anchored Story-Mountain;
     everyday anchors (chef orientation, fridge notes, clip-on lenses);
     3-choice scenario MCQs; full jargon gate; no code.
  2. **LLM Fine-Tuning in Practice** (`fine-tuning-in-practice`,
     intermediate, free, 14 lessons × 7–10 min incl. capstone, 101 min) —
     Predict–Investigate–Case + First-Principles Ladders on the running case
     **Sahayak** (WhatsApp pharmacy assistant); 5 runnable Pyodide exercises
     (chat-template render, loss-mask build, memory ledger, LoRA stack count,
     template diff); 2 continuous widgets (LR trace explorer, checkpoint
     picker); 4-choice MCQs where Q2 re-derives a rung.
  3. **LLM Fine-Tuning at Scale** (`fine-tuning-at-scale`, expert, **paid**,
     12 lessons × 10–15 min incl. capstone, 128 min) — Problem-First
     Diagnostic (CER) with mandatory Boundary beats on the production case
     **Varta** (privacy-first regional banking assistant); full formulas,
     failure modes, decision architecture; 2 exercises (preference margin
     audit, T4 budget planner); triage-tree widget. Capstone
     `free-gpu-capstone`: complete end-to-end QLoRA fine-tune of a small
     ungated Qwen instruct model on free Colab/Kaggle T4s — data → template →
     train → drawer-gated checkpoints → merge → GGUF → local Ollama serve.
- 42 new infographic components under `components/infographic/` (16 beginner,
  14 intermediate, 12 expert), all registered in `index.tsx` under
  `// LLM Fine-Tuning courses` comments.
- 22 new SkillIds in `content/types.ts` + definitions in `content/skills.ts`
  (8 foundations, 7 in-practice, 7 at-scale).
- Track plan doc `plans/coherent-v1/08-llm-fine-tuning-track.md`.

### Changed
- `convex/lib/dailyPlan.ts`: `FINE_TUNING_FOUNDATIONS_UNITS` (beginner+grad
  tracks), `FINE_TUNING_PRACTICE_UNITS` (grad+engineer),
  `FINE_TUNING_AT_SCALE_UNITS` (engineer+founder); minutes mirror the
  registry (coverage test enforced).
- `content/catalog.ts`: trackPriority for the three slugs (beginner+grad /
  grad+engineer / engineer+founder).
- `NEXT_COURSE`: foundations → in-practice → at-scale →
  `harness-engineering-foundations`; plus `rag-engineering-at-scale` →
  `fine-tuning-foundations`.
- `docs/content-model.md`: course-count copy refreshed.

## 2026-07-26 (Machine Learning for Layman course)

### Added
- New course **"Machine Learning for Layman"** built from `Lesson 1.pdf`,
  following the `infographics-custom` skill workflow (analyze → structure →
  recommend → confirm → spec → build). 5 lessons, each one concept from the
  deck, in a friendlier warm-accent style distinct from the technical ML course:
  1. `how-humans-learn` — How a human learns (hub-spoke)
  2. `humans-vs-machines` — Why a machine can't do that yet (binary-comparison, +exercise)
  3. `what-is-ml-layman` — What is ML, really? (linear-progression pipeline)
  4. `three-ml-paradigms` — The three families of ML (tree-branching)
  5. `supervised-learning-deep-dive` — Inside supervised learning (structural-breakdown, +exercise)
  Each lesson carries prose, 2-3 MCQs (with misconception-naming explanations),
  and the byte-chip + XP reward + completion-✓ wiring shared with the ML course.
- 5 new infographic components under `components/infographic/`:
  `HowHumansLearn`, `HumansVsMachines`, `WhatIsMLLayman`, `ThreeParadigms`,
  `SupervisedDeepDive`, all in the warm palette.
- New brand tokens in `app/globals.css`: `--color-warm`, `--color-warm-deep`,
  `--color-warm-wash` (#d49a6a / #b87a4a / #faf1e8) — a friendlier accent that
  coexists with the existing blue brand rather than replacing it.
- Warm tones (`warm`, `warmDeep`, `warmWash`) added to the `Card` primitive so
  the layman course reuses the same building blocks as the ML course.

### Changed
- Top-nav Courses dropdown now lists both courses (Machine Learning + ML for Layman).
- `content/courses.ts` registry: second course added; `courseLessonKey` helper
  unchanged so progress keys stay namespaced (`course:machine-learning-for-layman:<slug>`).

## 2026-07-26 (infographics skill v2 — core principles + layout gallery)

### Added
- `infographics-custom` skill: three **Core Principles** now lead the SKILL.md —
  (1) preserve source data faithfully, (2) define learning objectives before
  structuring content, (3) structure for visual communication
  (headlines → labels → visual elements, in that order).
- `references/layout-gallery.md`: 20 layout patterns (linear-progression,
  binary-comparison, comparison-matrix, hierarchical-layers, tree-branching,
  hub-spoke, structural-breakdown, bento-grid, iceberg, bridge, funnel,
  isometric-map, dashboard, periodic-table, comic-strip, story-mountain, jigsaw,
  venn-diagram, winding-roadmap, circular-flow, dense-modules). Each has a
  sketch, build guidance mapped to brand primitives, and a "best for". Includes
  a shape→layout chooser. bento-grid is the default when unsure.
- SKILL.md workflow rewritten as the explicit 6-step process: analyze →
  structure → recommend → confirm (with AskUserQuestion) → spec → build. The
  middle steps prevent jumping to code before content is understood.

### Changed
- `references/workflow-checklist.md`: now framed as steps 5-6 of the workflow;
  content rules strengthened with faithfulness + objective-testing requirements.

### Removed
- `references/archetypes.md` (the original 5-pattern file) — superseded by the
  20-pattern `layout-gallery.md`.

## 2026-07-26 (courses v3 — lessons become bytes + infographics skill)

### Added
- Course lessons are now full "bytes" per the product plan (§3.2): each lesson
  page renders infographic → prose → optional code exercise → self-check MCQs →
  XP reward on completion. Wired to the existing data layer via the `course:`
  namespace so it never collides with `/bytes` mastery.
  - `content/courses.ts`: `Lesson` type extended with `prose`, `exercise`,
    `questions`, `minutes`. All 4 ML lessons now carry real prose + 3 MCQs each;
    `what-is-machine-learning` also has a runnable Pyodide exercise.
  - `app/courses/[course]/[lesson]/page.tsx`: renders infographic + `LessonBody`
    + a "Byte · N min · +XP" chip + CoursePager.
  - `app/courses/[course]/[lesson]/LessonBody.tsx` (client): prose + ByteBody.
  - `app/courses/[course]/LessonStatus.tsx` (client): ✓ checkmark on completed
    lessons in the course landing list.
  - `content/courses.ts` exports `courseLessonKey(course, lesson)` →
    `course:<course>:<lesson>`, used as both the progress key and attempt prefix.
- `components/ByteBody.tsx`: the shared interactive byte body (questions, code
  cell, mark-complete, reward banner), extracted from `ByteRunner`. Takes
  `progressSlug` + `attemptPrefix` so both `/bytes` and `/courses` reuse it.
- `infographics-custom` project skill at `.agents/skills/infographics-custom/`:
  captures the analyze→design→build workflow for new infographic lessons.
  Includes `SKILL.md` + 3 references (brand-system, archetypes,
  workflow-checklist) + an `assets/lesson-template.tsx`. Fires on requests to
  turn decks/docs/concepts into infographic lessons.

### Changed
- `app/bytes/[slug]/ByteRunner.tsx`: now a thin wrapper around `ByteBody`.
  Behavior-preserving — byte progress still keyed by raw slug, attempt itemKeys
  still `byte:<slug>:<qid>`.
- Course landing (`/courses/[course]`): lesson list now shows completion ✓ marks.

### Fixed
- Nav bug: "Courses" was a toggle button with no destination (`/courses` 404'd).
  Now a real `<a href="/courses">` link to a new courses hub page; the dropdown
  remains as a hover/tap quick-jump with a "View all" entry.

## 2026-07-26 (courses v2)

### Added
- Course lesson viewer at `/courses/[course]/[lesson]` renders infographics as
  inline **responsive React components** (no iframe). Each infographic reflows
  for phones: comparisons stack to one column, pipelines go vertical, the
  neural-network and nested-circles diagrams scale via responsive SVG viewBox.
- New infographic components under `components/infographic/`: `WhatIsAI`,
  `WhatIsML` (now part of the course too), `WhatIsDeepLearning`, `AIVsMLVsDL`,
  plus shared `primitives.tsx` (Infographic, Card, BulletList, Tag) and an
  `index.tsx` slug→component registry.
- `content/courses.ts` registry: defines courses + ordered lessons. The ML course
  ships 4 lessons (AI → ML → DL → AI vs ML vs DL).
- `components/CoursePager.tsx`: prev/next arrow nav; last lesson shows a
  "Course complete → back to course" card.
- Dynamic course landing page `/courses/[course]`: numbered lesson list +
  "Start the course" button.

### Removed
- Standalone infographic HTML/PNG pipeline for course rendering: deleted the
  `/courses/[course]/[lesson]/raw` route handler and `components/InfographicFrame.tsx`
  (the iframe scaler). The original `.html`/`.png` files under `infographics/`
  are kept for social-media export, but are no longer used by the site.
- Static `/courses/machine-learning` page (superseded by the dynamic route).

### Changed
- Course ordering: ML course now starts with "What is AI?" and ends with
  "AI vs ML vs DL" (overview last, as a capstone).

## 2026-07-26

### Added
- Three infographics from the "AI vs ML vs Deep Learning" deck, in the ByteSized
  Decodes brand system (`infographics/`): `ai-vs-ml-vs-dl/` (nested AI⊃ML⊃DL overview,
  slides 1 & 3), `what-is-artificial-intelligence/` (intelligent vs non-intelligent
  machines, slide 2), `what-is-deep-learning/` (neural-network SVG, slide 5). Each
  has `infographic.html` + a 2400×3600 `infographic.png` render. "What is Machine
  Learning?" (slide 4) was skipped — it duplicates the existing
  `what-is-machine-learning/` infographic.
- Top nav: new "Courses" dropdown before "Today" containing "Machine Learning"
  (`components/Shell.tsx`, `components/NavDropdown.tsx`). Dropdown is a click-toggle
  client component (closes on outside click / Escape / item pick) so `Shell` stays
  server-compatible and works on touch.
- Route `/courses/machine-learning` with an intro page and links to Today / Bytes /
  Practice (`app/courses/machine-learning/page.tsx`).
- `CLAUDE.md` — agent guide capturing the DataLayer seam, purity rules for
  `lib/drills` / `lib/srs` / `lib/day`, generator conventions, and Phase-0 scope.
- `CHANGELOG.md` — this file. All subsequent code changes should be appended here.

### Changed
- `Shell` `active` prop type widened to `string` so it accepts course routes; the
  Courses trigger highlights when a course route is active.

### Context (current repo state, not new edits)
- Phase 0 frontend-only build of ByteSizedCodes (Next.js 16 + React 19 + Tailwind v4
  + Vitest). Persistence is `localStorage` behind the `DataLayer` seam in `lib/data/`.
- Implemented: G1 `tensor-shape`, G2 `confusion-matrix`, G4 `gradient-step`,
  G8 `head-and-loss` generators; pure SM-2 (`lib/srs.ts`); IST day keys (`lib/day.ts`);
  reactive local adapter with 80ms fake latency (`lib/data/local.ts`);
  routes `/`, `/today`, `/practice`, `/review`, `/settings`, `/bytes`, `/bytes/[slug]`;
  three Season 1 bytes (`precision-and-recall`, `gradient-descent`, `tensors-and-shapes`);
  lazy Pyodide `CodeCell`. See `plans/historical/03-phase-0-frontend-first.md` for exit criteria.
