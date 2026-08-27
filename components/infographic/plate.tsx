import type { ReactNode } from "react";
import { MotionProvider, Reveal } from "./motion";

/**
 * The Plate system — the visual grammar of the matured_v1 skill
 * (`.agents/skills/infographics-interactive-matured_v1/references/visual-grammar.md`).
 *
 * Printed-plate minimalism, inspired by technical guidebook illustrations:
 * elements float on the canvas with thin ink strokes and generous whitespace —
 * no boxed panels, no shadows, no pill badges, no card chrome. Everything is
 * theme-safe: strokes are `currentColor` on the component's text color, fills
 * are tokens (`bg-canvas`, `bg-brand-wash`), so plates invert cleanly in dark
 * mode. Matured lessons build from THIS vocabulary, not from Scene/Card.
 */

/** Wraps a whole matured infographic: motion + vertical rhythm + hairlines. */
export function PlateSet({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="flex flex-col divide-y divide-ash/70">{children}</div>
    </MotionProvider>
  );
}

/**
 * One plate: a full-width section of the canvas. `kicker` is the small
 * written-on-the-margin label (mono, uppercase); the content carries the
 * picture. No border, no shadow — the hairline comes from PlateSet.
 */
export function Plate({
  kicker,
  children,
  className = "",
}: {
  kicker?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal as="figure" className={`py-8 sm:py-10 ${className}`}>
      {kicker && (
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
          {kicker}
        </p>
      )}
      <div className={kicker ? "mt-4" : ""}>{children}</div>
    </Reveal>
  );
}

/** The minimal lesson header: kicker, left-aligned title, one-line dek. */
export function PlateHeader({
  kicker,
  title,
  dek,
}: {
  kicker: string;
  title: string;
  dek?: string;
}) {
  return (
    <Reveal as="figure" className="py-8 sm:py-10">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
        {kicker}
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      {dek && <p className="mt-1.5 max-w-xl text-sm font-medium text-ink-soft">{dek}</p>}
    </Reveal>
  );
}

/**
 * The matured replacement for StoryMap: the lesson's arc as ONE line of plain
 * text steps joined by thin arrows — a written path, not a row of chips.
 */
export function PlateMap({ steps }: { steps: readonly string[] }) {
  return (
    <Reveal as="figure" aria-label="Lesson map" className="py-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-ink-soft">{step}</span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="text-ink-faint">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

type InkTone = "plain" | "accent" | "dim" | "dashed";

const INK_TONES: Record<InkTone, string> = {
  plain: "border border-ink/70 bg-canvas",
  accent: "border border-brand bg-brand-wash",
  dim: "border border-ash bg-canvas opacity-55",
  dashed: "border border-dashed border-ink/60 bg-canvas",
};

/**
 * An ink node: rounded thin-stroke outline, transparent fill. The accent tone
 * marks the scene's ONE delta; dim ghosts established elements. Never add a
 * shadow — depth is not part of this grammar.
 */
export function InkBox({
  tone = "plain",
  className = "",
  children,
}: {
  tone?: InkTone;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`rounded-lg px-3 py-2.5 ${INK_TONES[tone]} ${className}`}>{children}</div>
  );
}

/** Thin line-art glyph set. Stroke-only, currentColor, 1.75 weight. */
export type GlyphName =
  | "person"
  | "chat"
  | "gear"
  | "terminal"
  | "db"
  | "chip"
  | "doc"
  | "search"
  | "server"
  | "globe";

function glyphPath(name: GlyphName): ReactNode {
  switch (name) {
    case "person":
      return (
        <>
          <circle cx="12" cy="7" r="3.2" />
          <path d="M5.5 20c.8-4.2 3.4-6.2 6.5-6.2s5.7 2 6.5 6.2" />
        </>
      );
    case "chat":
      return (
        <>
          <rect x="3" y="5" width="18" height="13" rx="3" />
          <circle cx="8.2" cy="11.5" r="0.45" fill="currentColor" stroke="none" />
          <circle cx="12" cy="11.5" r="0.45" fill="currentColor" stroke="none" />
          <circle cx="15.8" cy="11.5" r="0.45" fill="currentColor" stroke="none" />
        </>
      );
    case "gear":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.7 6.7l1.6 1.6M15.7 15.7l1.6 1.6M17.3 6.7l-1.6 1.6M8.3 15.7l-1.6 1.6" />
        </>
      );
    case "terminal":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M7 10l2.5 2L7 14M12.5 14.5h4" />
        </>
      );
    case "db":
      return (
        <>
          <ellipse cx="12" cy="6.5" rx="7" ry="2.5" />
          <path d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11" />
          <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
        </>
      );
    case "chip":
      return (
        <>
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <path d="M10 7V4.5M14 7V4.5M10 19.5V17M14 19.5V17M7 10H4.5M7 14H4.5M19.5 10H17M19.5 14H17" />
        </>
      );
    case "doc":
      return (
        <>
          <path d="M6 3.5h8l4 4V20.5H6z" />
          <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M14.8 14.8L20 20" />
        </>
      );
    case "server":
      return (
        <>
          <rect x="4.5" y="5" width="15" height="5.5" rx="1.2" />
          <rect x="4.5" y="13.5" width="15" height="5.5" rx="1.2" />
          <circle cx="7.8" cy="7.75" r="0.45" fill="currentColor" stroke="none" />
          <circle cx="7.8" cy="16.25" r="0.45" fill="currentColor" stroke="none" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <ellipse cx="12" cy="12" rx="3.5" ry="8" />
          <path d="M4.5 12h15" />
        </>
      );
  }
}

