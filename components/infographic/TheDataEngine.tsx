import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 2: "The data engine". The refinery: three
 * wells, the cracking loop, the assay gate — and the license ledger that
 * lets the biggest well close.
 */
export function TheDataEngine() {
  return (
    <Infographic>
      <InfographicHeader
        title="The data engine"
        subtitle="A refinery, not a mine: three wells, one cracking loop, assay on every batch"
      />

      {/* SCENE 1 — the three wells */}
      <Scene caption="① Three wells, one supply problem">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            { w: "real teller logs", v: "~40k usable exchanges post-anonymization", c: "licensed, PII-scrubbed, per-row provenance" },
            { w: "synthetic scenarios", v: "template families × LLM expansion", c: "human spot-check 5%, template ID logged" },
            { w: "distilled frontier outputs", v: "real questions → teacher answers → bilingual edits", c: "ToS-permitting provider, version logged", hot: true },
          ].map((x) => (
            <MotionChild key={x.w}>
              <div
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 ${
                  x.hot ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <div>
                  <p className="font-mono text-[11px] font-bold text-ink">{x.w}</p>
                  <p className="text-[10px] font-medium text-ink-soft">{x.c}</p>
                </div>
                <p className="text-[11px] font-semibold text-ink">{x.v}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Regional-language scarcity forces the mix to ~30% real / 70% synthetic+distilled — and synthetic imports the
          generator&apos;s biases unless counterweighted.
        </p>
      </Scene>

      {/* SCENE 2 — the cracking loop */}
      <Scene caption="② Cracking: dedup → near-dup → decontaminate">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
          {["exact dedup", "MinHash near-dup clusters", "decon vs ALL org evals", "counterweight re-mix"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-[10px] font-semibold text-ink shadow-sm">
                {s}
              </div>
              {i < 3 && <span className="text-sm font-bold text-ink-soft">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Corpus-scale failures are statistical: one leaked benchmark question upstream poisons every model trained on
          the batch.
        </p>
      </Scene>

      {/* SCENE 3 — the assay */}
      <Scene caption="③ The assay gates release on batch-level stats">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3">
          {[
            { k: "dup rate", v: "< 3%", note: "9% flagged one template family" },
            { k: "eval hits", v: "0", note: "against every org suite" },
            { k: "synth/real", v: "in band", note: "drift = distribution shifting" },
          ].map((x) => (
            <div key={x.k} className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{x.k}</p>
              <p className="mt-1 font-mono text-sm font-bold text-brand-deep">{x.v}</p>
              <p className="mt-0.5 text-[9px] font-medium text-ink-soft">{x.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Batch-level controls catch what per-row review structurally cannot.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary: the closable well */}
      <Scene caption="④ BOUNDARY — the ledger exists so the well can close">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            Distillation stands on the teacher&apos;s ToS permitting training use — provider/tier/jurisdiction dependent,
            and retroactively changed before.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            The hedge: per-row provenance makes every distilled row quarantine-able in one filter; the assay tracks the
            synthetic-only counterfactual. Design the refinery so the well can close.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Wells, cracking, assay — and a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">license ledger</span> that
          turns a ToS earthquake into a config change.
        </p>
      </Card>
    </Infographic>
  );
}
