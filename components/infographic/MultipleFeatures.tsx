import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, PictureCard, Operator, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 10: "When one feature isn't enough".
 *
 * Layout: ambiguous sample → add a feature → a decision tree of splits.
 * Faithful to Lesson 2.pdf slides 17-23: wheel-count alone leaves a 2-wheel
 * sample uncertain (75/25); adding Height (High/Low) resolves it; the pair of
 * splits forms a decision tree. Picture-led: the tree branches end in car/bike
 * picture cards, not text. Brand blue only. No prose/questions (course rule).
 */
export function MultipleFeatures() {
  return (
    <Infographic>
      <InfographicHeader
        title="When one feature isn't enough"
        subtitle="Ambiguity → add a feature → a tree of decisions"
      />

      {/* Step 1 — one feature leaves you unsure */}
      <Scene caption="① One feature can leave you unsure">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <BikeShape className="!h-14" />
            <span className="absolute -right-6 top-2 text-3xl font-bold text-warm">?</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-ash bg-white px-5 py-3 shadow-sm">
            <span className="text-xs font-bold text-ink-soft">Pr(car | 2 wheels)</span>
            <span className="font-mono text-lg font-bold text-warm">75%</span>
            <span className="text-ink-faint">vs</span>
            <span className="font-mono text-lg font-bold text-warm">25%</span>
          </div>
          <p className="text-center text-xs font-medium text-ink">
            Could still be a car — wheel count alone is not a clean call.
          </p>
        </div>
      </Scene>

      {/* Step 2 — add a second feature (Height) */}
      <Scene caption="② Add a second feature — Height (High / Low)">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <PictureCard
              picture={<CarShape className="!h-12" />}
              label="2 wheels + high → car"
              tone="brand"
            />
          </MotionChild>
          <MotionChild>
            <PictureCard
              picture={<BikeShape className="!h-12" />}
              label="2 wheels + low → bike"
              tone="brand"
            />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Two good features together separate the classes cleanly — 100%.
        </p>
      </Scene>

      {/* Step 3 — the splits form a decision tree */}
      <Scene caption="③ The splits chain into a decision tree">
        <div className="flex flex-col items-center">
          {/* root */}
          <div className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-canvas">
            #Wheel = 4?
          </div>
          <Branch label="yes" />
          <div className="flex items-center gap-6 sm:gap-12">
            <div className="flex flex-col items-center">
              <PictureCard picture={<CarShape className="!h-9" />} label="car" tone="white" />
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-canvas">
                Height = high?
              </div>
              <div className="flex items-start gap-4 pt-1 sm:gap-8">
                <div className="flex flex-col items-center">
                  <Branch label="yes" />
                  <PictureCard picture={<CarShape className="!h-8" />} label="car" tone="white" />
                </div>
                <div className="flex flex-col items-center">
                  <Branch label="no" />
                  <PictureCard picture={<BikeShape className="!h-8" />} label="bike" tone="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          More{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">good</span>{" "}
          features give more ways to separate the classes — chained as a decision tree.
        </p>
      </Card>
    </Infographic>
  );
}

/** A short labelled connector between tree levels. */
function Branch({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-0.5">
      <span className="h-4 w-px bg-ink-faint" aria-hidden="true" />
      <span className="rounded-full bg-ash px-2 py-0.5 text-[10px] font-bold uppercase text-ink-soft">
        {label}
      </span>
      <span className="h-3 w-px bg-ink-faint" aria-hidden="true" />
    </div>
  );
}
