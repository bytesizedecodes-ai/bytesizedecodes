import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";
import { MeaningTown } from "./WhatAreEmbeddings";

/**
 * RAG Engineering Foundations — Lesson 4: "How the Search Finds the Right
 * Page" (v2 Thread retrofit)
 *
 * Through-line stage: the SAME meaning-map town as lesson 3 (imported
 * `MeaningTown` — identical geography, so the map is a place the learner has
 * already been). The one new element is Ravi's question pin; then the story
 * zooms to the ranking it causes — ZapKart pages measured, sorted, top few
 * kept — and the k dial as three tiny window states (misses / just right /
 * the lesson-2 pile returns). Dropped pages stay visible as ghosts.
 */
export function SimilaritySearch() {
  return (
    <Infographic>
      <InfographicHeader
        title="The question joins the map"
        subtitle="Same map, one new pin — and the nearest pages win."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">📍</span>, label: "The question lands" },
          { icon: <span aria-hidden="true">📏</span>, label: "Rank every page" },
          { icon: <span aria-hidden="true">3️⃣</span>, label: "Keep the top few" },
        ]}
      />

      {/* Anchor state — the question pin, the ONE new element on the known map */}
      <Scene caption="So Ravi's question — 'Can I get my money back?' — lands on the map too.">
        <MeaningTown stage="question" />
      </Scene>

      {/* Tension → reveal — the measurement the pin causes, then the ranking */}
      <Scene variant="continue" caption="Then the search measures its distance to every page — and sorts.">
        <svg
          viewBox="0 0 280 104"
          className="mx-auto mb-4 w-full max-w-md"
          role="img"
          aria-label="The question pin with dashed measure lines to nearby and far pages: the three nearest get ranks 1, 2 and 3; distant pages rank 9 and 31"
        >
          <text x="40" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">Ravi&apos;s question</text>
          <circle cx="40" cy="50" r="6" fill="none" stroke="var(--color-brand)" strokeWidth="2" />
          <circle cx="40" cy="50" r="2.5" fill="var(--color-brand)" />
          {/* the three nearest — measured and kept */}
          <line x1="46" y1="47" x2="82" y2="36" stroke="var(--color-brand)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="87" cy="35" r="4" fill="var(--color-brand)" />
          <text x="87" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">1</text>
          <line x1="46" y1="54" x2="94" y2="66" stroke="var(--color-brand)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="99" cy="67" r="4" fill="var(--color-brand)" />
          <text x="99" y="80" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">2</text>
          <line x1="46" y1="50" x2="124" y2="50" stroke="var(--color-brand)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="129" cy="50" r="4" fill="var(--color-brand)" />
          <text x="129" y="40" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">3</text>
          {/* the far ones — measured too, dropped */}
          <line x1="46" y1="45" x2="184" y2="28" stroke="var(--color-ink-faint)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="189" cy="27" r="3.5" fill="var(--color-ink-faint)" />
          <text x="189" y="16" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">9</text>
          <line x1="46" y1="56" x2="232" y2="72" stroke="var(--color-ink-faint)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="237" cy="73" r="3.5" fill="var(--color-ink-faint)" />
          <text x="237" y="86" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">31</text>
          <text x="140" y="100" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">distance on the map = distance in meaning</text>
        </svg>
        <Stagger className="space-y-2">
          <MotionChild>
            <RankRow rank={1} page="policy-refunds.md · page 2" dist="very close" chosen />
          </MotionChild>
          <MotionChild>
            <RankRow rank={2} page="faq-returns.md · page 1" dist="close" chosen />
          </MotionChild>
          <MotionChild>
            <RankRow rank={3} page="policy-payments.md · page 4" dist="nearby" chosen />
          </MotionChild>
          <MotionChild>
            <RankRow rank={9} page="shipping-times.md · page 3" dist="far — different street" />
          </MotionChild>
          <MotionChild>
            <RankRow rank={31} page="careers.md · page 1" dist="very far" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          every indexed page gets a distance to the question — the search just{" "}
          <span className="font-bold text-ink">sorts by it</span>.
        </p>
      </Scene>

      {/* The k dial — keep the top few, felt as three window states */}
      <Scene variant="continue" caption="But k — how many to keep — is a dial, and both ends of it bite.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <KDial
              k="k = 1"
              state="miss"
              rows={[
                { page: "policy-refunds · p2", attention: "high" },
                { page: "faq-returns · p1", attention: "ghost", note: "missed the cut" },
              ]}
              verdict="too few — the second good page is lost"
            />
            <KDial
              k="k = 3"
              state="right"
              rows={[
                { page: "policy-refunds · p2", attention: "high" },
                { page: "faq-returns · p1", attention: "high" },
                { page: "policy-payments · p4", attention: "high" },
              ]}
              verdict="just right — the good pages, on top"
            />
            <KDial
              k="k = 20"
              state="pile"
              rows={[
                { page: "page 1", attention: "high" },
                { page: "pages 2–19", attention: "ghost" },
                { page: "page 20 — the refund page", attention: "ghost", note: "buried again" },
                { page: "+ 10 more", attention: "ghost" },
              ]}
              verdict="the lesson-2 pile returns — the winner hides mid-pile"
            />
          </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Search = plot the question, measure distances, sort, keep the top few. The map does
          the understanding; the sort does the choosing.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One ranked candidate page — kept pages accent, dropped pages ghost. */