/** A line-art glyph — sizes via className (`h-4 w-4`), colors via text-*. */
export function Glyph({
  name,
  className = "h-4 w-4",
}: {
  name: GlyphName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphPath(name)}
    </svg>
  );
}

/** A thin downward flow arrow with an optional written-on label. */
export function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-1 text-ink-faint" aria-hidden="true">
      <svg viewBox="0 0 12 16" className="h-4 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M6 1v12M2.5 9.5L6 13.5l3.5-4" />
      </svg>
      {label && <span className="font-mono text-[9px] font-bold uppercase tracking-wide">{label}</span>}
    </div>
  );
}

/** A thin horizontal arrow with an optional written-on label (row flows). */
export function SideArrow({ label, dashed = false }: { label?: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-ink-faint" aria-hidden="true">
      <svg viewBox="0 0 28 10" className="h-2.5 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M1 5h22M19.5 1.5L24.5 5l-5 3.5" strokeDasharray={dashed ? "3 2.5" : undefined} />
      </svg>
      {label && <span className="font-mono text-[9px] font-bold uppercase tracking-wide">{label}</span>}
    </span>
  );
}

/**
 * An oval node — the canonical cycle-chain step marker (device 2 in
 * references/story-devices.md). `exit` renders the terminal step in a
 * distinct stroke (good green); `accent` marks the scene's delta.
 */
export function Oval({
  label,
  exit = false,
  accent = false,
  className = "",
}: {
  label: string;
  exit?: boolean;
  accent?: boolean;
  className?: string;
}) {
  const stroke = accent
    ? "border-brand text-brand-deep"
    : exit
      ? "border-good text-good"
      : "border-ink/70 text-ink";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 bg-canvas px-4 py-1.5 font-mono text-xs font-bold ${stroke} ${className}`}
    >
      {label}
    </span>
  );
}

/**
 * A boundary enclosure (device 7) — dashed (logical) or solid (physical)
 * thin rounded rectangle grouping what is inside. Arrows crossing it are
 * the lesson. One boundary per plate.
 */
export function Boundary({
  dashed = true,
  label,
  children,
  className = "",
}: {
  dashed?: boolean;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl px-3 py-3.5 ${
        dashed ? "border border-dashed border-ink/60" : "border border-ink/70"
      } ${className}`}
    >
      {label && (
        <span className="absolute -top-2 left-3 bg-canvas px-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-ink-soft">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/** The closing note: one sentence under a thin accent rule. No card. */
export function NoteRule({ children }: { children: ReactNode }) {
  return (
    <Reveal as="figure" className="py-8 sm:py-10">
      <div className="border-l-2 border-brand pl-4">
        <p className="max-w-2xl text-sm font-semibold leading-relaxed text-ink">{children}</p>
      </div>
    </Reveal>
  );
}
