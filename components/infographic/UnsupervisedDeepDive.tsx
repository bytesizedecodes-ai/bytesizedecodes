import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "Inside unsupervised learning" (v2 Thread retrofit).
 *
 * Through-line stage: the SAME sample objects all lesson; the only thing that
 * changes is what stands beside them — first a "no labels" card (the answers
 * that supervised learning got, left out as a ghost), then the question the
 * machine asks itself, then the structure it finds (groups, pairs). Beats:
 * anchor (samples only) → tension (no target answer) → reveal (structure
 * emerges on its own).
 */
export function UnsupervisedDeepDive() {
  return (
    <Infographic>
      <InfographicHeader
        title="Inside unsupervised learning"
        subtitle="No labels — the algorithm finds the structure on its own"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🖼️</span>, label: "Samples, no answers" },
          { icon: <span aria-hidden="true">🚫</span>, label: "No labels given" },
          { icon: <span aria-hidden="true">👥</span>, label: "Groups emerge" },
          { icon: <span aria-hidden="true">🛒</span>, label: "Pairs that travel" },
        ]}
      />

      {/* Step 1 — raw samples, no labels. */}
      <Scene caption="So start with samples only — no answers given">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:gap-3">
          <MotionChild>
            <div className="flex-1 rounded-xl border border-ash bg-ash/40 p-3 text-center">
              <div className="mb-2 flex h-16 items-center justify-center gap-2">
                <CarShape className="!h-10" />
                <BikeShape className="!h-10" />
                <CarShape className="!h-10" />
                <BikeShape className="!h-10" />
              </div>
              <div className="text-sm font-bold">Samples</div>
              <div className="text-[11px] text-ink">just the inputs</div>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex-1 rounded-xl border border-dashed border-ink-faint bg-surface-elevated p-3 text-center">
              <div className="mb-2 flex h-16 items-center justify-center">
                <span className="text-2xl text-ink-faint">∅</span>
              </div>
              <div className="text-sm font-bold text-ink-faint">No labels</div>
              <div className="text-[11px] text-ink-faint">no answers</div>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — the task is to find structure */}
      <Scene variant="continue" caption="But with no target answer, it asks its own questions">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium text-ink sm:text-base">
            No target answer — instead it asks{" "}
            <span className="font-bold">“what groups together?”</span> and{" "}
            <span className="font-bold">“what tends to co-occur?”</span>
          </p>
        </div>
      </Scene>

      {/* Step 3 — two kinds of structure it finds */}
      <Scene variant="continue" caption="Then two kinds of structure fall out — groups, and pairs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {/* Clustering */}
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="mb-2 text-center text-sm font-bold text-ink">
              Clustering — groups
            </div>
            <div className="flex h-20 items-center justify-center gap-3">
              <div className="flex flex-col items-center rounded-lg bg-brand-wash px-2 py-1">
                <CarShape className="!h-8" />
                <CarShape className="!h-8" />
              </div>
              <div className="flex flex-col items-center rounded-lg bg-warm-wash px-2 py-1">
                <BikeShape className="!h-8" />
                <BikeShape className="!h-8" />
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-ink">
              similar items land together
            </p>
          </div>
          {/* Association rules */}
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="mb-2 text-center text-sm font-bold text-ink">
              Association — “buy X → likely Y”
            </div>
            <div className="flex h-20 items-center justify-center gap-2">
              <span className="text-3xl">🛒</span>
              <span className="text-2xl font-bold text-ink">→</span>
              <span className="text-3xl">🍞</span>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-ink">
              items that often appear together
            </p>
          </div>
        </div>
      </Scene>

      {/* Why it's unsupervised */}
      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          No labels means the algorithm invents its own{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            structure
          </span>{" "}
          — that&apos;s what makes it unsupervised.
        </p>
      </Card>
    </Infographic>
  );
}
