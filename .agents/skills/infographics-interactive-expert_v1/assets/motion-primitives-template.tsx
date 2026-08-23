/**
 * TEMPLATE — the motion leaf file for the infographic layer.
 *
 * Copy this to components/infographic/motion.tsx (note the leading "use client").
 * It is the ONE client component in the infographic subtree; every other
 * infographic file (primitives.tsx, scenes.tsx, the lessons, index.tsx) stays a
 * Server Component and imports from here.
 *
 * After creating it:
 *   1. npm install motion   (NOT framer-motion — that's the legacy name)
 *   2. Wire Reveal into Scene/Card in primitives.tsx (see reveal-patterns.md)
 *   3. Wrap the <Infographic> root in <MotionProvider> (see below)
 *   4. Verify: npm run typecheck, then the DevTools reduced-motion check
 * See references/reveal-patterns.md for the full client-boundary playbook.
 *
 * Requires the `motion` package:  npm install motion
 */

"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Tokens — the single source of truth for the motion language.        */
/* See references/motion-tokens.md.                                    */
/* ------------------------------------------------------------------ */

export const MOTION = {
  /** Matches the existing animate-pop curve in globals.css. */
  ease: [0.2, 0.7, 0.3, 1] as const,
  /** Slightly slower than the 220ms CSS pop; scroll-revealed scenes are larger. */
  duration: 0.26,
  /** The y distance a fadeUp travels — small, suggests arrival not travel. */
  revealOffset: 12,
  /** Delay between siblings in a stagger group — what makes a formula "build". */
  stagger: 0.12,
  /** Fire the reveal just before the element is fully in view. */
  viewportMargin: "-80px",
  /** Entrances play exactly once. Never re-fire on scroll-back. */
  viewportOnce: true,
} as const;

/** The one entrance variant. Only opacity + transform animate. */
export const fadeUp = {
  hidden: { opacity: 0, y: MOTION.revealOffset },
  visible: { opacity: 1, y: 0 },
} as const;

/* ------------------------------------------------------------------ */
/* MotionProvider — wrap the <Infographic> root ONCE.                  */
/* ------------------------------------------------------------------ */

/**
 * Makes the `motion` library honour prefers-reduced-motion.
 *
 * The CSS guard in globals.css clamps CSS animation/transition durations but
 * does NOT reach JS-driven (Framer/Motion) animation. This wrapper is the only
 * thing that collapses motion for reduced-motion users. Never omit it.
 *
 * Usage inside the <Infographic> primitive:
 *   export function Infographic({ children }) {
 *     return <MotionProvider><div className="flex flex-col gap-6">{children}</div></MotionProvider>;
 *   }
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* ------------------------------------------------------------------ */
/* Reveal — the workhorse. ~90% of entrance motion.                    */
/* ------------------------------------------------------------------ */

/**
 * Wraps any block; fades it up once when scrolled into view.
 * Use for Scene, and for any standalone block that isn't a Card.
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
      viewport={{ once: MOTION.viewportOnce, margin: MOTION.viewportMargin }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* RevealCard — the Card primitive, motion-aware.                      */
/* ------------------------------------------------------------------ */

/**
 * The fix for the Card transform conflict.
 *
 * The static Card applies an inline transform: rotate(Ndeg) for the hand-drawn
 * skew. Framer/Motion writes its own transform (the y in fadeUp) to the same
 * element. If both fight over style.transform, one is lost.
 *
 * Fix: Motion owns the transform; the static rotate is folded INTO the variant
 * (identical in hidden + visible), so only opacity + y animate. The resting
 * state is pixel-identical to the original style={{ transform: rotate() }} card.
 *
 * Usage in primitives.tsx:
 *   export function Card({ children, tone = "white", rotate = 0, className = "" }) {
 *     return (
 *       <RevealCard rotate={rotate} className={`rounded-2xl px-5 py-4 shadow-sm ${CARD_TONES[tone]} ${className}`}>
 *         {children}
 *       </RevealCard>
 *     );
 *   }
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
      // rotate lives IN the variant transform, not in style={{}}, so it doesn't
      // collide with Motion's own transform. Identical in both states => static.
      variants={{
        hidden: { opacity: 0, y: MOTION.revealOffset, rotate },
        visible: { opacity: 1, y: 0, rotate },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: MOTION.viewportOnce, margin: MOTION.viewportMargin }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — for sequences: formulas, pipelines, ordered card sets.    */
/* ------------------------------------------------------------------ */

/**
 * Wraps a group of children that should arrive in sequence.
 *
 * Each child must itself be a motion element carrying the fadeUp variant, e.g.:
 *   <Stagger className="flex ...">
 *     <motion.div variants={fadeUp} transition={{ duration: MOTION.duration, ease: MOTION.ease }}>
 *       <Box ... />
 *     </motion.div>
 *     ...
 *   </Stagger>
 *
 * Only stagger groups that are genuinely a sequence (a formula, a pipeline, an
 * ordered sweep). A 2x2 comparison grid reveals as one block — use Reveal, not
 * Stagger.
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
      viewport={{ once: MOTION.viewportOnce, margin: MOTION.viewportMargin }}
    >
      {children}
    </motion.div>
  );
}
