import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 7: "Harness Reliability".
 *
 * Course case: the 2am duplicate-refund incident — model timeout → retry →
 * double execution. Timeline scene (before), the idempotency-key fix
 * (after), and the degradation ladder. Semantic bad marks only the duplicate
 * execution; good marks the recovery. Expert register, compact.
 */
export function HarnessReliability() {
  return (
    <Infographic>
      <InfographicHeader
        title="The refund that ran twice"
        subtitle="At-least-once delivery met a non-idempotent action. 2:14am, pager fires."
      />

      {/* Beat 1 — the incident timeline */}
      <Scene caption="① Timeline: how a timeout became a double refund">
        <Stagger className="flex flex-col gap-1.5">
          <MotionChild>
            <Tick t="02:11:07" text="issue_refund(#4821, €84) → model API times out at 30s" tone="neutral" />
          </MotionChild>
          <MotionChild>
            <Tick t="02:11:37" text="retry policy fires — same call, same arguments, no key" tone="neutral" />
          </MotionChild>
          <MotionChild>
            <Tick t="02:11:39" text="first attempt's action lands late: refund executed" tone="bad" />
          </MotionChild>
          <MotionChild>
            <Tick t="02:11:41" text="retry lands too: €84 refunded twice. one order." tone="bad" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Neither call was wrong. The action was <span className="font-bold">replayable</span> and
          nothing told the executor they were the <span className="font-bold">same intent</span>.
        </p>
      </Scene>

      {/* Beat 2 — the fix */}
      <Scene caption="② Idempotency at the tool boundary">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 font-mono text-[11px] leading-relaxed shadow-sm">
              <div className="font-bold text-ink-soft">the contract</div>
              <p className="mt-1 text-ink">
                {`issue_refund(`}
                <br />
                {`  order_id="#4821",`}
                <br />
                {`  amount=84,`}
                <br />
                {`  idempotency_key="t4821-r1"`}
                <br />
                {`)`}
              </p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">
                executor: seen this key? return the first result — don&apos;t re-execute.
              </p>
            </div>
            <div className="rounded-xl border border-good bg-good-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-good">
                same timeline, with the key
              </div>
              <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-ink">
                Retry at 02:11:37 presents the same key → executor returns the first
                attempt&apos;s result. The double execution is structurally impossible,{" "}
                <span className="font-bold">not just unlikely</span>.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 3 — the degradation ladder */}
      <Scene caption="③ When the model itself is down: degrade, don't die">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Rung n={1} title="Full agent" note="the normal path — loop, tools, big model" />
            <Rung n={2} title="Cached + small-model lane" note="top questions served from cache; simple work on the fast lane" />
            <Rung n={3} title="Human queue + banner" note="irreversible actions park; customers told honestly. never silent failure" accent />
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Exactly-once is an illusion; idempotency keys are the engineering answer. And when
          the model is down, the ladder — cache, degrade, queue — beats the cliff.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One timeline tick of the incident. */
function Tick({
  t,
  text,
  tone,
}: {
  t: string;
  text: string;
  tone: "neutral" | "bad";
}) {
  const bad = tone === "bad";
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm ${
        bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="w-16 shrink-0 font-mono text-[10px] font-bold text-ink-faint">{t}</span>
      <span className="min-w-0 flex-1 font-mono text-[11px] font-medium leading-snug text-ink">
        {text}
      </span>
    </div>
  );
}

/** One rung of the degradation ladder. */
function Rung({
  n,
  title,
  note,
  accent = false,
}: {
  n: number;
  title: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="mt-2 text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
