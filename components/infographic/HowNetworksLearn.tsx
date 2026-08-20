import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 2: "The optimizer decides".
 * SGD → momentum → Adam → schedules, with Mango's training log as evidence.
 * Counter-beat: schedule and optimizer discipline beat architecture fiddling.
 */
export function HowNetworksLearn() {
  return (
    <Infographic>
      <InfographicHeader
        title="The optimizer decides"
        subtitle="Mango Labs, week 2: the model is fine — the walk down the hill is the problem"
      />

      {/* Beat 1 — the problem: training pathology */}
      <Scene caption="① The log every practitioner has stared at">
        <Stagger className="space-y-2">
          <MotionChild>
            <LogRow run="run A · lr 1e-5" behavior="loss 2.401 → 2.398 → 2.397 — three epochs, nothing" diagnosis="steps too small: crawling" />
          </MotionChild>
          <MotionChild>
            <LogRow run="run B · lr 1e-1" behavior="loss 2.41 → NaN by step 300" diagnosis="steps too large: diverged" />
          </MotionChild>
          <MotionChild>
            <LogRow run="run C · lr 3e-4 + Adam" behavior="2.41 → 0.83 in one epoch — and keeps falling" diagnosis="the zone" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Same architecture, same data, same loss. <span className="font-bold text-brand-deep">Only the walk changed.</span>
        </p>
      </Scene>

      {/* Beat 2 — vanilla SGD and its two failure modes */}
      <Scene caption="② SGD: step opposite the average slope of a mini-batch">
        <Stagger className="space-y-2">
          <MotionChild>
            <OptRow name="Vanilla SGD" formula="w ← w − lr · ∇loss" note="each mini-batch's slope is a noisy estimate — cheap, but rattles across ravines and stalls on plateaus" />
          </MotionChild>
          <MotionChild>
            <OptRow name="+ Momentum" formula="v ← β·v + ∇loss;  w ← w − lr · v" note="a rolling ball: inertia carries it across flat floors and through diagonal ravines instead of bouncing wall to wall" />
          </MotionChild>
          <MotionChild>
            <OptRow name="+ Adam" formula="per-parameter lr, adapted to its own gradient history" note="every dial gets its own stride — flat directions speed up, spiky ones calm down. The default that trains most things" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Adam ≈ momentum + per-parameter step sizes. Default choice; SGD+momentum still wins some
          vision workloads when tuned patiently.
        </p>
      </Scene>

      {/* Beat 3 — schedules */}
      <Scene caption="③ The rate is not a constant — it's a trajectory">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <PhaseCard phase="Warmup" detail="start tiny, climb — early gradients are garbage; big steps on garbage explode the weights" />
          </MotionChild>
          <MotionChild>
            <PhaseCard phase="Hold" detail="the productive training phase — most learning happens here at the peak rate" accent />
          </MotionChild>
          <MotionChild>
            <PhaseCard phase="Decay" detail="shrink toward the end — fine carving; big steps would knock the model out of the minimum it found" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the counter-beat */}
      <Scene caption="④ The discipline: where to spend your debugging hours">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-[12px] font-medium leading-relaxed text-ink sm:text-sm">
            Mango burned two days swapping layer widths (run A vs run B were the <em>same</em> architecture).
            The fix was <span className="font-bold">20 minutes of learning-rate work</span>: warmup 500 steps,
            cosine decay, AdamW. <span className="font-bold">Optimizer and schedule first; architecture tenth.</span>
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          A model that &quot;won&apos;t train&quot; is almost always an optimization failure, not a modeling one:
          <strong> rate, momentum, schedule — in that order — before touching the architecture.</strong>
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function LogRow({ run, behavior, diagnosis, accent = false }: { run: string; behavior: string; diagnosis: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10.5px] font-bold text-ink">{run}</div>
        <p className="mt-0.5 font-mono text-[10px] font-medium text-ink-soft">{behavior}</p>
        <p className="mt-0.5 text-[10.5px] font-semibold text-brand-deep">{diagnosis}</p>
      </div>
    </div>
  );
}

function OptRow({ name, formula, note, accent = false }: { name: string; formula: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{name}</div>
        <div className="mt-0.5 font-mono text-[9.5px] font-semibold text-brand-deep">{formula}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
    </div>
  );
}

function PhaseCard({ phase, detail, accent = false }: { phase: string; detail: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="font-mono text-[11px] font-bold text-ink">{phase}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
    </div>
  );
}
