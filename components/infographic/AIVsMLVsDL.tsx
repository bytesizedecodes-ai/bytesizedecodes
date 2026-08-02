import {
  Infographic,
  InfographicHeader,
  Card,
  Tag,
  Takeaway,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Lesson infographic: "AI vs ML vs Deep Learning" (intermediate course).
 *
 * One canonical visual — the nested AI ⊃ ML ⊃ DL circles, labelled — then the
 * boundary check that makes the nesting *do work*: three dots placed in the
 * three regions, each naming a model that sits there. No duplicated diagrams.
 *
 * The "aha" lands once: the resolution line states the nesting in one beat,
 * then the boundary cases force the learner to *use* it (P7 — the inference is
 * "where does logistic regression sit?").
 *
 * Picture-led vocabulary: Scene + Stagger + MotionChild (skill §4, §5).
 */
export function AIVsMLVsDL() {
  return (
    <Infographic>
      <InfographicHeader
        title="AI vs ML vs Deep Learning"
        subtitle="Three nested worlds — each one a slice of the next"
      />

      {/* The single canonical visual: AI ⊃ ML ⊃ DL, labelled. */}
      <Scene caption="The three fields, as nested circles">
        <div className="flex justify-center">
          <NestedCirclesSvg />
        </div>
      </Scene>

      {/* The resolution, stated once (P1). Shared Takeaway primitive. */}
      <Takeaway>
        <strong className="font-extrabold">AI ⊃ ML ⊃ DL.</strong> AI is the
        goal; ML is how we reach it (learn from data); DL is one ML technique
        (deep neural networks). Not all AI is ML; not all ML is DL.
      </Takeaway>

      {/* The boundary check — the ONE place the nesting earns its keep.
          Each region carries a dot + a real model that sits there, revealed
          as a stagger so the learner reads region-by-region. */}
      <Scene caption="Use it: where does each model actually sit?">
        <div className="flex justify-center">
          <BoundaryDotsSvg />
        </div>
        <Stagger className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <DotCase
              dot="AI · not ML"
              verdict="Expert system"
              note="Hand-coded if/then rules. Acts smart, but never learns from data."
            />
          </MotionChild>
          <MotionChild>
            <DotCase
              dot="ML · not DL"
              verdict="Logistic regression"
              note="Learns weights from data (ML), but no multi-layer network (not DL)."
            />
          </MotionChild>
          <MotionChild>
            <DotCase
              dot="DL"
              verdict="ResNet, GPT"
              note="Multi-layer neural networks — the innermost circle."
            />
          </MotionChild>
        </Stagger>
      </Scene>
    </Infographic>
  );
}

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */

function DotCase({
  dot,
  verdict,
  note,
}: {
  dot: string;
  verdict: string;
  note: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
      <Tag tone="brand" dot>
        {dot}
      </Tag>
      <span className="mt-2 text-sm font-extrabold text-ink sm:text-base">
        {verdict}
      </span>
      <span className="mt-1 text-xs font-medium leading-snug text-ink-soft sm:text-[13px]">
        {note}
      </span>
    </div>
  );
}

/** The single canonical nested-circles diagram. AI ⊃ ML ⊃ DL, labelled. */
function NestedCirclesSvg() {
  return (
    <svg
      viewBox="0 0 520 520"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Concentric circles: Artificial Intelligence contains Machine Learning, which contains Deep Learning."
    >
      {/* AI ring */}
      <circle cx="260" cy="260" r="255" className="fill-brand-wash" stroke="var(--color-brand)" strokeWidth={2} strokeDasharray="6 6" />
      {/* ML ring */}
      <circle cx="260" cy="260" r="175" className="fill-brand" />
      {/* DL core */}
      <circle cx="260" cy="260" r="95" className="fill-brand-deep" />

      <text x="260" y="40" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={14} fontWeight={800} letterSpacing={1.5} fill="var(--color-brand-deep)">
        ARTIFICIAL INTELLIGENCE
      </text>
      <text x="260" y="110" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={800} letterSpacing={1.5} fill="var(--color-canvas)">
        MACHINE LEARNING
      </text>
      <text x="260" y="248" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={30}>
        🧠
      </text>
      <text x="260" y="288" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={800} letterSpacing={1.5} fill="var(--color-canvas)">
        DEEP LEARNING
      </text>
    </svg>
  );
}

/** The boundary case: ONE flatter diagram with three dots in the three regions.
 *  Each dot maps to a card below. */
function BoundaryDotsSvg() {
  return (
    <svg
      viewBox="0 0 520 320"
      className="h-auto w-full max-w-lg"
      role="img"
      aria-label="The AI/ML/DL nesting flattened, with three example dots: one in the AI-only ring, one in the ML-only ring, one in the DL core."
    >
      {/* AI ring */}
      <circle cx="260" cy="160" r="150" className="fill-brand-wash" stroke="var(--color-brand)" strokeWidth={2} strokeDasharray="6 6" />
      {/* ML ring */}
      <circle cx="260" cy="160" r="100" className="fill-brand" />
      {/* DL core */}
      <circle cx="260" cy="160" r="52" className="fill-brand-deep" />

      {/* region labels */}
      <text x="260" y="24" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={12} fontWeight={700} fill="var(--color-brand-deep)">
        AI · not ML
      </text>
      <text x="430" y="164" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={11} fontWeight={700} fill="var(--color-canvas)">
        ML · not DL
      </text>
      <text x="260" y="164" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={11} fontWeight={700} fill="var(--color-canvas)">
        DL
      </text>

      {/* the three example dots, colour-keyed to the cards (brand) */}
      <circle cx="120" cy="70" r="8" className="fill-brand" />
      <circle cx="345" cy="160" r="8" className="fill-brand" />
      <circle cx="260" cy="160" r="8" className="fill-brand" />
    </svg>
  );
}
