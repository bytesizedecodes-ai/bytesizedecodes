import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 6: "The memory arithmetic".
 * The 16-bytes ledger, derived as stacked buckets on one bar — then the
 * LoRA rewrite of the same ledger.
 */
export function TheMemoryArithmetic() {
  const BUCKETS = [
    { label: "fp16 weights", bytes: 2, note: "the model itself" },
    { label: "fp32 master copy", bytes: 4, note: "the optimizer's reference" },
    { label: "Adam moments ×2", bytes: 8, note: "m and v per param" },
    { label: "fp16 gradients", bytes: 2, note: "this step's signal" },
  ];

  return (
    <Infographic>
      <InfographicHeader
        title="The memory arithmetic"
        subtitle="16 bytes a parameter — the ledger that picks your method for you"
      />

      {/* SCENE 1 — the four buckets */}
      <Scene caption="① Training state per parameter — four buckets before activations">
        <Stagger className="mx-auto max-w-lg space-y-2">
          {BUCKETS.map((b) => (
            <MotionChild key={b.label}>
              <div className="flex items-center gap-3">
                <p className="w-32 shrink-0 text-right text-[11px] font-semibold text-ink sm:w-40">{b.label}</p>
                <div className="h-5 rounded-r-md bg-brand" style={{ width: `${b.bytes * 10}%` }} />
                <p className="font-mono text-[11px] font-bold text-brand-deep">{b.bytes} B</p>
              </div>
            </MotionChild>
          ))}
          <MotionChild>
            <div className="flex items-center gap-3">
              <p className="w-32 shrink-0 text-right text-[11px] font-bold text-ink sm:w-40">TOTAL</p>
              <div className="h-5 rounded-r-md bg-brand-deep" style={{ width: "160%" }} />
              <p className="font-mono text-[11px] font-bold text-brand-deep">16 B / param</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The classic misprice is bucket one alone (2 B). Training holds all four — plus activations on top.
        </p>
      </Scene>

      {/* SCENE 2 — the 3B bill vs the card */}
      <Scene caption="② The 3B bill against the free T4">
        <div className="mx-auto max-w-md space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-bad bg-bad-wash px-4 py-2.5">
            <p className="text-xs font-semibold text-ink">full fine-tune · 3B × 16 B</p>
            <p className="font-mono text-sm font-bold text-ink">≈ 48 GB</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
            <p className="text-xs font-semibold text-ink">T4 (free tier) total</p>
            <p className="font-mono text-sm font-bold text-ink">16 GB</p>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5 text-center">
            <p className="text-xs font-semibold text-ink">
              3× short — under <em>any</em> batch size, rate, or trick. The ledger forbids it.
            </p>
          </div>
        </div>
      </Scene>

      {/* SCENE 3 — the LoRA rewrite */}
      <Scene caption="③ Freezing the base rewrites the ledger">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">full fine-tune</div>
            <div className="mt-2 space-y-1.5 font-mono text-[11px] text-ink">
              <p>base (trainable, 16 B) … 48 GB</p>
              <p>optimizer state … included</p>
            </div>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">LoRA route</div>
            <div className="mt-2 space-y-1.5 font-mono text-[11px] text-ink">
              <p>base (frozen, 2 B) … 6 GB</p>
              <p>adapter (~20M × 16 B) … 0.3 GB</p>
              <p className="font-bold text-brand-deep">total ≈ 6.3 GB → fits, with room</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Read-only weights need no master copy, no moments, no gradients — the four buckets collapse to one.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ What the ledger does NOT forbid">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-ink-soft">
            8-bit Adam shaves the constant; paged optimizers absorb spikes — the ledger bends.
          </p>
          <p className="mt-1.5 text-xs font-semibold text-ink">
            But no constant-shave makes 7B full fine-tuning a 16 GB activity —{" "}
            112 GB stays 112 GB. Activations scale with context × batch, so long packs cut the batch dial first.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Price the state, not the weights:{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">16 B/param</span> full, 2
          B/param frozen — the ledger picks the method.
        </p>
      </Card>
    </Infographic>
  );
}
