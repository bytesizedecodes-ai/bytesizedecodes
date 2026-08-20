import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  CodePanel,
  Takeaway,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Intermediate course — Lesson: "How wrong is wrong?" (loss functions).
 *
 * Through-line: an error meter over predictions. Two scorers, one per answer
 * type: squared error for numbers, cross-entropy for probabilities. The aha:
 * confident-and-wrong is punished disproportionately — which is exactly what
 * makes models calibrated, not just correct.
 */
export function LossFunctions() {
  return (
    <Infographic>
      <InfographicHeader
        title="How wrong is wrong?"
        subtitle="Loss functions: the score a model spends its life lowering"
      />

      {/* Beat 1 — why "wrong" needs a number */}
      <Scene caption="① Training needs wrongness as a number it can shrink">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">prediction</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">31 min</div>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">truth</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">25 min</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-xl font-bold text-brand" aria-hidden="true">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">loss</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-brand-deep">(31−25)² = 36</div>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          “Sort of wrong” can&apos;t be minimized. A number can. That number is the target of every training step.
        </p>
      </Scene>

      {/* Beat 2 — squared error for numbers */}
      <Scene caption="② Numbers: squared error punishes big misses hardest">
        <Stagger className="grid grid-cols-3 gap-2 sm:gap-3">
          <MotionChild>
            <MissCard miss="off by 2" loss="4" note="small miss, small fine" />
          </MotionChild>
          <MotionChild>
            <MissCard miss="off by 5" loss="25" note="5× the miss, 6× the fine" />
          </MotionChild>
          <MotionChild>
            <MissCard miss="off by 10" loss="100" note="10× the miss, 25× the fine" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Squaring makes the penalty curve bend upward — the model learns that one terrible prediction
          is worse than several small ones.
        </p>
      </Scene>

      {/* Beat 3 — cross-entropy for probabilities */}
      <Scene caption="③ Probabilities: confident-and-wrong pays the maximum">
        <Stagger className="space-y-2">
          <MotionChild>
            <EntropyRow verdict="says P(spam)=0.55, truth: spam" loss="0.60" note="barely committed, barely wrong — mild fine" />
          </MotionChild>
          <MotionChild>
            <EntropyRow verdict="says P(spam)=0.50, truth: not spam" loss="0.69" note="coin flip — the honest minimum" />
          </MotionChild>
          <MotionChild>
            <EntropyRow verdict="says P(spam)=0.99, truth: not spam" loss="4.6" note="confidently wrong — the fine explodes" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Cross-entropy doesn&apos;t just reward being right — it rewards{" "}
          <span className="font-bold">knowing how right</span>. That&apos;s what keeps probabilities honest.
        </p>
      </Scene>

      {/* Beat 4 — the code layer */}
      <Scene caption="④ In code: the loss is one line">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <CodePanel
              label="Squared error · numbers"
              caption="Mean squared error over a batch of predictions"
              code={`loss = ((preds - truth) ** 2).mean()
# off by [2, 5, 10]  →  (4+25+100)/3 ≈ 43`}
            />
          </MotionChild>
          <MotionChild>
            <CodePanel
              label="Cross-entropy · probabilities"
              caption="−log of the probability given to the truth"
              accent
              code={`loss = -log(p_of_truth)
# truth 'not spam', said 0.99 spam
# → -log(0.01) = 4.6`}
            />
          </MotionChild>
        </Stagger>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Accuracy is a report card; <strong>loss is what training actually minimizes</strong> — squared error for
            numbers, cross-entropy for probabilities. Pick the wrong scorer and the model learns the wrong lesson.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

function MissCard({ miss, loss, note, accent = false }: { miss: string; loss: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-[11px] font-semibold text-ink-soft">{miss}</div>
      <div className="mt-1 font-mono text-lg font-bold text-brand-deep">{loss}</div>
      <p className="mt-0.5 text-[10px] font-medium text-ink-soft">{note}</p>
    </div>
  );
}

function EntropyRow({ verdict, loss, note, accent = false }: { verdict: string; loss: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[11px] font-bold text-ink">{verdict}</div>
        <p className="mt-0.5 text-[10.5px] font-medium text-ink-soft">{note}</p>
      </div>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[10px] font-bold text-ink-soft">
        loss {loss}
      </span>
    </div>
  );
}
