"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 14: "Incident command and the learning loop".
 *
 * Click-to-elaborate (CER): the incident lifecycle. The last beat — a regression
 * test from the postmortem — is what closes the loop and prevents recurrence.
 * Reduced-motion-safe.
 */
type StepId = "detect" | "coordinate" | "mitigate" | "communicate" | "postmortem" | "regression";

interface Step {
  id: StepId;
  name: string;
  body: string;
}

const STEPS: readonly Step[] = [
  { id: "detect", name: "Detect", body: "A burn-rate alert fires on a real signal — quality, not just latency. The alert carries the cohort and a link to the dashboard." },
  { id: "coordinate", name: "Coordinate", body: "Incident commander owns the response; roles for comms, diagnosis, and fix. Severity sets who gets paged and how fast." },
  { id: "mitigate", name: "Mitigate", body: "Roll back the changed variable first — not root-cause it live. Mitigation is for users; root-cause is for later." },
  { id: "communicate", name: "Communicate", body: "Stakeholders get a timed, honest status (what we know, what we're doing, next update). Silence breeds worse headlines than the outage." },
  { id: "postmortem", name: "Blameless postmortem", body: "What happened, what we believed, why that was wrong, and the systemic fix — blameless on people, rigorous on systems." },
  { id: "regression", name: "Regression test", body: "The postmortem's action becomes an automated test in CI. This is the step that turns a one-time incident into a prevented class." },
];

export function IncidentCommandLearningLoop() {
  const [sel, setSel] = useState<StepId>("postmortem");
  const s = STEPS.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Incident command and the learning loop"
        subtitle="Click each step. The last one is what actually prevents the next incident."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1.5" role="list">
            {STEPS.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" role="listitem" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${on ? "bg-brand text-ink" : "bg-ash text-ink-soft"}`}>
                    {STEPS.findIndex((y) => y.id === x.id) + 1}
                  </span>
                  <span className="text-xs font-semibold text-ink">{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{s.name}</span>
            <p className="mt-1 text-xs font-medium text-ink">{s.body}</p>
          </div>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          An incident is closed when its postmortem becomes a regression test —
          turning a one-time failure into a permanently prevented class.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
