import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 4: "Reranking".
 *
 * Course case: the right runbook ranked 12th — outside every sane k. The
 * two-pass funnel: bi-encoder recall (top-50, cheap, map-glance) vs
 * cross-encoder rerank (reads question+page together, slow, precise). The
 * rank-jump beat shows 12→2. Cost tiers visible. Brand accent on the
 * rescued page.
 */
export function Reranking() {
  return (
    <Infographic>
      <InfographicHeader
        title="The right page was there — at rank 12"
        subtitle="Cheap search sees 50 candidates in a glance; a reranker actually reads them."
      />

      {/* Scene 1 — the two-pass funnel */}
      <Scene caption="① Recall wide, then read closely">
        <Stagger className="flex flex-col items-stretch gap-2">
          <MotionChild>
            <Pass
              n={1}
              label="Recall — bi-encoder"
              detail="question and pages embedded separately, distances compared: 12k pages → top 50 in milliseconds"
              cost="~€0.0001"
            />
          </MotionChild>
          <MotionChild>
            <Pass
              n={2}
              label="Rerank — cross-encoder"
              detail="question + each page read TOGETHER, scored for fit: 50 → 5, tens of milliseconds"
              cost="~€0.004"
              accent
            />
          </MotionChild>
          <MotionChild>
            <Pass n={3} label="Context" detail="the five best-read pages into the window — the right runbook included" cost="" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 2 — the rank jump */}
      <Scene caption="② The rescue, visible">
        <Reveal>
          <div className="mx-auto max-w-lg space-y-1.5">
            <RankRow from={12} to={1} text="runbook: quorum recovery (E-4821)" accent />
            <RankRow from={1} to={4} text="errors-E-4801.md (near-miss)" />
            <RankRow from={5} to={2} text="monitoring: quorum alerts" />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          The reranker didn&apos;t find anything new — it <span className="font-bold">read
          more carefully</span> what cheap search had already surfaced.
        </p>
      </Scene>

      {/* Scene 3 — the trade */}
      <Scene caption="③ Why two passes instead of one good one?">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            The careful reader costs <span className="font-bold">~40× the careful-looker per
            page</span> — you can&apos;t run it over 12,000 pages. So spend the cheap pass wide
            and the expensive pass <span className="font-bold">only on the shortlist</span>.
            That division of labor IS the design.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Recall with the cheap map-glance, rerank with the careful reader, keep five. The
          funnel finds what rank-12 was hiding.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One pass of the funnel. */
function Pass({ n, label, detail, cost, accent = false }: { n: number; label: string; detail: string; cost: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{label}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
      </div>
      {cost && (
        <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9.5px] font-bold text-ink-soft">
          {cost}
        </span>
      )}
    </div>
  );
}

/** One before/after rank movement. */
function RankRow({ from, to, text, accent = false }: { from: number; to: number; text: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="w-16 shrink-0 font-mono text-[11px] font-bold text-ink-faint">#{from}</span>
      <span aria-hidden="true" className={`text-sm ${to < from ? "text-good" : "text-ink-faint"}`}>
        {to < from ? "→" : "→"}
      </span>
      <span className={`w-8 shrink-0 font-mono text-[11px] font-bold ${to < from ? "text-good" : "text-[var(--color-bad)]"}`}>
        #{to}
      </span>
      <span className={`min-w-0 flex-1 truncate font-mono text-[11px] font-medium ${accent ? "text-ink" : "text-ink-soft"}`}>
        {text}
      </span>
    </div>
  );
}
