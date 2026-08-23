import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 7: "Multi-stage pipelines". The relay:
 * knowledge → behavior → taste; the skip rule; and the erosion boundary
 * with inter-stage gating.
 */
export function MultiStagePipelines() {
  return (
    <Infographic>
      <InfographicHeader
        title="Multi-stage pipelines"
        subtitle="Representation change before behavior before taste — each stage can drop the previous baton"
      />

      {/* SCENE 1 — the ordering derives from what each objective touches */}
      <Scene caption="① The order isn't convention — it's derivable">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            { s: "CPT — continued pretraining", d: "moves representations: what the model KNOWS (raw corpus, LM objective)", hot: false },
            { s: "SFT — supervised fine-tuning", d: "conditions behavior on that knowledge: can't ADD knowledge, only shape expression", hot: false },
            { s: "PREFERENCE — DPO family", d: "adjusts register among behaviors SFT made available: taste over expression", hot: true },
          ].map((x) => (
            <MotionChild key={x.s}>
              <div
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 ${
                  x.hot ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <p className="font-mono text-[11px] font-bold text-ink">{x.s}</p>
                <p className="text-[10px] font-medium text-ink-soft">{x.d}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Reverse the order and the later stage optimizes taste over ignorance — DPO on a model lacking the domain
          representations wastes the stage.
        </p>
      </Scene>

      {/* SCENE 2 — the skip rule */}
      <Scene caption="② Stages are evidence-driven, not ceremonial">
        <div className="mx-auto max-w-md space-y-2">
          {[
            "domain-knowledge gap measured? → CPT (the expensive stage: GPU-days + licensing)",
            "behavior gap after SFT substrate? → SFT (most product fine-tunes start and end here)",
            "taste gap that survives SFT? → DPO",
            "Varta: all three measured → all three stages",
          ].map((s, i) => (
            <MotionChild key={s}>
              <div
                className={`rounded-xl px-4 py-2.5 text-center text-xs font-medium ${
                  i === 3 ? "border border-brand bg-brand-wash font-semibold text-ink" : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {s}
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the erosion incident */}
      <Scene caption="③ The erosion rule: stages don't automatically compose">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-ink">stage 2 gate: receipt format 38/40 ✓ → shipped upstream</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-bad bg-bad-wash px-4 py-2.5">
              <p className="text-[11px] font-bold text-ink">stage 3 DPO ships → format compliance −6 in production</p>
              <p className="mt-0.5 text-[10px] font-medium text-ink-soft">verbosity drift pushed on format-sensitive behavior — the later stage un-trained the earlier one</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-[11px] font-bold text-ink">fix: format-anchored pairs in DPO data + lower final-stage LR</p>
              <p className="mt-0.5 text-[10px] font-medium text-ink-soft">and procedurally: every stage gate re-runs the FULL suite, earlier items included</p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 4 — the artifact */}
      <Scene caption="④ BOUNDARY + artifact — gated checkpoints, one per stage">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the pipeline's last artifact</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            The chain of gated checkpoints — one per stage, each rollback-able, each carrying its full-suite gate report.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Erosion is caught at the handoff or not at all — the gate is the pipeline&apos;s constitution.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Knowledge → behavior → taste; skip stages{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">on measured gaps</span>, and
          gate every handoff.
        </p>
      </Card>
    </Infographic>
  );
}
