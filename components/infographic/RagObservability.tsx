import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 8: "RAG Observability".
 *
 * Course case: the 2am mystery — answers citing odd pages, traced via the
 * retrieval log to a chunker regression (chunks suddenly 3× smaller). The
 * retrieval trace for one question: query as sent, chunks + scores, rerank
 * deltas, final context, latency per stage. Passive by restraint: the skill
 * is reading a trace. Brand accent on the smoking-gun span.
 */
export function RagObservability() {
  return (
    <Infographic>
      <InfographicHeader
        title="“Why this answer?” is a log question"
        subtitle="Atlas started citing odd pages at 2am. The trace answered in ten seconds."
      />

      {/* Scene 1 — the retrieval trace */}
      <Scene caption="① The trace for one question">
        <Stagger className="space-y-1.5">
          <MotionChild>
            <Span label="query" text="what is the parental leave policy for part-time staff?" ms="0ms" />
          </MotionChild>
          <MotionChild>
            <Span label="retrieve" text="hybrid: dense 50 + bm25 50 → fused → top 8" ms="18ms" />
          </MotionChild>
          <MotionChild>
            <Span label="chunk#3" text="hr-policy p11 · score 0.81 · 240 tokens" ms="" accent />
          </MotionChild>
          <MotionChild>
            <Span label="rerank" text="8 → 5 · hr-policy p11 held #1" ms="41ms" />
          </MotionChild>
          <MotionChild>
            <Span label="context" text="5 chunks · 1.9k tokens · 3 sources" ms="4ms" />
          </MotionChild>
          <MotionChild>
            <Span label="answer" text="16 weeks, pro-rated — [hr-policy p11]" ms="780ms" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          every row is a question you&apos;d otherwise answer by guessing.
        </p>
      </Scene>

      {/* Scene 2 — the 2am mystery, solved by trace */}
      <Scene caption="② What the logs showed that night">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-bad)]">the symptom</div>
              <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-ink">
                Answers began citing <span className="font-mono text-[10.5px]">policy-vacation</span> for
                parental-leave questions. Nothing about the model, prompt, or query stage had
                changed.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">the trace</div>
              <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-ink">
                Chunk sizes had quietly dropped <span className="font-bold">~3× across the index</span> —
                a chunker config regression at Tuesday&apos;s re-ingest. Whole procedures were now
                fragments; the embeddings matched worse; near-miss pages started winning.
              </p>
              <p className="mt-1 text-[11px] font-bold text-brand-deep">One config revert. No model touched.</p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — what to record */}
      <Scene caption="③ The spans that earn their keep">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Record title="Query as sent" note="post-rewrite — the query the index actually saw" accent />
            <Record title="Chunks + scores" note="what won, what lost, how close it was" />
            <Record title="Rerank deltas" note="what moved — big swings are signals" />
            <Record title="Context shape" note="chunk count, tokens, sources — the model's whole diet" />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Record <span className="font-bold">structure, not content</span> at scale — scores,
          sizes, and versions; raw page text only where privacy allows.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Trace the query, the chunks, the scores, the reranks, and the context shape —
          &ldquo;why this answer?&rdquo; becomes a lookup, not a seance.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One span row of the retrieval trace. */
function Span({ label, text, ms, accent = false }: { label: string; text: string; ms: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        className={`w-14 shrink-0 rounded px-1.5 py-0.5 text-center text-[9.5px] font-bold uppercase tracking-wide ${
          accent ? "bg-brand text-canvas" : "bg-ink text-canvas"
        }`}
      >
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] font-medium text-ink sm:text-[11px]">
        {text}
      </span>
      {ms && <span className="shrink-0 font-mono text-[10px] font-bold text-ink-faint">{ms}</span>}
    </div>
  );
}

/** One "record this" card. */
function Record({ title, note, accent = false }: { title: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-xs font-bold text-ink sm:text-[13px]">{title}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
