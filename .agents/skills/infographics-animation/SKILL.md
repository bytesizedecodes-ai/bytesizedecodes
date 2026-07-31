---
name: infographics-animation
description: THE DEFAULT skill for building and creating ByteSizedCodes infographic lessons and new course pages. Covers the full workflow — turn source material (PowerPoint, PDF, document, concept) into responsive on-brand lessons, plus the scroll-triggered motion system that makes them unfold: scenes fade in on scroll, and signature formulas build piece-by-piece. Use whenever the user wants to create an infographic, add a course lesson, design a visual explanation, animate infographics, add entrance/reveal effects, or build a new course page. Triggers on: build infographic, create lesson, add course, new course page, animate infographics, scroll reveal, stagger entrance, "make the scenes animate", infographic storytelling. Read motion-tokens + reveal-patterns before generating markup, and the layout/brand/contrast references in infographics-static for non-motion concerns.
---

# infographics-animation

The **default** skill for building ByteSizedCodes infographic lessons and new
course pages. It is the motion system *and* the full build workflow — every
live lesson in the project uses motion, so this is the skill you reach for to
create new content.

It composes two concerns:

- **What a lesson looks like** — layout, content, brand tokens, the
  text-contrast rule. Documented in the `infographics-static` skill (its
  `references/brand-system.md`, `references/layout-gallery.md`,
  `references/workflow-checklist.md`). Read those for non-motion concerns;
  every rule there still applies in full.
- **How it moves** — the scroll-reveal and stagger system documented in this
  skill's own references. Motion is folded into the shared primitives
  (`Card`, `Scene`, `Infographic`) so new lessons inherit it automatically;
  signature beats (formula builds, transformations) get bespoke choreography.

The single goal: turn the deck's accumulating formulas and parallel scenes into
something that *unfolds* instead of appearing whole. The `Dataset + Algorithm +
Rules = Decision` formula is the signature case — it should visibly build, one
box at a time, as the reader scrolls to it.

## Core principles

These come before any animation choice. Violating them produces motion that
distracts or excludes.

1. **Motion is narrative, not decoration.** Every animation must serve the story.
   A formula building piece-by-piece teaches *sequence*; a reward pulse teaches
   *achievement*. A card that wobbles on hover teaches nothing. If you can't state
   the narrative purpose in one sentence, cut the animation.

2. **Animate at the primitive layer, not per lesson.** Entrance motion belongs on
   `Scene`, `Card`, and the formula `Box`/`Operator` primitives — not hand-added to
   each of the 9+ lesson files. Annotate once in `primitives.tsx` and every lesson
   (plus every future skill-generated one) inherits motion for free. Per-lesson
   choreography is reserved for the 2-3 *signature* moments a lesson can't get from
   primitives alone (see `references/reveal-patterns.md`).

3. **The resting state is always fully legible.** Animate only `opacity` and
   `transform`. The element's final, non-animated state — its colours, contrast,
   font sizes — must be identical to the un-animated version. This means the
   text-contrast rule from `infographics-static/references/brand-system.md` still
   holds: text is `text-ink` or `text-canvas`, never blue or grey. Motion never
   excuses a low-contrast resting state.

4. **Reduced-motion is non-negotiable and handled in JS.** The existing CSS guard
   in `app/globals.css` clamps CSS `animation-*`/`transition-*` durations, but it
   does **not** reach JS-driven (Framer/Motion) animation. Therefore every motion
   subtree is wrapped in `<MotionConfig reducedMotion="user">`, which makes the
   `motion` library honour `prefers-reduced-motion: reduce` by jumping to the final
   state. No exceptions, no "just this once".

5. **Scroll-triggered, play once.** Entrance animations fire when an element enters
   the viewport (`whileInView` + `viewport={{ once: true }}`), never on page load
   (the reader hasn't scrolled yet) and never on every re-entry (re-playing on
   scroll-back is annoying). `once: true` is the default for all reveal motion.

## The dependency

Install the **`motion`** package — the React 19 / Next.js App Router successor to
`framer-motion`. Do **not** install `framer-motion` (legacy) for new work.

```bash
npm install motion
```

Import from the React entrypoint:

```ts
import { motion, MotionConfig } from "motion/react";
```

`motion` is fully compatible with the project's Next.js 16 / React 19 stack. Its
components are Client Components and require `"use client"` — see the boundary
rules below.

## The client-boundary rules (critical)

The infographic layer is, today, entirely Server Components: `page.tsx` (Server,
async, SSG) → `getInfographicComponent()` (static registry) → the lesson + the
shared `primitives.tsx`/`scenes.tsx` (all Server, no hooks). Motion must cross
that boundary cleanly. The rules:

1. **Put `"use client"` on the leaf motion primitives, not the registry.**
   `components/infographic/motion.tsx` (the file holding `Reveal`,
   `MotionProvider`) starts with `"use client"`. The lesson components and
   `index.tsx` registry stay Server Components and import from it freely — a
   Server Component may render a Client Component.
2. **One `MotionProvider` at the infographic root.** Wrap the `<Infographic>`
   tree once (inside the `<Infographic>` primitive) in `<MotionConfig
   reducedMotion="user">`. Do not scatter `MotionConfig` per scene.
