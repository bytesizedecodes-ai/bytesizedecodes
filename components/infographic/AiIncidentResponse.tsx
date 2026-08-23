import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 3: "AI incident response".
 * Case evidence: Setu's SEV ladder + forensics loop — what changes when the
 * asset is a model, a corpus, or a delegation graph.
 */
export function AiIncidentResponse() {
  return (
    <Infographic>
      <InfographicHeader
        title="AI incident response"
        subtitle="Setu's SEV ladder — when the compromised asset is a model, a corpus, or the delegation graph itself"
      />

      {/* SCENE 1 — the escalation problem */}
      <Scene caption="① Problem: the same symptom, three different severities">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 font-mono text-[11px] text-ink">
            <p>symptom: “odd answers from the schemes bot”</p>
            <p className="text-ink-soft">cause A: poisoned corpus page → SEV-3 (de-index, re-review)</p>
            <p className="text-ink-soft">cause B: deputy chain misuse → SEV-2 (money path, key rotation)</p>
            <p className="text-ink-soft">cause C: classifier backdoor triggered → SEV-1 (national-scale, model quarantine)</p>
          </div>
          <p className="mt-2 text-xs font-semibold text-ink">
            Severity attaches to the <span className="font-bold">asset and blast radius</span>, never to the symptom.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the AI-specific forensics loop */}
      <Scene caption="② The loop classic IR doesn't have: version-pinned AI assets">
        <div className="mx-auto max-w-lg space-y-1.5">
          {[
            ["1 · freeze the AI surface", "pin model version, corpus snapshot, tool descriptions — all three drift daily; evidence that drifts is evidence lost"],
            ["2 · replay the attack", "reconstruct prompts + retrieved context + tool calls from traces; AI attacks reproduce only with full context"],
            ["3 · scope the blast radius", "which answers, which citizens, which actions — query the trace store, not the model"],
            ["4 · fix the class, not the case", "the finding enters the CI suite + corpus intake rules; an incident fixed once is a finding reopened twice"],
          ].map(([step, text]) => (
            <MotionChild key={step}>
              <div className="flex items-start gap-3 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm">
                <span className="shrink-0 rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold text-ink">{step}</span>
                <span className="flex-1 text-[11px] font-medium text-ink">{text}</span>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — severity ladder */}
      <Scene caption="③ Setu's ladder, with clocks">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-ash bg-surface-elevated shadow-sm">
          {[
            ["SEV-1", "model/trust-graph compromise — national blast", "regulator: 24h · public disclosure per policy"],
            ["SEV-2", "money or PII moved via deputy chains", "affected users: 48h · forensic freeze immediately"],
            ["SEV-3", "corpus/tool-metadata poisoning, caught by alarms", "fix window: 1 week · enters CI suite on close"],
          ].map(([sev, what, clock]) => (
            <div key={sev} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 border-b border-ash px-3 py-2 last:border-b-0">
              <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold text-ink">{sev}</span>
              <span className="text-[11px] font-semibold text-ink">{what}</span>
              <span className="text-right text-[10px] font-medium text-ink-soft">{clock}</span>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — boundary */}
      <Scene caption="④ Boundary: when the ladder misleads">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            The ladder assumes you can <span className="font-bold">scope the blast radius</span>. Slow-burn poisoning —
            weeks of subtle misrouting — defeats symptom-driven triage entirely: by detection time the scope IS
            everything since the corpus change. The countermeasure lives upstream (corpus diff alarms, lesson 1),
            not in faster response.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Pin the drifting assets, replay from traces, scope by asset —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">and fix the class, not the case</span>.
        </p>
      </Card>
    </Infographic>
  );
}
