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
 * Intermediate course — Capstone: "Kirana Pay's month-one review".
 *
 * The course case, assembled: every lesson contributed one artifact to the
 * payments platform's fraud-and-churn scoring system, and this review board
 * lays them out in shipping order — labels → forest baseline → calibrated
 * score + threshold → priced eval → sealed holdout — plus the two near-misses
 * the review caught (a leakage feature, a rescaled-target rate incident).
 */
export function KiranaPayCapstone() {
  return (
    <Infographic>
      <InfographicHeader
        title="Kirana Pay · month-one review"
        subtitle="Every lesson of this course is one card on the table"
      />

      {/* Beat 1 — the case, in one look */}
      <Scene caption="① The system under review">
        <CaseBoard />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          Kirana Pay scores every transaction for fraud and every merchant for churn —
          a <span className="font-bold">rules engine</span> ran this job for years;
          the ML team&apos;s first month replaced it, card by card.
        </p>
      </Scene>

      {/* Beat 2 — the artifacts in shipping order */}
      <Scene caption="② The decision log — each card forced by a lesson">
        <Stagger className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-2.5">
          {[
            { top: "1 · Labels", bottom: "analysts marked fraud on 2 years of transactions — supervised learning starts here" },
            { top: "2 · Baseline", bottom: "random forest on the tabular features — variance averaged away, σ²/k" },
            { top: "3 · Score", bottom: "σ(z) = 1/(1+e⁻ᶻ) squashes evidence into P(fraud) — a probability, not a verdict" },
            { top: "4 · Threshold", bottom: "0.5 by default, priced in missed-fraud vs analyst-hours — a business decision" },
            { top: "5 · Holdout", bottom: "a sealed slice nobody tunes against — the only honest score", accent: true },
          ].map((step) => (
            <MotionChild key={step.top}>
              <div
                className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${
                  step.accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
                }`}
              >
                <div className="text-[11px] font-bold text-ink">{step.top}</div>
                <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{step.bottom}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* Beat 3 — the two near-misses */}
      <Scene caption="③ Caught in review — the month could have ended badly">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-bad">Near-miss 1 · leakage</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                A draft feature — <code className="font-mono">refund_issued</code> — was populated
                <em> after</em> the fraud review. Perfect correlate at train time, absent at prediction
                time. The offline score was measuring the leak, not the task.
              </p>
              <p className="mt-1.5 text-[11px] font-bold text-ink">Fix: data-flow, not modelling — drop the feature, re-run the audit.</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-bad">Near-miss 2 · the rate incident</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Targets rescaled rupees → paise: slopes ~100× steeper overnight. Training bounced
                2.1 → 2.4 → 1.9 → 2.6 — same rate, new curvature, every step overshooting.
              </p>
              <p className="mt-1.5 text-[11px] font-bold text-ink">Fix: shrink the rate with the curvature — the step-to-slope ratio is the whole job.</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the verdict */}
      <Scene caption="④ What shipped — and what was declined">
        <Reveal>
          <div className="rounded-xl border border-good bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-good">The review&apos;s verdict</div>
            <ul className="mt-2 space-y-1.5 text-[11.5px] font-medium leading-relaxed text-ink-soft">
              <li>
                <span className="font-bold text-ink">Shipped:</span> forest baseline · P(fraud) with a
                priced threshold · sealed holdout · monthly retrain with a drift watch.
              </li>
              <li>
                <span className="font-bold text-ink">Declined:</span> the 30-layer network on 900 tidy
                churn rows — memorized noise in the bias-variance artifacts; escalate only on plateau
                evidence.
              </li>
              <li>
                <span className="font-bold text-ink">Deferred:</span> storefront-photo screening — when
                the raw-perception data arrives at volume, the model-family decision reopens.
              </li>
            </ul>
          </div>
        </Reveal>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            A shipped model is <strong>a chain of forced decisions</strong> — labels, baseline, score,
            threshold, holdout — and the review&apos;s job is to check the chain, one card at a time.
            Every artifact here traces to a lesson; every near-miss was a rung somebody re-derived.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** Kirana Pay at a glance: the platform, the two scores, the retired rules engine. */
function CaseBoard() {
  return (
    <svg viewBox="0 0 100 44" className="h-auto w-full" aria-hidden="true">
      {/* the platform */}
      <rect x="2" y="6" width="22" height="30" rx="3" fill="var(--color-brand-wash)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <text x="13" y="16" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fontWeight="bold" fill="var(--color-brand-deep)">Kirana Pay</text>
      <text x="13" y="22" textAnchor="middle" fontFamily="monospace" fontSize="3.4" fill="var(--color-ink-soft)">mid-size</text>
      <text x="13" y="26" textAnchor="middle" fontFamily="monospace" fontSize="3.4" fill="var(--color-ink-soft)">payments</text>
      <text x="13" y="30" textAnchor="middle" fontFamily="monospace" fontSize="3.4" fill="var(--color-ink-soft)">platform</text>
      {/* the two scores */}
      <line x1="24" y1="15" x2="36" y2="15" stroke="var(--color-brand)" strokeWidth="1" markerEnd="url(#kp-arrow)" />
      <line x1="24" y1="27" x2="36" y2="27" stroke="var(--color-brand)" strokeWidth="1" markerEnd="url(#kp-arrow)" />
      <rect x="37" y="9" width="28" height="11" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-ash)" strokeWidth="0.9" />
      <text x="51" y="16" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="var(--color-ink)">fraud score · P(fraud)</text>
      <rect x="37" y="23" width="28" height="11" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-ash)" strokeWidth="0.9" />
      <text x="51" y="30" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="var(--color-ink)">churn score · merchant</text>
      {/* old vs new */}
      <line x1="65" y1="15" x2="76" y2="15" stroke="var(--color-ash)" strokeWidth="0.9" strokeDasharray="2 2" />
      <line x1="65" y1="27" x2="76" y2="27" stroke="var(--color-brand)" strokeWidth="1" markerEnd="url(#kp-arrow)" />
      <rect x="77" y="9" width="21" height="11" rx="2.5" fill="none" stroke="var(--color-ink-soft)" strokeWidth="0.9" strokeDasharray="2 1.5" />
      <text x="87.5" y="16" textAnchor="middle" fontFamily="monospace" fontSize="3.6" fill="var(--color-ink-soft)">rules engine — retired</text>
      <rect x="77" y="23" width="21" height="11" rx="2.5" fill="var(--color-brand-wash)" stroke="var(--color-brand)" strokeWidth="1.1" />
      <text x="87.5" y="30" textAnchor="middle" fontFamily="monospace" fontSize="3.6" fontWeight="bold" fill="var(--color-brand-deep)">this course&apos;s build</text>
      <defs>
        <marker id="kp-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0L6 3L0 6z" fill="var(--color-brand)" />
        </marker>
      </defs>
    </svg>
  );
}
