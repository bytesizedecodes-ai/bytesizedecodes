import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 7: "Production RAG Evals".
 *
 * Course case: quality slid 8 points in a quarter with zero deploys — the
 * drift the online layer catches. The layered pipeline (golden set in CI →
 * canary → online samples), drift dashboards, judge calibration, incidents
 * becoming tasks. Expert register; compact.
 */
export function ProductionRagEvals() {
  return (
    <Infographic>
      <InfographicHeader
        title="Quality slid 8 points. Nothing was deployed."
        subtitle="The drift quarter — and the layered eval system built so it can't happen unheard again."
      />

      {/* Beat 1 — the layers */}
      <Scene caption="① Three layers around every change">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <Layer n={1} label="CI: golden set" detail="200 tasks, all four metrics — any pipeline change regresses nothing or doesn't ship" />
          </MotionChild>
          <MotionChild>
            <Layer n={2} label="Canary: 5% of traffic" detail="new index/prompt/pipeline shadow-scored on real queries before commitment" />
          </MotionChild>
          <MotionChild>
            <Layer n={3} label="Online: sampled + judged" detail="1% of production, scored nightly — the only layer that sees drift, because drift is a distribution moving" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the drift quarter, diagnosed */}
      <Scene caption="② What the online layer would have shown in week two">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">the drift quarter</div>
              <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-ink">
                New products, renamed teams, docs rewritten — the <span className="font-bold">corpus moved</span>;
                retrieval scores sagged; near-miss pages started winning. The CI golden set
                held (those questions aged fine) — only production drifted.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">the dashboards</div>
              <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-ink">
                Retrieval-score distribution over time (the sag, visible nightly) · coverage
                clusters (low-score topics = new gaps) · judge calibration drift (monthly,
                against human labels) — three lines that turn &ldquo;feels worse&rdquo; into evidence.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 3 — the loop closure */}
      <Scene caption="③ Every escape becomes a task — and the judges stay honest">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Incidents join the golden set with their trace attached — the same failure can&apos;t
            ship twice. And because LLM judges drift too, <span className="font-bold">calibrate monthly
            against human-labeled samples</span>: a judge that quietly changed its mind is a
            metric that quietly changed meaning.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          CI gates changes; canaries test reality; online evals catch drift — score
          distributions, coverage gaps, and judge calibration, watched on dashboards.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One layer of the eval pipeline. */
function Layer({ n, label, detail, accent = false }: { n: number; label: string; detail: string; accent?: boolean }) {
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
