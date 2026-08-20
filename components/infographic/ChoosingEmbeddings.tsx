import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 2: "Choosing an Embedding Model".
 *
 * Course case: Atlas has English and German docs — the multilingual decision.
 * The selection funnel (leaderboards → your own data → cost/dimensions), and
 * the reindex rule: embedding models don't mix — changing one means
 * rebuilding the index, ideally as a dual-index migration. Expert-lite
 * register for an intermediate course: the funnel carries the argument.
 */
export function ChoosingEmbeddings() {
  return (
    <Infographic>
      <InfographicHeader
        title="One index, one embedding model — choose like it's permanent"
        subtitle="Atlas's docs are half English, half German. The map must speak both."
      />

      {/* Scene 1 — the funnel */}
      <Scene caption="① The selection funnel, top to bottom">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <FunnelStep n={1} label="Cast the net" detail="public leaderboards + vendor docs — build a shortlist of ~5 candidates" />
          </MotionChild>
          <MotionChild>
            <FunnelStep n={2} label="Test on YOUR data" detail="50–100 real questions with known-right pages; score top-k hit rate per model" accent />
          </MotionChild>
          <MotionChild>
            <FunnelStep n={3} label="Price the fit" detail="dimensions (index size), latency, cost per million tokens, multilingual coverage" />
          </MotionChild>
          <MotionChild>
            <FunnelStep n={4} label="Commit — and reindex" detail="new model = every chunk re-embedded = a new index; plan the migration, don't drift into it" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          Step 2 is the one teams skip — and the only one that answers <span className="font-bold text-ink">your</span> question.
        </p>
      </Scene>

      {/* Scene 2 — Atlas's decision */}
      <Scene caption="② Atlas's scorecard">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ModelCard name="fast-small" dims="384" note="cheapest, fast — misses German nuance entirely" />
            <ModelCard name="multilingual-mid" dims="768" note="strong on both languages — the hit-rate winner on Atlas's 80-question set" accent />
            <ModelCard name="leaderboard-top" dims="1024" note="+1 point on English — 3× the index size and cost for it" />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          The leaderboard leader lost to the mid-size multilingual — on <span className="font-bold">Atlas's data</span>,
          which is the only election that counts.
        </p>
      </Scene>

      {/* Scene 3 — the reindex rule */}
      <Scene caption="③ The rule that makes this a real commitment">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Embeddings are addresses — and <span className="font-bold">two models draw two different maps</span>.
            Every chunk embedded by model A is meaningless to model B&apos;s index. Changing models
            means re-embedding everything, ideally as a <span className="font-bold">dual-index migration</span>:
            build the new index in shadow, verify with the golden set, then switch.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Shortlist from leaderboards, decide on your own data, price dimensions and latency —
          and treat the choice as permanent, because the reindex makes it so.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One step of the selection funnel. */
function FunnelStep({ n, label, detail, accent = false }: { n: number; label: string; detail: string; accent?: boolean }) {
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

/** One candidate model card. */
function ModelCard({ name, dims, note, accent = false }: { name: string; dims: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="font-mono text-sm font-bold text-ink">{name}</div>
      <span className="mt-1 inline-block rounded-full border border-ash bg-surface-elevated px-2 py-0.5 font-mono text-[10px] font-bold text-ink-soft">
        {dims} dims
      </span>
      <p className="mt-2 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
