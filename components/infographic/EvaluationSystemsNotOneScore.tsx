"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 9: "Evaluation systems, not one score".
 *
 * Click-to-elaborate (CER): the components that make an eval trustworthy — task
 * suite, rubric reliability, inter-rater agreement, calibrated judge, confidence
 * intervals, score-distribution shift. One score hides all of them.
 * Reduced-motion-safe.
 */
type PartId = "suite" | "rubric" | "kappa" | "judge" | "ci" | "shift";

interface Part {
  id: PartId;
  name: string;
  q: string;
  a: string;
}

const PARTS: readonly Part[] = [
  { id: "suite", name: "Task suite", q: "Representative?", a: "A golden set that mirrors real usage, not just easy cases. Stale suites pass everything and catch nothing." },
  { id: "rubric", name: "Rubric reliability", q: "Repeatable?", a: "The same answer graded twice gives the same score. Vague rubrics add noise that swamps real change." },
  { id: "kappa", name: "Inter-rater agreement (κ)", q: "Do raters agree?", a: "Cohen's κ above ~0.6 means two humans (or judge vs human) agree enough that the score means something." },
  { id: "judge", name: "Calibrated judge", q: "Trustworthy?", a: "An LLM judge measured against human labels, with its biases mitigated — not a black box you trust on faith." },
  { id: "ci", name: "Confidence intervals", q: "Significant?", a: "A 2-point score move is meaningless without a CI. Report intervals so you don't chase noise." },
  { id: "shift", name: "Score-distribution shift", q: "Drifting?", a: "The mean can hold while the distribution moves — more 1s and 5s, fewer 3s. Watch the shape, not just the average." },
];

export function EvaluationSystemsNotOneScore() {
  const [sel, setSel] = useState<PartId>("kappa");
  const p = PARTS.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Evaluation systems, not one score"
        subtitle="Click each part of a trustworthy eval system."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PARTS.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring rounded-lg border px-2 py-2 text-left transition-colors ${on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`text-[11px] font-bold leading-tight ${on ? "text-brand" : "text-ink"}`}>{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{p.name} · {p.q}</span>
            <p className="mt-1 text-xs font-medium text-ink">{p.a}</p>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            A single number collapses all six into an illusion of rigor. Ship the system, not the score.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Trustworthy evaluation is a system: representative suites, repeatable
          rubrics, measured agreement, calibrated judges, intervals, and
          distribution watch — not one tidy number.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
