import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";
import { PlayMark, NoPlayMark } from "./weather";

/**
 * Layman course — Lesson 14: "Which split is best?".
 *
 * Picture-led rebuild of Lesson 5.pdf slides 13-23 (information gain), WITHOUT
 * the entropy formula. The intuition only: a good split leaves each side
 * mostly one class (pure); a bad split leaves the sides mixed. Shown with the
 * play/no-play picture marks from the tennis example (lesson 13), NOT a token
 * table. Brand blue + semantic good/bad only. No prose/questions (course rule).
 */
export function BestSplit() {
  return (
    <Infographic>
      <InfographicHeader
        title="Which split is best?"
        subtitle="The best question is the one that leaves each side mostly decided"
      />

      {/* Step 1 — the goal: pure groups, shown with pictures */}
      <Scene caption="① After a split, we want each side to be mostly one class">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="mb-2 text-sm font-bold text-good">pure side</div>
            <div className="flex items-center justify-center gap-1">
              <PlayMark />
              <PlayMark />
              <PlayMark />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink">all the same — decided</p>
          </div>
          <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
            <div className="mb-2 text-sm font-bold text-bad">mixed side</div>
            <div className="flex items-center justify-center gap-1">
              <PlayMark />
              <NoPlayMark />
              <PlayMark />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink">still unsure</p>
          </div>
        </div>
      </Scene>

      {/* Step 2 — compare two candidate splits, as picture clusters */}
      <Scene caption="② Compare two candidate questions — pick the purer one">
        <Stagger className="space-y-4">
          <MotionChild>
            <SplitRow
              question='split on "windy"?'
              leftLabel="not windy"
              left={["yes", "no", "yes", "no"]}
              rightLabel="windy"
              right={["no", "yes", "no", "yes"]}
              verdict="bad"
            />
          </MotionChild>
          <MotionChild>
            <SplitRow
              question='split on "humidity"?'
              leftLabel="high humidity"
              left={["no", "no", "no", "no"]}
              rightLabel="normal humidity"
              right={["yes", "yes", "yes", "yes"]}
              verdict="good"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 3 — the rule, in words */}
      <Scene caption="③ The tree picks the feature that makes the purest split">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium text-ink sm:text-base">
            Try every feature, measure how pure each split is, choose the{" "}
            <span className="font-bold">purest</span>. Repeat for each branch.
          </p>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          That measure of purity is called{" "}
          <span className="font-bold">information gain</span> — the math behind it just counts the mixing.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The best split is the one that{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">untangles</span>{" "}
          the classes — no formula needed to see why.
        </p>
      </Card>
    </Infographic>
  );
}

/** A row of outcome picture marks. */
function MarkRow({ outcomes }: { outcomes: ("yes" | "no")[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {outcomes.map((o, i) => (o === "yes" ? <PlayMark key={i} /> : <NoPlayMark key={i} />))}
    </div>
  );
}

/** One candidate split: a question + two labelled sides + a verdict. */
function SplitRow({
  question,
  leftLabel,
  left,
  rightLabel,
  right,
  verdict,
}: {
  question: string;
  leftLabel: string;
  left: ("yes" | "no")[];
  rightLabel: string;
  right: ("yes" | "no")[];
  verdict: "good" | "bad";
}) {
  const border = verdict === "good" ? "border-good" : "border-bad";
  const badgeTone = verdict === "good" ? "bg-good text-canvas" : "bg-bad text-canvas";
  return (
    <div className={`rounded-xl border-2 ${border} bg-surface-elevated p-4 shadow-sm`}>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-ink">
        <span className="rounded bg-ink px-2 py-0.5 text-[10px] uppercase text-canvas">question</span>
        {question}
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badgeTone}`}>
          {verdict === "good" ? "pure" : "mixed"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-2">
          <span className="text-center text-[11px] font-bold uppercase text-ink-soft">{leftLabel}</span>
          <MarkRow outcomes={left} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-center text-[11px] font-bold uppercase text-ink-soft">{rightLabel}</span>
          <MarkRow outcomes={right} />
        </div>
      </div>
    </div>
  );
}
