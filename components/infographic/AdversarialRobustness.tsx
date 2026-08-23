import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 1: "Adversarial robustness".
 * Case evidence: Setu's OCR/classifier stage faces evasion and poisoning;
 * the app-layer defenses (courses 1–2) do not touch this surface. The model
 * itself as attack surface.
 */
export function AdversarialRobustness() {
  return (
    <Infographic>
      <InfographicHeader
        title="Adversarial robustness"
        subtitle="When the attack surface is the model itself — evasion, poisoning, extraction at national scale"
      />

      {/* SCENE 1 — problem: the app layer was covered; the model wasn't */}
      <Scene caption="① Setu's diagnosis: a clean app layer, an attacked classifier">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 font-mono text-[11px] text-ink">
            <p>document upload → <span className="font-bold">document classifier</span> → scheme routing</p>
            <p className="text-ink-soft">↑ observed: 0.3% of uploads crafted; misrouting fraud docs to fast lanes</p>
            <p>app-layer guards: green ✓ — injection filters never see this stage</p>
          </div>
          <p className="mt-2 text-xs font-semibold text-ink">
            The adversary stopped attacking the conversation and started attacking{" "}
            <span className="font-bold">the model&apos;s decision boundary</span>.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the three model-layer attack families */}
      <Scene caption="② Three families, three stages of the ML lifecycle">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Evasion</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">inference-time: inputs crafted to cross the decision boundary — noise-patched scans, homoglyph text</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Poisoning</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">training-time: label flips or backdoor triggers planted in the corpus the next retrain ingests</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Extraction</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">API-time: high-volume querying that reconstructs the model — or its training data — through outputs</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 3 — the ladder from constraints */}
      <Scene caption="③ Derivation: why 'harden the model' is the wrong top rung">
        <div className="mx-auto max-w-lg space-y-1.5">
          {[
            ["Ground", "no deployed classifier is robust: adversarial examples exist for every boundary studied (scale ≠ immunity)"],
            ["Rung 1", "⇒ per-query defense is unbounded work — the attacker optimizes against whatever you deploy"],
            ["Rung 2", "⇒ controls must bind at trust transitions: corpus provenance (poisoning), rate/identity limits (extraction), and monitoring for boundary drift (evasion)"],
            ["Rung 3 — the design", "robustness = provenance + rate limits + monitored fallbacks, NOT a 'robust model'"],
          ].map(([rung, text], i) => (
            <div key={rung} className={`rounded-xl border px-3 py-2 shadow-sm ${i === 3 ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{rung}</p>
              <p className="text-[11px] font-semibold text-ink">{text}</p>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — boundary */}
      <Scene caption="④ Boundary: where this derivation breaks">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Relax the <span className="font-bold">feedback-loop constraint</span> — if misrouting is detectable and
            reversible within minutes (human review queue), monitored fallback is enough and adversarial
            training earns its cost only for the <span className="font-bold">irreversible</span> paths.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Setu: fast-lane misroutes are monitored; payment-triggering routes get the hardened classifier.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Model-layer attacks bind at{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">trust transitions</span> —
          corpus, query rate, and monitored fallbacks, not a mythical robust model.
        </p>
      </Card>
    </Infographic>
  );
}
