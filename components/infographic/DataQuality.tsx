import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "Garbage in, garbage out" (data quality).
 *
 * Teaches the foundational principle: a model is only as good as its data.
 * Biased / incomplete data → biased predictions. Shown as two datasets over
 * the same car-vs-bike task — a biased one (only red cars shown) produces a
 * wrong mental model; a balanced one produces the right one. Picture-led with
 * recolored car/bike shapes (the FeaturesAndVectors red-tint technique).
 * Brand blue + semantic good/bad only. No prose/questions (course rule).
 */
export function DataQuality() {
  return (
    <Infographic>
      <InfographicHeader
        title="Garbage in, garbage out"
        subtitle="A model is only as good as the data it learns from"
      />

      {/* Step 1 — a biased dataset */}
      <Scene caption="① A biased dataset: the model only ever saw red cars">
        <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
          <div className="mb-2 text-sm font-bold text-bad">Training data (biased)</div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <RedCar className="!h-8" />
            <RedCar className="!h-8" />
            <RedCar className="!h-8" />
            <RedCar className="!h-8" />
            <RedCar className="!h-8" />
            <RedCar className="!h-8" />
          </div>
          <p className="mt-2 text-[11px] font-medium text-ink">every example is a red car — no bikes, no other colours</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-ink">
          <span>what it learns:</span>
          <span className="rounded-full bg-bad px-2.5 py-1 text-canvas">&ldquo;a car is always red&rdquo;</span>
        </div>
      </Scene>

      {/* Step 2 — the consequence on a new sample */}
      <Scene caption="② Show it a blue car — and it may disagree">
        <Stagger className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-dashed border-brand-deep bg-brand-wash px-4 py-3 text-center">
              <BlueCar className="!h-12" />
              <span className="mt-1 block text-[11px] font-bold text-brand-deep">blue car · ?</span>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="text-xl font-bold text-ink">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-bad bg-bad-wash px-4 py-3 text-center">
              <span className="text-sm font-bold text-bad">&ldquo;not a car?&rdquo;</span>
              <p className="mt-1 text-[11px] text-ink">its data said cars are red</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 3 — a balanced dataset fixes it */}
      <Scene caption="③ A balanced dataset: varied colours, both classes">
        <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
          <div className="mb-2 text-sm font-bold text-good">Training data (balanced)</div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <RedCar className="!h-8" />
            <BlueCar className="!h-8" />
            <CarShape className="!h-8" />
            <BikeShape className="!h-8" />
            <RedCar className="!h-8" />
            <BikeShape className="!h-8" />
          </div>
          <p className="mt-2 text-[11px] font-medium text-ink">varied colours, both classes — the model learns the real pattern</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-ink">
          <span>now a blue car:</span>
          <span className="rounded-full bg-good px-2.5 py-1 text-canvas">&ldquo;that&apos;s a car&rdquo;</span>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Before tuning the algorithm, fix the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">data</span> —
          more good examples usually beats a fancier model.
        </p>
      </Card>
    </Infographic>
  );
}

/** A car tinted red (bias illustration). */
function RedCar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={`h-16 w-auto ${className}`} aria-hidden="true">
      <path d="M8 48 Q10 30 30 28 L42 18 Q60 14 78 18 L92 28 Q108 30 112 48 L112 54 Q112 58 108 58 L92 58 Q88 48 80 48 Q72 48 72 58 L48 58 Q44 48 40 48 Q32 48 32 58 L12 58 Q8 58 8 54 Z"
        fill="var(--color-bad)" stroke="var(--color-bad)" strokeWidth="2" />
      <circle cx="40" cy="56" r="9" fill="var(--tire)" />
      <circle cx="80" cy="56" r="9" fill="var(--tire)" />
    </svg>
  );
}

/** A car tinted blue (a colour the biased model never saw). */
function BlueCar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={`h-16 w-auto ${className}`} aria-hidden="true">
      <path d="M8 48 Q10 30 30 28 L42 18 Q60 14 78 18 L92 28 Q108 30 112 48 L112 54 Q112 58 108 58 L92 58 Q88 48 80 48 Q72 48 72 58 L48 58 Q44 48 40 48 Q32 48 32 58 L12 58 Q8 58 8 54 Z"
        fill="var(--color-brand-deep)" stroke="var(--color-brand-deep)" strokeWidth="2" />
      <circle cx="40" cy="56" r="9" fill="var(--tire)" />
      <circle cx="80" cy="56" r="9" fill="var(--tire)" />
    </svg>
  );
}
