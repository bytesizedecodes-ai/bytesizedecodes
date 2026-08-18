"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 11: "Triage a real-looking incident".
 *
 * Click-to-elaborate (PIC): the investigation path from alert to fix. Each step
 * reveals one piece of evidence; together they form and confirm a hypothesis
 * (a tool shipped in release v17 is timing out). Reduced-motion-safe.
 */
type StepId = "alert" | "dashboard" | "cohort" | "trace" | "fix";

interface Step {
  id: StepId;
  name: string;
  question: string;
  reveals: string;
}

const STEPS: readonly Step[] = [
  { id: "alert", name: "Alert fired", question: "What's burning?", reveals: "The quality SLO: answer-faithfulness dropped 18% over 30 minutes. Latency is fine — this is a quality incident, not a performance one." },
  { id: "dashboard", name: "Read the dashboard", question: "Where?", reveals: "Slice by region and client: eu-west is healthy, us-east is fine on web but degraded on iOS. The blast radius is us-east × iOS." },
  { id: "cohort", name: "Slice the cohort", question: "What's shared?", reveals: "Every bad turn in that cohort carries tool = billing v2.2, which shipped in release v17 two hours ago. One changed variable." },
  { id: "trace", name: "Open a trace", question: "Why?", reveals: "The billing tool span returns 502s after a 400ms timeout. The model waited, then answered with no billing info — hence 'unhelpful'." },
  { id: "fix", name: "Act + confirm", question: "Did it work?", reveals: "Roll back billing v2.2 to v2.1. Faithfulness recovers inside 15 minutes. The hypothesis is confirmed; file the regression test." },
];

export function TriageAnIncident() {
  const [sel, setSel] = useState<StepId>("alert");
  const step = STEPS.find((s) => s.id === sel)!;
  const last = sel === "fix";

  return (
    <Infographic>
      <InfographicHeader
        title="Triage a real-looking incident"
        subtitle="Click each step of the investigation. What does it reveal?"
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1.5" role="list">
            {STEPS.map((s) => {
              const on = s.id === sel;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="listitem"
                  onClick={() => setSel(s.id)}
                  aria-pressed={on}
                  className={`focus-ring flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                    on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${on ? "bg-brand text-ink" : "bg-ash text-ink-soft"}`}>
                    {STEPS.findIndex((x) => x.id === s.id) + 1}
                  </span>
                  <span className="text-xs font-semibold text-ink">{s.name}</span>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-ink-soft">{s.question}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <p className={`text-xs font-medium ${last ? "text-brand" : "text-ink"}`}>{step.reveals}</p>
          </div>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Triage is a drill-down: alert → dashboard → cohort → trace → act. Each
          step narrows the blast radius and tests one hypothesis.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
