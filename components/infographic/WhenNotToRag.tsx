import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 7 (capstone): "When NOT to Use RAG".
 *
 * Three tasks, three right-sized designs: paste the small handbook into the
 * window; count records in a database; RAG for the large changing corpus that
 * needs citations. Mirrors the harness capstone's "least machinery" ladder.
 * Good marks the right-sized choice; brand accent on the RAG row.
 */
export function WhenNotToRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="The most valuable skill: not building one"
        subtitle="Three knowledge tasks arrive on Monday — only one deserves RAG."
      />

      {/* Scene 1 — sort the tasks */}
      <Scene caption="① Three tasks, three right answers">
        <Stagger className="flex flex-col gap-3">
          <MotionChild>
            <TaskRow
              task="Answer questions from the 12-page employee handbook — it changed once, in 2023"
              design="paste it in"
              why="tiny, static — it fits in the window; retrieval buys nothing"
            />
          </MotionChild>
          <MotionChild>
            <TaskRow
              task="&ldquo;How many orders shipped on Tuesday, and to which cities?&rdquo;"
              design="database"
              why="exact records need exact lookups — search approximates, a query counts"
            />
          </MotionChild>
          <MotionChild>
            <TaskRow
              task="Answer from 40,000 support docs, product specs, and policy pages — updated daily, every answer must cite its source"
              design="RAG"
              why="far too big to paste, always changing, and citations are the product"
              accent
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 2 — what each is good at */}
      <Scene caption="② Why the three aren't interchangeable">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ToolCard title="Paste it in" rows={["zero moving parts", "perfect for small + static", "costs the same tokens every ask"]} />
            <ToolCard title="Database query" rows={["exact records, exact counts", "no ranking, no guessing", "the right tool for &ldquo;how many&rdquo;"]} />
            <ToolCard title="RAG pipeline" rows={["scales to any corpus size", "always-current (if the index is)", "citations built in"]} accent />
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — the ladder */}
      <Scene caption="③ The ladder — climb only as high as the task forces">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            <span className="font-bold">Paste it in</span> → too big or changing?{" "}
            <span className="font-bold">RAG</span> → but exact records or counts? That was never
            a search problem — <span className="font-bold">query the database</span>. The
            confidence to skip RAG is the senior skill.
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

/** One task sorted onto its right-sized design. */
function TaskRow({ task, design, why, accent = false }: { task: string; design: string; why: string; accent?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed text-ink sm:text-[13px]">
        {task}
      </p>
      <div className="sm:w-44 sm:shrink-0">
        <span className="inline-block rounded-full border border-good bg-good-wash px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-good">
          ✓ {design}
        </span>
        <p className="mt-1 text-[10px] font-medium leading-snug text-ink-soft">{why}</p>
      </div>
    </div>
  );
}

/** One tool card in the comparison. */
function ToolCard({ title, rows, accent = false }: { title: string; rows: string[]; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{title}</div>
      <ul className="mt-2 space-y-1">
        {rows.map((r) => (
          <li key={r} className="text-[10.5px] font-medium leading-relaxed text-ink-soft">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
