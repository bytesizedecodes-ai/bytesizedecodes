import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, Tag } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 1: "Chunking Strategy".
 *
 * Course case: Atlas's runbooks were cut mid-procedure. Side-by-side: the
 * fixed-size guillotine (step 4 severed from its warning, a table sliced in
 * half) vs structure-aware chunks (each procedure whole, parent document
 * linked). Third beat: the research headline — chunking decides more than
 * the embedding model. Comparison grid reveals as one block; bad marks the
 * cuts.
 */
export function ChunkingStrategy() {
  return (
    <Infographic>
      <InfographicHeader
        title="Where RAG quality is actually decided"
        subtitle="Atlas retrieved the right runbook — and a chunk that had lost the plot."
      />

      {/* Scene 1 — the guillotine */}
      <Scene caption="① Fixed-size cuts: 512 tokens, feelings not included">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <Tag tone="neutral">runbook: restart-the-cache-service · 1,800 tokens</Tag>
            <div className="mt-3 space-y-1">
              <Cut label="chunk 1" note="steps 1–3 · fine" tone="ok" />
              <Cut label="chunk 2" note="steps 4–6 — severed from step 4's warning: 'do NOT skip the drain step'" tone="bad" />
              <Cut label="chunk 3" note="the config table — sliced in half, columns orphaned" tone="bad" />
            </div>
            <p className="mt-3 text-[11px] font-medium leading-relaxed text-ink-soft">
              Retrieval found chunk 2 for &ldquo;how do I restart the cache service safely?&rdquo; —
              and the answer came back <span className="font-bold text-[var(--color-bad)]">without the warning</span>.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — structure-aware */}
      <Scene caption="② Cut where the document already bends">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <Tag tone="neutral">fixed-size guillotine</Tag>
              <ul className="mt-2 space-y-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                <li>✗ procedures severed mid-step</li>
                <li>✗ tables and code blocks split arbitrarily</li>
                <li>✗ headings separated from their content</li>
              </ul>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <Tag tone="brand" dot>structure-aware</Tag>
              <ul className="mt-2 space-y-1.5 text-[11px] font-medium leading-relaxed text-ink">
                <li>✓ one procedure = one chunk, warning attached</li>
                <li>✓ tables and code blocks stay whole</li>
                <li>✓ heading + its section travel together — and link back to the parent doc</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — the headline + parent-document */}
      <Scene caption="③ The finding teams keep re-learning">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            In field after field the same result: <span className="font-bold">chunking strategy
            decides more than the embedding model</span>. Teams A/B a fancier model for weeks;
            fixing the cuts moves the score more. And when small pieces must stay small, use the{" "}
            <span className="font-bold">parent-document move</span>: retrieve the precise piece,
            serve the surrounding section.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          A chunk is the unit of retrieval — cut at the document's own joints, keep each piece
          self-contained, and link it back to its section.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One chunk row in the guillotine view. */
function Cut({ label, note, tone }: { label: string; note: string; tone: "ok" | "bad" }) {
  const bad = tone === "bad";
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-1.5 ${
        bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"
      }`}
    >
      <span className={`w-14 shrink-0 font-mono text-[10px] font-bold ${bad ? "text-[var(--color-bad)]" : "text-ink-faint"}`}>
        {label}
      </span>
      <span className="text-[10.5px] font-medium leading-snug text-ink">{note}</span>
    </div>
  );
}
