import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 3: "GraphRAG".
 *
 * The relationship query vectors can't answer, the graph build (entities →
 * relations → community summaries), and the compare grid against vector
 * indexes. The selectivity rule: only for relationship-heavy query mixes.
 * Expert register; compare grid reveals as one block.
 */
export function GraphRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="The questions similarity can't hear"
        subtitle="“Which teams depend on the payments service?” is a graph question wearing search clothes."
      />

      {/* Beat 1 — the failure and the alternative */}
      <Scene caption="① Two query shapes, two structures">
        <Reveal>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <p className="font-mono text-[12px] font-semibold text-ink">
              “Which teams depend on the payments service?”
            </p>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink-soft">
              Vector search retrieves <span className="font-bold text-ink">pages about dependencies</span> —
              but the answer is a <span className="font-bold text-ink">traversal</span>: every node with an
              edge to payments. That's graph shape, embedded in your org's documents as prose.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — the compare grid */}
      <Scene caption="② Vector index vs knowledge graph">
        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-separate border-spacing-1 text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                  <th className="w-28">Property</th>
                  <th>Vector index</th>
                  <th>Knowledge graph</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium leading-relaxed">
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Query shape</td>
                  <td className="rounded-lg border border-brand bg-brand-wash px-2.5 py-2 text-ink">“what does X say about Y” — similarity</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">“what relates to X, how, through whom” — traversal</td>
                </tr>
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Build</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">chunk + embed — one pass</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">entity extraction + relations + community summaries — LLM-heavy</td>
                </tr>
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Freshness</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">re-ingest a doc, done</td>
                  <td className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-ink-soft">a doc edit can ripple through communities — partial rebuilds</td>
                </tr>
                <tr>
                  <td className="rounded-lg bg-ash px-2.5 py-2 font-bold text-ink">Where it wins</td>
                  <td className="rounded-lg border border-brand bg-brand-wash px-2.5 py-2 text-ink">the 92%: pages, passages, paraphrase</td>
                  <td className="rounded-lg border border-brand bg-brand-wash px-2.5 py-2 text-ink">org charts, service maps, multi-entity synthesis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 3 — selectivity */}
      <Scene caption="③ The selectivity rule">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Atlas indexed <span className="font-bold">only the service-registry and org docs</span> into
            the graph — 800 documents, not 40,000. The research consensus holds: GraphRAG is a
            <span className="font-bold"> selective instrument for relationship-heavy query mixes</span>,
            layered next to the vector index — almost never a replacement for it.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Graph questions need graph structure. Build it selectively — entities and communities
          over the relationship-dense slice — and keep the vector index for everything else.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
