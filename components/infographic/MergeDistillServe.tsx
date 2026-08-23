import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 10: "Merge, distill, serve". The physics
 * (tokens/sec ∝ bandwidth / model bytes), the artifact matrix, and the
 * uniform-delta boundary.
 */
export function MergeDistillServe() {
  return (
    <Infographic>
      <InfographicHeader
        title="Merge, distill, serve"
        subtitle="Decode is bandwidth-bound — the serving math picks the artifact"
      />

      {/* SCENE 1 — the physics */}
      <Scene caption="① One ratio orders the options">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="font-mono text-sm font-bold text-brand-deep">tokens/sec ∝ memory bandwidth ÷ model bytes</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { k: "merge", d: "bytes unchanged", note: "adapter cost was training-time" },
              { k: "quantize", d: "bytes ÷ ~4", note: "a latency optimization too" },
              { k: "distill", d: "bytes ÷ ~2.3 (7B→3B)", note: "the only order-of-magnitude lever" },
            ].map((x) => (
              <div key={x.k} className="rounded-lg bg-brand-wash px-2 py-2">
                <p className="font-mono text-[10px] font-bold text-ink">{x.k}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-ink">{x.d}</p>
                <p className="text-[9px] font-medium text-ink-soft">{x.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Scene>

      {/* SCENE 2 — the branch arithmetic */}
      <Scene caption="② Varta's branch servers: the arithmetic is brutal">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="flex items-center justify-between rounded-xl border border-bad bg-bad-wash px-4 py-2.5">
              <p className="font-mono text-[11px] font-semibold text-ink">7B @ Q4 on CPU (~20 GB/s)</p>
              <p className="font-mono text-xs font-bold text-ink">≈ 6 tok/s ✗</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex items-center justify-between rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="font-mono text-[11px] font-semibold text-ink">7B @ 2-bit (proposed)</p>
              <p className="font-mono text-xs font-bold text-ink">≈ 12 tok/s — still ✗</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex items-center justify-between rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="font-mono text-[11px] font-semibold text-ink">3B distilled @ Q4</p>
              <p className="font-mono text-xs font-bold text-brand-deep">≈ 40+ tok/s ✓</p>
            </div>
          </MotionChild>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Quantization divides the denominator ~2× per step; the envelope needed ~7×. Only shrinking the model moves the
          ratio&apos;s order.
        </p>
      </Scene>

      {/* SCENE 3 — the artifact matrix + economics */}
      <Scene caption="③ The artifact matrix and the one-time bill">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-ash shadow-sm">
          <div className="grid grid-cols-12 bg-ash px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-ink">
            <span className="col-span-5">artifact</span>
            <span className="col-span-4 text-center">target</span>
            <span className="col-span-3 text-right">cost model</span>
          </div>
          {[
            ["7B merged @ Q8", "flagship · on-prem A10", "inference only"],
            ["3B distilled @ Q4", "branch edge · CPU 8 GB", "~60 GPU-hours, one-time"],
            ["adapters (unmerged)", "experiment tier · shared A10", "memory for flexibility"],
          ].map(([a, t, c]) => (
            <div key={a} className="grid grid-cols-12 items-center border-t border-ash bg-surface-elevated px-3 py-2">
              <span className="col-span-5 font-mono text-[10px] font-semibold text-ink">{a}</span>
              <span className="col-span-4 text-center text-[10px] text-ink-soft">{t}</span>
              <span className="col-span-3 text-right text-[10px] font-medium text-ink-soft">{c}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          60 GPU-hours one-time vs 2.3× per-query latency at every branch, forever — payback in days.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ BOUNDARY — compression deltas are NOT uniform across behaviors">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            4-bit noise concentrates on calibration-sensitive behaviors; distillation transfers only what the transfer
            set spans — uncovered behaviors regress to student-native quality.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Varta&apos;s distill: aggregate flat (−0.4), refusal suite −9 — a quadrant failure the average hid. Per-item
            gates on every artifact; artifact-hash → gate-report in the registry.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Merge, distill, quantize — three packagings,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">one bandwidth ratio</span>{" "}
          — and the gate runs on the exact served bytes.
        </p>
      </Card>
    </Infographic>
  );
}
