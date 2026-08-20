"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 8 (capstone): "Anatomy of Production
 * Harnesses". Decision-gate widget (v5 CER Now-what): three real design-review
 * decisions for Relay at scale, each committed against evidence from earlier
 * lessons. Feedback names the evidence for AND against each call — including
 * the correct one's trade-off. Three blueprints + the generic architecture
 * flow complete the teardown. Expert register: no hand-holding, evidence-led.
 */

type Decision = {
  id: string;
  question: string;
  evidence: string;
  options: {
    key: string;
    label: string;
    verdict: "right" | "wrong";
    feedback: string;
  }[];
};

const DECISIONS: Decision[] = [
  {
    id: "topology",
    question: "Ship the three-agent refactor?",
    evidence:
      "Routing +2 pts on single-flow tickets, −6 on cross-flow (damage claim needed by the shipping decision).",
    options: [
      {
        key: "ship",
        label: "Ship it — specialists are the modern architecture",
        verdict: "wrong",
        feedback:
          "The org chart isn't evidence. The −6 on cross-flow tickets is exactly the handoff tax: context died at two boundaries. Re-read the orchestration data before spending a quarter on this.",
      },
      {
        key: "hold",
        label: "Hold — one agent, tool groups with per-group budgets",
        verdict: "right",
        feedback:
          "Matches the measurement: isolation where it pays (budgets, allowlists per group) without paying the handoff tax. Trade-off kept: one noisy document can still steer the whole agent — watch it in the traces.",
      },
      {
        key: "canary",
        label: "Ship behind a 5% canary and see",
        verdict: "wrong",
        feedback:
          "The canary can't save you from a known-wrong topology — the cross-flow regression is already measured. Canaries resolve uncertainty; this isn't uncertainty, it's evidence you're ignoring.",
      },
    ],
  },
  {
    id: "optimizer",
    question: "Enable auto-prompt optimization?",
    evidence:
      "Last run: +4.2% suite, tone regressed — the judge scored correctness, not care.",
    options: [
      {
        key: "unattended",
        label: "Enable unattended — the suite gates it",
        verdict: "wrong",
        feedback:
          "The suite IS the blind spot — it approved the tone regression. Unattended optimization against one metric is how you ship a +4% that customers hate.",
      },
      {
        key: "guarded",
        label: "Enable — held-out tasks, multiple judges, diffs capped + revertible",
        verdict: "right",
        feedback:
          "The flywheel with the brakes on: held-out scoring blocks over-fitting the suite, multi-lens judging closes the single-metric blind spot, capped diffs keep a human a click away. The optimizer works for you — supervised.",
      },
      {
        key: "never",
        label: "Never — humans write every prompt",
        verdict: "wrong",
        feedback:
          "Throws away a real compounding loop: correction data is already flowing. The lesson's failure was missing guardrails, not the existence of optimization.",
      },
    ],
  },
  {
    id: "refundmodel",
    question: "Route refund judgment to the fine-tuned model?",
    evidence:
      "50k clean labels, slow policy drift. Cost math: €72/day prompting vs €40/day serving + re-trains.",
    options: [
      {
        key: "classify",
        label: "Yes — classification only; policy facts stay in retrieval",
        verdict: "right",
        feedback:
          "Splits along the matrix: high-volume narrow judgment → weights; fresh, auditable facts → harness. Break-even in weeks, and policy changes ship as retrieval updates — not re-trains.",
      },
      {
        key: "all",
        label: "Yes — bake refund policy into the model too",
        verdict: "wrong",
        feedback:
          "Knowledge injection is the weights' weakest axis: policy goes stale on training day, every change costs a re-train, and the audit trail is a checkpoint instead of a diff.",
      },
      {
        key: "prompt",
        label: "No — keep prompting regardless of volume",
        verdict: "wrong",
        feedback:
          "At 40k req/day the token math is decisive — 'regardless of volume' ignores the cost curve that made fine-tuning earn its place.",
      },
    ],
  },
];