3. **Never use a client-only API (`useEffect`, `useRef`, `useState`,
   `useReducedMotion`) outside a `"use client"` file.** If a lesson needs bespoke
   choreography that requires hooks, that lesson's file becomes a Client Component
   and gets `"use client"` at the top — but prefer primitive-level motion that
   needs no hooks in the lesson itself.

## The motion system in one screen

Read `references/motion-tokens.md` for the exact values; the shape is:

- **One easing curve**, deliberately matching the existing `animate-pop` utility
  (`cubic-bezier(0.2, 0.7, 0.3, 1)`) so motion feels of-a-piece with the legacy
  reward pop. No second curve without a reason.
- **One duration** for entrances (~260ms). Slower than the 220ms `animate-pop`
  because scroll-revealed scenes are larger and benefit from a touch more time.
- **One reveal variant** (`fadeUp`: `opacity 0→1`, `y 12px→0`), reused everywhere.
- **One stagger** between siblings (~120ms) — what makes a formula *build*.
- **One trigger**: `whileInView`, `once: true`, `viewport={{ margin: "-80px" }}`
  so elements nudge into view before firing.

## The 4-step workflow

### Step 1 — Decide the scope
Is this **universal motion** (applies to all scenes, edit only the primitives)
or a **signature moment** (one bespoke choreography in one lesson)? Default to
universal. Only escalate to signature when a specific narrative beat — a formula
building, a loop looping, a transformation happening — can't be conveyed by a
simple reveal.

### Step 2 — Read the references
- `references/motion-tokens.md` — the exact easing/duration/variant/stagger values.
- `references/reveal-patterns.md` — the `Reveal` wrapper, the `Card` transform
  conflict fix, the stagger recipe, the client-boundary playbook, and the
  signature-moment patterns.

### Step 3 — Apply motion
For universal motion: copy `assets/motion-primitives-template.tsx` into
`components/infographic/motion.tsx`, then wire `Reveal` into `Scene`/`Card`/the
formula `Box` in `primitives.tsx` per the template. All 9 lessons animate; no
lesson file changes. For signature motion: add a `"use client"` + a small motion
block to that one lesson, following a pattern from `reveal-patterns.md`.

### Step 4 — Verify
1. `npm run typecheck` — must pass (the `"use client"` boundary compiles cleanly).
2. Load a lesson route in the browser and scroll — scenes should reveal once,
   formula boxes should stagger, nothing should re-fire on scroll-back.
3. Open DevTools → Rendering → "Emulate CSS media prefers-reduced-motion: reduce".
   **All motion must collapse to instant.** If anything still animates, the
   `MotionConfig` wrapper is missing or misplaced — that is a bug, not a polish
   item.
4. Confirm the resting state is pixel-identical to the pre-motion version (motion
   changed only how elements *arrive*, not how they *look* at rest).

## What NOT to do

- **Don't install `framer-motion`** for new work. Use `motion`. (`framer-motion`
  still works but is the legacy name; mixing both is confusing.)
- **Don't add `"use client"` to lesson components or `index.tsx`** for universal
  motion. The directive belongs on the motion-primitives leaf file. Escalate a
  lesson to Client only when it needs bespoke hook-driven choreography.
- **Don't animate properties other than `opacity` and `transform`.** Animating
  `width`, `height`, `color`, or layout properties causes reflow, jank, and
  resting-state drift. The resting state must be the plain Tailwind styles.
- **Don't ship motion without `MotionConfig reducedMotion="user"`.** The CSS guard
  in `globals.css` does not reach JS-driven animation — this wrapper is the only
  thing that makes Framer/Motion respect reduced-motion. Skipping it is an
  accessibility regression.
- **Don't re-fire entrances on scroll-back.** Always `viewport={{ once: true }}`.
  Re-playing is the fastest way to make motion feel hostile.
- **Don't introduce a second easing curve or duration without a stated reason.**
  The whole system reads as one motion language because it uses one. A new curve
  is a design decision worth confirming with the user.
- **Don't let motion excuse a low-contrast resting state.** The text-contrast rule
  from `infographics-static` still applies in full — text is black or white, never
  blue or grey. Motion is layered *on top of* a legible design, not in place of it.
- **Don't hand-animate every lesson.** If you're reaching for per-lesson motion
  code and it isn't a signature narrative beat, you've missed the primitive layer.

## References (read on demand)

- `references/motion-tokens.md` — the exact easing, duration, variant, and stagger
  values, with the rationale for each.
- `references/reveal-patterns.md` — the `Reveal` wrapper, stagger recipe,
  `Card`-transform-conflict fix, client-boundary playbook, and signature-moment
  choreography patterns.
- `assets/motion-primitives-template.tsx` — copy-paste starting point for the
  motion-enabled `Reveal` + `MotionProvider` leaf file.
- `../infographics-static/SKILL.md` and its `references/brand-system.md`,
  `references/layout-gallery.md`, `references/workflow-checklist.md` — the
  static reference. Read those for layout, content, brand tokens, and the
  text-contrast rule; this skill assumes the lesson follows that standard and
  adds motion on top.
