import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 9: "Incident drills".
 * Case artifact: PaisaShield's minute-one card — contain, preserve, notify,
 * in that order, rehearsed.
 */
export function IncidentDrills() {
  return (
    <Infographic>
      <InfographicHeader
        title="Incident drills"
        subtitle="PaisaShield's minute one — contain, preserve, notify, rehearsed"
      />

      {/* SCENE 1 — the alarm */}
      <Scene caption="① Scenario, 02:14: the alarm you trained for">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-wash text-lg">🚨</span>
            <div>
              <p className="text-xs font-bold text-ink">alert: 40 refunds to ACCT 9988 in 10 minutes</p>
              <p className="text-[10px] font-medium text-ink-soft">source: refund-gate rate alarm (lesson 3&apos;s cap, doing its job)</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-ink">
            The next 60 minutes decide whether this is a story or a post-mortem.{" "}
            <span className="font-bold">Nobody improvises well at 02:14.</span>
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the order that matters */}
      <Scene caption="② The order is the whole design: contain → preserve → notify">
        <div className="mx-auto max-w-lg space-y-2">
          {[
            ["1 · contain", "kill the refund key, not the product — the caps mean one key to rotate, not a shutdown", "0–15 min"],
            ["2 · preserve", "snapshot logs + traces + the triggering tickets BEFORE cleanup — evidence evaporates first", "15–30 min"],
            ["3 · notify", "security lead, affected customers if data moved, regulator clock if PII left — per the playbook, not per panic", "30–60 min"],
          ].map(([step, what, when]) => (
            <MotionChild key={step}>
              <div className="flex items-start gap-3 rounded-xl border border-ash bg-surface-elevated px-3 py-2.5 shadow-sm">
                <span className="shrink-0 rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold text-ink">{step}</span>
                <span className="flex-1 text-[11px] font-medium text-ink">{what}</span>
                <span className="shrink-0 rounded-full bg-ash px-2 py-0.5 font-mono text-[10px] font-bold text-ink">{when}</span>
              </div>
            </MotionChild>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Reversing the order is the classic failure: notify-first creates panic,{" "}
          <span className="font-bold">cleanup-first destroys the evidence</span>.
        </p>
      </Scene>

      {/* SCENE 3 — the card */}
      <Scene caption="③ The artifact: the one-page card, roles pre-assigned">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-ink">
            <div className="rounded-lg bg-ash p-2">commander: on-call SRE <span className="text-ink-soft">(decides, doesn't type)</span></div>
            <div className="rounded-lg bg-ash p-2">operator: security eng <span className="text-ink-soft">(types, doesn't decide)</span></div>
            <div className="rounded-lg bg-ash p-2">comms: support lead <span className="text-ink-soft">(customers, status page)</span></div>
            <div className="rounded-lg bg-ash p-2">scribe: anyone <span className="text-ink-soft">(timestamps everything)</span></div>
          </div>
          <p className="mt-2 text-center text-[10px] font-medium text-ink-soft">
            printed, laminated, and rehearsed — the Runbook-is-a-link failure mode at 02:14 is real
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — drill cadence */}
      <Scene caption="④ Rehearse quarterly — the drill is the product">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            A playbook that&apos;s never been drilled is{" "}
            <span className="font-bold">a document, not a capability</span>.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Quarterly game-day: inject a fake probe, watch the hour, fix what was awkward. The capstone runs one.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Minute one is designed on a calm day:{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">contain the key, preserve the evidence, notify from the card</span>.
        </p>
      </Card>
    </Infographic>
  );
}
