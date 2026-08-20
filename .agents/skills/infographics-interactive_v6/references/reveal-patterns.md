# Reveal patterns

The concrete recipes: the `Reveal` wrapper, the stagger group, the `Card`
transform conflict fix, the client-boundary playbook, and the signature-moment
choreography patterns. Read `motion-tokens.md` first — every value here comes from
the `MOTION` / `fadeUp` constants defined there.

## The `Reveal` wrapper (the workhorse)

One client component does ~90% of the work. It wraps any block and fades it up on
scroll-into-view, once.

```tsx
// components/infographic/motion.tsx
"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { MOTION, fadeUp } from "./motion-tokens"; // or inline, see below

/** Wraps any block; fades it up once when scrolled into view. */
export function Reveal({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "figure" | "li";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: MOTION.viewportMargin }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease }}
    >
      {children}
    </MotionTag>
  );
}
```

Wire it into the primitives so every lesson inherits motion with **zero per-lesson
edits**:

```tsx
// primitives.tsx — Scene becomes:
export function Scene({ caption, children, className = "" }) {
  return (
    <Reveal as="figure" className={`rounded-2xl border ... ${className}`}>
      {caption && <figcaption>...</figcaption>}
      {children}
    </Reveal>
  );
}
```

Because `Reveal` is a Client Component and `Scene` is (still) a Server Component,
`Scene` simply renders the client `Reveal` — the boundary crosses cleanly. **Do
not** add `"use client"` to `primitives.tsx`; only `motion.tsx` carries it.

## The `Card` transform conflict (and its fix)

The `Card` primitive applies a hand-drawn skew via inline style:

```tsx
style={{ transform: `rotate(${rotate}deg)` }}
```

Framer/Motion writes its own `transform` (from the `y` in `fadeUp`) to the same
element. If both fight over `style.transform`, one wins and the other is lost —
either the entrance doesn't move, or the skew vanishes on arrival.

**The fix:** let Motion own the transform, and fold the static `rotate` into the
variant's transform string. Motion composes transform properties, so express
`rotate` as a Motion value, not an inline style:

```tsx
// motion.tsx — a Card-aware reveal
export function RevealCard({
  children,
  className,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      className={className}
      // rotate lives IN the variant transform, not in style={{}}.
      variants={{
        hidden: { opacity: 0, y: MOTION.revealOffset, rotate },
        visible: { opacity: 1, y: 0, rotate },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: MOTION.viewportMargin }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}
```

The `rotate` is identical in `hidden` and `visible`, so the skew is present
throughout — only `opacity` and `y` actually animate. The resting state is
pixel-identical to the original `style={{ transform: rotate() }}` card. **This is
why the `fadeUp` variant in `motion-tokens.md` omits `scale`: scale would have to
be composed alongside `rotate + y`, and the simpler `opacity + y` keeps `rotate`
easy to fold in.**

## The stagger group (formulas and pipelines)

Stagger belongs on the **parent**. The parent carries `staggerChildren` in its
`visible` transition; each child carries the `fadeUp` variant and inherits the
parent's `initial`/`whileInView`.

```tsx
// The accumulating formula: Dataset + Algorithm = Rules
<motion.div
  variants={{ visible: { transition: { staggerChildren: MOTION.stagger } } }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: MOTION.viewportMargin }}
  className="flex ... "
>
  <motion.div variants={fadeUp} transition={{ duration: MOTION.duration, ease: MOTION.ease }}>
    <Box ... /> {/* Dataset */}
  </motion.div>
  <motion.div variants={fadeUp} transition={{ duration: MOTION.duration, ease: MOTION.ease }}>
    <Operator>+</Operator>
  </motion.div>
  <motion.div variants={fadeUp} transition={{ duration: MOTION.duration, ease: MOTION.ease }}>
    <Box ... /> {/* Algorithm */}
  </motion.div>
  {/* ... */}
</motion.div>
```

This is the signature effect — the formula *builds*, and the `+`/`=` operators
arrive between the boxes they connect, carrying the sequence. Stagger only groups
that are genuinely a sequence: formulas, pipelines, an ordered set of parallel
cards the eye should sweep. A 2×2 comparison grid reveals as one block — no
stagger.

For convenience, export a `Stagger` wrapper so lesson authors don't hand-write the
parent:

