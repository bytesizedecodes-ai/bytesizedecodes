# Motion tokens

The exact values every animated infographic must use. These are the "brand system
for motion" — parallel to `infographics-static/references/brand-system.md` for
colour. The whole point is that the entire infographic layer reads as *one* motion
language, so deviation is a design decision worth confirming with the user.

## Why these values

The project already has one motion convention: the `animate-pop` CSS utility in
`app/globals.css` — a 220ms, `cubic-bezier(0.2, 0.7, 0.3, 1)` one-shot
`translateY + scale + opacity` pop, used on the drill question card and the reward
banner. The motion tokens below are chosen to feel of-a-piece with that legacy pop,
not to introduce a competing motion language.

## The tokens

| Token | Value | Use |
|---|---|---|
| `EASE` | `[0.2, 0.7, 0.3, 1]` | The one easing curve. Matches `animate-pop`. Use for every entrance. |
| `DURATION` | `0.4` (seconds) | Entrance duration. Gentler than the 220ms CSS pop — scroll-revealed scenes are larger and benefit from a slower, more deliberate fade. |
| `REVEAL_OFFSET` | `12` (px) | The `y` distance a `fadeUp` reveal travels. Small — motion should suggest arrival, not travel. |
| `STAGGER` | `0.18` (seconds) | Delay between siblings in a stagger group. What makes a formula visibly *build*. A 5-element formula takes ~1.3s. |
| `VIEWPORT_MARGIN` | `"-80px"` | The `whileInView` viewport margin. Fires the reveal just before the element is fully in view, so motion doesn't feel late. |
| `VIEWPORT_ONCE` | `true` | Entrances play exactly once. Never re-fire on scroll-back. |

Export them as named constants from the motion leaf file so lessons reference
symbols, not magic numbers:

```ts
export const MOTION = {
  ease: [0.2, 0.7, 0.3, 1] as const,
  duration: 0.4,
  revealOffset: 12,
  stagger: 0.18,
  viewportMargin: "-80px",
  viewportOnce: true,
} as const;
```

(The `as const` matters: Framer/Motion's `Transition.ease` wants a tuple
`[number, number, number, number]`, not `number[]`.)

## The one reveal variant — `fadeUp`

There is exactly one entrance variant. Everything else is derived from it.

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: MOTION.revealOffset },
  visible: { opacity: 1, y: 0 },
};
```

- **Only `opacity` and `transform` animate** — never `width`, `height`, `color`,
  or layout. This keeps the resting state identical to the un-animated design and
  avoids reflow.
- `y: 12px` is deliberately small. The reader should perceive "it arrived", not
  "it flew in".
- There is no `scale` in the reveal variant, even though `animate-pop` uses scale.
  Reason: `Card` primitives already carry an inline `rotate()` for the hand-drawn
  skew, and composing `scale + rotate + y` in one transform is fragile. Keep the
  reveal to `opacity + y` and let the static `rotate` survive untouched. (See
  `reveal-patterns.md` for the transform-conflict fix.)

## Stagger

Stagger is what turns a simultaneous reveal into a *build*. Apply it to the parent
of a group that should arrive in sequence — most importantly the accumulating
formula rows (`Dataset + Algorithm = Rules`, `Patterns + Relations = Decision`).

```tsx
<motion.div
  variants={{
    visible: { transition: { staggerChildren: MOTION.stagger } },
  }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: MOTION.viewportMargin }}
>
  {children} {/* each child is a motion element with the fadeUp variant */}
</motion.div>
```

- `0.12s` between siblings. Longer and the formula feels sluggish; shorter and the
  build reads as simultaneous.
- Stagger belongs on the **parent**, with `staggerChildren`. The children just
  carry the `fadeUp` variant and inherit the parent's `initial`/`whileInView`.
- Only stagger groups that are genuinely a sequence (a formula, a pipeline, a set
  of parallel cards the eye should sweep across). A 2×2 comparison grid does not
  need stagger — reveal it as one block.

## Reduced motion — the rule, restated

`MOTION` and `fadeUp` describe the *animated* path. The reduced-motion path is
not a token — it is the absence of motion, handled by wrapping the tree in
`<MotionConfig reducedMotion="user">`. When the user's OS asks for reduced motion,
Framer/Motion jumps every variant straight to its `visible` state with no
transition. The CSS guard in `globals.css` cannot do this for JS-driven motion, so
the `MotionConfig` wrapper is mandatory and is the single most important
correctness rule in this skill.

## When you genuinely need a new value

You usually don't. But if a signature moment requires it (a looping arrow, a
transforming label), state the reason in a comment next to the override and prefer
deriving from `MOTION` rather than inventing a raw number:

```tsx
// Looping reinforcement arrow: a slow, repeating rotation to convey "cycle".
// Justified — a one-shot fadeUp cannot express recurrence.
transition={{ duration: MOTION.duration * 6, repeat: Infinity, ease: "linear" }}
```

A new easing curve or a new entrance variant is a bigger decision than a new
duration — raise it with the user rather than silently splitting the motion
language.
