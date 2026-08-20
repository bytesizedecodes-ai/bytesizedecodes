import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 4: "How the Search Finds the Right Page".
 *
 * Same map as lesson 3 (through-line: the meaning map — new state, not a new
 * metaphor). The question gets plotted; nearest pages win; top-k is made
 * visible (3 chosen of many, ranked). Stagger ranks the candidates; the
 * reveal shows the final trio. Brand accent on the question and its winners.
 */
export function SimilaritySearch() {
  return (
    <Infographic>
      <InfographicHeader
        title="The question joins the map"
        subtitle="Same map, one new pin — and the nearest pages win."
      />

      {/* Scene 1 — the question lands on the map */}
      <Scene caption="① &ldquo;Can I get my money back?&rdquo; gets an address too">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center shadow-sm">
            <div className="text-sm font-bold text-ink">&ldquo;Can I get my money back?&rdquo;</div>
            <div aria-hidden="true" className="mt-1 text-lg text-brand">↓</div>
            <div className="text-[11px] font-medium text-ink-soft">
              the embedding model plots it on <span className="font-bold text-ink">money &amp; refunds street</span> —
              right between the refund pages
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — the ranking, staggered */}
      <Scene caption="② Distances measured, pages ranked">
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

      {/* Scene 3 — top-k made visible */}
      <Scene caption="③ Keep the few, drop the rest">
        <Reveal>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
            <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
              The top <span className="font-mono font-bold">3</span> of hundreds go into the
              context window — the &ldquo;k&rdquo; is a dial the engineer sets: too few and the
              right page might miss the cut; too many and the pile starts hiding it again.
            </p>
          </div>
        </Reveal>
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

/** One ranked candidate page. */
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
        chosen ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated opacity-70"
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
    </div>
  );
}
