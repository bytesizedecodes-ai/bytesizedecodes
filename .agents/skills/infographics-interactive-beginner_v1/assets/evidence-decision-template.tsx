/**
 * TEMPLATE — Constructive patterns for v4: evidence matrix + decision gate.
 * Copy to components/infographic/<YourWidget>.tsx and set `MODE`.
 *
 * Story fusion (required):
 *  - Evidence matrix → CER Diagnose + Claim/Evidence/Reasoning (or PIC Observe)
 *  - Decision gate   → CER Now-what (or PIC Transfer)
 *  - Specify BEFORE → ACT → AFTER in references/lesson-contract.md first.
 *  - See references/visual-interactive-storytelling.md and
 *    references/interactivity-patterns.md §§4–5.
 *
 * Shared rules: "use client", real <button>s, theme-safe tokens, one accent,
 * verb-led instruction, feedback names misconception + next investigation.
 */

"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "../primitives";
import { Reveal } from "../motion";

/** Switch when you copy — keep one mode per lesson widget. */
const MODE: "matrix" | "decision" = "matrix";

/* ---------- Evidence matrix data (replace) ---------- */

type ClaimId = "model" | "retrieval" | "traffic";

const EVIDENCE = [
  {
    id: "eval",
    label: "Eval score",
    value: "↓ 12%",
    supports: ["model", "retrieval"] as const,
  },
  {
    id: "empty",
    label: "Retrieval empty",
    value: "↑ 28%",
    supports: ["retrieval"] as const,
    anomaly: true,
  },
  {
    id: "latency",
    label: "p95 latency",
    value: "+40%",
    supports: ["traffic", "model"] as const,
  },
  {
    id: "prompt",
    label: "Prompt version",
    value: "v3 → v4",
    supports: ["model"] as const,
  },
] as const;

const CLAIMS: { id: ClaimId; label: string }[] = [
  { id: "model", label: "Model / prompt regression" },
  { id: "retrieval", label: "Retrieval / index issue" },
  { id: "traffic", label: "Traffic mix shift" },
];

const CLAIM_FEEDBACK: Record<
  ClaimId,
  { body: string; next: string }
> = {
  model: {
    body: "Prompt changed, but failures cluster where retrieval is empty — not evenly across all traffic.",
    next: "Compare grounded vs ungrounded answers before rolling back the model.",
  },
  retrieval: {
    body: "Empty-retrieval rate rises with the quality drop. Latency alone does not prove a model fault.",
    next: "Inspect index freshness and retrieval status on failing traces.",
  },
  traffic: {
    body: "Latency can rise with mix shifts, but empty-retrieval clusters still need an index check first.",
    next: "Slice by cohort, then confirm whether retrieval emptiness tracks the new mix.",
  },
};

/* ---------- Decision gate data (replace) ---------- */

type ActionId = "ship" | "canary" | "rollback" | "investigate";

const ACTIONS: { id: ActionId; label: string }[] = [
  { id: "ship", label: "Ship to 100%" },
  { id: "canary", label: "Hold / expand canary" },
  { id: "rollback", label: "Rollback release" },
  { id: "investigate", label: "Investigate before changing traffic" },
];

const REASONS = [
  { id: "slo", label: "Error budget still healthy" },
  { id: "safety", label: "Safety / grounding risk unclear" },
  { id: "evidence", label: "Evidence points at retrieval, not model" },
] as const;

const DECISION_FEEDBACK: Partial<
  Record<ActionId, Partial<Record<(typeof REASONS)[number]["id"], string>>>
> = {
  investigate: {
    evidence:
      "Defensible: freeze traffic changes, inspect index freshness, then re-evaluate. Missing evidence that would change this: grounded-answer rate by cohort.",
    safety:
      "Defensible when grounding risk is unclear — gather cohort evidence before rollback or ship.",
  },
  canary: {
    slo: "Only defensible if the canary cohort is measured on retrieval-empty and grounding — not latency alone.",
  },
  rollback: {
    evidence:
      "Premature if empty-retrieval is the cluster. Rollback the index/retrieval change first; keep the model unless eval on grounded contexts also fails.",
  },
  ship: {
    slo: "Weak: quality already dropped. Do not ship on an intact error budget if grounding is unmeasured.",
  },
};

export function EvidenceDecisionTemplate() {
  if (MODE === "matrix") return <EvidenceMatrix />;
  return <DecisionGate />;
}

function EvidenceMatrix() {
  const [claim, setClaim] = useState<ClaimId | null>(null);
  const feedback = claim ? CLAIM_FEEDBACK[claim] : null;

  return (
    <Infographic>
      <InfographicHeader
        title="What failed after the release?"
        subtitle="Choose the claim to investigate first — then read which evidence lights up"
      />

      <Reveal>
        <div className="space-y-4 rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="grid gap-2 sm:grid-cols-2">
            {EVIDENCE.map((e) => {
              const active =
                claim !== null &&
                (e.supports as readonly ClaimId[]).includes(claim);
              return (
                <div
                  key={e.id}
                  className={`rounded-xl border px-3 py-2 ${
                    active
                      ? "border-brand bg-brand-wash"
                      : "border-ash bg-canvas"
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                    {e.label}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      e.anomaly && active ? "text-bad" : "text-ink"
                    }`}
                  >
                    {e.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Claims"
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
          >
            {CLAIMS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setClaim(c.id)}
                aria-pressed={claim === c.id}
                className={`focus-ring min-h-[32px] rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  claim === c.id
                    ? "border-brand bg-brand text-ink"
                    : "border-ash bg-canvas text-ink-soft hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {feedback ? (
            <p className="text-xs font-medium text-ink">
              {feedback.body}{" "}
              <span className="text-ink-soft">Next: {feedback.next}</span>
            </p>
          ) : (
            <p className="text-xs font-medium text-ink-soft">
              BEFORE: all signals look equally loud. Commit to a claim to see
              which evidence actually supports it.
            </p>
          )}
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Pick the investigation the evidence supports — correlation is not a
          root cause.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function DecisionGate() {
  const [action, setAction] = useState<ActionId | null>(null);
  const [reason, setReason] = useState<(typeof REASONS)[number]["id"] | null>(
    null,
  );
  const feedback =
    action && reason ? DECISION_FEEDBACK[action]?.[reason] : undefined;

  return (
    <Infographic>
      <InfographicHeader
        title="What do you do next?"
        subtitle="Choose one action and one reason — then read the impact and missing evidence"
      />

      <Reveal>
        <div className="space-y-4 rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <p className="text-sm font-semibold text-ink">
            Canary shows a quality drop; retrieval-empty rate is up; error budget
            is not exhausted.
          </p>

          <div role="group" aria-label="Actions" className="flex flex-col gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAction(a.id)}
                aria-pressed={action === a.id}
                className={`focus-ring min-h-[32px] rounded-xl border px-3 py-2 text-left text-xs font-bold transition-colors ${
                  action === a.id
                    ? "border-brand bg-brand text-ink"
                    : "border-ash bg-canvas text-ink-soft hover:text-ink"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Reasons" className="flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                aria-pressed={reason === r.id}
                className={`focus-ring min-h-[32px] rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  reason === r.id
                    ? "border-brand bg-brand-wash text-ink"
                    : "border-ash bg-canvas text-ink-soft hover:text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {feedback ? (
            <p className="text-xs font-medium text-ink">{feedback}</p>
          ) : (
            <p className="text-xs font-medium text-ink-soft">
              Select an action and a reason to reveal impact and what evidence
              would change the call.
            </p>
          )}
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A good decision names the next runbook step and the evidence that
          would reverse it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
