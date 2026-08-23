import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 3: "The objective landscape". The five
 * objectives organized by signal consumed; failure modes as procurement;
 * the orchestra scored per movement.
 */
export function ObjectiveLandscape() {
  const objs = [
    { o: "SFT", sig: "demonstrations — 'make this likely'", fail: "mode collapse toward demo style" },
    { o: "DPO", sig: "static pairs, closed-form margin", fail: "verbosity bias; pair-span-limited coverage" },
    { o: "ORPO", sig: "pairs folded into one SFT-stage loss", fail: "tighter theory traded for one stage" },
    { o: "PPO", sig: "rollouts × learned reward, KL-leashed", fail: "reward hacking; a loop to babysit" },
    { o: "GRPO", sig: "group-relative advantage over N rollouts", fail: "rollout cost; verifier quality bound" },
  ];
  return (
    <Infographic>
      <InfographicHeader
        title="The objective landscape"
        subtitle="Read by signal consumed — and buy the failure mode your evals can catch"
      />

      {/* SCENE 1 — signal consumed */}
      <Scene caption="① Five objectives, five signals">
        <Stagger className="mx-auto max-w-2xl space-y-1.5">
          {objs.map((x, i) => (
            <MotionChild key={x.o}>
              <div
                className={`grid grid-cols-12 items-center gap-2 rounded-xl px-3.5 py-2.5 ${
                  i === 1 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <span className={`col-span-2 font-mono text-xs font-bold ${i === 1 ? "text-brand-deep" : "text-ink"}`}>{x.o}</span>
                <span className="col-span-5 text-[11px] font-medium text-ink">{x.sig}</span>
                <span className="col-span-5 text-right text-[10px] font-medium text-ink-soft">✗ {x.fail}</span>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Objective choice is failure-mode procurement: you are choosing which pathology your evals must catch.
        </p>
      </Scene>

      {/* SCENE 2 — the offline/online split */}
      <Scene caption="② The load-bearing split: offline pairs vs online rollouts">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-brand bg-brand-wash p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">offline — DPO family</div>
            <p className="mt-1 font-mono text-[11px] font-semibold text-ink">chosen vs rejected → log-margin loss</p>
            <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
              RL&apos;s target without RL&apos;s loop. SFT-like infra. Varta&apos;s register/taste tool.
            </p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">online — PPO / GRPO</div>
            <p className="mt-1 font-mono text-[11px] font-semibold text-ink">rollouts → reward → advantage-weighted update</p>
            <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
              For objectives nobody can write as pairs: long-horizon agency, hard safety, verifiable reasoning.
            </p>
          </div>
        </div>
      </Scene>

      {/* SCENE 3 — the derivation as team capability */}
      <Scene caption="③ Varta's choice is forced by constraints, not fashion">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            "gap: register/taste — pair-expressible ✓",
            "safety: rule-driven, eval-gated downstream ✓",
            "team: 4 engineers, on-prem A10 budget — no reward-model ops",
            "→ SFT then DPO; revisit when the objective becomes outcome-conditional",
          ].map((s, i) => (
            <MotionChild key={s}>
              <div
                className={`rounded-xl px-4 py-2.5 text-center text-xs font-medium ${
                  i === 3 ? "border border-brand bg-brand-wash font-semibold text-ink" : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {s}
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ BOUNDARY — where the offline family stops applying">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            DPO-family data must SPAN the target behavior — pairs covering tone but not refusal boundaries leave the
            uncovered behavior at base quality, silently.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            And outcome-conditional objectives (&ldquo;complete the transfer correctly&rdquo;) aren&apos;t
            pair-expressible at all — that&apos;s GRPO-with-a-verifier territory.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          An orchestra, not an instrument —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">scored per movement</span>{" "}
          by what the signal can express and the team can operate.
        </p>
      </Card>
    </Infographic>
  );
}
