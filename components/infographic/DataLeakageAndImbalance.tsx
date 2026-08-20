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
 * Intermediate course — Lesson: "The two traps" (data leakage & imbalance).
 *
 * Two quiet killers that produce spectacular offline scores and useless
 * models. Through-line: the data pipeline box diagram — the leak is drawn as
 * test-set information flowing backward into training. The imbalance half
 * revisits the accuracy trap from the metrics lesson and moves to fixes.
 */
export function DataLeakageAndImbalance() {
  return (
    <Infographic>
      <InfographicHeader
        title="The two traps"
        subtitle="Data leakage and imbalance: the failures that look like success"
      />

      {/* Beat 1 — the symptom */}
      <Scene caption="① The pattern that should stop you cold">
        <Stagger className="space-y-2">
          <MotionChild>
            <SymptomRow where="offline, on your laptop" what="AUC 0.997 — the team celebrates" tone="good" />
          </MotionChild>
          <MotionChild>
            <SymptomRow where="week one, live traffic" what="barely better than random — leadership asks questions" tone="bad" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          When offline and online disagree THIS sharply, it is almost never the model. It&apos;s the data.
        </p>
      </Scene>

      {/* Beat 2 — leakage: information from the future */}
      <Scene caption="② Trap one — leakage: the test set sneaks into training">
        <PipelineLeak />
        <Stagger className="mt-3 space-y-2">
          <MotionChild>
            <LeakRow
              leak="Normalizing before the split"
              why="the averages include the test rows — every value carries a whisper of the answers"
              fix="fit the scaler on train only; apply it to test"
            />
          </MotionChild>
          <MotionChild>
            <LeakRow
              leak="The 'resolved' column"
              why="‘days_to_close: 0’ exists only for tickets that were closed — the label is hiding inside a feature"
              fix="drop or time-align features to what exists at prediction time"
              accent
            />
          </MotionChild>
          <MotionChild>
            <LeakRow
              leak="Twins across the split"
              why="the same patient, session, or farm in both train and test — the model recognizes, not predicts"
              fix="split by group (patient / session / farm), never by row"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — imbalance: the class that barely exists */}
      <Scene caption="③ Trap two — imbalance: 0.7% positives makes 'always no' look brilliant">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">The broken grade</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                With 7 positives in 1,000 rows, “always no” scores 99.3% accuracy. Any real model
                must beat <span className="font-bold">that</span> — accuracy can&apos;t tell you if it did.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">The honest fixes</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Grade with <span className="font-bold">recall/precision or AUPRC</span> — not accuracy.
                Train with <span className="font-bold">class weights or resampling</span> so each positive
                actually pulls the model.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the checklist */}
      <Scene caption="④ The 60-second audit before you trust any score">
        <Stagger className="space-y-1.5">
          <MotionChild>
            <CheckItem text="Could a human make this prediction at decision time, with only the data this row carries?" />
          </MotionChild>
          <MotionChild>
            <CheckItem text="Was every fitted thing (scalers, encoders, imputers, feature selection) fitted on train only?" />
          </MotionChild>
          <MotionChild>
            <CheckItem text="Is the split grouped so no entity appears on both sides?" />
          </MotionChild>
          <MotionChild>
            <CheckItem text="Does the metric feel the minority class at all — would 'always no' beat it?" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            <strong>Too-good scores are a smell, not a win.</strong> Leakage means the answers leaked into
            training; imbalance means the metric can&apos;t feel the class you care about — and both are
            invisible until the model meets reality.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** The pipeline with the leak drawn: test info flowing backward into training. */
function PipelineLeak() {
  return (
    <svg viewBox="0 0 100 34" className="h-auto w-full" aria-hidden="true">
      <rect x="4" y="10" width="22" height="14" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <text x="15" y="18.5" textAnchor="middle" fontFamily="monospace" fontSize="4.6" fill="var(--color-ink)">all data</text>
      <line x1="26" y1="17" x2="38" y2="17" stroke="var(--color-brand)" strokeWidth="1.2" />
      <rect x="38" y="4" width="24" height="11" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-ash)" strokeWidth="1" />
      <text x="50" y="10.5" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink)">train 80%</text>
      <rect x="38" y="19" width="24" height="11" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-ash)" strokeWidth="1" />
      <text x="50" y="25.5" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink)">test 20%</text>
      <line x1="62" y1="9.5" x2="76" y2="9.5" stroke="var(--color-brand)" strokeWidth="1.2" />
      <line x1="62" y1="24.5" x2="76" y2="24.5" stroke="var(--color-ash)" strokeWidth="1.2" />
      <rect x="76" y="10" width="20" height="14" rx="2.5" fill="var(--color-brand-wash)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <text x="86" y="18.5" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink)">fit + score</text>
      {/* the leak */}
      <path d="M50 19 Q50 15 50 15" fill="none" />
      <path d="M64 22 Q72 15 75.5 12.5" fill="none" stroke="var(--color-bad)" strokeWidth="1.4" strokeDasharray="2.5 2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-bad)" />
        </marker>
      </defs>
      <text x="72" y="9" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="var(--color-bad)">the leak ↑</text>
    </svg>
  );
}

function SymptomRow({ where, what, tone }: { where: string; what: string; tone: "good" | "bad" }) {
  return (
    <div className={`rounded-xl border px-4 py-2.5 shadow-sm ${tone === "good" ? "border-good bg-good-wash" : "border-bad bg-bad-wash"}`}>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[10px] font-bold uppercase text-ink-soft">{where}</span>
        <span className={`text-[11px] font-bold ${tone === "good" ? "text-good" : "text-bad"}`}>{what}</span>
      </div>
    </div>
  );
}

function LeakRow({ leak, why, fix, accent = false }: { leak: string; why: string; fix: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="text-[11.5px] font-bold text-ink">{leak}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{why}</p>
      <p className="mt-0.5 font-mono text-[9.5px] font-semibold text-good">fix: {fix}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
      <span className="mt-0.5 text-xs text-brand" aria-hidden="true">☐</span>
      <p className="text-[11px] font-medium leading-relaxed text-ink">{text}</p>
    </div>
  );
}
