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
 * Intermediate course — Lesson: "Committees of weak models" (ensembles).
 *
 * Through-line: decision trees — one shaky, then many voting. Two committee
 * designs: bagging (independent trees, averaged) and boosting (each tree
 * trained on its predecessor's mistakes). The aha: weak + weak + weak ≠
 * slightly better weak — averaging independent mistakes cancels them.
 */
export function EnsembleMethods() {
  return (
    <Infographic>
      <InfographicHeader
        title="Committees of weak models"
        subtitle="Random forests and gradient boosting: why many weak beats one strong"
      />

      {/* Beat 1 — one tree is shaky */}
      <Scene caption="① One decision tree: sharp, brittle, easily fooled">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">A single tree on this data</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Learns razor-sharp rules: “if area &gt; 71.5 m² and floor ≤ 3 → sell fast”. Every
                rule is fitted to the exact rows it saw — including their noise.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-bad">Shake the data slightly</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Swap a few rows out and the “best split” jumps elsewhere — the tree rewrites its
                whole rulebook. <span className="font-bold">High variance, memorized noise.</span>
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the averaging aha */}
      <Scene caption="② The aha: independent mistakes cancel when averaged">
        <Stagger className="space-y-2">
          <MotionChild>
            <VoterRow who="Tree 1" verdict="says ₹44 lakh — fooled by the one penthouse row" />
          </MotionChild>
          <MotionChild>
            <VoterRow who="Tree 2 (different sample)" verdict="says ₹41 lakh — never saw the penthouse, misses it low" />
          </MotionChild>
          <MotionChild>
            <VoterRow who="Tree 3 (different sample)" verdict="says ₹43 lakh — different quirk, small error" />
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-good bg-good-wash px-4 py-2.5 text-center shadow-sm">
              <span className="font-mono text-[11px] font-bold text-ink">average: ₹42.7 lakh — errors ±1.3, ±1.7, ±0.3 mostly cancel</span>
              <p className="mt-0.5 text-[10px] font-medium text-ink-soft">
                each tree is wrong somewhere different; the average is wrong <span className="font-bold">less</span>
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — two committee designs */}
      <Scene caption="③ Two ways to build the committee">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-brand bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Bagging · random forest</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Grow <span className="font-bold">independent</span> trees, each on a random slice of rows
                and a random subset of features. Average their votes.
              </p>
              <p className="mt-1.5 text-[10.5px] font-medium text-ink-soft">
                <span className="font-bold text-ink">Cures:</span> variance. Robust default, hard to
                break, parallel to train.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Boosting · gradient boosting</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Grow trees <span className="font-bold">in sequence</span> — each new tree trains on the
                previous committee&apos;s residual errors. Add it in with a small weight.
              </p>
              <p className="mt-1.5 text-[10.5px] font-medium text-ink-soft">
                <span className="font-bold text-ink">Cures:</span> bias. Often the most accurate on
                tabular data — but easier to overfit, more knobs.
              </p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Same weak learner (a small tree), opposite diseases treated — pick by diagnosis, not fashion.
        </p>
      </Scene>

      {/* Beat 4 — where this wins */}
      <Scene caption="④ The uncomfortable truth for deep learning fans">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <DomainCard domain="Tabular business data" verdict="ensembles usually win" note="rows of numbers and categories — churn, fraud, pricing, credit. XGBoost/RandomForest remain the Kaggle and industry default" win />
          </MotionChild>
          <MotionChild>
            <DomainCard domain="Raw perception data" verdict="networks win" note="pixels, audio, free text — the signal needs learned features, which is exactly what deep layers do" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            A committee of weak models beats one strong model when their mistakes are{" "}
            <strong>independent enough to cancel</strong> — bagging averages variance away, boosting
            chains bias away. On tabular data, this is still the tool to beat.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

function VoterRow({ who, verdict }: { who: string; verdict: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-2 shadow-sm">
      <span className="shrink-0 font-mono text-[10px] font-bold text-brand-deep">{who}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{verdict}</p>
    </div>
  );
}

function DomainCard({ domain, verdict, note, win = false }: { domain: string; verdict: string; note: string; win?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${win ? "border-good bg-good-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="text-xs font-bold text-ink">{domain}</div>
      <div className={`mt-0.5 font-mono text-[11px] font-bold ${win ? "text-good" : "text-brand-deep"}`}>{verdict}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
