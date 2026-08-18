/**
 * The motion leaf for the infographic layer.
 *
 * This is the ONE client component in the infographic subtree. Every other
 * infographic file (primitives.tsx, scenes.tsx, the lessons, index.tsx) stays a
 * Server Component and imports from here — a Server Component may render a
 * Client Component cleanly.
 *
 * Implements the motion system documented in
 * .agents/skills/infographics-interactive_v4/. Read its SKILL.md + references before
 * editing here.
 *
 * Requires the `motion` package:  npm install motion   (NOT framer-motion)
 */

"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Tokens — the single source of truth for the motion language.        */
/* See infographics-interactive_v4/references/motion-tokens.md.        */
/* ------------------------------------------------------------------ */

export const MOTION = {
  /** Matches the existing animate-pop curve in globals.css. */
  ease: [0.2, 0.7, 0.3, 1] as const,
  /** Gentler than the 220ms CSS pop; scroll-revealed scenes are larger and
   *  benefit from a slower, more deliberate fade. */
  duration: 0.4,
  /** The y distance a fadeUp travels — small, suggests arrival not travel. */
  revealOffset: 12,
  /** Delay between siblings in a stagger group — what makes a formula "build". */
  stagger: 0.18,
  /** Fire the reveal just before the element is fully in view. */
  viewportMargin: "-80px",
  /** Entrances play exactly once. Never re-fire on scroll-back. */
  viewportOnce: true,
} as const;

/** The one entrance transition. Pairs with any fadeUp-variant element. */
const transition = { duration: MOTION.duration, ease: MOTION.ease } as const;

/** The one entrance variant. Only opacity + transform animate. */
export const fadeUp = {
  hidden: { opacity: 0, y: MOTION.revealOffset },
  visible: { opacity: 1, y: 0 },
} as const;

/** The viewport config every whileInView element uses. */
const viewport = {
  once: MOTION.viewportOnce,
  margin: MOTION.viewportMargin,
} as const;

/* ------------------------------------------------------------------ */
/* MotionProvider — wrap an infographic root ONCE.                     */
/* ------------------------------------------------------------------ */

/**
 * Makes the `motion` library honour prefers-reduced-motion.
 *
 * The CSS guard in globals.css clamps CSS animation/transition durations but
 * does NOT reach JS-driven (Framer/Motion) animation. This wrapper is the only
 * thing that collapses motion for reduced-motion users. Never omit it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* ------------------------------------------------------------------ */
/* Reveal — the workhorse. ~90% of entrance motion.                    */
/* ------------------------------------------------------------------ */

/**
 * Wraps any block; fades it up once when scrolled into view.
 * Use for scene-level reveals and standalone blocks that aren't Cards.
 */
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
      viewport={viewport}
      transition={transition}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* RevealCard — a Card that preserves its hand-drawn rotate at rest.   */
/* ------------------------------------------------------------------ */

/**
 * The fix for the Card transform conflict.
 *
 * The static Card applies an inline transform: rotate(Ndeg) for the hand-drawn
 * skew. Framer/Motion writes its own transform (the y in fadeUp) to the same
 * element — if both fight over style.transform, one is lost.
 *
 * Fix: Motion owns the transform; the static rotate is folded INTO the variant
 * (identical in hidden + visible), so only opacity + y animate. The resting
 * state is pixel-identical to the original style={{ transform: rotate() }} card.
 */
export function RevealCard({
  children,
  className,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Degrees of hand-drawn rotation, e.g. -0.5 or 0.8. Preserved at rest. */
  rotate?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: MOTION.revealOffset, rotate },
        visible: { opacity: 1, y: 0, rotate },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — for sequences: formulas, pipelines, ordered card sets.    */
/* ------------------------------------------------------------------ */

/**
 * Wraps a group of children that should arrive in sequence. Each child must be a
 * <motion.*> element carrying the fadeUp variant (see MotionChild).
 *
 * Only stagger groups that are genuinely a sequence (a formula, a pipeline, an
 * ordered sweep). A comparison grid reveals as one block — use Reveal.
 */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{ visible: { transition: { staggerChildren: MOTION.stagger } } }}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

/**
 * A child of <Stagger>. Carries the fadeUp variant and inherits the parent's
 * initial/whileInView; the stagger delay is applied automatically.
 */
export function MotionChild({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={fadeUp} transition={transition}>
      {children}
    </MotionTag>
  );
}
