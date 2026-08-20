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
 * Intermediate course — Lesson: "Yes/no as a probability" (logistic regression).
 *
 * Through-line: one spam-score axis with the S-curve squashing it into 0..1.
 * Beats: the hard-threshold problem → the weighted sum → the sigmoid squash →
 * the 0.5 boundary and what moving it costs. No code panel here — the curve
 * carries the whole idea (the next lesson, loss functions, does the code work).
 */
export function LogisticRegression() {
  return (
    <Infographic>
      <InfographicHeader
        title="Yes/no as a probability"
        subtitle="Logistic regression: a weighted score squashed into a confident maybe"
      />

      {/* Beat 1 — the hard threshold problem */}
      <Scene caption="① A hard cutoff answers the wrong question">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-bad">Hard rule</div>
              <p className="mt-1.5 font-mono text-[12px] font-semibold text-ink">
                score &gt; 50 → spam
              </p>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                A mail scoring 50.1 and one scoring 99 get the same verdict, the same silence.
                Nothing in between, no way to say “probably fine”.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">What we want</div>
              <p className="mt-1.5 font-mono text-[12px] font-semibold text-ink">
                P(spam) = 0.03 … 0.97
              </p>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                A number from 0 to 1 — near 0 for clearly genuine mail, near 1 for clearly spam,
                honestly unsure near the middle.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the through-line: weighted sum → S-curve */}
      <Scene caption="② Weighted evidence in, probability out">
        <SigmoidChart />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <StepBox top="1 · Weigh the evidence" bottom="suspicious words, odd sender, weird links — each feature adds its weighted score" />
          </MotionChild>
          <MotionChild>
            <StepBox top="2 · Squash through the S-curve" bottom="any score −∞…+∞ bends into a probability 0…1" accent />
          </MotionChild>
          <MotionChild>
            <StepBox top="3 · Read the boundary" bottom="above 0.5 call it spam, below call it genuine — the curve decides how confident" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — where the boundary sits is a business decision */}
      <Scene caption="③ Move the cutoff, change the mistakes">
        <Stagger className="space-y-2">
          <MotionChild>
            <CutoffRow
              where="cutoff at 0.9"
              result="almost nothing flagged"
              trade="spam slips into inboxes (false negatives) — but no real mail is ever lost"
            />
          </MotionChild>
          <MotionChild>
            <CutoffRow
              where="cutoff at 0.5"
              result="balanced verdicts"
              trade="some mistakes both ways — the default starting point"
            />
          </MotionChild>
          <MotionChild>
            <CutoffRow
              where="cutoff at 0.2"
              result="aggressive filtering"
              trade="inbox stays clean, but genuine mail gets buried (false positives) — the costly mistake"
              accent
            />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          The model provides the probability; <span className="font-bold">where you cut is your call</span> —
          chosen by which mistake hurts more.
        </p>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Logistic regression is linear regression&apos;s sibling: same weighted evidence, but the answer is
            bent through an S-curve into a probability — and the cutoff turns probabilities into decisions.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** The through-line: spam score axis, S-curve, marked points, 0.5 boundary. */
function SigmoidChart() {
  const sigmoid = (x: number) => 74 - 68 / (1 + Math.exp(-0.09 * (x - 50)));
  const path = [10, 20, 30, 40, 50, 60, 70, 80, 90]
    .map((x) => `${x} ${sigmoid(x).toFixed(1)}`)
    .join(" L");
  return (
    <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
      <line x1="8" y1="74" x2="94" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
      <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
      {/* 0.5 boundary line */}
      <line x1="8" y1="40" x2="92" y2="40" stroke="var(--color-ink-soft)" strokeWidth="1" strokeDasharray="3 2.5" />
      <text x="93" y="42.5" textAnchor="end" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">P = 0.5</text>
      {/* the S-curve */}
      <path d={`M${path}`} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" />
      {/* marked points */}
      <circle cx="22" cy={sigmoid(22)} r="2.6" fill="var(--color-good)" />
      <text x="24" y={sigmoid(22) - 3} fontFamily="monospace" fontSize="5" fill="var(--color-good)">0.07</text>
      <circle cx="50" cy={sigmoid(50)} r="2.6" fill="var(--color-brand-deep)" />
      <text x="52" y={sigmoid(50) - 3} fontFamily="monospace" fontSize="5" fill="var(--color-brand-deep)">0.5</text>
      <circle cx="78" cy={sigmoid(78)} r="2.6" fill="var(--color-bad)" />
      <text x="80" y={sigmoid(78) - 3} fontFamily="monospace" fontSize="5" fill="var(--color-bad)">0.93</text>
      <text x="50" y="79.5" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        spam-evidence score
      </text>
      <text x="10" y="5" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        P(spam)
      </text>
    </svg>
  );
}

function StepBox({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-[11px] font-bold text-ink">{top}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{bottom}</p>
    </div>
  );
}

function CutoffRow({ where, result, trade, accent = false }: { where: string; result: string; trade: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">
          <span className="font-mono">{where}</span> — {result}
        </div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{trade}</p>
      </div>
    </div>
  );
}