function RankRow({
  rank,
  page,
  dist,
  chosen = false,
}: {
  rank: number;
  page: string;
  dist: string;
  chosen?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${
        chosen ? "border-brand bg-brand-wash" : "border-dashed border-ash bg-canvas opacity-70"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
          chosen ? "bg-brand text-canvas" : "bg-ink text-canvas"
        }`}
      >
        {rank}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] font-semibold text-ink sm:text-xs">
        {page}
      </span>
      <span className="shrink-0 text-[10px] font-medium text-ink-soft">{dist}</span>
      {chosen && (
        <span className="shrink-0 rounded-full border border-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-deep">
          kept
        </span>
      )}
      {!chosen && (
        <span className="shrink-0 rounded-full border border-dashed border-ash px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-faint">
          dropped
        </span>
      )}
    </div>
  );
}

/** One window state of the k dial. */
function KDial({
  k,
  state,
  rows,
  verdict,
}: {
  k: string;
  state: "miss" | "right" | "pile";
  rows: { page: string; attention: "high" | "ghost"; note?: string }[];
  verdict: string;
}) {
  const accent = state === "right";
  return (
    <div
      className={`flex h-full flex-col rounded-xl border p-3 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        className={`mx-auto rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${
          accent ? "border-brand bg-surface-elevated text-brand-deep" : "border-ash bg-canvas text-ink-soft"
        }`}
      >
        {k}
      </span>
      <div className="mt-2 flex-1 space-y-1">
        {rows.map((r) => (
          <div
            key={r.page}
            className={`flex items-center justify-between gap-1 rounded-lg border px-2 py-1 ${
              r.attention === "high"
                ? accent
                  ? "border-brand bg-surface-elevated"
                  : "border-ash bg-surface-elevated"
                : "border-dashed border-ash bg-canvas"
            }`}
          >
            <span
              className={`truncate text-[10px] font-bold ${
                r.attention === "high" ? "text-ink" : "text-ink-faint line-through decoration-dotted"
              }`}
            >
              {r.page}
            </span>
            {r.note && <span className="shrink-0 text-[9px] font-medium text-ink-faint">{r.note}</span>}
          </div>
        ))}
      </div>
      <p className={`mt-2 text-[10.5px] font-medium leading-relaxed ${accent ? "text-brand-deep font-bold" : "text-ink-soft"}`}>
        {verdict}
      </p>
    </div>
  );
}
