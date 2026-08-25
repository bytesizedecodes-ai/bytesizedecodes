import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, Operator, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 5: "Inside supervised learning" (v2 Thread retrofit).
 *
 * Through-line stage: the accumulating formula — samples + labels = dataset —
 * stays in the same spot and GROWS one box per Stagger step; then the learned
 * function appears, then the two output shapes. Beats: anchor (build the
 * dataset piece by piece) → reveal (the function) → fade (category vs
 * number). The vehicles are the same street objects Asha's machine has been
 * meeting since lesson 1 — now handed over as labelled flashcards.
 */
export function SupervisedDeepDive() {
  return (
    <Infographic>
      <InfographicHeader
        title="Inside supervised learning"
        subtitle="Samples + labels → a function → a category or a number"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🖼️</span>, label: "Samples plus labels" },
          { icon: <span aria-hidden="true">🗂️</span>, label: "One dataset" },
          { icon: <span aria-hidden="true">🔮</span>, label: "A learned function" },
          { icon: <span aria-hidden="true">🔀</span>, label: "Two answer shapes" },
        ]}
      />

      {/* Step 1 — build the dataset. Builds piece-by-piece. */}
      <Scene caption="So build the labelled dataset — samples plus the answers">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-stretch sm:gap-3">
          {/* Samples */}
          <MotionChild>
            <div className="flex-1 rounded-xl border border-ash bg-ash/40 p-3 text-center">
              <div className="mb-2 flex h-16 items-center justify-center gap-2">
                <CarShape className="!h-10" />
                <BikeShape className="!h-10" />
              </div>
              <div className="text-sm font-bold">Samples</div>
              <div className="text-[11px] text-ink">the inputs</div>
            </div>
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          {/* Labels */}
          <MotionChild>
            <div className="flex-1 rounded-xl border border-ash bg-ash/40 p-3 text-center">
              <div className="mb-2 flex h-16 items-center justify-center gap-2">
                <span className="rounded-full bg-ink px-2 py-1 text-[11px] font-bold text-canvas">car</span>
                <span className="rounded-full bg-ink px-2 py-1 text-[11px] font-bold text-canvas">bike</span>
              </div>
              <div className="text-sm font-bold">Labels</div>
              <div className="text-[11px] text-ink">the answers</div>
            </div>
          </MotionChild>
          <MotionChild>
            <Operator>=</Operator>
          </MotionChild>
          {/* Dataset */}
          <MotionChild>
            <div className="flex-1 rounded-xl border border-brand bg-brand p-3 text-center shadow-sm">
              <div className="mb-2 flex h-16 items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-0.5">
                  <CarShape className="!h-8" />
                  <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-bold text-canvas">car</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <BikeShape className="!h-8" />
                  <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-bold text-canvas">bike</span>
                </div>
              </div>
              <div className="text-sm font-bold">Dataset</div>
              <div className="text-[11px] text-ink">inputs + answers</div>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — the function */}
      <Scene variant="continue" caption="Then the algorithm learns a function (a decision rule)">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <div className="font-mono text-sm font-bold text-ink sm:text-base">
            f( <span className="font-extrabold">dataset</span>,{" "}
            <span className="font-extrabold">new sample</span> ) → prediction
          </div>
          <p className="mt-2 text-xs font-medium text-ink">
            Feed it the data and a new, unseen input → it outputs a prediction.
          </p>
        </div>
      </Scene>

      {/* Step 3 — two output shapes */}
      <Scene variant="continue" caption="That's why the prediction is one of two shapes">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {/* Classification */}
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="mb-2 text-center text-sm font-bold text-ink">
              Classification — a category
            </div>
            <div className="flex h-20 items-center justify-center gap-2">
              <CarShape className="!h-12" />
              <span className="text-2xl font-bold text-ink">→</span>
              <span className="rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-canvas">CAR</span>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-ink">
              car / bike / truck / …
            </p>
          </div>
          {/* Regression */}
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="mb-2 text-center text-sm font-bold text-ink">
              Regression — a number
            </div>
            <div className="flex h-20 items-center justify-center gap-2">
              <span className="text-3xl">🏠</span>
              <span className="text-2xl font-bold text-ink">→</span>
              <span className="font-mono text-base font-bold text-ink">₹20,500</span>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-ink">
              any continuous real value
            </p>
          </div>
        </div>
      </Scene>

      {/* Why both are supervised */}
      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Both depend on the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            labels
          </span>{" "}
          you provided — that&apos;s what makes them supervised.
        </p>
      </Card>
    </Infographic>
  );
}
