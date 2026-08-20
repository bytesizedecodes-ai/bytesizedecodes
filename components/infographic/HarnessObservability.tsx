import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 7: "Harness Observability".
 *
 * Course case: Relay behaved oddly on one ticket — the trace answers it. A
 * decision-trace strip for a single request: prompt version, context assembly
 * size, tool calls with durations, one schema retry, final answer + cost.
 * Each span is labelled in place (no legend). The reveal: the odd behavior
 * is diagnosed from the trace — the wrong prompt version was served.
 * Deliberately passive (restraint): the lesson is reading a trace, not
 * clicking one. Brand accent on the smoking-gun span.
 */
export function HarnessObservability() {
  return (
    <Infographic>
      <InfographicHeader
        title="One request, fully visible"
        subtitle="Relay answered oddly on ticket #4821 — the trace explains it in ten seconds."
      />

      {/* Scene 1 — the trace */}
      <Scene caption="① The decision trace for one request">
        <Stagger className="space-y-1.5">
          <MotionChild>
            <Span label="request" detail='customer: "refund the damaged order"' ms="0ms" />
          </MotionChild>
          <MotionChild>
            <Span label="context" detail="prompt v12 · 2.4k tok · pinned facts + 8 turns" ms="6ms" />
          </MotionChild>
          <MotionChild>
            <Span label="tool" detail="lookup_order(#4821) → shipped Fri, damaged" ms="210ms" />
          </MotionChild>
          <MotionChild>
            <Span label="tool" detail="policy_lookup(refund) → clause 4.2" ms="180ms" />
          </MotionChild>
          <MotionChild>
            <Span label="retry" detail="schema violation: action enum — repaired turn 1" ms="+340ms" tone="bad" />
          </MotionChild>
          <MotionChild>
            <Span label="answer" detail="refund issued · 4 sentences · order cited" ms="1.1s" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          Every row answers a question you&apos;d otherwise guess at.
        </p>
      </Scene>

      {/* Scene 2 — the diagnosis */}
      <Scene caption="② The 2am question, answered by the trace">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Without a trace</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                &ldquo;It promised a refund it shouldn&apos;t have. Bad model? Bad prompt?
                Bad day?&rdquo; — revert a release, pray, repeat next week.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">With the trace</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
                <span className="font-mono">prompt v12</span> was served — the deploy that
                hadn&apos;t rolled out yet. The model, tools, and schema were all fine.
              </p>
              <p className="mt-1 text-[11px] font-semibold text-brand">
                Rollback one deploy. Ticket closed in minutes, not days.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — what to record */}
      <Scene caption="③ The spans that earn their keep">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <RecordWhat title="Prompt version" note="which text actually ran — the #1 silent variable" accent />
            <RecordWhat title="Context shape" note="tokens in, what was pinned, what was trimmed" />
            <RecordWhat title="Tool calls" note="name, arguments, duration, result class" />
            <RecordWhat title="Retries & repairs" note="every second attempt is a signal, not noise" />
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          You can't fix what you can't see: trace prompt version, context shape, tool
          calls, and retries — before you need them.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One span row of the decision trace. */
function Span({
  label,
  detail,
  ms,
  tone = "neutral",
}: {
  label: string;
  detail: string;
  ms: string;
  tone?: "neutral" | "bad";
}) {
  const accent = tone === "bad";
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm ${
        accent
          ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]"
          : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        className={`w-16 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-wide ${
          accent ? "bg-[var(--color-bad)] text-canvas" : "bg-ink text-canvas"
        }`}
      >
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] font-medium text-ink sm:text-[11px]">
        {detail}
      </span>
      <span className="shrink-0 font-mono text-[10px] font-bold text-ink-faint">{ms}</span>
    </div>
  );
}

/** One "record this" card. */
function RecordWhat({
  title,
  note,
  accent = false,
}: {
  title: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-xs font-bold text-ink sm:text-[13px]">{title}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
