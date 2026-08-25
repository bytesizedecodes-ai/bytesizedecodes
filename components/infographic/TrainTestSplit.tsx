import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "Don't grade on what you studied" (train/test
 * split) (v2 Thread retrofit).
 *
 * Through-line stage: ONE pile of labelled cards, sitting in the same spot all
 * lesson. States: whole → cut into two piles (train grows the accent, test
 * takes the dashed sealed border) → the grading contrast (studied paper vs
 * sealed paper). Beats: anchor (one full pile) → reveal (the split) → why
 * (memory vs generalisation). The cards are the same vehicles the course has
 * been labelling since lesson 5.
 */
export function TrainTestSplit() {
  return (
    <Infographic>
      <InfographicHeader
        title="Don't grade on what you studied"
        subtitle="Split your data: train on one part, test on a part it's never seen"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🗃️</span>, label: "One labelled pile" },
          { icon: <span aria-hidden="true">✂️</span>, label: "Cut it in two" },
          { icon: <span aria-hidden="true">🔒</span>, label: "Keep test sealed" },
          { icon: <span aria-hidden="true">🎓</span>, label: "Grade on unseen" },
        ]}
      />

      {/* Step 1 — the whole dataset */}
      <Scene caption="So you start with one pile of labelled examples">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <CarShape className="!h-9" />
          <BikeShape className="!h-9" />
          <CarShape className="!h-9" />
          <BikeShape className="!h-9" />
          <CarShape className="!h-9" />
          <BikeShape className="!h-9" />
          <CarShape className="!h-9" />
          <BikeShape className="!h-9" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Your full dataset — every sample labelled.
        </p>
      </Scene>

      {/* Step 2 — split into two piles */}
      <Scene variant="continue" caption="Then cut it into two piles — train and test">
        <Stagger className="grid grid-cols-2 gap-4">
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="mb-2 text-sm font-bold text-brand-deep">Training set</div>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <CarShape className="!h-8" />
                <BikeShape className="!h-8" />
                <CarShape className="!h-8" />
                <BikeShape className="!h-8" />
                <CarShape className="!h-8" />
                <BikeShape className="!h-8" />
              </div>
              <p className="mt-2 text-[11px] font-medium text-ink">the model learns from these (~80%)</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-dashed border-ink-faint bg-surface-elevated p-4 text-center shadow-sm">
              <div className="mb-2 text-sm font-bold text-ink-soft">Test set</div>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <CarShape className="!h-8" />
                <BikeShape className="!h-8" />
              </div>
              <p className="mt-2 text-[11px] font-medium text-ink">hidden — used only to grade (~20%)</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 3 — why */}
      <Scene variant="continue" caption="That's why they stay separate — grading on studied data measures memory">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-bad">Grade on training data</div>
            <p className="mt-1 text-[11px] font-medium text-ink">
              It already saw the answers → 100%, but it might have just memorized.
            </p>
          </div>
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-good">Grade on test data</div>
            <p className="mt-1 text-[11px] font-medium text-ink">
              New questions → a real measure of whether it learned to generalize.
            </p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          A model is only as good as its score on{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">unseen</span>{" "}
          data — not the data it studied.
        </p>
      </Card>
    </Infographic>
  );
}
