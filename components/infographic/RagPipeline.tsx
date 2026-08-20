"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 5: "The RAG Pipeline, End to End".
 *
 * Interactive stepper (AgentLoop pattern): the learner picks one of two
 * preset questions and steps through its full journey — question → embedded
 * → ranked pages → top-3 → context → cited answer — with a running trace
 * log. Feedback contract: the tempting wrong idea is that RAG is "the model
 * searching the internet"; stepping shows the harness stages, and that the
 * model only ever sees what the pipeline put in front of it. Constrained
 * presets, real buttons, aria-pressed, state-based (reduced-motion safe).
 */

const QUESTIONS = {
  refund: {
    label: "Damaged box refund",
    question: "Can I get my money back if the box arrived damaged?",
    steps: [
      { phase: "Ask", line: "the customer's question arrives — plain words, nothing else" },
      { phase: "Embed", line: "the question is plotted on the meaning map — money & refunds street" },
      { phase: "Search", line: "every indexed page is measured; hundreds get ranked by distance" },
      { phase: "Top-3", line: "kept: policy-refunds p2 · faq-returns p1 · policy-payments p4" },
      { phase: "Context", line: "the three pages + the question are placed in the window" },
      { phase: "Answer", line: "\u201cYes — full refund within 14 days of delivery. [policy-refunds §2]\u201d" },
    ],
  },
  delivery: {
    label: "Delivery time to Berlin",
    question: "How long does delivery to Berlin take?",
    steps: [
      { phase: "Ask", line: "the customer's question arrives — plain words, nothing else" },
      { phase: "Embed", line: "plotted on shipping street — a different neighborhood entirely" },
      { phase: "Search", line: "ranked by distance; refund pages now land far away" },
      { phase: "Top-3", line: "kept: shipping-times p1 · eu-delivery faq p3 · tracking p2" },
      { phase: "Context", line: "the three pages + the question are placed in the window" },
      { phase: "Answer", line: "\u201c2–4 working days to Berlin, tracked. [shipping-times p1]\u201d" },
    ],
  },
} as const;

type QKey = keyof typeof QUESTIONS;

export function RagPipeline() {
  const [q, setQ] = useState<QKey>("refund");
  const [step, setStep] = useState(0);

  const current = QUESTIONS[q];
  const finished = step >= current.steps.length;
  const visible = current.steps.slice(0, step);

  return (
    <Infographic>
      <InfographicHeader
        title="One question's journey, step by step"
        subtitle="Pick a question, then press “Next step” — and watch what the model actually receives."
      />

      {/* Scene 1 — the map recap, static */}
      <Scene caption="① Everything you've met, now as one machine">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {["question", "embedding", "ranked pages", "top-3", "context window", "cited answer"].map(
              (s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true" className="text-ink-faint">→</span>}
                  <span className="rounded-full border border-ash bg-surface-elevated px-3 py-1 text-[11px] font-bold text-ink">
                    {s}
                  </span>
                </span>
              ),
            )}
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — the stepper (the tension beat) */}
      <Scene caption="② Step the journey yourself">
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm">
          {/* question presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">Question:</span>
            {(Object.keys(QUESTIONS) as QKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setQ(key);
                  setStep(0);
                }}
                aria-pressed={q === key}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors focus-ring ${
                  q === key
                    ? "border-brand bg-brand text-canvas"
                    : "border-ash bg-surface-elevated text-ink hover:bg-brand-wash"
                }`}
              >
                {QUESTIONS[key].label}
              </button>
            ))}
          </div>

          <p className="mt-3 rounded-xl bg-ash px-3 py-2 text-xs font-semibold text-ink sm:text-[13px]">
            🙋 &ldquo;{current.question}&rdquo;
          </p>

          {/* the trace log */}
          <ol className="mt-3 min-h-[8rem] space-y-1.5" aria-live="polite">
            {visible.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-ink sm:text-[13px]">
                <span className="w-4 shrink-0 text-right font-mono text-[10px] text-ink-faint">{i + 1}</span>
                <span className="rounded-full border border-ash bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                  {s.phase}
                </span>
                <span className="break-words">{s.line}</span>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="text-xs font-medium text-ink-soft">
                Nothing has happened yet. Press &ldquo;Next step&rdquo;.
              </li>
            )}
          </ol>

          {/* controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={finished}
              className="rounded-full border border-brand bg-brand px-4 py-2 text-sm font-bold text-canvas transition-opacity focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next step ▸
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full border border-ash bg-surface-elevated px-3.5 py-2 text-xs font-bold text-ink hover:bg-ash focus-ring"
            >
              ↺ Reset
            </button>
            <span className="ml-auto font-mono text-[11px] font-bold text-ink-faint">
              {Math.min(step, current.steps.length)}/{current.steps.length}
            </span>
          </div>

          {finished && (
            <p className="mt-3 rounded-xl border border-brand bg-brand-wash px-3 py-2 text-xs font-bold leading-relaxed text-brand sm:text-[13px]">
              Answer delivered — and notice what the model actually did: it never searched,
              never browsed. It read the three pages the pipeline handed it, and answered from
              those. Every question repeats this same journey.
            </p>
          )}
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          The RAG pipeline: embed the question, rank the pages, keep the top few, hand them to
          the model — the answer is only ever as good as the pages.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
