import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 5: "QLoRA scaling limits". The ledger with
 * the activation term, the regime flip, and the fleet fit matrix.
 */
export function QloraScalingLimits() {
  return (
    <Infographic>
      <InfographicHeader
        title="QLoRA scaling limits"
        subtitle="The floor is easy math — the activation term is where plans die"
      />

      {/* SCENE 1 — the ledger, precise */}
      <Scene caption="① The QLoRA floor: 0.5·P + 16·P_adapter + activations">
        <div className="mx-auto max-w-md space-y-2">
          {[
            ["4-bit base · P/2 bytes", "3B ≈ 1.5 GB · 7B ≈ 3.5 GB"],
            ["adapter @ r16 (16 B each)", "30–60 MB — two orders below base"],
            ["activations · batch × ctx (attn)", "noise at 4k · the budget at 16k"],
          ].map(([k, v], i) => (
            <MotionChild key={k}>
              <div
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 ${
                  i === 2 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <p className="font-mono text-[11px] font-semibold text-ink">{k}</p>
                <p className="text-[10px] font-medium text-ink-soft">{v}</p>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 2 — the flip */}
      <Scene caption="② The regime flip: weight-bound → activation-bound">
        <svg viewBox="0 0 100 56" className="h-auto w-full" aria-hidden="true">
          <line x1="6" y1="48" x2="96" y2="48" stroke="var(--color-ash)" strokeWidth="1" />
          <text x="8" y="55" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">2k ctx</text>
          <text x="42" y="55" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">8k</text>
          <text x="78" y="55" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">16k</text>
          {/* weights line: flat */}
          <path d="M6 16 L94 16" stroke="var(--color-ink-soft)" strokeWidth="1.8" fill="none" />
          <text x="8" y="12" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">weights (flat)</text>
          {/* activations: crossing */}
          <path d="M6 40 C 30 38, 50 30, 66 20 C 78 12, 86 6, 94 4" stroke="var(--color-brand)" strokeWidth="2" fill="none" />
          <text x="66" y="7" fontFamily="monospace" fontSize="4.5" fill="var(--color-brand)" fontWeight="bold">activations</text>
          {/* crossing marker */}
          <circle cx="66" cy="17" r="2.2" fill="var(--color-brand)" />
          <text x="52" y="24" fontFamily="monospace" fontSize="4" fill="var(--color-ink-soft)">← the flip</text>
        </svg>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          Past the crossover, no rank or batch arithmetic rescues the run — the levers become checkpointing (~30% step
          time) and flash attention (exact, blocked softmax).
        </p>
      </Scene>

      {/* SCENE 3 — the fit matrix */}
      <Scene caption="③ The fleet artifact: the fit matrix">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-ash shadow-sm">
          <div className="grid grid-cols-12 bg-ash px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-ink">
            <span className="col-span-5">run</span>
            <span className="col-span-3 text-center">GPU</span>
            <span className="col-span-2 text-center">fits</span>
            <span className="col-span-2 text-right">binding term</span>
          </div>
          {[
            { run: "3B · r16 · 4k ctx", gpu: "T4 16 GB (free)", fits: "✓", term: "weights" },
            { run: "7B · r16 · 4k ctx", gpu: "A10 24 GB", fits: "edge", term: "weights" },
            { run: "7B · r16 · 8k ctx", gpu: "A10 24 GB", fits: "✓ w/ ckpt", term: "activations" },
            { run: "7B · r16 · 16k ctx", gpu: "L4 48 GB", fits: "✓ w/ ckpt", term: "activations" },
            { run: "7B · r16 · 16k ctx", gpu: "T4 16 GB", fits: "✗", term: "activations" },
          ].map(({ run, gpu, fits, term }) => (
            <div key={run + gpu} className="grid grid-cols-12 items-center border-t border-ash bg-surface-elevated px-3 py-2">
              <span className="col-span-5 font-mono text-[10px] font-semibold text-ink">{run}</span>
              <span className="col-span-3 text-center text-[10px] text-ink-soft">{gpu}</span>
              <span className={`col-span-2 text-center font-mono text-[11px] font-bold ${fits.startsWith("✓") ? "text-brand-deep" : "text-ink"}`}>
                {fits}
              </span>
              <span className="col-span-2 text-right text-[10px] font-medium text-ink-soft">{term}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          One row per (model, rank, ctx, batch, GPU) with the binding term labeled — re-run when models or hardware
          change.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ BOUNDARY — where activation compressibility itself breaks">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            Checkpointing and flash attention assume the activation term is compressible — past ~32k context, residual
            attention working sets don&apos;t fit regardless.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            That regime belongs to sequence-parallel training or a smaller model + retrieval — not more optimizer
            tricks.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Easy math for the floor,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">regime analysis for the
          wall</span> — and the binding term labeled per row.
        </p>
      </Card>
    </Infographic>
  );
}
