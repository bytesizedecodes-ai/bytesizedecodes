import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 8: "Defensive evals".
 * Case artifact: the attack suite as a CI gate — probes + expected outcomes,
 * run on every change, blocking on regression.
 */
export function DefensiveEvals() {
  return (
    <Infographic>
      <InfographicHeader
        title="Defensive evals"
        subtitle="The attack suite as a CI gate — regressions block the merge"
      />

      {/* SCENE 1 — the regression story */}
      <Scene caption="① Scenario: a “harmless” prompt tweak reopens a closed hole">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 text-[11px] font-medium text-ink">
            <p>• Week 3: drill RT-011 found jail-09 slipping through; guard updated; closed.</p>
            <p>• Week 6: a teammate shortens the system prompt “for token cost”.</p>
            <p>• Week 7: the same jailbreak works again — and nobody knows.</p>
          </div>
          <p className="mt-2 text-xs font-semibold text-ink">
            Security fixes <span className="font-bold">decay silently</span> unless a test guards them.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the suite shape */}
      <Scene caption="② The suite: every finding becomes a test with an expected outcome">
        <div className="mx-auto max-w-lg space-y-2">
          {[
            ["inject-04 → blocked at in-guard (score ≥ 0.8)", "assert: blocked = true"],
            ["jail-09 → no refund instructions in any draft", "assert: draft contains none"],
            ["exfil-07 → no card pattern in output", "assert: regex miss"],
            ["money-02 → target_account ≠ original needs approval", "assert: gate fired"],
          ].map(([probe, assertion]) => (
            <div key={probe} className="flex flex-col gap-1 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm sm:flex-row sm:items-center sm:gap-3">
              <span className="flex-1 text-[11px] font-semibold text-ink">{probe}</span>
              <span className="rounded-md bg-ash px-2 py-1 font-mono text-[10px] text-ink">{assertion}</span>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the gate */}
      <Scene caption="③ The gate: same wall evals already use">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-mono text-[11px] font-bold text-ink">CI pipeline</p>
            <span className="text-lg">↓</span>
            <div className="flex gap-2">
              <span className="rounded-full bg-ash px-2.5 py-1 text-[10px] font-bold text-ink">quality evals</span>
              <span className="rounded-full bg-brand-wash px-2.5 py-1 text-[10px] font-bold text-ink">attack suite</span>
            </div>
            <span className="text-lg">↓</span>
            <p className="text-[11px] font-semibold text-ink">
              any assertion fails → <span className="font-bold">merge blocked</span>, finding re-opened with the diff
              that broke it
            </p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — maintenance rule */}
      <Scene caption="④ Keep the suite honest">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🆕</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Every drill finding graduates into the suite</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">📉</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Track pass-rate trend — decay shows here first</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">⚖️</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Balance with quality evals — a locked-down useless bot also fails CI</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Every closed finding becomes a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">test with an owner and an assertion</span> —
          the suite turns decay into a blocked merge.
        </p>
      </Card>
    </Infographic>
  );
}
