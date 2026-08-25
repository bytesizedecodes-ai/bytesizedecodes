import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, PictureCard, Operator, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 11: "Find its neighbors: k-Nearest Neighbors" (v2
 * Thread retrofit).
 *
 * Through-line stage: the same street corner — known cars and bikes parked in
 * the same spots, the dashed newcomer in the middle, every scene. States: all
 * neutral → the five nearest get the ring, the far ones dim to ghosts → the
 * vote tallies into a winner. Beats: hook (a newcomer nobody knows) → reveal
 * (the k closest step forward) → resolution (majority wins). Nothing moves;
 * only attention changes.
 */
export function KnnNeighbors() {
  return (
    <Infographic>
      <InfographicHeader
        title="Find its neighbors"
        subtitle="A new sample takes the class most of its closest neighbors belong to"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">❓</span>, label: "A newcomer arrives" },
          { icon: <span aria-hidden="true">📍</span>, label: "Five nearest step up" },
          { icon: <span aria-hidden="true">🗳️</span>, label: "Count the votes" },
          { icon: <span aria-hidden="true">🏆</span>, label: "Majority wins" },
        ]}
      />

      {/* Step 1 — a new sample arrives among known ones */}
      <Scene caption="So a new, unknown sample arrives among known ones">
        <div className="relative mx-auto flex h-40 max-w-md items-center justify-center">
          {/* known samples scattered */}
          <CarShape className="absolute left-2 top-2 !h-9" />
          <BikeShape className="absolute left-10 top-20 !h-9" />
          <CarShape className="absolute left-24 top-6 !h-9" />
          <BikeShape className="absolute right-24 top-24 !h-9" />
          <CarShape className="absolute right-10 top-4 !h-9" />
          <BikeShape className="absolute right-2 top-20 !h-9" />
          {/* the newcomer, centered, unknown */}
          <div className="relative z-10 rounded-full border-2 border-dashed border-brand-deep bg-brand-wash px-3 py-2">
            <span className="text-2xl font-bold text-brand-deep">?</span>
          </div>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          We know the classes of the others — but not this one.
        </p>
      </Scene>

      {/* Step 2 — find the k closest */}
      <Scene variant="continue" caption="Then the k nearest step forward — here, k = 5">
        <div className="relative mx-auto flex h-40 max-w-md items-center justify-center">
          {/* dimmed far samples */}
          <CarShape className="absolute left-2 top-2 !h-9 opacity-25" />
          <BikeShape className="absolute right-2 top-20 !h-9 opacity-25" />
          {/* the 5 nearest, highlighted */}
          <BikeShape className="absolute left-10 top-20 !h-9 ring-4 ring-brand rounded-full" />
          <CarShape className="absolute left-24 top-6 !h-9 ring-4 ring-brand rounded-full" />
          <CarShape className="absolute left-1/2 top-0 !h-9 -translate-x-1/2 ring-4 ring-brand rounded-full" />
          <CarShape className="absolute right-24 top-24 !h-9 ring-4 ring-brand rounded-full" />
          <BikeShape className="absolute right-10 top-4 !h-9 ring-4 ring-brand rounded-full" />
          {/* newcomer */}
          <div className="relative z-10 rounded-full border-2 border-dashed border-brand-deep bg-brand-wash px-3 py-2">
            <span className="text-2xl font-bold text-brand-deep">?</span>
          </div>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          &ldquo;Closest&rdquo; = most similar in their features.
        </p>
      </Scene>

      {/* Step 3 — majority vote, as picture cards */}
      <Scene caption="That's why the count decides — the majority wins the vote">
        <Stagger className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <MotionChild>
            <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
              <div className="mb-2 flex items-end justify-center gap-1">
                <CarShape className="!h-9" />
                <CarShape className="!h-9" />
                <CarShape className="!h-9" />
              </div>
              <div className="text-sm font-bold text-good">car = 3</div>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <div className="mb-2 flex items-end justify-center gap-1">
                <BikeShape className="!h-9" />
                <BikeShape className="!h-9" />
              </div>
              <div className="text-sm font-bold text-ink-soft">bike = 2</div>
            </div>
          </MotionChild>
        </Stagger>
        <Stagger className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
          <MotionChild>
            <span className="text-sm font-bold text-ink-soft">3 cars vs 2 bikes</span>
          </MotionChild>
          <MotionChild>
            <Operator>→</Operator>
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<CarShape className="!h-10" />} label="car" tone="brand" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          No formula — just{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            ask the neighbors
          </span>{" "}
          and take a vote.
        </p>
      </Card>
    </Infographic>
  );
}