```tsx
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ visible: { transition: { staggerChildren: MOTION.stagger } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: MOTION.viewportMargin }}
    >
      {children}
    </motion.div>
  );
}
// Children must be <motion.* variants={fadeUp} ...> — see the template asset.
```

## The client-boundary playbook

The infographic layer today is all Server Components. Motion crosses the boundary
like this:

| File | Directive | Role |
|---|---|---|
| `components/infographic/motion.tsx` | `"use client"` (top of file) | Holds `Reveal`, `RevealCard`, `Stagger`, `MotionProvider`. The **only** motion leaf. |
| `components/infographic/primitives.tsx` | none (Server) | Imports `Reveal`/`RevealCard` from `motion.tsx`. Renders them. Stays Server. |
| `components/infographic/scenes.tsx` | none (Server) | May use `Reveal` for scene-level animation. Stays Server. |
| `components/infographic/<Lesson>.tsx` | none (Server) | Uses primitives; inherits motion. Stays Server for universal motion. |
| `components/infographic/index.tsx` | none (Server) | Registry. Untouched. |
| `app/courses/[course]/[lesson]/page.tsx` | none (Server, async) | Renders `<Infographic />`. Untouched. |

Rules:

1. **A Server Component may render a Client Component.** That's why `Scene`
   (Server) can return `<Reveal>` (Client) with no directive change. The boundary
   is one-way and clean.
2. **The `MotionProvider` wraps the root once.** Put `<MotionConfig
   reducedMotion="user">` inside the `<Infographic>` primitive so every lesson gets
   it without per-lesson wrapping.
3. **Escalate a lesson to Client only for bespoke choreography.** If a signature
   moment needs `useEffect`/`useRef`/`useAnimationFrame` (e.g. a looping particle
   flow), that lesson's file gets `"use client"` at the top. Universal motion
   never requires this.

## Signature-moment patterns

Most lessons need only the `Reveal`/`RevealCard`/`Stagger` primitives above. When
a specific narrative beat needs more, use one of these. Each is the *minimum*
choreography that conveys the beat — resist elaborating.

### Formula builds piece-by-piece
Already covered by `Stagger`. This is the default signature moment and needs no
extra code beyond wrapping the formula row in `<Stagger>`.

### Transformation (`???` → `CAR!`)
The child's confused state resolving into the answer. Two-state label swap with a
pop on the resolved state:

```tsx
<motion.span
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.2 }}
>
  It&apos;s a CAR! 🎉
</motion.span>
```
Delay the resolved state ~200ms after the surrounding scene reveals so the
"realization" reads as a beat, not a simultaneous arrival.

### The learning loop (reinforcement)
A cycle that should *feel* cyclical. Animate a dashed arc's `pathLength` from
0→1 on reveal, then (optionally) loop slowly to convey recurrence:

```tsx
<motion.path
  d="M70 110 Q100 130 130 110"
  stroke={BRAND_DEEP}
  strokeWidth={2}
  fill="none"
  strokeDasharray="4 3"
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  viewport={{ once: true }}
  transition={{ duration: MOTION.duration * 2, ease: MOTION.ease }}
/>
```
A continuous slow rotation can convey "this loops forever" — but guard it: under
reduced motion it must collapse (the `MotionConfig` wrapper handles this for
`whileInView`, but an `animate={{ ... }}` infinite loop needs an explicit reduced
motion check via `useReducedMotion()`).

### Data flow (neural net)
Particles travelling input→output along the connections. This is the heaviest
pattern and the one most likely to overcomplicate a lesson. Prefer the lighter
version: stagger-reveal each *layer* of nodes left-to-right with `Stagger`, which
reads as "data moves through the layers" without simulating particles. Reach for
actual moving particles only if the lighter version underwhelms, and keep them to
2-3 dots, not a swarm.

## Verification checklist (per the SKILL workflow)

- [ ] `npm run typecheck` passes (the `"use client"` boundary compiles).
- [ ] Scenes reveal once on scroll; formula boxes stagger; nothing re-fires on
      scroll-back (`once: true`).
- [ ] DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → **all**
      motion collapses to instant. If anything moves, `MotionProvider` is missing.
- [ ] Resting state is pixel-identical to the pre-motion design — only the
      *arrival* changed, not the look.
- [ ] No new easing curve or duration introduced without a commented reason.
- [ ] Text still follows the contrast rule (black/white, never blue/grey).
