import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 13: "Shipping the adapter".
 * The food-truck opening day: merge (recipes finalized), quantize (kitchen
 * downsized), serve (window faces the street) — with the re-validation gate.
 */
export function ShippingAnAdapter() {
  return (
    <Infographic>
      <InfographicHeader
        title="Shipping the adapter"
        subtitle="Merge → GGUF → Ollama: the tune reaches real traffic"
      />

      {/* SCENE 1 — the merge */}
      <Scene caption="① Merge: the adapter stops existing — in the best way">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated px-3 py-4 text-center shadow-sm">
            <p className="font-mono text-xs font-bold text-ink">W</p>
            <p className="text-[10px] font-medium text-ink-soft">base weights</p>
          </div>
          <span className="font-mono text-sm font-bold text-brand-deep">+ B·A</span>
          <div className="rounded-xl border border-brand bg-brand-wash px-3 py-4 text-center">
            <p className="font-mono text-xs font-bold text-brand-deep">W′</p>
            <p className="text-[10px] font-medium text-ink-soft">same shape, same speed</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          ΔW was always just a matrix — fold it in and the served model has no adapter in it at all. Zero added latency.
        </p>
      </Scene>

      {/* SCENE 2 — the export + re-validation */}
      <Scene caption="② Export to GGUF — and re-run the gate on the EXPORT">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            "merge checkpoint 600 → one model",
            "export GGUF, quantize 4-bit for the VM",
            "re-run the 40-question drawer ON THE EXPORTED FILE",
            "no item regresses → ship; any shift → the export is a suspect",
          ].map((s, i) => (
            <MotionChild key={s}>
              <div
                className={`rounded-xl px-4 py-2.5 text-center text-xs font-medium ${
                  i >= 2 ? "border border-brand bg-brand-wash text-ink" : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {s}
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Merge and quantize are <span className="font-bold">lossy transformations</span> — validate the artifact you
          ship, not its ancestor.
        </p>
      </Scene>

      {/* SCENE 3 — serving */}
      <Scene caption="③ Serve where the requirements say: on the chain's own VM">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
          {["WhatsApp gateway", "Ollama / llama.cpp", "4-bit 3B · CPU, < 1 s", "health data stays on-chain"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-[11px] font-semibold text-ink shadow-sm">
                {s}
              </div>
              {i < 3 && <span className="text-sm font-bold text-ink-soft">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Local serving isn&apos;t the compromise — it was the requirement. And the incumbent stays one config flag away
          for a week.
        </p>
      </Scene>

      {/* SCENE 4 — the versioned artifact */}
      <Scene caption="④ What goes in the registry, per ship">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
          {["adapter", "pack hash", "drawer scores", "GGUF"].map((x) => (
            <div key={x} className="rounded-xl border border-ash bg-surface-elevated px-3 py-2.5 text-center shadow-sm">
              <p className="text-[11px] font-bold text-ink">{x}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Every future retrain re-runs the same gate against the same drawer — reproducibility is four files, not
          folklore.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Merge away the adapter, quantize for the hardware,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">gate the exported
          artifact</span> — then serve.
        </p>
      </Card>
    </Infographic>
  );
}
