import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 7: "The security tradeoff review".
 * Case evidence: Setu's risk register — likelihood × impact × cost, the
 * accept/reject decision, and the signature that makes it governance.
 */
export function SecurityTradeoffReview() {
  return (
    <Infographic>
      <InfographicHeader
        title="The security tradeoff review"
        subtitle="Every security decision priced — and signed: the register as the court record of tradeoffs"
      />

      {/* SCENE 1 — the decision that isn't yours alone */}
      <Scene caption="① Problem: someone must own the risk you didn't fix">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 text-[11px] font-medium text-ink">
            <p>• hardening the grievance intake against slow-burn poisoning costs 3 eng-months + 40ms/query</p>
            <p>• the product side prices the 40ms at measurable completion-rate loss for low-literacy users</p>
            <p>• neither side can unilaterally decide — the register is where the decision becomes explicit</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 2 — the register row */}
      <Scene caption="② One register row, fully priced">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-ash bg-surface-elevated shadow-sm">
          {[
            ["risk", "slow-burn corpus poisoning of grievance intake"],
            ["likelihood × impact", "low × medium — detectable in 2 weeks via diff alarms"],
            ["mitigation cost", "3 eng-months + 40ms/query (completion-rate hit)"],
            ["decision", "ACCEPT — alarms as control, hardening deferred"],
            ["owner / clock", "CISO · revisit when intake volume 2× or alarm fires"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-ash px-3 py-1.5 text-[11px] last:border-b-0">
              <span className="w-32 shrink-0 text-[10px] font-bold uppercase tracking-wide text-ink-soft">{k}</span>
              <span className="font-semibold text-ink">{v}</span>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the review discipline */}
      <Scene caption="③ The quarterly review, re-priced">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">⚖️</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Re-price: did likelihood, impact, or cost move since last quarter?</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🔔</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Check triggers: any alarm fired, volume crossed, incident adjacent?</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">✍️</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Re-sign or flip: the owner updates the decision — silence never renews it</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 4 — boundary */}
      <Scene caption="④ Boundary: registers fail two ways">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            The <span className="font-bold">paper register</span>: decisions recorded, never re-priced — it documents
            courage that expired. The <span className="font-bold">everything-register</span>: every papercut priced —
            review drowns, signal dies. The register holds decisions someone would actually argue about; the rest
            belong in the CI suite where they&apos;re enforced for free.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Price it, decide it,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">sign it, re-price it quarterly</span> —
          the register is where tradeoffs stop being vibes.
        </p>
      </Card>
    </Infographic>
  );
}
