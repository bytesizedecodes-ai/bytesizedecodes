import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 7: "When NOT to Build an Agent"
 * (v2 Thread retrofit)
 *
 * Course capstone. Cast: three tickets land on Divya's desk at Team Vaani on
 * the same Monday — one is Rohan's return-policy question. Through-line
 * stage: the sorting desk — the same three tickets each scene, first sorted
 * onto their designs (✓ good marks the right-sized choice), then repriced
 * (the agent's flexibility carries the brand accent as the one costly
 * change), then the fade to the ladder rule: always the least machinery that
 * works. Beginner density throughout.
 */
export function WhenNotToAgent() {
  return (
    <Infographic>
      <InfographicHeader
        title="The most valuable skill: not building one"
        subtitle="Three real tasks — only one of them deserves an agent."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">📥</span>, label: "Three Monday tickets" },
          { icon: <span aria-hidden="true">💰</span>, label: "Price each option" },
          { icon: <span aria-hidden="true">🪜</span>, label: "Climb the ladder" },
        ]}
      />

      {/* Scene 1 — sort three tasks to their right-sized design */}
      <Scene caption="So three tickets land on Divya's desk — same Monday, three right sizes.">
        <Stagger className="flex flex-col gap-3">
          <MotionChild>
            <TaskRow
              task="Every night: translate the day's 40 new product descriptions into four languages"
              design="pipeline"
              why="same steps, every night, no decisions — script it once"
            />
          </MotionChild>
          <MotionChild>
            <TaskRow
              task="Rohan asks: “what's your return policy?”"
              design="single call"
              why="one question, one answer — hand the policy to the model"
            />
          </MotionChild>
          <MotionChild>
            <TaskRow
              task="The CEO asks: “why did returns spike this week?”"
              design="agent"
              why="nobody can script the steps — it depends on what it finds"
              accent
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 2 — the trade-off: what flexibility costs */}
      <Scene variant="continue" caption="Then price the machinery before choosing — flexibility has a bill.">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <CostCard label="Fixed pipeline" cost="low" rows={["runs the same every time", "cheap and fast", "blind to surprises"]} />
            <CostCard label="Single call" cost="low" rows={["one model call, one answer", "cheapest of all", "can't react or investigate"]} />
            <CostCard label="Agent loop" cost="high" rows={["adapts to what it finds", "every step: slower + pricier", "can wander — needs a budget"]} accent />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink sm:text-[15px]">
          An agent isn&apos;t a better pipeline — it&apos;s a{" "}
          <span className="font-bold">different tool</span>, traded knowingly.
        </p>
      </Scene>

      {/* Scene 3 — the rule, faded to the idea */}
      <Scene caption="That's why the ladder rule: climb only as high as the task forces.">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            <span className="font-bold">Pipeline</span> → can&apos;t? try a{" "}
            <span className="font-bold">single call</span> → still can&apos;t?{" "}
            <span className="font-bold">now</span> an agent.{" "}
            The confidence to ship the boring design is the senior skill.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The capstone takeaway</CardTitle>
        <Takeaway>
          Use the least machinery that works. An agent is a power tool — reach for it only when
          the path can't be written in advance.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One task sorted onto its right-sized design. */
function TaskRow({
  task,
  design,
  why,
  accent = false,
}: {
  task: string;
  design: string;
  why: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed text-ink sm:text-[13px]">
        {task}
      </p>
      <div className="sm:w-52 sm:shrink-0">
        <span className="inline-block rounded-full border border-good bg-good-wash px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-good">
          ✓ {design}
        </span>
        <p className="mt-1 text-[10px] font-medium leading-snug text-ink-soft">{why}</p>
      </div>
    </div>
  );
}

/** The cost card for each design. `accent` marks the expensive flexibility. */
function CostCard({
  label,
  cost,
  rows,
  accent = false,
}: {
  label: string;
  cost: "low" | "high";
  rows: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{label}</div>
      <span
        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          cost === "high" ? "bg-ink text-canvas" : "border border-good bg-good-wash text-good"
        }`}
      >
        cost: {cost}
      </span>
      <ul className="mt-2 space-y-1">
        {rows.map((row) => (
          <li key={row} className="text-[11px] font-medium leading-relaxed text-ink-soft">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}
