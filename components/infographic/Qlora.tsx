import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 8: "QLoRA". The memory stack redrawn:
 * 4-bit frozen base, 16-bit adapters above it, and the gradient path that
 * makes the noise safe — with the calibration boundary.
 */
export function Qlora() {
  return (
    <Infographic>
      <InfographicHeader
        title="QLoRA: a 4-bit base under the adapter"
        subtitle="Store the frozen base at ~0.5 bytes/param — dequantize on the fly"
      />

      {/* SCENE 1 — the ledger line rewritten */}
      <Scene caption="① The frozen-base line, rewritten">
        <div className="mx-auto max-w-md space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
            <p className="text-xs font-semibold text-ink">3B base · fp16 frozen</p>
            <p className="font-mono text-sm font-bold text-ink">≈ 6 GB</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
            <p className="text-xs font-semibold text-ink">3B base · 4-bit frozen</p>
            <p className="font-mono text-sm font-bold text-brand-deep">≈ 1.5 GB</p>
          </div>
          <p className="text-center text-[11px] font-medium text-ink-soft">
            same rule the ship lesson reuses: read-only weights don&apos;t need full precision in memory
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the stack */}
      <Scene caption="② The training stack, one forward pass">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            { l: "LoRA adapters · 16-bit · TRAINABLE", tone: "brand" },
            { l: "dequantize → matmul → re-quantize · per layer, on the fly", tone: "plain" },
            { l: "base weights · 4-bit NF4 · FROZEN", tone: "plain" },
          ].map((row) => (
            <MotionChild key={row.l}>
              <div
                className={`rounded-xl px-4 py-3 text-center font-mono text-[11px] font-semibold ${
                  row.tone === "brand"
                    ? "border border-brand bg-brand-wash text-brand-deep"
                    : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {row.l}
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Whole run on a free T4: ~1.5 GB base + adapter state + activations — comfortable, with headroom.
        </p>
      </Scene>

      {/* SCENE 3 — the gradient path */}
      <Scene caption="③ Why the noise can't compound">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-2 sm:gap-4">
          {["loss", "∂ adapter (16-bit)", "frozen 4-bit base = constant", "update adapter"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`rounded-lg px-2.5 py-2 text-center text-[10px] font-bold ${
                  i === 2 ? "bg-ash text-ink-soft" : i === 1 ? "bg-brand-wash text-brand-deep" : "border border-ash bg-surface-elevated text-ink"
                }`}
              >
                {s}
              </div>
              {i < 3 && <span className="text-sm font-bold text-ink-soft">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The trained parameters are 16-bit; the base is a <span className="font-bold">constant</span> in the
          computation — noise in a constant shifts the optimum slightly, it never compounds through updates.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ When the photocopy's blur shows">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">absorbs the noise</div>
            <p className="mt-1 text-xs font-semibold text-ink">tone · format · refusals</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">behavior targets — drawer shows no gap</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">can degrade</div>
            <p className="mt-1 text-xs font-semibold text-ink">numeric calibration · risk scores</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">A/B against the 16-bit control before blaming the data</p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The base is frozen, so store it{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">cheap and noisy</span> — the
          adapters learn against a fixed landscape.
        </p>
      </Card>
    </Infographic>
  );
}
