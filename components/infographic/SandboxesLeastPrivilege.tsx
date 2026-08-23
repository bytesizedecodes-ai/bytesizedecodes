import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 3: "Sandboxes & least privilege".
 * Case artifact: PaisaShield's three keys, sized by blast radius — read,
 * draft, refund — each in its own ring.
 */
export function SandboxesLeastPrivilege() {
  const KeyPlan = ({
    name,
    scope,
    cap,
    tone,
  }: {
    name: string;
    scope: string;
    cap: string;
    tone: "tight" | "loose";
  }) => (
    <MotionChild>
      <div
        className={`flex h-full flex-col gap-1.5 rounded-xl border p-3 shadow-sm ${
          tone === "loose" ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔑</span>
          <p className="text-xs font-bold text-ink">{name}</p>
        </div>
        <p className="text-[10px] font-medium text-ink-soft">scope: {scope}</p>
        <p className="mt-auto rounded-md bg-ash px-2 py-1 text-[10px] font-semibold text-ink">cap: {cap}</p>
      </div>
    </MotionChild>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Sandboxes & least privilege"
        subtitle="PaisaShield's keys, sized by blast radius"
      />

      {/* SCENE 1 — the ladder ground: what a tricked assistant can do */}
      <Scene caption="① Ground truth: the assistant will occasionally be tricked">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Assume the model <span className="font-bold">will</span> follow a smuggled instruction some day.
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Then the only variable you control is{" "}
            <span className="font-bold">what its keys can reach</span>.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — blast radius rings */}
      <Scene caption="② Rung: damage = keys held, not intent">
        <div className="mx-auto flex max-w-md flex-col items-center gap-2">
          {[
            ["the refund API key", "money leaves", "w-64"],
            ["the send-as-company key", "words leave in your name", "w-52"],
            ["the ticket read key", "data seen (already shared)", "w-40"],
            ["the draft key", "nothing leaves without a human", "w-28"],
          ].map(([key, reach, w]) => (
            <div key={key as string} className={`${w as string} rounded-full border border-ash bg-surface-elevated px-3 py-1.5 text-center shadow-sm`}>
              <p className="text-[11px] font-bold text-ink">{key}</p>
              <p className="text-[9px] font-medium text-ink-soft">reach: {reach}</p>
            </div>
          ))}
          <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">wider ring = bigger blast radius</p>
        </div>
      </Scene>

      {/* SCENE 3 — the case's key plan */}
      <Scene caption="③ Rung: one key per errand, every key capped">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <KeyPlan tone="tight" name="read" scope="this ticket only" cap="100 tickets/hour" />
          <KeyPlan tone="tight" name="draft" scope="drafts routed to agent queue" cap="never sends itself" />
          <KeyPlan tone="loose" name="refund" scope="refund API, this order" cap="₹1,000/day, human above ₹500" />
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The refund key is the only one that moves money — so it&apos;s the only one with a{" "}
          <span className="font-bold">sandbox</span>: its own scope, its own cap, its own log.
        </p>
      </Scene>

      {/* SCENE 4 — the top rung: the sandbox contract */}
      <Scene caption="④ Top rung: a sandbox is a promise about the worst day">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Sandboxing = running each tool inside a{" "}
            <span className="font-bold">bounded box</span>: separate credentials, scoped permissions, hard caps,
            and every use logged.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            A fully-tricked PaisaShield can annoy you for ₹1,000. That number is a design choice.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Assume the trick lands; design so{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">the worst day costs one capped key</span> —
          not the kingdom.
        </p>
      </Card>
    </Infographic>
  );
}
