import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 9: "The alignment tax". Two-sided costs:
 * over-refusal on the canary, surface shift on the adversarial suite —
 * and the separability boundary that hands rows to product flow.
 */
export function TheAlignmentTax() {
  return (
    <Infographic>
      <InfographicHeader
        title="The alignment tax"
        subtitle="Every refusal boundary also refuses something legitimate — price both sides"
      />

      {/* SCENE 1 — generalization is the mechanism */}
      <Scene caption="① Boundaries generalize over neighborhoods, not policies">
        <svg viewBox="0 0 100 44" className="h-auto w-full" aria-hidden="true">
          {/* points */}
          {[
            [22, 26, "bad"], [30, 32, "bad"], [26, 18, "bad"], [34, 24, "bad"],
            [58, 22, "good"], [66, 28, "good"], [62, 16, "good"], [72, 22, "good"],
          ].map(([x, y, k], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="2.2" fill={k === "bad" ? "var(--color-bad)" : "var(--color-brand)"} />
          ))}
          {/* the learned neighborhood bleeding over legit points */}
          <ellipse cx="40" cy="24" rx="26" ry="13" fill="var(--color-bad)" opacity="0.12" />
          <ellipse cx="40" cy="24" rx="26" ry="13" fill="none" stroke="var(--color-bad)" strokeWidth="0.8" strokeDasharray="2 2" />
          <text x="12" y="40" fontFamily="monospace" fontSize="4" fill="var(--color-bad)">violating examples</text>
          <text x="62" y="40" fontFamily="monospace" fontSize="4" fill="var(--color-brand)">legitimate queries</text>
          <text x="36" y="10" fontFamily="monospace" fontSize="4" fill="var(--color-ink-soft)">the learned neighborhood</text>
        </svg>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          The fraud boundary learned from violating examples covers legitimate queries that share their neighborhood —
          the over-refusal tax.
        </p>
      </Scene>

      {/* SCENE 2 — the canary measurement */}
      <Scene caption="② Varta priced the tax: 6.8% → 2.1% over-refusal">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="flex items-center justify-between rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-ink">first safety pass</p>
              <p className="font-mono text-xs font-bold text-ink">6.8% of legitimate canary refused</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex items-center justify-between rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-[11px] font-semibold text-ink">+ boundary counterweight data</p>
              <p className="font-mono text-xs font-bold text-brand-deep">2.1% · canary gates ≥95% answer rate</p>
            </div>
          </MotionChild>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The canary: 80 legitimate-but-scary-sounding queries — closure wording, fraud-victim phrasing, joint-account
          disputes — scored every release.
        </p>
      </Scene>

      {/* SCENE 3 — the surface shift */}
      <Scene caption="③ Safety tuning MOVES risk, it doesn't delete it">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">raw violations</p>
              <p className="mt-1 font-mono text-sm font-bold text-brand-deep">↓ sharply</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">adversarial success</p>
              <p className="mt-1 font-mono text-sm font-bold text-ink">→ shifts shape</p>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] font-medium text-ink-soft">
            Roleplay framings, instruction-smuggling, refusal-extraction — the jailbreak suite regresses EVERY release,
            because last release&apos;s defenses aren&apos;t this release&apos;s.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — the separability boundary */}
      <Scene caption="④ BOUNDARY — where training-based safety stops being the tool">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            Legitimate and violating traffic must be separable BY BEHAVIOR. A credential-holding fraudster querying
            &ldquo;their&rdquo; account is, at the behavior layer, a customer.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Non-separable rows belong to product flow — step-up verification, velocity checks — not to a bigger refusal
            pack. Ask per row: &ldquo;is this separable by behavior?&rdquo;
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Refusals, over-refusals, and a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">moved adversarial
          surface</span> — three gates, every release.
        </p>
      </Card>
    </Infographic>
  );
}
