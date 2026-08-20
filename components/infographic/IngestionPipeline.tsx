import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 9 (capstone): "The Ingestion
 * Pipeline". Documents → parse → chunk → embed → index, with the metadata
 * that makes it honest (source, doc_id, version, updated_at); the sync loop
 * (updated → re-ingest, deleted → chunks removed — orphans); Atlas ships.
 * Brand accent on the metadata beat; bad marks the orphan once.
 */
export function IngestionPipeline() {
  return (
    <Infographic>
      <InfographicHeader
        title="The pipeline that keeps the index honest"
        subtitle="Retrieval is only as good as what ingestion put in — and what it removed."
      />

      {/* Scene 1 — the stages */}
      <Scene caption="① From document to index">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <Stage n={1} label="Parse" detail="PDFs, wikis, tickets → clean text (tables and code preserved — lesson 1's promise)" />
          </MotionChild>
          <MotionChild>
            <Stage n={2} label="Chunk" detail="cut at the document's joints — one procedure, one table, one section per chunk" />
          </MotionChild>
          <MotionChild>
            <Stage n={3} label="Embed" detail="each chunk → the meaning map — one model, chosen once, for everything" />
          </MotionChild>
          <MotionChild>
            <Stage n={4} label="Index + metadata" detail="every chunk carries: source, doc_id, version, updated_at" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 2 — the sync loop, including deletes */}
      <Scene caption="② What happens when the source changes">
        <Reveal>
          <div className="space-y-2">
            <SyncRow tone="ok" event="doc updated" action="re-parse → re-chunk → re-embed → replace by doc_id" note="old chunks overwritten, never duplicated" />
            <SyncRow tone="ok" event="new doc" action="ingest once, stamp version + updated_at" note="findable from the first minute" />
            <SyncRow tone="bad" event="doc deleted" action="chunks must be removed by doc_id — or they live on as…" note="orphans: untraceable ghosts still winning rankings (the stale-page failure, institutionalized)" />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          The beginner course&apos;s stale page was never a model failure —{" "}
          <span className="font-bold">it was an ingestion debt</span>, and this loop is how it's paid.
        </p>
      </Scene>

      {/* Scene 3 — Atlas ships */}
      <Scene caption="③ How Atlas finally ships">
        <Reveal>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4">
            <div className="space-y-1.5 text-sm font-medium leading-relaxed text-ink">
              <p><span className="font-bold">Chunks</span> cut at structure, parents linked. ✦
                <span className="font-bold">Hybrid</span> dense + keyword, ranks fused.</p>
              <p><span className="font-bold">Rerank</span> top-50 → top-5. ✦
                <span className="font-bold">Queries</span> rewritten whole before the index.</p>
              <p><span className="font-bold">Answers</span> cited or refused. ✦
                <span className="font-bold">Evals</span> scoring all four questions. ✦
                <span className="font-bold">Traces</span> on every request.</p>
              <p className="pt-1 text-center font-bold">
                …and an ingestion loop that keeps the index identical to its sources. That's RAG in practice.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The capstone takeaway</CardTitle>
        <Takeaway>
          Ingestion is where honesty is manufactured: structure-aware chunks, version-stamped
          metadata, updates replaced, deletes propagated — the index tracks its sources.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One ingestion stage. */
function Stage({ n, label, detail, accent = false }: { n: number; label: string; detail: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{label}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
      </div>
    </div>
  );
}

/** One row of the sync loop. */
function SyncRow({ tone, event, action, note }: { tone: "ok" | "bad"; event: string; action: string; note: string }) {
  const bad = tone === "bad";
  return (
    <div
      className={`rounded-xl border px-4 py-3 shadow-sm ${
        bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase text-canvas ${bad ? "bg-[var(--color-bad)]" : "bg-ink"}`}>
          {event}
        </span>
      </div>
      <p className="mt-1.5 font-mono text-[10.5px] font-semibold leading-relaxed text-ink">{action}</p>
      <p className="mt-1 text-[10px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
