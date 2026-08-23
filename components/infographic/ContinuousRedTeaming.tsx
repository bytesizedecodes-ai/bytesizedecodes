import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 6: "Continuous red-teaming".
 * Case evidence: Setu's programme — automation tier, human tier, bounty tier,
 * and the fix-rate metric that keeps it honest.
 */
export function ContinuousRedTeaming() {
  return (
    <Infographic>
      <InfographicHeader
        title="Continuous red-teaming"
        subtitle="A programme, not a quarter — three tiers, one metric: fix-rate latency"
      />

      {/* SCENE 1 — the tiers */}
      <Scene caption="① Three tiers, three kinds of finding">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Automated (CI)</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">known families, every merge — catches regressions, finds nothing new</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Human red team (monthly)</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">novel chains, multi-step attacks across agents — finds what packs can&apos;t</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Bounty / external (standing)</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">diversity of adversaries — finds what your team&apos;s imagination won&apos;t</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 2 — the programme loop */}
      <Scene caption="② The loop, with owners">
        <div className="mx-auto max-w-lg space-y-1.5">
          {[
            ["find", "each tier files into ONE findings register — same schema, same severities"],
            ["triage", "blast radius × confidence → severity; duplicates merged into families"],
            ["fix", "owner + PR; CI suite entry created for the family, not just the instance"],
            ["verify & pay", "re-run green closes it; bounty pays on closure, not on filing"],
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

      {/* SCENE 3 — the metric */}
      <Scene caption="③ The metric that keeps it honest: fix-rate latency">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="flex items-end justify-center gap-2">
            {[
              ["SEV-1", 24, "h"],
              ["SEV-2", 48, "h"],
              ["SEV-3", 5, "d"],
            ].map(([sev, val, unit]) => (
              <div key={sev as string} className="flex flex-col items-center gap-1">
                <span className="rounded-full bg-brand-wash px-2 py-0.5 font-mono text-[11px] font-bold text-ink">{val}{unit}</span>
                <span className="text-[10px] font-semibold text-ink-soft">{sev} target</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold text-ink">
            Median time from finding → verified fix, per severity. Rising trend = the programme is decoration.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — boundary */}
      <Scene caption="④ Boundary: what programmes over-index on">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Count-of-findings is a vanity metric — it rewards noisy scanners. And automation breeds{" "}
            <span className="font-bold">alert fatigue</span>: the day the team batch-closes SEV-3s unread, the
            programme&apos;s real coverage is zero regardless of dashboards. Track fix-rate and reopen-rate; audit a
            sample of closed findings quarterly.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Three tiers, one register, one metric —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">fix-rate latency</span> by
          severity.
        </p>
      </Card>
    </Infographic>
  );
}
