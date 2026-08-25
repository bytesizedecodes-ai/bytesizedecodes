import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, BikeShape, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 7: "Inside reinforcement learning" (v2 Thread
 * retrofit).
 *
 * Through-line stage: the loop — agent acts, the world answers — staged on
 * the same bike all lesson, with Ishaan from lesson 1 now the rider. Beats:
 * anchor (the loop diagram) → tension made concrete (Ishaan's rides: smooth =
 * reward, fall = penalty) → reveal (repeated attempts escalate into a
 * strategy). The bike keeps its place; only its state changes (fell, steadier,
 * riding with a star).
 */
export function ReinforcementDeepDive() {
  return (
    <Infographic>
      <InfographicHeader
        title="Inside reinforcement learning"
        subtitle="Try, get feedback, try again — learn from rewards"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🔄</span>, label: "Act, world answers" },
          { icon: <span aria-hidden="true">🚲</span>, label: "Ishaan tries riding" },
          { icon: <span aria-hidden="true">🔁</span>, label: "Repeat the tries" },
          { icon: <span aria-hidden="true">🏆</span>, label: "Riding wins" },
        ]}
      />

      {/* Step 1 — the loop, with the shared MachineFigure */}
      <Scene caption="So an agent acts — and the world answers with feedback">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center">
              <MachineFigure label="agent" />
              <div className="mt-1 text-[11px] font-bold text-brand-deep">takes an action</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="text-center text-xl font-bold text-ink">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center">
              <div className="flex h-24 items-center justify-center">
                <BikeShape className="!h-14" />
              </div>
              <div className="text-sm font-bold">the world</div>
              <div className="text-[11px] text-ink">reacts</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="text-center text-xl font-bold text-ink">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand px-4 py-3 text-center text-canvas shadow-sm">
              <div className="flex h-24 items-center justify-center text-3xl" aria-hidden="true">⚖️</div>
              <div className="text-sm font-bold">feedback</div>
              <div className="text-[11px]">reward / penalty</div>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — feedback is reward or penalty, with a concrete scenario */}
      <Scene variant="continue" caption="Then watch Ishaan practise: each try earns a reward or a penalty">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="mb-1 flex items-end justify-center gap-2">
              <BikeShape className="!h-12" />
              <span className="text-2xl" aria-hidden="true">⭐</span>
            </div>
            <div className="text-sm font-bold text-good">Reward — rode smoothly</div>
            <p className="mt-1 text-[11px] font-medium text-ink">&ldquo;that was good — do it more&rdquo;</p>
          </div>
          <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
            <div className="mb-1 flex items-end justify-center gap-2">
              <BikeShape className="!h-12 opacity-60" />
              <span className="text-2xl" aria-hidden="true">⛔</span>
            </div>
            <div className="text-sm font-bold text-bad">Penalty — fell over</div>
            <p className="mt-1 text-[11px] font-medium text-ink">&ldquo;that was bad — avoid it&rdquo;</p>
          </div>
        </div>
      </Scene>

      {/* Step 3 — repeat → strategy emerges */}
      <Scene variant="continue" caption="That's why small wins add up — riding becomes the strategy">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <BikeShape className="!h-8 opacity-40" />
            <span className="text-ink-faint">→</span>
            <BikeShape className="!h-10 opacity-70" />
            <span className="text-ink-faint">→</span>
            <BikeShape className="!h-12" />
            <span className="text-2xl" aria-hidden="true">⭐</span>
          </div>
          <p className="mt-3 text-sm font-medium text-ink sm:text-base">
            Many attempts → rewards add up → riding becomes the strategy.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          No dataset of right answers — just{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">trial and error</span>{" "}
          guided by reward. That&apos;s reinforcement learning.
        </p>
      </Card>
    </Infographic>
  );
}
