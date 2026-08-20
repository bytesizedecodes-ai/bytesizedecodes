import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 4: "Harness vs Fine-Tuning".
 *
 * Course case: 50k labeled refund tickets — fine-tune a judgment model or
 * keep prompting at 40k req/day? The capability-matrix scene (style vs facts
 * vs judgment × change frequency), the cost math beat, and the distillation
 * arrow. Expert register: the matrix carries the argument, prose captions it.
 */
export function HarnessVsFinetuning() {
  return (
    <Infographic>
      <InfographicHeader
        title="Weights or scaffolding?"
        subtitle="50k labeled refund tickets and 40k requests a day — where does the capability belong?"
      />

      {/* Beat 1 — the capability matrix */}
      <Scene caption="① What each layer is actually good at">
        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-separate border-spacing-1 text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                  <th className="w-32">Capability</th>
                  <th>Harness (prompt + tools)</th>
                  <th>Fine-tuning (weights)</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium leading-relaxed">
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Facts &amp; knowledge</td>
                  <td className="rounded-lg border border-brand bg-brand-wash px-2.5 py-2 text-ink">wins — retrieval is fresh, auditable, cheap to fix</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">loses — knowledge injection is unreliable, stale by training day</td>
                </tr>
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Style &amp; format</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">works, but re-paid in tokens on every request</td>
                  <td className="rounded-lg border border-brand bg-brand-wash px-2.5 py-2 text-ink">wins — baked into weights, zero per-call cost, unfailingly consistent</td>
                </tr>
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Narrow judgment</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">fine with examples — until volume × latency × cost bite</td>
                  <td className="rounded-lg border border-brand bg-brand-wash px-2.5 py-2 text-ink">wins at scale — if labels exist and the task drifts slowly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — the cost math */}
      <Scene caption="② Relay's refund-judgment math">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">keep prompting</div>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-ink">
                40k req/day × ~1.8k tok
                <br />≈ €72/day, forever
              </p>
              <p className="mt-2 text-[10.5px] font-medium leading-relaxed text-ink-soft">
                changes ship in minutes; every fix is a diff.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">fine-tune the small model</div>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-ink">
                1 train run (50k labels)
                <br />≈ €40/day serving + re-train on drift
              </p>
              <p className="mt-2 text-[10.5px] font-medium leading-relaxed text-ink-soft">
                breaks even in weeks — if the labels are clean and policy drifts slowly.
              </p>
            </div>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Relay shipped the fine-tune for refund <span className="font-bold">classification only</span> —
          and kept policy facts in retrieval. The distillation arrow: big model judges during
          training, small model serves.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Facts live in the harness; style and high-volume narrow judgment earn their way into
          the weights — proven by the eval suite, paid back by the cost math.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
