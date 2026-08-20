import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 3: "Hybrid Search".
 *
 * Closes the beginner course's E-4821 gap. Two retrievers race on one query:
 * dense finds the concept page; BM25 finds the exact code. The fusion beat
 * (rank merging, RRF-style) interleaves them. Bad marks semantic-alone's
 * miss; brand accent carries the merged shortlist.
 */
export function HybridSearch() {
  return (
    <Infographic>
      <InfographicHeader
        title="Keywords and meaning, on the same case"
        subtitle="“What does error E-4821 mean?” — one retriever shrugs, the other nails it."
      />

      {/* Scene 1 — the race */}
      <Scene caption="① Same question, two retrievers">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center font-mono text-xs font-semibold text-ink shadow-sm">
            “What does error E-4821 mean?”
          </div>
        </Reveal>
        <Stagger className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MotionChild>
            <div className="h-full rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-bad)]">semantic only</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
                E-4821 has no meaning neighborhood — returns sibling codes:
              </p>
              <ul className="mt-2 space-y-1 font-mono text-[10.5px] text-ink-soft">
                <li>#12 · errors-E-4801.md</li>
                <li>#31 · errors-E-4830.md</li>
                <li>#44 · troubleshooting-intro.md</li>
              </ul>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">keyword (BM25)</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
                exact token match — the code IS the query:
              </p>
              <ul className="mt-2 space-y-1 font-mono text-[10.5px] text-ink">
                <li>#1 · errors-E-4821.md · “cache quorum lost”</li>
              </ul>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 2 — fusion */}
      <Scene caption="② Fusion: interleave the rankings">
        <Reveal>
          <div className="mx-auto max-w-lg space-y-1.5">
            <FusedRow n={1} from="kw" text="errors-E-4821.md — cache quorum lost" />
            <FusedRow n={2} from="dense" text="runbook: cache quorum recovery" />
            <FusedRow n={3} from="kw" text="errors-E-4801.md (near-miss, ranked down)" dim />
            <FusedRow n={4} from="dense" text="monitoring: quorum alerts" dim />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Rank fusion doesn&apos;t compare scores across systems — it{" "}
          <span className="font-bold">merges positions</span>: each list contributes its best,
          and the exact match and the concept page both survive.
        </p>
      </Scene>

      {/* Scene 3 — the baseline claim */}
      <Scene caption="③ Why this is the production default">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Meaning-search and keyword-search fail on <span className="font-bold">opposite
            cases</span> — paraphrases defeat keywords; codes and names defeat meaning. Run
            both, fuse the ranks: the production baseline almost no team regrets.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Hybrid search = dense + keyword in parallel, ranks fused. Paraphrases and part
          numbers both get found — by the retriever that handles each.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One row of the fused ranking. */
function FusedRow({ n, from, text, dim = false }: { n: number; from: "kw" | "dense"; text: string; dim?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2 shadow-sm ${
        dim ? "border-ash bg-canvas opacity-70" : from === "kw" ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="w-5 shrink-0 font-mono text-[11px] font-bold text-ink-faint">#{n}</span>
      <span
        className={`w-12 shrink-0 rounded px-1.5 py-0.5 text-center text-[9px] font-bold uppercase text-canvas ${
          from === "kw" ? "bg-brand" : "bg-ink"
        }`}
      >
        {from === "kw" ? "kw" : "sem"}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-ink">{text}</span>
    </div>
  );
}
