import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 1: "Advanced Retrieval".
 *
 * Course case: "summarize this quarter's incidents across 40 runbooks" — no
 * single chunk contains the answer. The upgrade ladder with explicit costs:
 * contextual chunk enrichment → hierarchical summaries → multi-hop
 * decomposition. Expert register, compact; the counter-beat: the standard
 * pipeline still wins single-hop.
 */
export function AdvancedRetrieval() {
  return (
    <Infographic>
      <InfographicHeader
        title="Questions no single chunk can answer"
        subtitle="Atlas at 40k documents — where top-k retrieval quietly runs out."
      />

      {/* Beat 1 — the failure class */}
      <Scene caption="① The query the index can't serve">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <p className="font-mono text-[12px] font-semibold text-ink">
              “Summarize this quarter&apos;s payment incidents across all 40 runbooks.”
            </p>
            <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-[var(--color-bad)]">
              No single chunk contains this answer — it lives <span className="font-bold">across</span> documents.
              Top-k returns 5 incident fragments; the synthesis of 40 was never retrievable,
              because retrieval returns pieces, not populations.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — the ladder, with costs */}
      <Scene caption="② The upgrade ladder — pay only for the question shape you get">
        <Stagger className="space-y-2">
          <MotionChild>
            <Rung title="Contextual chunk enrichment" cost="+1 ingestion pass" note="each chunk prefixed with its document's summary — disambiguates 'it' and 'the service' at index time" />
          </MotionChild>
          <MotionChild>
            <Rung title="Hierarchical summaries" cost="+index size ×~1.3" note="summaries of sections, docs, topics — indexed alongside chunks; cross-doc questions match the summary layer" accent />
          </MotionChild>
          <MotionChild>
            <Rung title="Multi-hop decomposition" cost="+k× retrieval latency" note="'which teams depend on payments?' → hop 1: find the service; hop 2: retrieve its dependents — query the map twice, with what hop 1 taught you" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — the counter-beat */}
      <Scene caption="③ The discipline: match the machinery to the query mix">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Atlas measured its traffic: <span className="font-bold">92% single-hop</span>. The
            ladder shipped for the 8% — hierarchical summaries for cross-doc synthesis,
            multi-hop for dependency questions — while the 92% kept the standard hybrid +
            rerank path. <span className="font-bold">Upgrades are per-question-shape, not global.</span>
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          When answers live across documents, retrieve structure: enriched chunks, summary
          layers, or multi-hop chains — and pay each cost only for the queries that need it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One rung of the upgrade ladder. */
function Rung({ title, cost, note, accent = false }: { title: string; cost: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{title}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-ink-soft">
        {cost}
      </span>
    </div>
  );
}
