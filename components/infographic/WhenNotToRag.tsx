import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 7 (capstone): "When NOT to Use RAG"
 * (v2 Thread retrofit)
 *
 * Through-line stage: ZapKart's ticket board. The three Monday tickets appear
 * unsorted; the ONE change of the second scene is the verdict chip landing on
 * each ticket (staggered — good marks paste/query, brand accent on the RAG
 * ticket); the resolution is the ladder — three rungs, a stop flag on the
 * lowest rung that works. The tool-comparison grid is gone: the decision-tree
 * diagram below the infographic already formalizes that (no re-telling).
 */
export function WhenNotToRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="The most valuable skill: not building one"
        subtitle="Three knowledge tasks arrive on Monday — only one deserves RAG."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🎫</span>, label: "Three tickets" },
          { icon: <span aria-hidden="true">🔀</span>, label: "Sort each one" },
          { icon: <span aria-hidden="true">🪜</span>, label: "Stop at the lowest rung" },
        ]}
      />

      {/* Anchor — the board, three tickets, nothing sorted yet */}
      <Scene caption="So three tickets land on ZapKart's desk on Monday.">
        <div className="flex flex-col gap-3">
          <TicketRow task="Answer questions from the 12-page employee handbook — it changed once, in 2023" />
          <TicketRow task="&ldquo;How many orders shipped on Tuesday, and to which cities?&rdquo;" />
          <TicketRow task="Answer from 40,000 support docs, product specs, and policy pages — updated daily, every answer must cite its source" />
        </div>
      </Scene>

      {/* The sort — verdict chips land one ticket at a time */}
      <Scene variant="continue" caption="Then sort each one — keep the smallest tool that wins.">
        <Stagger className="flex flex-col gap-3">
          <MotionChild>
            <TicketRow
              task="Answer questions from the 12-page employee handbook — it changed once, in 2023"
              design="✓ paste it in"
              why="tiny, static — it fits in the window; retrieval buys nothing"
            />
          </MotionChild>
          <MotionChild>
            <TicketRow
              task="&ldquo;How many orders shipped on Tuesday, and to which cities?&rdquo;"
              design="✓ query the database"
              why="exact records need exact lookups — search approximates, a query counts"
            />
          </MotionChild>
          <MotionChild>
            <TicketRow
              task="Answer from 40,000 support docs, product specs, and policy pages — updated daily, every answer must cite its source"
              design="★ RAG pipeline"
              why="far too big to paste, always changing, and citations are the product"
              accent
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Resolution — the ladder */}
      <Scene caption="That's why you stop at the lowest rung that works.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm">
            <div className="space-y-2">
              <LadderRung n={3} label="retrieve — RAG" note="too big to paste, too alive to freeze, citations required" />
              <LadderRung n={2} label="query — database" note="exact records and counts" />
              <LadderRung n={1} label="paste — the window" note="small and static knowledge" stop />
            </div>
            <p className="mt-3 text-center text-[11px] font-medium leading-relaxed text-ink-soft">
              the handbook ticket stops on rung 1 —{" "}
              <span className="font-bold text-ink">&ldquo;you don&apos;t need RAG for this&rdquo; is a complete, senior answer</span>
            </p>
          </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The capstone takeaway</CardTitle>
        <Takeaway>
          RAG is for corpora too big to paste and too alive to freeze — with citations as the
          prize. Small static docs: paste. Exact records: query.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One ticket on the board — sorted tickets carry a verdict chip. */
function TicketRow({ task, design, why, accent = false }: { task: string; design?: string; why?: string; accent?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed text-ink sm:text-[13px]">
        {task}
      </p>
      {design && (
        <div className="sm:w-44 sm:shrink-0">
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              accent
                ? "border-brand bg-surface-elevated text-brand-deep"
                : "border-dashed border-ash bg-canvas text-ink-soft"
            }`}
          >
            {design}
          </span>
          {why && <p className="mt-1 text-[10px] font-medium leading-snug text-ink-soft">{why}</p>}
        </div>
      )}
    </div>
  );
}

/** One rung of the tool ladder. */
function LadderRung({ n, label, note, stop = false }: { n: number; label: string; note: string; stop?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
          stop ? "border-brand bg-brand text-canvas" : "border-ash bg-canvas text-ink-soft"
        }`}
      >
        {n}
      </span>
      <div
        className={`flex min-w-0 flex-1 items-baseline justify-between gap-2 rounded-lg border px-3 py-1.5 ${
          stop ? "border-brand bg-brand-wash" : "border-dashed border-ash bg-canvas"
        }`}
      >
        <span className={`text-xs font-bold ${stop ? "text-brand-deep" : "text-ink-soft"}`}>{label}</span>
        <span className="truncate text-[10px] font-medium text-ink-soft">{note}</span>
      </div>
      {stop && (
        <span className="shrink-0 rounded-full border border-brand bg-surface-elevated px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-deep">
          stop here
        </span>
      )}
    </div>
  );
}
