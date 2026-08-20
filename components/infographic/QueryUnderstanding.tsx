import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 5: "Query Understanding".
 *
 * Course case: Atlas's follow-ups ("and what about part-time?") retrieved
 * nothing — because the index never saw a complete question. Three moves:
 * rewrite with chat context, decompose multi-part questions, expand jargon.
 * Bad marks the naked follow-up; brand carries the rewritten queries.
 */
export function QueryUnderstanding() {
  return (
    <Infographic>
      <InfographicHeader
        title="The question the index never sees whole"
        subtitle="“And what about part-time?” is a perfectly good question — with its first half missing."
      />

      {/* Scene 1 — the gap */}
      <Scene caption="① What search received, verbatim">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <div className="font-mono text-[11px] leading-relaxed text-ink-soft">
              user: what&apos;s the parental leave policy?
              <br />
              atlas: <span className="text-ink">[answers, cites HR-policy p4]</span>
              <br />
              user: and what about part-time?
            </div>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-[var(--color-bad)]">
              embedded alone, “and what about part-time?” lands near nothing —
              the map has no street for a sentence missing its subject
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — the three moves */}
      <Scene caption="② Three moves before the index">
        <Stagger className="space-y-2">
          <MotionChild>
            <Move
              name="Rewrite with context"
              before="“and what about part-time?”"
              after="“what is the parental leave policy for part-time employees?”"
              note="the chat history completes the question"
            />
          </MotionChild>
          <MotionChild>
            <Move
              name="Decompose"
              before="“compare vacation policy for the Berlin and Austin offices and tell me who approves”"
              after="q1: vacation days — Berlin · q2: vacation days — Austin · q3: who approves requests"
              note="multi-part questions retrieve badly as one blob"
            />
          </MotionChild>
          <MotionChild>
            <Move
              name="Expand"
              before="“how do I fix a quorum storm?”"
              after="“fix quorum storm — also search: cache quorum lost, E-4821, cluster split-brain”"
              note="the docs may not use the asker's words"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 3 — the placement */}
      <Scene caption="③ Where the stage sits">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {["raw question + history", "understand", "embed + search", "rerank", "answer"].map(
              (s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true" className="text-ink-faint">→</span>}
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                      s === "understand" ? "border-brand bg-brand-wash text-brand-deep" : "border-ash bg-surface-elevated text-ink"
                    }`}
                  >
                    {s}
                  </span>
                </span>
              ),
            )}
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Understanding is the stage that makes every later stage honest —{" "}
          <span className="font-bold">search can only answer the question it receives</span>.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Rewrite follow-ups into whole questions, split multi-part asks, expand jargon —
          before the index ever sees the query.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One query-understanding move with before/after. */
function Move({ name, before, after, note }: { name: string; before: string; after: string; note: string }) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
      <div className="text-xs font-bold text-ink sm:text-[13px]">{name}</div>
      <p className="mt-1.5 font-mono text-[10.5px] leading-relaxed text-ink-faint line-through decoration-[var(--color-bad)]/60">
        {before}
      </p>
      <p className="mt-1 font-mono text-[10.5px] font-semibold leading-relaxed text-brand-deep">{after}</p>
      <p className="mt-1 text-[10px] font-medium text-ink-soft">{note}</p>
    </div>
  );
}
