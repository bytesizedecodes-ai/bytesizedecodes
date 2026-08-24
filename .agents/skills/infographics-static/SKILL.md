---
name: infographics-static
description: The STATIC (motionless) reference for building ByteSizedCodes infographic lessons — layout, content, brand tokens, and the text-contrast rule. NOT the default for new work — use this only when explicitly building a motionless infographic, auditing contrast/layout in isolation, or reading the layout-gallery and brand-system references. The DEFAULT skill for creating new lessons and course pages is `infographics-animation` (which incorporates everything here plus the motion system). Triggers on: static infographic, motionless lesson, layout gallery, brand system, text-contrast audit, "build without motion".
---

# infographics-static

> **This is the static (motionless) reference.** The default skill for building
> new lessons is now **`infographics-animation`** — it layers scroll-reveal
> motion on top of everything documented here and is what every live lesson in
> the project uses today. Reach for this skill only when you specifically need a
> motionless build or want to read the layout/content/brand references in
> isolation.

Turn source material into responsive, on-brand infographic lessons for the
ByteSizedCodes course system. Each lesson is a "byte" — an infographic plus
prose, an optional code exercise, and self-check questions — that fits the
product's Hook loop (Action → Reward → Investment).

This skill captures the workflow used to build the existing ML lessons so every
new infographic is consistent, faithful to its source, and fast to produce.

**The layout, content, brand-system, and text-contrast rules below are inherited
in full by `infographics-animation`.** This skill exists to keep those concerns
documented independent of motion.

## Core principles

These come before any layout or styling decision. Violating them produces a
pretty graphic that teaches the wrong thing.

1. **Preserve source data faithfully.** Do not simplify, editorialise, or invent
   to fit a layout. If the source says "approximately 73%", the infographic says
   "approximately 73%" — not "~70%" or "most". If a layout can't hold the
   detail faithfully, pick a different layout or split the content into two
   lessons. The visual serves the data, never the other way around.

2. **Define learning objectives before structuring content.** Before choosing a
   layout, write down: "After this lesson, the learner should be able to ___."
   One sentence, active verb (explain, distinguish, compute, identify). The
   objective drives every subsequent choice — which facts stay, which are
   secondary, what the assessment question should test. No objective = no build.

3. **Structure for visual communication.** Information becomes a visual through
   three layers, in order:
   - **Headlines** — the one thing the eye lands on first. Each section needs a
     headline that conveys its point even if the reader reads nothing else.
   - **Labels** — every visual element (axis, node, region, arrow) is labelled.
     Unlabelled visuals force guessing; in a teaching context that's a failure.
   - **Visual elements** — the shapes, colours, and spatial arrangement that
     express the relationship between the labelled things. This is the *last*
     layer, chosen to fit the labels, not the first.

## When to use

- A user gives you a PowerPoint, PDF, document, or raw concept and wants it
  turned into web infographic content.
- A user asks to "add a lesson" or "create a course byte".
- A user wants a visual explanation, comparison, diagram, or data visual built
  in the project's brand style, or wants help picking a layout.

## The 6-step workflow

Follow in order. The middle steps exist specifically to prevent jumping to code
before the content is understood. Load each reference as you reach it.

### Step 1 — Analyze content
- **PowerPoint (.pptx):** it's a ZIP. `unzip -o file.pptx -d /tmp/x`, then read
  `ppt/slides/slideN.xml` for text and `ppt/slides/_rels/slideN.xml.rels` for
  the image each slide uses. Speaker notes live in `ppt/notesSlides/`. If text
  is baked into images, use `mcp__4_5v_mcp__analyze_image` against the
  CDN-uploaded image URL (the `Read` tool uploads local images to CDN — re-read
  the PNG to get a URL, then analyze it).
- **Documents/markdown:** read directly.
- **Raw concepts/data:** ask the user for the key points if ambiguous.
- **Output of this step:** a list of the source's actual claims, facts, and
  relationships — transcribed faithfully, not interpreted.

### Step 2 — Generate structured content
For each distinct idea in the source, produce:
- The **learning objective** (one sentence: "After this, the learner can ___").
- The **headline** (the one-line takeaway).
- The **labels and facts** that must appear (verbatim numbers, defined terms).
- The **relationship shape** between them (sequence, contrast, containment,
  overlap, cycle, hierarchy — see the chooser in `references/layout-gallery.md`).

