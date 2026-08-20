"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 8 (capstone): "Anatomy of Production
 * RAG". Decision-gate (CER Now-what): Atlas's architecture review — three
 * calls (GraphRAG scope, agentic mode default, permission model), each with
 * evidence and stated trade-offs on the right answers too. Three blueprint
 * teardowns + the shared skeleton. Expert register, compact.
 */

type Decision = {
  id: string;
  question: string;
  evidence: string;
  options: { key: string; label: string; verdict: "right" | "wrong"; feedback: string }[];
};

const DECISIONS: Decision[] = [
  {
    id: "graph",
    question: "Adopt GraphRAG?",
    evidence:
      "Dependency and org questions are 3% of traffic but 40% of escalations. Graph build costs ~6× a vector re-index over whatever slice it covers.",
    options: [
      {
        key: "all",
        label: "Index all 40k docs into the graph",
        verdict: "wrong",
        feedback:
          "Pays the graph premium on 92% of traffic that never asks a graph question — build cost, freshness ripple, and a second system to operate, for questions similarity already answers.",
      },
      {
        key: "slice",
        label: "Graph only the service-registry and org docs (~800), keep vectors for the rest",
        verdict: "right",
        feedback:
          "Selective by query shape: the traversal questions get real graph structure, everything else keeps the cheap, fresh path. Trade-off kept: two indexes to lifecycle — the graph slice now has its own freshness axis on the dashboard.",
      },
      {
        key: "none",
        label: "Skip it — vector search handles everything eventually",
        verdict: "wrong",
        feedback:
          "The 40%-of-escalations line is the evidence: traversal questions aren't slow similarity questions, they're the wrong structure. 'Eventually' is where those users already went.",
      },
    ],
  },
  {
    id: "agent",
    question: "Make agentic research mode the default?",
    evidence:
      "Research mode answers the hard multi-part questions ~20 points better — at ~6× the retrieval cost and +2.1s median latency.",
    options: [
      {
        key: "default",
        label: "Default-on: quality is the product",
        verdict: "wrong",
        feedback:
          "6× on 100% of traffic for gains only the multi-hop minority need — the cost curve eats the margin, and the latency hit lands on the 92% who had a fine single-pass answer.",
      },
      {
        key: "routed",
        label: "Route by query shape: classifier sends multi-part and cross-doc questions to the loop",
        verdict: "right",
        feedback:
          "The 20-point gains land exactly where they're earned; the fast path stays fast and cheap. Trade-off kept: the router is now a failure surface — misroutes get their own eval slice, monthly.",
      },
      {
        key: "never",
        label: "Kill research mode — the cost is unjustifiable",
        verdict: "wrong",
        feedback:
          "Reads the receipt and ignores the revenue: 20 points on your hardest, most-escalated questions is exactly what 6× on 8% of traffic is for. The fix is routing, not amputation.",
      },
    ],
  },
  {
    id: "permissions",
    question: "Which permission model before enterprise rollout?",
    evidence:
      "Tenants arrive with hard isolation requirements. Post-filtering is one sprint cheaper; pre-filtering with ACL metadata and tenant namespaces is the audit-documented path.",
    options: [
      {
        key: "post",
        label: "Post-filter: retrieve top-k globally, drop unauthorized results after ranking",
        verdict: "wrong",
        feedback:
          "Ranking against documents the user can't see distorts every result set, and top-5-then-filter returns 2 results where 5 belonged. The audit team reads it as a leak channel with extra steps — because it is one.",
      },
      {
        key: "pre",
        label: "Pre-filter with ACL metadata per chunk + tenant-isolated namespaces",
        verdict: "right",
        feedback:
          "The context only ever forms from authorized space — isolation by construction where tenants demand it, filter discipline where granularity demands it. Trade-off kept: ACL sync is now on the freshness axes; a stale ACL is a stale permission, dashboarded with the rest.",
      },
      {
        key: "copy",
        label: "Separate full copy of the stack per tenant",
        verdict: "wrong",
        feedback:
          "Isolation achieved — at N× the index cost, N× the ingestion pipelines, and N× the drift surfaces to monitor. Namespaces give the same boundary without forking the whole machine; reserve full stacks for the compliance tier that genuinely demands them.",
      },
    ],
  },
];

export function ProductionRagAnatomy() {
  const [calls, setCalls] = useState<Record<string, string>>({});
  const made = Object.keys(calls).length;

  return (
    <Infographic>
      <InfographicHeader
        title="The architecture review"
        subtitle="Three production blueprints — then make Atlas's three calls yourself. The review commits on your decisions."
      />

      {/* Beat 1 — the blueprints */}
      <Scene caption="① Three real RAG systems, one skeleton">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Blueprint
              name="Support-KB assistant"
              rows={["hybrid + rerank baseline", "grounded citations, refusal logging", "golden set from ticket history"]}
            />
            <Blueprint
              name="Code-docs agent"
              rows={["hierarchical summaries across versions", "multi-hop for API chains", "contextual chunk enrichment"]}
            />
            <Blueprint
              name="Enterprise search"
              rows={["ACL pre-filter, tenant namespaces", "drift dashboards nightly", "dual-index embedding migrations"]}
              accent
            />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          different stress, same skeleton: <span className="font-bold text-ink">ingest → index → retrieve → rerank → ground → cite → eval</span>.
        </p>
      </Scene>

      {/* Beat 2 — the decision gate */}
      <Scene caption="② Atlas's review: your three calls">
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
                      chosenOption.verdict === "right" ? "bg-good-wash text-ink" : "bg-[var(--color-bad-wash)] text-ink"
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
              ? `${made}/${DECISIONS.length} calls committed — review adjourned. The skeleton below is what they all run on.`
              : `${made}/${DECISIONS.length} calls committed — pick an option on each decision.`}
          </p>
        </div>
      </Scene>

      {/* Beat 3 — the skeleton */}
      <Scene caption="③ What every lesson of this trilogy bolted onto">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {["sources", "ingestion", "hybrid index", "query understanding", "retrieve + rerank", "grounded answer", "traces", "evals"].map(
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
          Production RAG is one skeleton — ingest, index, retrieve, ground, cite, eval — and
          every scaling decision is evidence in, trade-off out.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One blueprint card. */
function Blueprint({ name, rows, accent = false }: { name: string; rows: string[]; accent?: boolean }) {
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
