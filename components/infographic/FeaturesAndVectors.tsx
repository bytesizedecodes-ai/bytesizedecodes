import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, PictureCard, Operator, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 8: "Representing samples as features" (v2 Thread
 * retrofit).
 *
 * Through-line stage: ONE vehicle — the car that keeps stopping at Asha's
 * gate — and its feature form. The form fills one chip at a time, collapses
 * into a single row of numbers (the vector), and then Color is shown the door
 * as a bad feature. Beats: anchor (describe with features) → the vector forms
 * → tension (not every feature helps; red cars and red bikes share Color).
 * The vehicle never moves; only its description changes state.
 */
export function FeaturesAndVectors() {
  return (
    <Infographic>
      <InfographicHeader
        title="Representing samples as features"
        subtitle="Turn a real object into numbers a machine can read"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🚗</span>, label: "One visitor arrives" },
          { icon: <span aria-hidden="true">📋</span>, label: "Fill in the form" },
          { icon: <span aria-hidden="true">🔢</span>, label: "A row of numbers" },
          { icon: <span aria-hidden="true">✂️</span>, label: "Cut useless features" },
        ]}
      />

      {/* Step 1 — one object, several features */}
      <Scene caption="So Asha describes each visitor with features — numbers her machine can read">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
          <CarShape />
          <div className="flex flex-wrap justify-center gap-2">
            <FeatureChip label="#Wheel" value="4" />
            <FeatureChip label="Height" value="6" />
            <FeatureChip label="Weight" value="500" />
            <FeatureChip label="Color" value="Red" />
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The features describe the object: #Wheel, Height, Weight, Color.
        </p>
      </Scene>

      {/* Step 2 — the formula builds: Object = value per feature */}
      <Scene variant="continue" caption="Then each sample becomes a list of values — a vector">
        <Stagger className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <MotionChild>
            <div className="flex min-w-[7rem] flex-col items-center gap-2 rounded-xl border border-ash bg-surface-elevated px-4 py-4 text-center shadow-sm">
              <CarShape className="!h-12" />
              <span className="text-xs font-bold text-ink">a sample</span>
            </div>
          </MotionChild>
          <MotionChild>
            <Operator>=</Operator>
          </MotionChild>
          <MotionChild>
            <div className="flex min-w-[9rem] flex-col items-center gap-1 rounded-xl border border-brand bg-brand px-4 py-4 text-center shadow-sm">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <FeatureChip label="#Wheel" value="4" />
                <FeatureChip label="Height" value="6" />
                <FeatureChip label="Weight" value="500" />
                <FeatureChip label="Color" value="Red" />
              </div>
              <span className="text-[11px] font-bold text-ink">a list of values (a vector)</span>
              <span className="text-[11px] text-ink">one value per feature</span>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 3 — good vs bad features, shown with pictures */}
      <Scene variant="continue" caption="But not every feature helps — compare Color with #Wheel">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {/* Good feature: #Wheel separates the classes */}
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="mb-2 text-sm font-bold text-good">#Wheel — a good feature</div>
            <div className="flex items-end justify-center gap-4">
              <PictureCard picture={<CarShape className="!h-10" />} label="4 → car" tone="white" />
              <PictureCard picture={<BikeShape className="!h-10" />} label="2 → bike" tone="white" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink">different wheels → different class</p>
          </div>
          {/* Bad feature: Color is shared by both classes */}
          <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
            <div className="mb-2 text-sm font-bold text-bad">Color — a bad feature</div>
            <div className="flex items-end justify-center gap-4">
              <PictureCard picture={<RedCarCard />} label="red car" tone="white" />
              <PictureCard picture={<RedBikeCard />} label="red bike" tone="white" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink">same color → tells you nothing</p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          A sample becomes a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">vector</span>{" "}
          — keep only features that actually separate the classes.
        </p>
      </Card>
    </Infographic>
  );
}

/** A small feature pill: feature name + its value for this sample. */
function FeatureChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-wash px-3 py-1.5 text-xs font-semibold text-ink">
      <span className="font-bold text-brand-deep">{label}</span>
      <span>{value}</span>
    </span>
  );
}

/** A car tinted red — to show color is shared by both classes. */
function RedCarCard() {
  return (
    <svg viewBox="0 0 120 70" className="h-10 w-auto" aria-hidden="true">
      <path d="M8 48 Q10 30 30 28 L42 18 Q60 14 78 18 L92 28 Q108 30 112 48 L112 54 Q112 58 108 58 L92 58 Q88 48 80 48 Q72 48 72 58 L48 58 Q44 48 40 48 Q32 48 32 58 L12 58 Q8 58 8 54 Z"
        fill="var(--color-bad)" stroke="var(--color-bad)" strokeWidth="2" />
      <circle cx="40" cy="56" r="9" fill="var(--tire)" />
      <circle cx="80" cy="56" r="9" fill="var(--tire)" />
    </svg>
  );
}

/** A bike tinted red — same color, different class = useless feature. */
function RedBikeCard() {
  return (
    <svg viewBox="0 0 120 80" className="h-10 w-auto" aria-hidden="true">
      <circle cx="28" cy="56" r="18" fill="none" stroke="var(--tire)" strokeWidth="3" />
      <circle cx="92" cy="56" r="18" fill="none" stroke="var(--tire)" strokeWidth="3" />
      <path d="M28 56 L55 30 L75 30 L92 56 M55 30 L70 56 M75 30 L70 56"
        stroke="var(--color-bad)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
