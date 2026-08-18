"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 8: "Observe RAG, not only the model".
 *
 * Click-to-elaborate (PIC): four RAG metrics for one retrieval+answer pair.
 * Two score low (faithfulness, context precision), revealing the retrieval is
 * the problem — not the model. Teaches that RAG quality lives in the retrieval
 * layer, which model-only metrics miss. Reduced-motion-safe.
 */
type MetricId = "faithfulness" | "relevancy" | "ctx-precision" | "ctx-recall";

interface Metric {
  id: MetricId;
  name: string;
  score: number; // 0..1 for this scenario
  def: string;
  failure: string;
}

const METRICS: readonly Metric[] = [
  {
    id: "faithfulness",
    name: "Faithfulness",
    score: 0.4,
    def: "Is every claim in the answer supported by the retrieved context?",
    failure: "Low: the answer states facts the retrieved docs don't contain — a hallucination sourced from the model, not the retrieval.",
  },
  {
    id: "relevancy",
    name: "Answer relevancy",
    score: 0.9,
    def: "Does the answer actually address the user's question?",
    failure: "Fine here — the answer is on-topic. The model did its part.",
  },
  {
    id: "ctx-precision",
    name: "Context precision",
    score: 0.25,
    def: "Are the useful chunks ranked highly (vs. buried under junk)?",
    failure: "Low: only 1 of 4 retrieved chunks was relevant, and it ranked third. The retriever returned noise.",
  },
  {
    id: "ctx-recall",
    name: "Context recall",
    score: 0.8,
    def: "Did retrieval surface the information needed to answer?",
    failure: "Mostly fine — the right doc was in the context window, just buried.",
  },
];

export function ObserveRAGNotJustModel() {
  const [sel, setSel] = useState<MetricId>("faithfulness");
  const m = METRICS.find((x) => x.id === sel)!;
  const bad = m.score < 0.6;

  return (
    <Infographic>
      <InfographicHeader
        title="Observe RAG, not only the model"
        subtitle="Click each metric to see where this retrieval went wrong."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="mb-4 rounded-lg border border-ash bg-canvas px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">the turn</p>
            <p className="text-xs font-medium text-ink">
              User asks a policy question. Retrieval returns 4 chunks (1 relevant, ranked 3rd). The answer is fluent but adds a clause no doc states.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {METRICS.map((x) => {
              const on = x.id === sel;
              const xbad = x.score < 0.6;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setSel(x.id)}
                  aria-pressed={on}
                  className={`focus-ring rounded-lg border px-3 py-2 text-left transition-colors ${
                    on
                      ? xbad
                        ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]"
                        : "border-brand bg-brand-wash"
                      : "border-ash bg-canvas hover:border-ash"
                  }`}
                >
                  <span className="block text-xs font-bold text-ink">{x.name}</span>
                  <span className={`font-mono text-sm font-bold ${xbad ? "text-[var(--color-bad)]" : "text-brand"}`}>
                    {Math.round(x.score * 100)}%
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <p className="text-xs font-semibold text-ink">{m.def}</p>
            <p className={`mt-1 text-xs font-medium ${bad ? "text-[var(--color-bad)]" : "text-ink-soft"}`}>{m.failure}</p>
          </div>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A bad RAG answer is usually a retrieval problem wearing a model's
          clothes. Measure faithfulness and context quality, not just fluency.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
