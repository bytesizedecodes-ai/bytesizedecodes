# Rework ALL courses to v5 + skill/test/docs updates

Repo state: 65 lessons in 5 courses. ML for Layman (19) is already v5 (brief + diagrams, no prediction/application). Remaining 46 lessons — `machine-learning` (4, intermediate), `ai-observability` (~14, beginner), `llm-observability` (~14, intermediate, holds most of the 5 exercises), `ai-observability-reliability` (~14, expert) — all still v4-style: every one has a `prediction`, an `application`, and **3 questions**.

## Part 1 — Update the v5 skill (authoring contract)

`.agents/skills/infographics-interactive_v5/`:
1. **SKILL.md §0**: lesson order becomes `header → CONCEPT BRIEF → story infographic → SYSTEM DIAGRAM → prose → 2 scenario MCQs`. Remove the "optional prediction" and "legacy application" lines — v5 lessons have **no prediction card and no application card**; the real-world transfer lives *inside* the two questions.
2. **New MCQ rule (in §0 or the workflow)**: **exactly 2 self-check MCQs per lesson**, both **real-life scenario-based** — a concrete situation with named actors/systems ("Your chatbot's p95 latency doubled after a prompt change…", "A store groups shoppers with no labels…") rather than abstract recall ("What is X?"). Explanations must resolve the scenario, name the misconception, and stay >20 chars. Keep existing diagnostic-distractor discipline.
3. **`references/lesson-contract.md`**: transfer section rewritten — transfer is embedded in the 2nd scenario MCQ; no application card. Quality tests updated to "exactly 2 scenario MCQs".
4. **"What NOT to do"**: add "Don't ship 3+ MCQs or definition-style prompts; two scenario questions close every lesson."

## Part 2 — Mechanical removals (scripted, all 46 lessons)

Python script over `content/courses.ts`, scoped to every course except `machine-learning-for-layman`:
- Remove all 46 `prediction: { … },` blocks
- Remove all 46 `application: { … },` blocks
Then hand-verify counts (46/46) and re-run for strays.

## Part 3 — Per-lesson authoring (the bulk, 46 lessons)

For each lesson in the 4 courses, by hand via edits:
1. **Add `concept`** — What / Why / Where (2–3 specific applications) / When NOT, 1–2 sharp sentences, key terms `**bold**`. Calibration per course level (expert course gets production-grade Where/When-NOT, e.g. SLOs, PII contracts, region rollouts).
2. **Trim questions 3 → exactly 2**, rewritten to real-life scenario form: keep the strongest existing question if already scenario-based, convert abstract ones into concrete situations. Renumber ids to q1/q2.
3. **Bold key terms in prose** (light touch, 1–3 per paragraph).
4. **Add `diagram` where the subject clearly fits** the standardized formats — traces/pipelines → `flow`, trade-off lessons → `compare`, choice/workflow lessons → `decision`. Skip where it would duplicate the story 1:1 (per skill §4.5). Expect roughly half the lessons to get one.
5. Keep `exercise` blocks (5 total) untouched.

**ML for Layman (19 lessons)**: audit the existing q1/q2 pairs; rewrite any abstract-recall prompt ("What makes an experience useful for learning?") into real-life scenario form. Concepts/diagrams already done.

## Part 4 — Code cleanup (dead code after removal)

- `content/courses.ts`: drop `prediction?` and `application?` from the `Lesson` type (no remaining data); drop now-unused `ByteQuestion`/related imports if applicable.
- `app/courses/[course]/[lesson]/page.tsx`: remove PredictionCard + ApplicationCase imports and render blocks (concept/diagram/prose/questions stay).
- Delete `components/PredictionCard.tsx` and `components/ApplicationCase.tsx` (used only by this page — verified by grep).
- **Keep** `lib/useChoiceKeys.ts` (still used by ByteBody, DrillPlayer, AuthoredReviewPlayer).

## Part 5 — Test contract (`content/courses.test.ts`)

- Every lesson (all courses are v5 now): **`concept` required** and well-formed (4 fields, where ≥ 2) — drop the V5_COURSES allowlist, or invert it to a legacy list kept empty.
- **`questions.length === 2`** exactly.
- Light scenario heuristic: each prompt ≥ ~40 chars (scenario questions can't be one-liners) — soft-fail with a clear message.
- Remove `prediction` from the question-quality loop and drop the application check entirely.
- Update the doc comment: "brief → visual → prose → 2 scenario checks".

## Part 6 — Docs

- `docs/content-model.md`: anatomy table loses the prediction and application rows; questions row → "exactly 2 real-life scenario MCQs"; contract sentence updated.
- `CLAUDE.md` rule 11: update the contract line (all courses are v5: concept required, exactly 2 scenario MCQs, no prediction/application) and remove the "legacy prediction" phrasing.
- `docs/conventions.md` courses section: drop "optional legacy prediction" mention, add the 2-scenario-MCQ rule.

## Part 7 — Verification

- `npm run typecheck` + `npm test` green.
- Scripted audit: 0 predictions, 0 applications, 65 concepts, 65 lessons × exactly 2 questions across `COURSES`.
- Visual spot-check on the dev server: one lesson per reworked course (brief at top, no prediction/application, 2 questions) in light + dark mode.