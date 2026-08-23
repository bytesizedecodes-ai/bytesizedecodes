"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";
import { ToggleGroup } from "./controls";

/**
 * Fine-Tuning at Scale — Lesson 11: "Failure forensics". The four-fault
 * tree in order of cheapness, with a Diagnose-beat widget: pick a fault
 * hypothesis and see the evidence each class leaves.
 */
type Fault = "data" | "template" | "training" | "objective";

const FAULTS: Record<Fault, { evidence: string; cost: string; signature: string }> = {
  data: {
    evidence: "pack stats re-run on the HASH-VERIFIED pack · leak-check logs · per-batch loss outliers",
    cost: "minutes, zero GPU",
    signature: "most common fault class — check first, always",
  },
  template: {
    evidence: "byte-diff contract test train-render vs serve-render · tokenizer VERSION PIN (incident #1 lived here)",
    cost: "minutes, zero GPU",
    signature: "quality down + retrains change nothing = fault isn't in the weights",
  },
  training: {
    evidence: "loss-trace signatures (spike triage) · checkpoint evals along the timeline",
    cost: "partial re-run to confirm",
    signature: "the two-curve chart shows WHERE transfer left the run",
  },
  objective: {
    evidence: "by ELIMINATION (3 classes clean) + the positive signal: suite green, product wrong",
    cost: "a redesign — diagnose last, deliberately",
    signature: "every log is the objective's own POV; no log shows it directly",
  },
};

export function FailureForensics() {
  const [fault, setFault] = useState<Fault>("template");
  const cur = FAULTS[fault];
  return (
    <Infographic>
      <InfographicHeader
        title="Failure forensics"
        subtitle="Four fault classes, triaged in order of cheapness — the retrain reflex is the expensive default"
      />

      {/* SCENE 1 — the tree */}
      <Scene caption="① The four-fault tree, in check-order">
        <Stagger className="mx-auto max-w-md space-y-1.5">
          {(
            [
              ["① DATA — the pack is wrong", "contamination · distribution drift · schema breaks"],
              ["② TEMPLATE/SERVING — skew", "render divergence · tokenizer version"],
              ["③ TRAINING — rate/schedule/stability", "the loss trace's signatures"],
              ["④ OBJECTIVE MISMATCH — last, by elimination", "loss optimized ≠ product goal"],
            ] as const
          ).map(([k, d], i) => (
            <MotionChild key={k}>
              <div
                className={`rounded-xl px-4 py-2.5 ${
                  i === 3 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <p className="font-mono text-[11px] font-bold text-ink">{k}</p>
                <p className="mt-0.5 text-[10px] font-medium text-ink-soft">{d}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Cheap checks first: data and template cost minutes and logs; training costs a re-run; objective costs a
          redesign.
        </p>
      </Scene>

      {/* SCENE 2 — the widget: hypothesis → evidence */}
      <Scene caption="② Diagnose: pick a hypothesis, read what it leaves behind">
        <div className="mx-auto max-w-lg">
          <div className="flex justify-center">
            <ToggleGroup<Fault>
              label="Fault hypothesis"
              value={fault}
              onChange={setFault}
              options={[
                { value: "data", label: "data" },
                { value: "template", label: "template" },
                { value: "training", label: "training" },
                { value: "objective", label: "objective" },
              ]}
            />
          </div>
          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">evidence this class leaves</p>
              <p className="mt-0.5 text-[11px] font-semibold text-ink">{cur.evidence}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">cost to check</p>
                <p className="mt-0.5 text-[11px] font-semibold text-ink">{cur.cost}</p>
              </div>
              <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">signature</p>
                <p className="mt-0.5 text-[11px] font-semibold text-ink">{cur.signature}</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] font-medium text-ink-soft">
            Task: for &ldquo;quality −8 post-deploy, two retrains changed nothing&rdquo; — pick the hypothesis the
            elimination signal supports before scrolling on.
          </p>
        </div>
      </Scene>

      {/* SCENE 3 — incident #1 */}
      <Scene caption="③ Incident #1 on record — 30 GPU-hours for a 90-second test">
        <div className="mx-auto max-w-md space-y-2">
          {[
            "deploy → quality −8 points",
            "retrain ×2 → no change (the fault wasn't in the weights)",
            "contract test finally run → tokenizer minor-version skew, found in 90 s at zero GPU cost",
          ].map((s, i) => (
            <MotionChild key={s}>
              <div
                className={`rounded-xl px-4 py-2.5 text-center text-[11px] font-medium ${
                  i === 2 ? "border border-brand bg-brand-wash font-semibold text-ink" : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {s}
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — the multi-fault boundary */}
      <Scene caption="④ BOUNDARY — compensating faults defeat branch-by-branch triage">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            The tree assumes faults are single and separable. Compensating faults — a data skew masked by a schedule
            choice, two template divergences that cancel on the fixed test message — chase ghosts down wrong branches.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Escape: timeline bisection — gate-score every checkpoint and diff everything that changed at the moment
            quality left. &ldquo;When&rdquo; localizes &ldquo;what.&rdquo;
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Data → template → training → objective,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">in order of cheapness</span>{" "}
          — and bisect the timeline when faults conspire.
        </p>
      </Card>
    </Infographic>
  );
}
