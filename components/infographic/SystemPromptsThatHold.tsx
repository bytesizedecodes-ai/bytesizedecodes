import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 3: "System Prompts that Hold".
 *
 * Course case: Relay's prompt, v1 → v6. Beat 1: the anatomy (role → rules →
 * examples → format) as a staggered document build. Beat 2: the drift — every
 * incident pasted in a new rule until two rules conflict (the refund promise
 * vs the approval rule) and behavior wobbles. Beat 3: the fix — prompts are
 * versioned artifacts, not sticky notes. Intermediate density; brand accent
 * only; the conflict is drawn with semantic bad, once.
 */
export function SystemPromptsThatHold() {
  return (
    <Infographic>
      <InfographicHeader
        title="The document that never stops growing"
        subtitle="Relay's system prompt, from 12 clean lines to 90 that fight each other."
      />

      {/* Scene 1 — anatomy, staggered build */}
      <Scene caption="① v1 — the anatomy that worked">
        <Stagger className="space-y-2">
          <MotionChild>
            <PromptSection label="Role" text="You are Relay, a support agent for a mid-size shop." />
          </MotionChild>
          <MotionChild>
            <PromptSection label="Rules" text="Be accurate. Never promise a refund — issue one only via issue_refund." />
          </MotionChild>
          <MotionChild>
            <PromptSection label="Examples" text="One worked exchange: angry customer → acknowledge, look up, act." />
          </MotionChild>
          <MotionChild>
            <PromptSection label="Format" text="Answer in ≤4 sentences; always cite the order number." />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          Role → rules → examples → format. <span className="font-bold text-ink">12 lines</span>, every one load-bearing.
        </p>
      </Scene>

      {/* Scene 2 — the drift */}
      <Scene caption="② Five incidents later: 90 lines, one contradiction">
        <Reveal>
          <div className="space-y-2">
            <PromptSection label="Rule 7 (added after the May incident)" text="Always reassure customers their refund is guaranteed." tone="bad" />
            <PromptSection label="Rule 23 (added after the audit)" text="Never state a refund is guaranteed — approval above €200 is required." tone="bad" />
          </div>
          <p className="mt-3 rounded-xl border border-[var(--color-bad)] bg-[var(--color-bad-wash)] px-4 py-3 text-center text-sm font-medium leading-relaxed text-ink">
            Two rules, added months apart, now <span className="font-bold">directly contradict</span>.
            The model obeys whichever it attended to — so behavior flips by customer, by day, by phrasing.
          </p>
        </Reveal>
      </Scene>

      {/* Scene 3 — the discipline */}
      <Scene caption="③ Prompts are versioned artifacts, not sticky notes">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Discipline title="One owner, one file" note="The prompt lives in the repo, reviewed like code — not pasted into a console at 2am." />
            <Discipline title="Change = diff + eval" note="Every edit ships with the diff and a task-suite run — you see what the change broke." accent />
            <Discipline title="Rules get pruned" note="Adding a rule means re-reading the others. Contradiction is a bug, not a style." />
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          A system prompt holds under pressure when it's structured (role → rules →
          examples → format), contradiction-free, and versioned like code.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One labelled section of the prompt document. */
function PromptSection({
  label,
  text,
  tone = "neutral",
}: {
  label: string;
  text: string;
  tone?: "neutral" | "bad";
}) {
  const cls =
    tone === "bad"
      ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]"
      : "border-ash bg-surface-elevated";
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${cls}`}>
      <span className="w-16 shrink-0 pt-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <span className="text-xs font-medium leading-relaxed text-ink sm:text-[13px]">{text}</span>
    </div>
  );
}

/** One discipline card from the resolution. */
function Discipline({
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
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
