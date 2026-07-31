import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, CarShape, Operator, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 3: "What is Machine Learning, really?".
 *
 * Layout: linear-progression told as an accumulating formula — the deck's
 * signature visual from slides 22-26: Dataset + Algorithm + Rules + Patterns
 * + Relations = Decision. Each box is a labelled picture; the + operators
 * carry the story. Brand blue only. No prose/questions (course rule).
 *
 * Faithful to source: Lesson 1.pdf slides 16-27.
 */
export function WhatIsMLLayman() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Machine Learning, really?"
        subtitle="Give the machine experience, and let it find the patterns itself"
      />

      {/* The machine gets the same task as the child */}
      <Scene caption="① Give the machine the same job we gave the child">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <CarShape />
          <MachineFigure label="machine" />
          <span className="rounded-2xl bg-brand px-4 py-2 text-sm font-bold text-ink">
            learn from data
          </span>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The machine&apos;s &ldquo;experience&rdquo; is data.
        </p>
      </Scene>

      {/* The accumulating formula — slides 22-26. Builds piece-by-piece. */}
      <Scene caption="② The recipe, built up one piece at a time">
        <Stagger className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <MotionChild>
            <Box emoji="📊" title="Dataset" sub="the experience" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <Box emoji="⚙️" title="Algorithm" sub="runs on the data" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <Box emoji="🔍" title="Rules" sub="what it learns" tone="brand" />
          </MotionChild>
        </Stagger>
        <p className="mt-4 text-center text-xs font-medium text-ink">
          data + algorithm → the machine derives rules itself.
        </p>

        <Stagger className="mt-4 flex flex-col items-stretch gap-3 border-t border-ash pt-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <MotionChild>
            <Box emoji="🔗" title="Patterns" sub="in the data" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <Box emoji="🤝" title="Relations" sub="between things" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>=</Operator>
          </MotionChild>
          <MotionChild>
            <Box emoji="✅" title="Decision" sub="on new input" tone="brandDeep" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          …finds patterns and relations → decides on something new.
        </p>
      </Scene>

      {/* The four things ML can then do — slides 17-20 */}
      <Scene caption="③ Now the machine can do things only humans could">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Outcome emoji="🚗" label="Identify objects" />
          <Outcome emoji="📈" label="Predict prices" />
          <Outcome emoji="💬" label="Understand language" />
          <Outcome emoji="😀" label="Recognise faces" />
        </div>
      </Scene>

      {/* One-line summary */}
      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Data in → patterns found →{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            decision out
          </span>
          . That&apos;s machine learning.
        </p>
      </Card>
    </Infographic>
  );
}

function Box({
  emoji,
  title,
  sub,
  tone,
}: {
  emoji: string;
  title: string;
  sub: string;
  tone: "white" | "brand" | "brandDeep";
}) {
  const bg =
    tone === "brandDeep"
      ? "bg-brand-deep text-canvas border-brand-deep"
      : tone === "brand"
        ? "bg-brand text-ink border-brand"
        : "bg-white text-ink border-ash";
  const subColor = tone === "brandDeep" ? "text-canvas" : "text-ink";
  return (
    <div className={`flex min-w-[8rem] flex-col items-center gap-1 rounded-xl border px-4 py-4 text-center shadow-sm ${bg}`}>
      <span className="text-2xl" aria-hidden="true">{emoji}</span>
      <span className="text-sm font-bold">{title}</span>
      <span className={`text-[11px] font-medium ${subColor}`}>{sub}</span>
    </div>
  );
}

function Outcome({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-ash bg-brand-wash px-3 py-4 text-center">
      <span className="text-3xl" aria-hidden="true">{emoji}</span>
      <span className="text-xs font-semibold text-ink">{label}</span>
    </div>
  );
}
