import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 10: capstone "The PaisaShield defense log".
 * The whole course assembled: one pipeline with every layer this course
 * installed, plus the one attack the team accepted.
 */
export function PaisashieldCapstone() {
  return (
    <Infographic>
      <InfographicHeader
        title="The PaisaShield defense log"
        subtitle="Nine lessons assembled on one pipeline — and one accepted risk"
      />

      {/* SCENE 1 — the defended pipeline */}
      <Scene caption="① The pipeline, fully dressed">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 text-[11px] font-semibold text-ink">
            {[
              ["ticket arrives", "redaction pass masks PII → locked map (L4)"],
              ["in-guard", "family stack scores; high blocks + traces (L2)"],
              ["retrieval", "intake-gated wiki, reader-pass filtered (L5)"],
              ["model + tools", "allow-list · approval > ₹500 · reviewed descriptions (L6)"],
              ["out-guard", "card patterns, policy answers, tone (L2)"],
              ["sends / refunds", "capped keys in sandboxes (L3)"],
            ].map(([stage, layer]) => (
              <div key={stage} className="flex flex-col gap-0.5 rounded-lg bg-ash px-3 py-1.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="w-28 shrink-0 font-bold">{stage}</span>
                <span className="text-ink-soft">{layer}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] font-medium text-ink-soft">
            behind it: threat model (L1) · CI attack suite (L8) · incident card (L9) · drills monthly (L7)
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the drills proved it */}
      <Scene caption="② What the drills showed">
        <div className="mx-auto max-w-lg space-y-2">
          {[
            ["probe pack, 26 probes", "24 blocked at layers, 2 caught by out-guard fallback ✓"],
            ["game-day refund rush", "cap fired at ₹1,000; key rotated in 9 minutes ✓"],
            ["wiki poisoning attempt", "intake inspection flagged instruction-like lines ✓"],
          ].map(([drill, result]) => (
            <MotionChild key={drill}>
              <div className="flex flex-col gap-1 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm sm:flex-row sm:items-center sm:gap-3">
                <span className="w-40 shrink-0 text-[11px] font-bold text-ink">{drill}</span>
                <span className="text-[11px] font-medium text-ink-soft">{result}</span>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the accepted risk */}
      <Scene caption="③ The honest page: what the team did NOT fix">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-ink">accepted risk AR-3</p>
          <p className="mt-1 text-[11px] font-semibold text-ink">
            A novel jailbreak phrasing will eventually produce one off-tone draft before the out-guard catches it.
          </p>
          <p className="mt-1 text-[11px] font-medium text-ink">
            Accepted because drafts queue for human review; monitored via out-guard hit-rate trend; revisit next quarter.
          </p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A defense log without an accepted-risk page is{" "}
          <span className="font-bold">claiming a finish line that doesn&apos;t exist</span>.
        </p>
      </Scene>

      {/* SCENE 4 — your turn */}
      <Scene caption="④ The artifact you now own">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Threat model → layered defenses → drilled, gated, logged —{" "}
            <span className="font-bold">reusable on any AI product you ship</span>.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Next: at-scale security — adversarial robustness, multi-agent trust, incident command, governance.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Map it, layer it, drill it, log it —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">and write down the risk you accepted</span>.
        </p>
      </Card>
    </Infographic>
  );
}
