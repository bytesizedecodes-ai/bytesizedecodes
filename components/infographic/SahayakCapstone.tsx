import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 14 (capstone): "The Sahayak decision
 * log". The whole build on one page: nine rows, each with evidence and
 * artifact — then the log under stress.
 */
export function SahayakCapstone() {
  const rows = [
    { n: 1, d: "behavior → SFT · facts → RAG · campaigns → prompt", e: "84M tokens/mo of repeated instructions" },
    { n: 2, d: "800 pairs: dedup, decontaminate, 20% general", e: "leak check vs the 40-question drawer" },
    { n: 3, d: "model template, verbatim user turns", e: "rendered-bytes rule" },
    { n: 4, d: "completion-only loss", e: "loss only on generated tokens" },
    { n: 5, d: "QLoRA rank 16, LR 2e-4", e: "ledger: 48 GB full vs 6 GB adapter on a 16 GB T4" },
    { n: 6, d: "checkpoint every 200 steps", e: "two-curve chart, parrot watch" },
    { n: 7, d: "ship checkpoint 600", e: "drawer peak 86/100 — not lowest train loss" },
    { n: 8, d: "rubric gate + template contract in CI", e: "per-item no-regression + byte equality" },
    { n: 9, d: "merge → 4-bit GGUF → Ollama on-chain", e: "drawer re-run on the exported artifact" },
  ];

  return (
    <Infographic>
      <InfographicHeader
        title="Capstone: the Sahayak decision log"
        subtitle="Nine decisions, each with its evidence — one page a new engineer could run from"
      />

      {/* SCENE 1 — the log */}
      <Scene caption="① The whole build, one page">
        <div className="mx-auto max-w-2xl space-y-1.5">
          {rows.map((r) => (
            <MotionChild key={r.n}>
              <div
                className={`flex items-start gap-3 rounded-xl px-3.5 py-2 shadow-sm ${
                  r.n === 7 || r.n === 8 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
                }`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[10px] font-bold text-canvas">
                  {r.n}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">{r.d}</p>
                  <p className="text-[10px] font-medium text-ink-soft">evidence: {r.e}</p>
                </div>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 2 — the loop */}
      <Scene caption="② The pipeline the log describes, with its loop">
        <div className="mx-auto max-w-md space-y-1.5">
          {["DECIDE", "DATA", "FORMAT", "TRAIN", "GATE", "SHIP"].map((s, i) => (
            <div key={s} className="flex items-center justify-center gap-2">
              <div
                className={`w-40 rounded-lg px-3 py-2 text-center font-mono text-[11px] font-bold ${
                  i === 4 ? "border border-brand bg-brand-wash text-brand-deep" : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {s}
              </div>
              {i === 5 && (
                <span className="ml-2 text-[10px] font-medium text-ink-soft">
                  ↺ gate fails → fix the named row, retrain, re-gate
                </span>
              )}
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the log under stress */}
      <Scene caption="③ Three earthquakes, three re-derivations">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            { c: "traffic ×10", r: "serving row re-derives: replicas or a different quantized artifact — drawer rescoring each candidate", o: "upstream rows stand" },
            { c: "privacy ruling: data never leaves the chain", r: "absorbed with zero changes — the ship row was already local", o: "the log answers as written" },
            { c: "a new base model drops", r: "rows 2–9 re-run against the same drawer: re-curate if the template changed, re-run the ledger, re-gate", o: "same pipeline, new base" },
          ].map((x) => (
            <MotionChild key={x.c}>
              <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
                <p className="font-mono text-[11px] font-bold text-ink">{x.c}</p>
                <p className="mt-0.5 text-xs font-medium text-ink">{x.r}</p>
                <p className="mt-0.5 text-[10px] font-medium text-ink-soft">{x.o}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 4 — the course in one sentence */}
      <Scene caption="④ What the log actually says">
        <div className="mx-auto max-w-lg rounded-xl border border-brand bg-brand-wash p-5 text-center">
          <p className="text-sm font-bold leading-relaxed text-ink">
            Decide with arithmetic. Curate before you scale. Mask what you don&apos;t want generated. Let the ledger pick
            the method. Let the drawer pick the checkpoint. Gate per item. Ship the artifact you validated.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The next engineer inherits reasons, not folklore —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">the log records decisions,
          not laws</span>.
        </p>
      </Card>
    </Infographic>
  );
}
