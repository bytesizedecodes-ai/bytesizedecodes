import type { ReactNode } from "react";
import { MotionProvider, Reveal, RevealCard } from "./motion";

/**
 * Shared primitives for rendering infographics as inline page content.
 *
 * These replace the old fixed-1200px standalone HTML files. Everything here is
 * plain Tailwind + the brand tokens from `app/globals.css`, so an infographic
 * reflows naturally on phones and sits flush in the page on desktop — no iframe,
 * no scaling, no scrollbars.
 *
 * Design language carried over from the original infographic HTML:
 *  - dot-grid canvas background (already on <body>)
 *  - rounded cards with soft shadows + a touch of hand-drawn rotation
 *  - brand blue as the accent, ash/white surfaces, ink for text
 *
 * MOTION: every infographic is animated by default. Universal entrance motion
 * (scroll-reveal) is folded in here so all 9 lessons inherit it with zero
 * per-lesson edits. The `MotionProvider` wraps the root once, giving every
 * lesson reduced-motion support (`MotionConfig reducedMotion="user"`) for free.
 * Motion is layered on top of a fully legible resting state — it only changes
 * how elements *arrive*, not how they look at rest. See the
 * `infographics-animation` skill.
 */

/** Full infographic wrapper. Wraps the tree in MotionProvider once. */
export function Infographic({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="flex flex-col gap-6">{children}</div>
    </MotionProvider>
  );
}

/** Title block at the top of an infographic. Fades up on first view. */
export function InfographicHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <header className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm font-medium text-ink sm:text-base">
            {subtitle}
          </p>
        )}
        <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-brand opacity-70" />
      </header>
    </Reveal>
  );
}

type CardTone = "white" | "ash" | "brand" | "brandDeep" | "brandWash";

const CARD_TONES: Record<CardTone, string> = {
  white: "bg-surface-elevated border border-ash text-ink",
  ash: "bg-ash border border-dot text-ink",
  brand: "bg-brand border border-brand text-ink",
  brandDeep: "bg-brand-deep border border-brand-deep text-canvas",
  brandWash: "bg-brand-wash border border-brand text-ink",
};

/** A surface card. `rotate` adds the hand-drawn skew (subtle on mobile).
 *  Reveals on scroll; the rotate is preserved at rest via RevealCard. */
export function Card({
  children,
  tone = "white",
  rotate = 0,
  className = "",
}: {
  children: ReactNode;
  tone?: CardTone;
  /** Degrees of rotation, e.g. -0.5 or 0.8. */
  rotate?: number;
  className?: string;
}) {
  return (
    <RevealCard
      rotate={rotate}
      className={`rounded-2xl px-5 py-4 shadow-sm sm:px-6 sm:py-5 ${CARD_TONES[tone]} ${className}`}
    >
      {children}
    </RevealCard>
  );
}

/** Card title row with an optional emoji icon. */
export function CardTitle({
  icon,
  children,
}: {
  icon?: string;
  children: ReactNode;
}) {
  return (
    <h3 className="mb-2 flex items-center gap-2 text-base font-bold sm:text-lg">
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </h3>
  );
}

/** Bullet list that matches the brand's ✦ marker. */
export function BulletList({
  items,
  onBrand = false,
}: {
  items: ReactNode[];
  /** When true, the marker contrasts against a brand-coloured card. */
  onBrand?: boolean;
}) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li
          key={i}
          className={`relative pl-5 text-sm font-medium leading-relaxed sm:text-[15px] ${
            onBrand ? "text-ink" : "text-ink"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute left-0 top-[0.15em] text-xs ${
              onBrand ? "text-canvas" : "text-ink"
            }`}
          >
            ✦
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * A small pill tag, e.g. for example chips or region labels.
 * `tone="brand"` + `dot` renders the accent pill used to key a label to a
 * diagram element (e.g. the boundary-dot cases in AIVsMLVsDL).
 */
export function Tag({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand";
  dot?: boolean;
}) {
  const cls =
    tone === "brand"
      ? "border-brand bg-brand-wash text-brand"
      : "border-ash bg-surface-elevated text-ink";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}

/**
 * A code surface for illustrative (non-runnable) snippets. Matches the app's
 * canonical code style (`bg-ink` / `text-canvas` / `font-mono`, cf. CodeCell).
 * Use `accent` to mark the "learned from data" / ML side of a contrast.
 */
export function CodePanel({
  label,
  caption,
  code,
  accent = false,
}: {
  label: string;
  caption: string;
  code: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-xl border px-4 py-3 ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <span className="mb-2 text-xs font-medium text-ink sm:text-[13px]">
        {caption}
      </span>
      <pre className="mt-auto overflow-x-auto rounded-lg bg-ink px-3 py-2.5 font-mono text-[12px] leading-relaxed text-canvas sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * The recurring "aha" / resolution callout. One visual signature for the key
 * insight of each lesson, so the course reads as one design. Brand-wash surface
 * flips correctly in dark mode (it's rgba there).
 */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center text-sm font-semibold text-ink sm:text-base">
      {children}
    </div>
  );
}