Do not pick a visual yet. This step is pure content/structure.

### Step 3 — Recommend combinations
Match each idea's relationship shape to a layout from
`references/layout-gallery.md` (20 patterns). For each, state:
- The chosen layout and *why* it fits the shape.
- 1-2 alternatives that would also work, with the trade-off.
- Whether one slide should become one infographic or be split.

If multiple ideas are weakly related, recommend a **bento-grid** (the default)
or split into separate lessons.

### Step 4 — Confirm options
Present the recommendation to the user before building. Use `AskUserQuestion`
if there's a real choice (which layout, split vs merge, which lesson goes
first). Do not proceed to code on assumption when the user's intent could
reasonably differ — a wrong layout means a full rebuild.

### Step 5 — Generate the spec
Once confirmed, write the per-lesson spec that step 6 implements:
- Layout name + the primitives it uses.
- Each section: headline, labels, content (faithful to source).
- The brand tokens to apply (from `references/brand-system.md`).
- The "byte" payload: prose paragraphs, MCQ questions (with explanations that
  name each distractor's misconception), and optional code exercise.

### Step 6 — Generate the component
Follow `references/workflow-checklist.md` exactly:
1. Create `components/infographic/<PascalName>.tsx` from
   `assets/lesson-template.tsx`.
2. Register in `components/infographic/index.tsx`.
3. Add the lesson entry to `content/courses/` with prose/questions/exercise.
4. Verify: `npm run typecheck`, route resolves, (optional) PNG render.

## The layout gallery

`references/layout-gallery.md` documents 20 patterns: linear-progression,
binary-comparison, comparison-matrix, hierarchical-layers, tree-branching,
hub-spoke, structural-breakdown, bento-grid (default), iceberg, bridge, funnel,
isometric-map, dashboard, periodic-table, comic-strip, story-mountain, jigsaw,
venn-diagram, winding-roadmap, circular-flow, dense-modules. Read it before
step 3 — each entry has a sketch, build guidance mapped to our primitives, and
a "best for" so you can match shape to content.

## Content rules (the "byte" payload)

A lesson isn't just a picture. Each entry in `content/courses/` should have:
- **`prose`**: 2-4 short paragraphs (~100-200 words total). Plain strings, no
  markdown. One idea per paragraph. Faithful to source.
- **`questions`**: 2-3 MCQs. Each wrong answer must teach something — the
  `explanation` field should say *why* the right answer is right and name the
  specific misconception behind each plausible distractor. (This mirrors the
  generator philosophy in `plans/historical/02-drill-generators.md`.)
- **`exercise`** (optional): a `CodeExercise` with `starterCode` + `testCode`.
  The `testCode` MUST set `ok = True` (and optionally `message`) on success —
  that's the contract `components/CodeCell.tsx` reads back. See the existing
  `what-is-machine-learning` lesson for a worked example.

## What NOT to do

- Don't pick a layout before defining the learning objective and content
  structure (steps 1-2). That's the failure mode this skill exists to prevent.
- Don't create standalone `.html` files for new course content — those are
  legacy, kept only for social-media PNG export. New lessons are React components.
- Don't invent new Tailwind tokens. If you need a colour, it must already exist
  in `app/globals.css` `@theme`.
- Don't use `text-brand`, `text-brand-deep`, `text-ink-soft`, or `text-ink-faint`
  for readable text (subtitles, captions, labels, arrows, operators). Text is
  `text-ink` on light surfaces and `text-canvas` on dark ones — black or white,
  never blue or grey. See the "Text contrast rule" in `references/brand-system.md`.
  Before finishing a component, grep it for those four classes and fix every hit.
- Don't use `Math.random()`, `Date.now()`, or `localStorage` inside an
  infographic component — they must be pure presentational React.
- Don't duplicate an existing lesson. Check `content/courses/` and
  `components/infographic/index.tsx` before building.
- Don't paraphrase source numbers or drop qualifiers to fit a layout. Faithful
  first, pretty second.

## References (read on demand)

- `references/brand-system.md` — exact tokens, design language, responsive rules
- `references/layout-gallery.md` — the 20 layout patterns with sketches + build guidance
- `references/workflow-checklist.md` — the precise file-touch sequence + verify commands
- `assets/lesson-template.tsx` — copy-paste starting point for a new component
