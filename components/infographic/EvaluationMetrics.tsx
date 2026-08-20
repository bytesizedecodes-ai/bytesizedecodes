import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  Takeaway,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Intermediate course — Lesson: "Grading honestly" (evaluation metrics).
 *
 * Through-line: one 2×2 confusion matrix that every beat re-lights. Beats:
 * the accuracy trap → the four cells → precision vs recall as the two ways to
 * be good → cross-validation to make the grade itself honest.
 */
export function EvaluationMetrics() {
  return (
    <Infographic>
      <InfographicHeader
        title="Grading honestly"
        subtitle="Accuracy lies on lopsided data — the confusion matrix doesn't"
      />

      {/* Beat 1 — the accuracy trap */}
      <Scene caption="① The 99% model that does nothing">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">fraud in real traffic</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">1%</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-xl font-bold text-brand" aria-hidden="true">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">“model”</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">say “genuine”, always</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-xl font-bold text-brand" aria-hidden="true">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-bad bg-bad-wash px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-bad">accuracy</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-bad">99% ★</div>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          It never catches a single fraud. <span className="font-bold">Accuracy can only be read against the base rate</span> —
          on lopsided data it grades laziness as genius.
        </p>
      </Scene>

      {/* Beat 2 — the four cells */}
      <Scene caption="② Count what happened: the confusion matrix">
        <Matrix highlight="none" />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <MotionChild>
            <MetricCard
              name="Precision"
              formula="of everything flagged, how much was real"
              value="TP / (TP + FP)"
              question="“when we raise the alarm, are we right?”"
            />
          </MotionChild>
          <MotionChild>
            <MetricCard
              name="Recall"
              formula="of all real fraud, how much was caught"
              value="TP / (TP + FN)"
              question="“how much of the bad stuff slips past?”"
              accent
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — the trade-off */}
      <Scene caption="③ One dial, two kinds of good">
        <Stagger className="space-y-2">
          <MotionChild>
            <TradeRow setting="tighten the cutoff (flag less)" precision="precision ↑ 0.97" recall="recall ↓ 0.55" story="spam filter: real mail almost never lost — but plenty of spam slips into the inbox" />
          </MotionChild>
          <MotionChild>
            <TradeRow setting="loosen the cutoff (flag more)" precision="precision ↓ 0.40" recall="recall ↑ 0.98" story="cancer screening: miss almost nothing — but 3 in 5 alarms are false scares" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          You cannot max both. <span className="font-bold">Which one to favor is a business decision</span> —
          priced by which mistake costs more.
        </p>
      </Scene>

      {/* Beat 4 — cross-validation */}
      <Scene caption="④ And grade on questions it hasn't seen — repeatedly">
        <Matrix highlight="cv" />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          One split = one lucky-or-unlucky test. Cross-validation rotates the test fold —{" "}
          <span className="font-mono font-bold text-brand-deep">k=5: train 4 parts, test 1, repeat ×5</span> —
          and averages the five scores into a grade you can trust.
        </p>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Read the <strong>four cells</strong>, not one percentage: precision guards against false alarms,
            recall guards against misses — and cross-validation keeps the whole grade honest.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** The through-line 2×2. `highlight` re-lights cells per beat. */
function Matrix({ highlight }: { highlight: "none" | "cv" }) {
  const cell = (label: string, count: string, tone: "good" | "bad" | "muted", lit: boolean) => {
    const tones = {
      good: "border-good bg-good-wash text-good",
      bad: "border-bad bg-bad-wash text-bad",
      muted: "border-ash bg-surface-elevated text-ink-soft",
    };
    return (
      <div
        className={`rounded-lg border-2 p-2 text-center shadow-sm transition-colors ${tones[tone]} ${
          lit ? "" : "opacity-95"
        }`}
      >
        <div className="text-[9px] font-bold uppercase tracking-wide">{label}</div>
        <div className="mt-0.5 font-mono text-sm font-bold text-ink">{count}</div>
      </div>
    );
  };
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-2">
        <span />
        <span className="text-center text-[9px] font-bold uppercase tracking-wide text-ink-soft">predicted fraud</span>
        <span className="text-center text-[9px] font-bold uppercase tracking-wide text-ink-soft">predicted genuine</span>
        <span className="rotate-180 text-[9px] font-bold uppercase tracking-wide text-ink-soft [writing-mode:vertical-rl]">actually fraud</span>
        {cell("true positive", "92", "good", true)}
        {cell("false negative — missed", "61", "bad", true)}
        <span className="rotate-180 text-[9px] font-bold uppercase tracking-wide text-ink-soft [writing-mode:vertical-rl]">actually genuine</span>
        {cell("false positive — false alarm", "138", "bad", true)}
        {cell("true negative", "9,709", "good", true)}
      </div>
      {highlight === "cv" && (
        <p className="mt-2 text-center text-[10px] font-medium text-ink-soft">
          every fold of the data takes one turn being the test — no row gets graded on itself
        </p>
      )}
    </div>
  );
}

function MetricCard({ name, formula, value, question, accent = false }: { name: string; formula: string; value: string; question: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-bold text-ink">{name}</span>
        <span className="font-mono text-[10px] font-bold text-brand-deep">{value}</span>
      </div>
      <p className="mt-1 text-[10.5px] font-medium text-ink-soft">{formula}</p>
      <p className="mt-1 text-[10.5px] font-semibold text-ink">{question}</p>
    </div>
  );
}

function TradeRow({ setting, precision, recall, story, accent = false }: { setting: string; precision: string; recall: string; story: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-[10.5px] font-bold text-ink">{setting}</span>
        <span className="font-mono text-[9.5px] font-bold text-ink-soft">{precision}</span>
        <span className="font-mono text-[9.5px] font-bold text-ink-soft">{recall}</span>
      </div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{story}</p>
    </div>
  );
}
