import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, CarShape, Operator, Scene, PictureCard } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 3: "What is Machine Learning, really?".
 *
 * Layout: linear-progression told as an accumulating formula — the deck's
 * signature visual from slides 22-26: Dataset + Algorithm + Rules, then
 * Patterns + Relations = Decision. Each box is a labelled PictureCard (not an
 * emoji tile); the + operators carry the story and build with Stagger. The
 * "what ML can do" outcomes are PictureCards with drawn icons. Brand blue only.
 *
 * Faithful to source: Lesson 1.pdf slides 16-27.
 */
export function WhatIsMLLayman() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Machine Learning, really?"
        subtitle="Give the machine experience, and let it find the patterns itself"
      />

      {/* The machine gets the same task as the child */}
      <Scene caption="① Give the machine the same job we gave the child">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <CarShape />
          <MachineFigure label="machine" />
          <span className="rounded-2xl bg-brand px-4 py-2 text-sm font-bold text-ink">
            learn from data
          </span>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The machine&apos;s &ldquo;experience&rdquo; is data.
        </p>
      </Scene>

      {/* The accumulating formula — slides 22-26. Builds piece-by-piece. */}
      <Scene caption="② The recipe, built up one piece at a time">
        <Stagger className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <MotionChild>
            <PictureCard picture={<DatasetIcon />} label="Dataset" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<AlgorithmIcon />} label="Algorithm" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<RulesIcon />} label="Rules" tone="brand" />
          </MotionChild>
        </Stagger>
        <p className="mt-4 text-center text-xs font-medium text-ink">
          data + algorithm → the machine derives rules itself.
        </p>

        <Stagger className="mt-4 flex flex-col items-stretch gap-3 border-t border-ash pt-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <MotionChild>
            <PictureCard picture={<PatternsIcon />} label="Patterns" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<RelationsIcon />} label="Relations" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>=</Operator>
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<DecisionIcon />} label="Decision" tone="brand" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          …finds patterns and relations → decides on something new.
        </p>
      </Scene>

      {/* The four things ML can then do — slides 17-20, as PictureCards */}
      <Scene caption="③ Now the machine can do things only humans could">
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
          <MotionChild>
            <PictureCard picture={<IdentifyIcon />} label="Identify objects" tone="white" />
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<PredictIcon />} label="Predict prices" tone="white" />
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<LanguageIcon />} label="Understand language" tone="white" />
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<FaceIcon />} label="Recognise faces" tone="white" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* One-line summary */}
      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Data in → patterns found →{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            decision out
          </span>
          . That&apos;s machine learning.
        </p>
      </Card>
    </Infographic>
  );
}

/* --- drawn icons for the formula boxes (brand palette, no emoji) --- */

function DatasetIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="12" rx="14" ry="5" />
      <path d="M10 12 V24 Q10 29 24 29 Q38 29 38 24 V12" />
      <path d="M10 24 V36 Q10 41 24 41 Q38 41 38 36 V24" />
    </svg>
  );
}

function AlgorithmIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="7" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={24 + Math.cos(a) * 9} y1={24 + Math.sin(a) * 9} x2={24 + Math.cos(a) * 13} y2={24 + Math.sin(a) * 13} />;
      })}
    </svg>
  );
}

function RulesIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#171713" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="8" width="28" height="32" rx="3" />
      <line x1="16" y1="17" x2="32" y2="17" />
      <line x1="16" y1="24" x2="32" y2="24" />
      <line x1="16" y1="31" x2="26" y2="31" />
    </svg>
  );
}

function PatternsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="16" r="4" />
      <circle cx="34" cy="16" r="4" />
      <circle cx="24" cy="32" r="4" />
      <path d="M16 18 L22 30 M32 18 L26 30" opacity="0.5" />
    </svg>
  );
}

function RelationsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="5" />
      <circle cx="34" cy="34" r="5" />
      <path d="M18 18 L30 30" />
      <circle cx="34" cy="14" r="5" />
      <path d="M32 18 L20 30" opacity="0.5" />
    </svg>
  );
}

function DecisionIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#171713" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="14" />
      <path d="M17 24 L22 29 L32 19" />
    </svg>
  );
}

function IdentifyIcon() {
  // an eye
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 24 Q24 10 42 24 Q24 38 6 24 Z" />
      <circle cx="24" cy="24" r="5" fill="#4f72aa" />
    </svg>
  );
}

function PredictIcon() {
  // a rising line chart
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="8" x2="8" y2="40" />
      <line x1="8" y1="40" x2="40" y2="40" />
      <polyline points="12,34 20,26 28,30 38,14" />
    </svg>
  );
}

function LanguageIcon() {
  // a speech bubble
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10 H40 Q44 10 44 14 V28 Q44 32 40 32 H20 L12 38 V32 H8 Q4 32 4 28 V14 Q4 10 8 10 Z" />
      <line x1="12" y1="18" x2="36" y2="18" />
      <line x1="12" y1="24" x2="28" y2="24" />
    </svg>
  );
}

function FaceIcon() {
  // a simple face
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="none" stroke="#4f72aa" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="24" cy="24" r="16" />
      <circle cx="18" cy="21" r="1.6" fill="#4f72aa" />
      <circle cx="30" cy="21" r="1.6" fill="#4f72aa" />
      <path d="M17 30 Q24 35 31 30" />
    </svg>
  );
}
