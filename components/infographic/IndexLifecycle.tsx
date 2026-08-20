import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 5: "The Index Lifecycle".
 *
 * Freshness engineering at 40k docs: incremental sync, delete propagation,
 * drift detection (silent 10–20 pts/year), re-ingest triggers on
 * parser/chunker changes, and the dual-index migration for embedding
 * upgrades. Expert register; brand accent on the migration.
 */
export function IndexLifecycle() {
  return (
    <Infographic>
      <InfographicHeader
        title="An index is a running system, not a build artifact"
        subtitle="Atlas: 40k documents, daily changes, quarterly model upgrades — and zero pauses allowed."
      />

      {/* Beat 1 — what freshness actually requires */}
      <Scene caption="① Fresh = index ≡ sources, on six axes">
        <Reveal>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Axis title="Source edits" note="re-ingest by doc_id — replace, never duplicate" />
            <Axis title="Source deletes" note="propagate the same cycle — orphans forbidden" />
            <Axis title="Parser changes" note="new parser = full re-ingest: every chunk reshapes" />
            <Axis title="Chunker changes" note="same — and chunk-size dashboards catch it same-night" />
            <Axis title="Embedding upgrades" note="new map: dual-index migration, never a flip" accent />
            <Axis title="Cache invalidation" note="answers cached on old chunks must expire with them" />
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — the silent drift */}
      <Scene caption="② The failure nobody deploys">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-bad)]">
              measured across the industry
            </div>
            <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-ink">
              Untended RAG indexes lose <span className="font-bold">10–20 retrieval points within a
              year</span> with zero code changes: sources drift, deletes never propagate, near-duplicates
              accumulate, and the corpus&apos;s phrasing moves on without the embeddings. Nothing
              crashes — the answers just get quietly worse.
            </p>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          which is why drift detection is a <span className="font-bold text-ink">dashboard</span>, not a suspicion.
        </p>
      </Scene>

      {/* Beat 3 — the dual-index migration */}
      <Scene caption="③ Upgrading embeddings at 40k docs, without a pause">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <Phase n={1} label="Shadow-build" detail="new model re-embeds everything into a second index — live traffic untouched" />
          </MotionChild>
          <MotionChild>
            <Phase n={2} label="Verify" detail="run the golden set against the new index — all four metrics, no regressions" />
          </MotionChild>
          <MotionChild>
            <Phase n={3} label="Switch" detail="flip the pointer; canary 5% first, then full" accent />
          </MotionChild>
          <MotionChild>
            <Phase n={4} label="Retire" detail="keep the old index warm for a week (instant rollback), then decommission" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Freshness is six synchronized axes — edits, deletes, parsers, chunkers, embeddings,
          caches — and upgrades travel by dual-index migration, never by a mid-flight flip.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One freshness axis. */
function Axis({ title, note, accent = false }: { title: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-[11.5px] font-bold text-ink">{title}</div>
      <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

/** One phase of the migration. */
function Phase({ n, label, detail, accent = false }: { n: number; label: string; detail: string; accent?: boolean }) {
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
