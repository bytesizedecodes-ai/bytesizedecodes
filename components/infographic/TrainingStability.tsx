import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 6: "Training stability". The loud triage
 * (spikes), the quiet contracts (packing masks, length grouping), and the
 * boundary where stability tooling stops mattering.
 */
export function TrainingStability() {
  return (
    <Infographic>
      <InfographicHeader
        title="Training stability"
        subtitle="The loud failures alarm; the quiet ones just degrade — until the log explains why"
      />

      {/* SCENE 1 — the spike triage */}
      <Scene caption="① Two spikes, opposite responses">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">single-step · recovers</div>
            <svg viewBox="0 0 100 30" className="mt-1 h-auto w-full" aria-hidden="true">
              <path d="M4 22 L34 20 L40 6 L46 21 L94 16" fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.6" />
            </svg>
            <p className="mt-1 text-[11px] font-semibold text-ink">DATA fault — locate the batch, inspect the row</p>
            <p className="text-[10px] font-medium text-ink-soft">cost: minutes, zero GPU</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">sustained climb</div>
            <svg viewBox="0 0 100 30" className="mt-1 h-auto w-full" aria-hidden="true">
              <path d="M4 24 C 30 22, 50 18, 66 10 C 78 4, 86 8, 94 5" fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.6" />
            </svg>
            <p className="mt-1 text-[11px] font-semibold text-ink">OPTIMIZER fault — rollback to checkpoint, change the variable</p>
            <p className="text-[10px] font-medium text-ink-soft">cost: partial re-run</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 2 — the quiet contracts */}
      <Scene caption="② Throughput tricks carry correctness contracts">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            { t: "packing + block-diagonal masks", c: "unmasked packing leaks doc 17's tail into doc 18's context — cross-document continuation, invisible on the loss chart" },
            { t: "length-grouped sampling", c: "bounded grouping only — over-grouping drifts batch composition off the data distribution" },
            { t: "deterministic restart", c: "checkpoint = weights + optimizer state + data-order seed — resume is boring by design" },
          ].map((x) => (
            <MotionChild key={x.t}>
              <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
                <p className="font-mono text-[11px] font-bold text-ink">{x.t}</p>
                <p className="mt-0.5 text-[11px] font-medium text-ink-soft">{x.c}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 3 — the incident pattern */}
      <Scene caption="③ The quiet failure in person">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-ink">packing enabled · throughput ×2 · loss chart immaculate</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-ink">…model increasingly continues documents mid-sentence</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5 text-center">
              <p className="text-[11px] font-bold text-ink">the eval gate caught what the loss chart couldn&apos;t — the mask contract was violated</p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ BOUNDARY — stability ≠ learning the right thing">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            The kit presumes gradients worth stabilizing. At 500 pairs, the run will be gloriously stable and perfectly
            overfit — overfitting isn&apos;t instability, it&apos;s optimization succeeding at the wrong objective.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Run both gauges: the health dashboard AND the transfer eval from the first checkpoint. Neither substitutes
            for the other.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Loud failures alarm,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">quiet failures
          contract-check</span> — and stability tooling serves the healthy-data regime only.
        </p>
      </Card>
    </Infographic>
  );
}
