import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, PictureCard, Operator, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 12: "The class center: the centroid classifier" (v2
 * Thread retrofit).
 *
 * Through-line stage: the same two clusters all lesson. States: full crowds →
 * each crowd collapses to ONE starred typical member (the crowd's outline
 * stays as a ghost) → the newcomer lands nearer one star. Beats: anchor (the
 * clusters) → reveal (one average stands for each class) → resolution
 * (nearest star wins). The objects never change identity — only their count
 * per class changes.
 */
export function CentroidClassifier() {
  return (
    <Infographic>
      <InfographicHeader
        title="The class center"
        subtitle="Each class has a typical member — assign the new sample to the nearest one"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">👥</span>, label: "Two full clusters" },
          { icon: <span aria-hidden="true">⭐</span>, label: "One typical each" },
          { icon: <span aria-hidden="true">📏</span>, label: "Measure to newcomer" },
          { icon: <span aria-hidden="true">✅</span>, label: "Nearest star wins" },
        ]}
      />

      {/* Step 1 — each class is a cluster */}
      <Scene caption="So each class is a cluster of samples">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="mb-2 flex items-end justify-center gap-1">
              <CarShape className="!h-9" />
              <CarShape className="!h-9" />
              <CarShape className="!h-9" />
            </div>
            <span className="text-xs font-bold text-ink-soft">all cars</span>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="mb-2 flex items-end justify-center gap-1">
              <BikeShape className="!h-9" />
              <BikeShape className="!h-9" />
              <BikeShape className="!h-9" />
            </div>
            <span className="text-xs font-bold text-ink-soft">all bikes</span>
          </div>
        </div>
      </Scene>

      {/* Step 2 — collapse each cluster to one average member (the centroid) */}
      <Scene variant="continue" caption="Then summarise each cluster by one average member — its center">
        <Stagger className="grid grid-cols-2 gap-4">
          <MotionChild>
            <div className="relative rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="flex h-14 items-center justify-center">
                <CarShape className="!h-12" />
                <span className="absolute right-3 top-3 text-xl" aria-hidden="true">★</span>
              </div>
              <span className="mt-1 block text-xs font-bold text-brand-deep">typical car</span>
              <span className="text-[11px] text-ink">the car center</span>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="relative rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="flex h-14 items-center justify-center">
                <BikeShape className="!h-12" />
                <span className="absolute right-3 top-3 text-xl" aria-hidden="true">★</span>
              </div>
              <span className="mt-1 block text-xs font-bold text-brand-deep">typical bike</span>
              <span className="text-[11px] text-ink">the bike center</span>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          One average stands for the whole class.
        </p>
      </Scene>

      {/* Step 3 — the new sample is closest to one center */}
      <Scene caption="That's why the new sample takes the nearest center — car">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <CarShape className="!h-12" />
            <span className="mt-1 text-[11px] font-bold text-brand-deep">★ car center</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-full border-2 border-dashed border-brand-deep bg-brand-wash px-3 py-2">
              <span className="text-2xl font-bold text-brand-deep">?</span>
            </div>
            <span className="mt-1 text-[11px] font-bold text-good">nearer ★</span>
          </div>
          <div className="flex flex-col items-center opacity-50">
            <BikeShape className="!h-12" />
            <span className="mt-1 text-[11px] font-bold text-ink-soft">★ bike center</span>
          </div>
        </div>
        <Stagger className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
          <MotionChild>
            <span className="text-sm font-bold text-ink-soft">closest to the car center</span>
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
          Compare to one{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            typical member
          </span>{" "}
          per class — not to every sample.
        </p>
      </Card>
    </Infographic>
  );
}
