import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, Tag } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 1: "Context Engineering".
 *
 * Course case: Relay, a support assistant. A long ticket overflows the window
 * mid-conversation — this lesson is the packing decision. A token-budget bar
 * shows what makes the cut: system prompt pinned, recent history kept,
 * retrieval trimmed, stale tool output dropped. PIC beats: the overflow
 * (scenario), the packing rule (observe), the fade — context engineering is
 * budget + priorities, not stuffing. One accent (brand); bad marks only the
 * overflow.
 */
export function ContextEngineering() {
  return (
    <Infographic>
      <InfographicHeader
        title="Packing a fixed-size window"
        subtitle="Relay's ticket #4821 is 40 messages deep — and the window is full."
      />

      {/* Scene 1 — scenario: the overflow */}
      <Scene caption="① The moment a harness engineer dreads">
        <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <Tag tone="neutral">relay · support ticket</Tag>
            <span className="font-mono text-xs font-bold text-[var(--color-bad)]">
              4,096 / 4,096 tokens
            </span>
          </div>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink">
            The customer&apos;s order number was message 3. The refund policy got retrieved at
            message 12. Three tool dumps sit in the middle. Message 41 just arrived —
            <span className="font-bold"> something must go</span>.
          </p>
        </div>
      </Scene>

      {/* Scene 2 — the packing rule, as a budget bar */}
      <Scene caption="② What makes the cut: a budget with priorities">
        <Reveal>
          <div className="space-y-2">
            <Segment label="System prompt (pinned)" tokens="400" width="26" note="always in — it's the constitution" />
            <Segment label="Order facts (pinned summary)" tokens="300" width="20" note="the order number, distilled — never the raw dump" />
            <Segment label="Recent history (last 8 turns)" tokens="1800" width="44" note="the live conversation" />
            <Segment label="Refund policy (retrieved)" tokens="900" width="22" note="trimmed to the relevant clause" accent />
            <Segment label="Old tool outputs" tokens="—" width="0" note="dropped — stale, bulky, already summarized" dropped />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          Nothing is &ldquo;kept by default&rdquo; — every segment <span className="font-bold text-ink">applies for space</span>.
        </p>
      </Scene>

      {/* Scene 3 — the two moves, faded to the idea */}
      <Scene caption="③ The whole discipline in two moves">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">1 · Distill</div>
              <p className="mt-1 text-xs font-medium leading-relaxed text-ink-soft">
                Raw content → compact facts. A 900-token tool dump becomes a 40-token
                note (&ldquo;order #4821, shipped Fri, no delivery issues logged&rdquo;).
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">2 · Prioritize</div>
              <p className="mt-1 text-xs font-medium leading-relaxed text-ink-soft">
                When space runs out, the harness decides what survives — by rule, not
                by accident of what happened to arrive last.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Context engineering = a token budget plus an explicit priority order. The model
          sees the packing decision; it never makes it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One row of the token-budget bar. */
function Segment({
  label,
  tokens,
  width,
  note,
  accent = false,
  dropped = false,
}: {
  label: string;
  tokens: string;
  /** Percentage width of the bar. */
  width: string;
  note: string;
  accent?: boolean;
  dropped?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 shrink-0 text-right text-[11px] font-bold leading-tight text-ink sm:w-48">
        {label}
        <span className="block font-mono text-[10px] font-medium text-ink-faint">{tokens} tok</span>
      </div>
      <div className="h-6 flex-1 overflow-hidden rounded-md bg-ash">
        {dropped ? (
          <div className="flex h-full items-center pl-2 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
            dropped
          </div>
        ) : (
          <div
            className={`h-full rounded-md ${accent ? "bg-brand-deep" : "bg-brand"}`}
            style={{ width: `${width}%` }}
          />
        )}
      </div>
      <div className="hidden w-44 shrink-0 text-[10px] font-medium leading-tight text-ink-soft sm:block">
        {note}
      </div>
    </div>
  );
}
