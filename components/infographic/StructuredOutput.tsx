import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, CodePanel } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 5: "Structured Output".
 *
 * Course case: Relay's refund action needs machine-readable JSON, always.
 * The repair loop made visible: model output → schema validator → violation
 * with a specific message → repair instruction → valid. The key teaching:
 * validation errors are feedback the model reads, not dead ends. Bad marks
 * the violation state once; good marks the pass; brand carries the loop.
 */
export function StructuredOutput() {
  return (
    <Infographic>
      <InfographicHeader
        title="JSON, every single time"
        subtitle="Relay's refund action fires on parser output — 'mostly valid' is not valid."
      />

      {/* Scene 1 — the contract */}
      <Scene caption="① The contract between harness and model">
        <CodePanel
          label="The schema Relay requires"
          caption="One required field, one enum. Small contract — and still not free."
          code={`{
  "order_id": "#4821",
  "action": "issue_refund"   // or "needs_approval"
}`}
        />
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Downstream code reads <span className="font-mono text-[13px]">order_id</span> and
          <span className="font-mono text-[13px]"> action</span> blindly — a missing quote
          isn&apos;t a styling issue, it&apos;s a <span className="font-bold">crash</span>.
        </p>
      </Scene>

      {/* Scene 2 — the repair loop */}
      <Scene caption="② The loop: validate → teach → retry">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <LoopStep n={1} label="Model outputs" mono={`{ order_id: "4821", action: "refund" }`} note="close. not valid." tone="neutral" />
          </MotionChild>
          <MotionChild>
            <LoopStep
              n={2}
              label="Validator rejects — with specifics"
              mono={`action must be one of ["issue_refund", "needs_approval"]`}
              note="the error names the field, the rule, and the allowed values"
              tone="bad"
            />
          </MotionChild>
          <MotionChild>
            <LoopStep
              n={3}
              label="Repair turn: error fed back to the model"
              mono={`Fix the JSON: <validator message>`}
              note="the model reads its own output plus the complaint"
              tone="neutral"
            />
          </MotionChild>
          <MotionChild>
            <LoopStep
              n={4}
              label="Second attempt passes"
              mono={`{ "order_id": "#4821", "action": "issue_refund" }`}
              note="one extra round-trip, cents — vs a silent crash"
              tone="good"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 3 — the economics + the ceiling */}
      <Scene caption="③ Cheap insurance — with a limit">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-good">Most outputs: 1 pass</div>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
              good schemas + examples in the prompt make first-try validity the norm;
              the loop is the safety net, not the plan
            </p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-ink">After 2–3 repairs: stop</div>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
              retries have a budget too — then fall back to a human queue, never an
              infinite fix-loop
            </p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Don't hope for valid output — contract for it: a schema, a validator that
          teaches, and a bounded repair loop.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One numbered step of the validate-teach-retry loop. */
function LoopStep({
  n,
  label,
  mono,
  note,
  tone,
}: {
  n: number;
  label: string;
  mono: string;
  note: string;
  tone: "neutral" | "bad" | "good";
}) {
  const border =
    tone === "bad"
      ? "border-[var(--color-bad)]"
      : tone === "good"
        ? "border-good"
        : "border-ash";
  return (
    <div className={`flex items-start gap-3 rounded-xl border ${border} bg-surface-elevated px-4 py-3 shadow-sm`}>
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{label}</div>
        <code className="mt-0.5 block break-words rounded bg-ink px-2 py-1 font-mono text-[10.5px] leading-relaxed text-canvas sm:text-[11px]">
          {mono}
        </code>
        <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
    </div>
  );
}