export function ProductionHarnessAnatomy() {
  const [calls, setCalls] = useState<Record<string, string>>({});
  const made = Object.keys(calls).length;

  return (
    <Infographic>
      <InfographicHeader
        title="The design review"
        subtitle="Three blueprint teardowns — then make the three calls yourself. The review commits on your decisions."
      />

      {/* Beat 1 — three production blueprints */}
      <Scene caption="① Three real harnesses, same skeleton, different stress">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Blueprint
              name="Coding agent"
              rows={[
                "tight loop: read → edit → run tests → fix",
                "permissioning per command class",
                "aggressive context compaction on long tasks",
              ]}
            />
            <Blueprint
              name="Computer-use agent"
              rows={[
                "screen → plan → click/type loop",
                "sandboxed VM; snapshots as checkpoints",
                "verification after every irreversible step",
              ]}
            />
            <Blueprint
              name="Support agent (Relay)"
              rows={[
                "pinned facts + policy retrieval",
                "3 tools, allowlisted, idempotent actions",
                "suite-gated changes; corrections feed back",
              ]}
              accent
            />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          Different surfaces, one skeleton: <span className="font-bold text-ink">context, loop, guardrails, trace, evals</span>.
        </p>
      </Scene>

      {/* Beat 2 — the decision gate */}
      <Scene caption="② Relay's review: your three calls">
        <div className="space-y-3">
          {DECISIONS.map((d) => {
            const chosen = calls[d.id];
            const chosenOption = d.options.find((o) => o.key === chosen);
            return (
              <div key={d.id} className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
                <div className="text-sm font-bold text-ink">{d.question}</div>
                <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                  Evidence: {d.evidence}
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {d.options.map((o) => {
                    const isChosen = chosen === o.key;
                    return (
                      <button
                        key={o.key}
                        type="button"
                        aria-pressed={isChosen}
                        onClick={() => setCalls((c) => ({ ...c, [d.id]: o.key }))}
                        className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors focus-ring ${
                          isChosen
                            ? o.verdict === "right"
                              ? "border-good bg-good-wash text-ink"
                              : "border-[var(--color-bad)] bg-[var(--color-bad-wash)] text-ink"
                            : "border-ash bg-surface-elevated text-ink hover:bg-ash"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                {chosenOption && (
                  <p
                    className={`mt-2 rounded-lg px-3 py-2 text-[11px] font-medium leading-relaxed ${
                      chosenOption.verdict === "right"
                        ? "bg-good-wash text-ink"
                        : "bg-[var(--color-bad-wash)] text-ink"
                    }`}
                    aria-live="polite"
                  >
                    {chosenOption.feedback}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">
            {made === DECISIONS.length
              ? `${made}/${DECISIONS.length} calls committed — review adjourned. The blueprint below is what they all run on.`
              : `${made}/${DECISIONS.length} calls committed — pick an option on each decision.`}
          </p>
        </div>
      </Scene>

      {/* Beat 3 — the generic architecture */}
      <Scene caption="③ The skeleton every lesson of this course bolted onto">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {["intake", "context packing", "agent loop", "guardrails", "tools & actions", "trace", "evals"].map(
              (s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true" className="text-ink-faint">→</span>}
                  <span className="rounded-full border border-ash bg-surface-elevated px-3 py-1 text-[11px] font-bold text-ink">
                    {s}
                  </span>
                </span>
              ),
            )}
            <span aria-hidden="true" className="text-ink-faint">↺</span>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The capstone takeaway</CardTitle>
        <Takeaway>
          Production harnesses share one skeleton — context, loop, guardrails, trace, evals —
          and every scaling decision is evidence in, trade-off out.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One harness blueprint card. */
function Blueprint({
  name,
  rows,
  accent = false,
}: {
  name: string;
  rows: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{name}</div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li key={r} className="flex gap-1.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">
            <span aria-hidden="true" className="text-brand">✦</span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
