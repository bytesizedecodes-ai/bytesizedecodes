import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 8: capstone "The Setu architecture review".
 * The accumulated case on one page: the federation diagram with every layer
 * this course added, the programme metrics, and the signed register.
 */
export function SetuCapstone() {
  return (
    <Infographic>
      <InfographicHeader
        title="The Setu architecture review"
        subtitle="Eight lessons assembled: the federation, the programme, and the signed register"
      />

      {/* SCENE 1 — the defended federation */}
      <Scene caption="① The architecture, layered end to end">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 text-[11px] font-semibold text-ink">
            {[
              ["citizen → router", "identity principal minted, propagated end-to-end (L2)"],
              ["department agents", "per-hop policy on received principal; capability expiry for long tasks (L2)"],
              ["retrieval corpora", "provenance + diff alarms; slow-burn detection (L1, L7)"],
              ["models", "pinned versions, quarantine path; extraction rate limits (L1, L3)"],
              ["vault tools", "approval gates on irreversible actions (L2) — gates log to the trace store (L5)"],
            ].map(([stage, layer]) => (
              <div key={stage} className="flex flex-col gap-0.5 rounded-lg bg-ash px-3 py-1.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="w-32 shrink-0 font-bold">{stage}</span>
                <span className="font-medium text-ink-soft">{layer}</span>
              </div>
            ))}
          </div>
        </div>
      </Scene>

      {/* SCENE 2 — the programme evidence */}
      <Scene caption="② The programme, as metrics">
        <div className="mx-auto max-w-lg space-y-2">
          {[
            ["fix-rate latency", "SEV-1: 18h · SEV-2: 40h · SEV-3: 4d — inside targets, trend flat"],
            ["register discipline", "11 risks accepted, all signed; 3 flipped to MITIGATE on re-price"],
            ["review gate", "100% of design docs with door-changes carry delta sections"],
            ["obligation coverage", "every binding obligation mapped to a living artifact (L5)"],
          ].map(([m, v]) => (
            <MotionChild key={m}>
              <div className="flex flex-col gap-1 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm sm:flex-row sm:items-center sm:gap-3">
                <span className="w-36 shrink-0 text-[11px] font-bold text-ink">{m}</span>
                <span className="font-mono text-[10px] font-medium text-ink-soft">{v}</span>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the boundary the review flags */}
      <Scene caption="③ What the review flags, honestly">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-ink">open finding OF-9</p>
          <p className="mt-1 text-[11px] font-semibold text-ink">
            Long-horizon agent tasks (overnight grievance batches) still depend on capability expiry being re-checked —
            untested at federation scale.
          </p>
          <p className="mt-1 text-[11px] font-medium text-ink">
            Game-day scheduled; owner: core platform; the gap is priced in the register, not hidden in a doc.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — the method, transferred */}
      <Scene caption="④ The method you now own at any scale">
        <Stagger className="mx-auto grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            ["🧭", "constrain", "derive security from assets & blast radius"],
            ["🧱", "layer", "guards, gates, provenance, propagation"],
            ["🔁", "verify", "drills, CI suites, fix-rate metrics"],
            ["✍️", "govern", "signed registers, living artifacts"],
          ].map(([icon, step, note]) => (
            <MotionChild key={step}>
              <div className="flex h-full flex-col items-center gap-1 rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
                <span className="text-xl">{icon}</span>
                <p className="text-[11px] font-bold text-ink">{step}</p>
                <p className="text-[10px] font-medium text-ink-soft">{note}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Constrain from the asset, layer at trust transitions, verify by fix-rate,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">govern by signature</span> —
          the method scales because the derivation does.
        </p>
      </Card>
    </Infographic>
  );
}
