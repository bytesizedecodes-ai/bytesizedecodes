import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 1: "Multi-Agent Orchestration".
 *
 * Course case: Relay at scale — split refund/logistics/retention flows into
 * specialists, or keep one agent? Expert register, CER beats: the handoff
 * diagram shows context dropped at every handoff (the tax nobody budgets),
 * then the counter-example — the single agent that won. Compact by expert
 * calibration; brand accent only.
 */
export function MultiAgentOrchestration() {
  return (
    <Infographic>
      <InfographicHeader
        title="Specialists, planners, and the handoff tax"
        subtitle="Every handoff drops context. Every specialist adds a boundary something must cross."
      />

      {/* Beat 1 — the orchestrated design, with its tax made visible */}
      <Scene caption="① Planner + two specialists — and what dies at each boundary">
        <Reveal>
          <div className="space-y-2">
            <Node label="planner" detail="decomposes: refund check → logistics update → retention offer" tone="brand" />
            <Arrow note="handoff 1 · drops: customer tone, ticket history — the specialist plans blind" />
            <Node label="specialist: refunds" detail="own context, own budget, own tool allowlist" />
            <Arrow note="handoff 2 · drops: what the refunds agent just learned about the damage claim" />
            <Node label="specialist: logistics" detail="re-asks for facts the planner already had" />
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — what isolation buys */}
      <Scene caption="② Why teams still split — the two real reasons">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Context isolation</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                A specialist sees a small window and a narrow menu — tool choice stays sharp,
                one noisy document can&apos;t steer the whole system.
              </p>
            </div>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Independent budgets &amp; limits</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Per-agent step/cost caps, separate permissioning, independently shippable
                prompts. Failure blast radius shrinks.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 3 — the counter-example */}
      <Scene caption="③ Relay's actual data — and the decision it forced">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4">
          <p className="text-sm font-medium leading-relaxed text-ink">
            Measured: the three-agent refactor gained 2 points on routing accuracy and{" "}
            <span className="font-bold">lost 6 on cross-flow tickets</span> — exactly the
            tickets where the damage claim mattered to the shipping decision. Shipped
            instead: <span className="font-bold">one agent, three tool groups</span>, with
            budgets per group.
          </p>
          <p className="mt-2 text-center text-xs font-bold text-ink-soft">
            Orchestration is a hypothesis to test — not an architecture to assume.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Split for isolation and independent limits — never for spectacle. Budget the
          handoff tax, and let the eval suite — not the org chart — pick the topology.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One agent node in the topology. */
function Node({
  label,
  detail,
  tone = "neutral",
}: {
  label: string;
  detail: string;
  tone?: "neutral" | "brand";
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        tone === "brand" ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="w-24 shrink-0 rounded bg-ink px-1.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-canvas">
        {label}
      </span>
      <span className="text-xs font-medium leading-relaxed text-ink sm:text-[13px]">{detail}</span>
    </div>
  );
}

/** The handoff arrow with its explicit loss. */
function Arrow({ note }: { note: string }) {
  return (
    <div className="flex items-center gap-3 pl-6">
      <span aria-hidden="true" className="text-lg leading-none text-ink-faint">↓</span>
      <span className="text-[10.5px] font-medium italic leading-snug text-ink-soft">{note}</span>
    </div>
  );
}
