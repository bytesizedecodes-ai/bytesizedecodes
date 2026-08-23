import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 7: "LoRA from first principles".
 * The rank bottleneck as geometry: a 4096×4096 change that only needs 16
 * directions — ΔW = B·A, derived then priced.
 */
export function LoraFromFirstPrinciples() {
  return (
    <Infographic>
      <InfographicHeader
        title="LoRA from first principles"
        subtitle="ΔW ≈ B·A — the behavior change lives in a thin subspace"
      />

      {/* SCENE 1 — the full matrix vs the two thin ones */}
      <Scene caption="① A 16.7M-cell change, expressed in 16 columns">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-3 sm:gap-6">
          <div className="text-center">
            <div className="mx-auto grid h-28 w-28 grid-cols-8 grid-rows-8 gap-px overflow-hidden rounded-md border border-ash bg-ash p-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="rounded-[1px] bg-ink-soft opacity-60" />
              ))}
            </div>
            <p className="mt-1.5 font-mono text-[11px] font-semibold text-ink">ΔW · 4096×4096</p>
            <p className="text-[10px] font-medium text-ink-soft">16,777,216 params</p>
          </div>
          <span className="text-lg font-bold text-ink-soft">≈</span>
          <div className="flex items-center gap-1.5">
            <div className="flex h-28 w-5 flex-col gap-px overflow-hidden rounded border border-brand bg-brand-wash p-0.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-[1px] bg-brand" />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-ink">·</span>
            <div className="flex h-5 w-28 items-start gap-px overflow-hidden rounded border border-brand bg-brand-wash p-0.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-full w-2 flex-1 rounded-[1px] bg-brand" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="font-mono text-xs font-bold text-brand-deep">
            B (4096×16) · A (16×4096) = 131,072 params — 0.8%
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the derivation ladder */}
      <Scene caption="② Why a thin subspace is enough — the ladder">
        <Stagger className="mx-auto max-w-lg space-y-2">
          {[
            { r: "GROUND", d: "The base model already performs the task's raw skills — what's missing is conditional style.", top: false },
            { r: "RUNG 1", d: "Style/format shifts are consistent, low-complexity changes — they don't scatter across every direction of weight space.", top: false },
            { r: "RUNG 2", d: "A low-complexity change is well-approximated by a low-rank matrix — 16–64 directions cover it.", top: false },
            { r: "TOP — named now", d: "So freeze W, learn ΔW = B·A at small r: LoRA. Empirically matches full tuning for behavior, at 1% of the params.", top: true },
          ].map((rung) => (
            <MotionChild key={rung.r}>
              <div
                className={`rounded-xl px-4 py-2.5 ${
                  rung.top ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <p className={`text-[11px] font-bold tracking-wide ${rung.top ? "text-brand-deep" : "text-ink-soft"}`}>{rung.r}</p>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink">{rung.d}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 3 — rank is the capacity dial */}
      <Scene caption="③ Rank = how many directions the behavior change needs">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3">
          {[
            { r: "r = 8", u: "tone only", fill: "w-1/4" },
            { r: "r = 16", u: "tone + format + refusals", fill: "w-1/2", hot: true },
            { r: "r = 32+", u: "richer multi-behavior blends", fill: "w-4/5" },
          ].map((x) => (
            <div
              key={x.r}
              className={`rounded-xl p-3 text-center shadow-sm ${
                x.hot ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
              }`}
            >
              <p className="font-mono text-xs font-bold text-ink">{x.r}</p>
              <div className="mt-2 flex h-1.5 rounded-full bg-ash">
                <div className={`h-1.5 rounded-full bg-brand ${x.fill}`} />
              </div>
              <p className="mt-1.5 text-[10px] font-medium text-ink-soft">{x.u}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Start at 16; drop to 8 if the drawer shows headroom. Climbing rank for <em>knowledge</em> is the boundary below.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ The premise fails for knowledge injection">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-xs font-semibold text-ink">
            Rank 8 misses the terms → rank 64 barely improves → rank 256 proposed…
          </p>
          <p className="mt-1.5 text-xs font-medium text-ink-soft">
            Stagnant gains across an 8× rank climb is the signature of a <span className="font-bold">high-rank target</span>:
            new knowledge touches broad representations. The right tools are continued pretraining or retrieval — not a
            bigger adapter.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">ΔW = B·A</span> — behavior
          changes are thin; pay for 16 directions, not 16.7 million cells.
        </p>
      </Card>
    </Infographic>
  );
}
