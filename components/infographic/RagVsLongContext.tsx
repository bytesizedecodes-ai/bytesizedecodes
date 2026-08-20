import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 6: "RAG vs Long Context".
 *
 * The decision framework: long context fits small static corpora and
 * exhaustive whole-doc analysis; RAG wins cost (~1,250× at 1M-token scale),
 * latency (30–60×), freshness, provenance; the hybrid pattern (retrieve to
 * select, long context to read). The memo beat: "million-token models make
 * RAG obsolete" meets Atlas's cost math. Compare grid + verdict.
 */
export function RagVsLongContext() {
  return (
    <Infographic>
      <InfographicHeader
        title="The million-token memo"
        subtitle="“RAG is obsolete now.” Atlas's finance team ran the numbers before the architecture changed."
      />

      {/* Beat 1 — the cost math */}
      <Scene caption="① The same corpus, two bills">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">paste the 40k docs (long context)</div>
              <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink">
                ~1M tokens / request
                <br />≈ €9.00 / query · 30–60× slower
                <br />re-billed on <span className="font-bold">every question</span>
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">retrieve the 5 pages (RAG)</div>
              <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink">
                ~2k tokens / request
                <br />≈ €0.007 / query · milliseconds
                <br /><span className="font-bold">~1,250× cheaper</span> at this scale
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — where long context genuinely wins */}
      <Scene caption="② What big windows are actually for">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <UseCase title="Exhaustive analysis" note="whole-contract review, cross-reading one 400-page doc — nothing may be missed, retrieval selects and therefore drops" />
            <UseCase title="Small + static" note="the 12-page handbook: pasting was already right in course one — the window just makes it easier" />
            <UseCase title="The hybrid move" note="retrieve to SELECT the right 3 documents, then long-context to READ them whole — selection precision, exhaustive depth" accent />
          </div>
        </Reveal>
      </Scene>

      {/* Beat 3 — the verdict */}
      <Scene caption="③ The memo, answered">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Bigger windows change <span className="font-bold">where the boundary sits</span>, not the
            trade: cost scales with tokens pasted, freshness scales with sync, and provenance
            still requires knowing which page said it. Atlas's answer: RAG for the corpus,{" "}
            <span className="font-bold">hybrid for deep dives</span> — and the eval suite scoring both.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Long context is an analysis tool, not a corpus strategy: paste what's small and
          static, retrieve what's large and living — and combine them when depth demands it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One use-case card. */
function UseCase({ title, note, accent = false }: { title: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
