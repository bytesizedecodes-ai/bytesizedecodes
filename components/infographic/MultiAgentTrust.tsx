import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 2: "Multi-agent trust".
 * Case evidence: Setu federates — each department runs its own tool agents.
 * The delegation graph becomes the security architecture.
 */
export function MultiAgentTrust() {
  const Node = ({ label, note, tone }: { label: string; note: string; tone: "core" | "dept" | "tool" }) => (
    <div
      className={`rounded-xl border p-2.5 text-center shadow-sm ${
        tone === "core" ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <p className="text-[11px] font-bold text-ink">{label}</p>
      <p className="text-[9px] font-medium text-ink-soft">{note}</p>
    </div>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Multi-agent trust"
        subtitle="Setu federates: 40 department agents, one delegation graph — the graph IS the security architecture"
      />

      {/* SCENE 1 — problem: the confused deputy across org boundaries */}
      <Scene caption="① The incident that frames the lesson">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 font-mono text-[11px] text-ink">
            <p>citizen → router agent → <span className="font-bold">state treasury agent</span> → disbursement tool</p>
            <p className="text-ink-soft">a scheme-eligibility agent (lower trust) was allowed to REQUEST treasury actions</p>
            <p className="text-ink-soft">crafted request ⇒ treasury agent executed with ITS credentials: the confused deputy, at federation scale</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 2 — the ladder: identity must survive delegation */}
      <Scene caption="② Derivation: from delegation to identity propagation">
        <div className="mx-auto max-w-lg space-y-1.5">
          {[
            ["Ground", "an agent's credentials authorize what IT may do — never what its requester may do"],
            ["Rung 1", "⇒ every delegation carries the original principal: citizen identity + purpose, propagated end-to-end"],
            ["Rung 2", "⇒ each agent enforces its own policy on the RECEIVED principal — treasury checks the citizen's entitlement, not the asking agent's reputation"],
            ["Rung 3 — the design", "trust = per-hop policy on propagated identity, never inter-agent goodwill"],
          ].map(([rung, text], i) => (
            <div key={rung} className={`rounded-xl border px-3 py-2 shadow-sm ${i === 3 ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{rung}</p>
              <p className="text-[11px] font-semibold text-ink">{text}</p>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the graph view */}
      <Scene caption="③ Setu's delegation graph, annotated">
        <div className="mx-auto grid max-w-lg grid-cols-3 items-center gap-2">
          <Node tone="core" label="router (core)" note="propagates citizen principal" />
          <Stagger className="contents">
            <MotionChild className="contents">
              <div className="flex flex-col gap-2">
                <Node tone="dept" label="eligibility (state)" note="policy: read-only on principal" />
                <Node tone="dept" label="treasury (core)" note="policy: disburse only on citizen entitlement" />
                <Node tone="dept" label="records (dept)" note="policy: dept-scope docs only" />
              </div>
            </MotionChild>
          </Stagger>
          <div className="flex flex-col gap-2">
            <Node tone="tool" label="scheme DB" note="read" />
            <Node tone="tool" label="disbursement" note="irreversible → approval gate" />
            <Node tone="tool" label="doc store" note="scoped read" />
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Every edge carries the principal; every node re-checks policy. No edge exists from{" "}
          <span className="font-bold">low-trust to vault</span> regardless of reputation.
        </p>
      </Scene>

      {/* SCENE 4 — boundary */}
      <Scene caption="④ Boundary: where identity propagation breaks">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Long-horizon autonomous work breaks end-to-end identity: when a sub-agent acts{" "}
            <span className="font-bold">hours later</span> on stored context, the propagated principal is stale —
            the design needs <span className="font-bold">capability expiry</span> (delegation valid for the task&apos;s
            window, then re-authentication), or the graph degrades to the deputy problem again.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Credentials authorize the agent;{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">propagated principal
          authorizes the act</span> — per-hop policy, never inter-agent goodwill.
        </p>
      </Card>
    </Infographic>
  );
}
