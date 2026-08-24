/**
 * Picture-led scene primitives for the "Machine Learning for Layman" course.
 *
 * The source deck (Lesson 1.pdf) teaches ~80% through pictures: real car/bike
 * photos, a child character that learns, the accumulating
 * `Samples + Labels = Dataset` formula drawn with literal + and = operators.
 * We can't ship photos, but we CAN draw rich SVG scenes that carry the same
 * explanatory load. These primitives are the visual vocabulary every layman
 * lesson is built from.
 *
 * Uses the same brand-blue palette as the rest of the site — one colour system,
 * easier to remember.
 */

import type { ReactNode } from "react";
import { Reveal } from "./motion";

/*
  Theme-aware colors for the SVG vocabulary. The brand/ink shapes use
  `currentColor` so they inherit the theme-aware text color set on each
  component's wrapper (text-brand / text-ink / etc.) and flip in dark mode.
  Structural dark accents (wheels, tires, hair) use a CSS variable so they
  also adapt.
*/
const BRAND = "currentColor";
const BRAND_DEEP = "currentColor";
const TIRE = "var(--tire)";
const HUB = "var(--hub)";

/* ------------------------------------------------------------------ */
/* Characters                                                         */
/* ------------------------------------------------------------------ */

/** A simple, friendly person figure — the "learner" in the deck's story. */
export function PersonFigure({
  className = "",
  label,
  // Skin tone only — a person is a person, not a brand colour.
  skin = "#f4c89a",
}: {
  className?: string;
  label?: string;
  skin?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-brand ${className}`}>
      <svg viewBox="0 0 80 110" className="h-24 w-auto sm:h-28" aria-hidden="true">
        {/* head */}
        <circle cx="40" cy="22" r="16" fill={skin} />
        {/* hair */}
        <path d="M24 18 Q40 2 56 18 Q56 10 40 8 Q24 10 24 18 Z" fill={TIRE} />
        {/* eyes */}
        <circle cx="34" cy="22" r="1.8" fill={TIRE} />
        <circle cx="46" cy="22" r="1.8" fill={TIRE} />
        {/* smile */}
        <path d="M34 28 Q40 33 46 28" stroke={TIRE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* body — brand blue shirt */}
        <path d="M22 50 Q40 42 58 50 L62 95 Q40 102 18 95 Z" fill={BRAND} />
        {/* arms */}
        <path d="M22 52 L10 78" stroke={skin} strokeWidth="7" strokeLinecap="round" />
        <path d="M58 52 L70 78" stroke={skin} strokeWidth="7" strokeLinecap="round" />
      </svg>
      {label && (
        <span className="mt-1 rounded-full bg-brand-wash px-2.5 py-0.5 text-[11px] font-semibold text-ink">
          {label}
        </span>
      )}
    </div>
  );
}

/** A robot / computer figure — the "machine" in the story. */
export function MachineFigure({
  className = "",
  label,
  confused = false,
}: {
  className?: string;
  label?: string;
  confused?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center text-brand-deep ${className}`}>
      <svg viewBox="0 0 90 110" className="h-24 w-auto sm:h-28" aria-hidden="true">
        {/* monitor body */}
        <rect x="8" y="14" width="74" height="56" rx="6" fill="var(--surface-elevated)" stroke={BRAND_DEEP} strokeWidth="2" />
        {/* screen */}
        <rect x="14" y="20" width="62" height="40" rx="3" fill="var(--screen)" />
        {/* face on screen */}
        {confused ? (
          <>
            <text x="32" y="42" fontFamily="monospace" fontSize="14" fill={BRAND} fontWeight="bold">?</text>
            <text x="50" y="42" fontFamily="monospace" fontSize="14" fill={BRAND} fontWeight="bold">?</text>
            <path d="M30 50 Q45 46 58 50" stroke={BRAND} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="32" cy="36" r="3" fill={BRAND} />
            <circle cx="56" cy="36" r="3" fill={BRAND} />
            <path d="M32 48 Q45 54 56 48" stroke={BRAND} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* stand */}
        <rect x="38" y="70" width="14" height="14" fill={BRAND_DEEP} />
        <rect x="28" y="84" width="34" height="6" rx="3" fill={BRAND_DEEP} />
      </svg>
      {label && (
        <span className="mt-1 rounded-full bg-ash px-2.5 py-0.5 text-[11px] font-semibold text-ink">
          {label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Objects being learned                                              */
/* ------------------------------------------------------------------ */

/** A car, drawn as a simple side-profile shape. */
export function CarShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={`h-16 w-auto text-brand ${className}`} aria-hidden="true">
      {/* body — brand blue */}
      <path d="M8 48 Q10 30 30 28 L42 18 Q60 14 78 18 L92 28 Q108 30 112 48 L112 54 Q112 58 108 58 L92 58 Q88 48 80 48 Q72 48 72 58 L48 58 Q44 48 40 48 Q32 48 32 58 L12 58 Q8 58 8 54 Z"
        fill={BRAND} stroke="currentColor" strokeWidth="2" />
      {/* windows */}
      <path d="M42 20 L52 20 L52 30 L36 30 Z" fill="var(--window)" opacity="0.7" />
      <path d="M56 20 L74 20 L82 30 L56 30 Z" fill="var(--window)" opacity="0.7" />
      {/* wheels */}
      <circle cx="40" cy="56" r="9" fill={TIRE} />
      <circle cx="40" cy="56" r="3.5" fill={HUB} />
      <circle cx="80" cy="56" r="9" fill={TIRE} />
      <circle cx="80" cy="56" r="3.5" fill={HUB} />
    </svg>
  );
}

/** A bike, drawn as a simple side-profile shape. */
export function BikeShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={`h-16 w-auto text-brand-deep ${className}`} aria-hidden="true">
      {/* wheels */}
      <circle cx="28" cy="56" r="18" fill="none" stroke={TIRE} strokeWidth="3" />
      <circle cx="28" cy="56" r="3" fill={TIRE} />
      <circle cx="92" cy="56" r="18" fill="none" stroke={TIRE} strokeWidth="3" />
      <circle cx="92" cy="56" r="3" fill={TIRE} />
      {/* frame — brand-deep */}
      <path d="M28 56 L55 30 L75 30 L92 56 M55 30 L70 56 M75 30 L70 56"
        stroke={BRAND_DEEP} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* seat + handlebar */}
      <line x1="52" y1="28" x2="60" y2="28" stroke={TIRE} strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="30" x2="82" y2="22" stroke={TIRE} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Annotation primitives                                              */
/* ------------------------------------------------------------------ */

/** A speech or thought bubble containing text. */
export function SpeechBubble({
  children,
  side = "top",
  className = "",
}: {
  children: ReactNode;
  /** Where the bubble's tail points. */
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={`relative inline-block rounded-2xl bg-surface-elevated px-4 py-2.5 text-sm font-semibold text-ink shadow-sm border border-ash ${className}`}
    >
      {children}
      {/* tail */}
      <span
        className={`absolute h-3 w-3 rotate-45 bg-surface-elevated border-ash ${
          side === "top"
            ? "-top-1.5 left-1/2 -translate-x-1/2 border-t border-l"
            : side === "bottom"
              ? "-bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r"
              : side === "left"
                ? "-left-1.5 top-1/2 -translate-y-1/2 border-l border-b"
                : "-right-1.5 top-1/2 -translate-y-1/2 border-r border-t"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

/** A big operator symbol used in the `Samples + Labels = Dataset` formula. */
export function Operator({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center justify-center text-3xl font-bold text-ink sm:text-4xl">
      {children}
    </span>
  );
}

/** A labelled picture card — the deck's core unit ("a thing + its label"). */
export function PictureCard({
  picture,
  label,
  tone = "white",
}: {
  picture: ReactNode;
  label: string;
  tone?: "white" | "brand" | "ash";
}) {
  const bg =
    tone === "brand"
      ? "bg-brand-wash border-brand"
      : tone === "ash"
        ? "bg-ash border-dot"
        : "bg-surface-elevated border-ash";
  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 ${bg}`}>
      <div className="flex h-20 items-center justify-center">{picture}</div>
      <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-canvas">
        {label}
      </span>
    </div>
  );
}

/**
 * A scene frame: a captioned panel. Reveals on scroll.
 *
 * `variant="chapter"` (default) opens a beat — a boxed panel. Use it when the
 * picture changes WHAT it shows. `variant="continue"` keeps the beat going —
 * a frameless panel hung on a shared left rule, for when the SAME stage
 * changes state. Mixing both is what makes a lesson read as one story
 * instead of a deck of cards.
 */
export function Scene({
  caption,
  children,
  className = "",
  variant = "chapter",
}: {
  /** The one-line label above the scene. In v2 lessons it opens with a
   * connective (And/But/So/Because…) plus the beat position when the
   * framework has one ("Rung 2 of 4 — because…"). */
  caption?: string;
  children: ReactNode;
  className?: string;
  /** "chapter" = boxed panel that opens a beat; "continue" = frameless
   * continuation of the current beat's stage. */
  variant?: "chapter" | "continue";
}) {
  if (variant === "continue") {
    return (
      <Reveal
        as="figure"
        className={`relative border-l-2 border-ash pl-4 sm:pl-5 ${className}`}
      >
        {caption && (
          <figcaption className="mb-2 text-sm font-bold text-ink sm:text-base">
            {caption}
          </figcaption>
        )}
        {children}
      </Reveal>
    );
  }
  return (
    <Reveal
      as="figure"
      className={`rounded-2xl border border-ash bg-surface-elevated px-4 py-5 shadow-sm sm:px-6 sm:py-6 ${className}`}
    >
      {caption && (
        <figcaption className="mb-3 text-center text-sm font-bold text-ink sm:text-base">
          {caption}
        </figcaption>
      )}
      {children}
    </Reveal>
  );
}

/** One slot in the {@link StoryMap} strip. */
export type StoryMapStep = {
  /** Short label for the beat (≤ 4 words), e.g. "Ordered batches lie". */
  label: string;
  /** Optional small glyph (emoji/SVG) — beginner lessons want playful ones. */
  icon?: ReactNode;
};

/**
 * The story-at-a-glance strip: the whole lesson as numbered slots, placed
 * directly under the `InfographicHeader`. It is the advance organizer that
 * lets a learner hold the arc while the scenes advance one beat at a time —
 * and each slot's label doubles as the anchor phrase the matching scene's
 * caption should reuse.
 */
export function StoryMap({ steps }: { steps: StoryMapStep[] }) {
  return (
    <ol
      aria-label="Story map"
      className="flex flex-wrap items-stretch gap-1.5 sm:gap-2"
    >
      {steps.map((step, i) => (
        <li
          key={step.label}
          className="flex min-w-[7.5rem] flex-1 items-center gap-2 rounded-lg border border-ash bg-surface-elevated px-2.5 py-1.5"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-wash text-[10px] font-bold text-brand-deep">
            {i + 1}
          </span>
          <span className="flex min-w-0 items-center gap-1 text-[11px] font-semibold leading-tight text-ink-soft">
            {step.icon}
            <span className="truncate">{step.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
