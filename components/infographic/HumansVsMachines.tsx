import { Infographic, InfographicHeader } from "./primitives";
import { Card } from "./primitives";
import {
  PersonFigure,
  MachineFigure,
  CarShape,
  SpeechBubble,
  Scene,
} from "./scenes";

/**
 * Layman course — Lesson 2: "Why a machine can't do that (yet)".
 *
 * Layout: binary-comparison told through two parallel scenes — a human
 * recognising a car vs a machine asked to do the same and failing. Mirrors
 * Lesson 1.pdf slides 13-15. Pictures carry the contrast; text is one line each.
 */
export function HumansVsMachines() {
  return (
    <Infographic>
      <InfographicHeader
        title="Why a machine can't do that (yet)"
        subtitle="A traditional machine follows instructions — it doesn't decide"
      />

      {/* SCENE A — the human, again, succeeds */}
      <Scene caption="① A human has no trouble">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <CarShape />
          <PersonFigure label="human" />
          <SpeechBubble side="left">That&apos;s a car.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Experience → instant decision.
        </p>
      </Scene>

      {/* SCENE B — the same question to a machine */}
      <Scene caption="② Ask the same question to a machine">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <CarShape />
          <MachineFigure label="machine" confused />
          <SpeechBubble side="left" className="text-bad">
            I have no rule for &ldquo;car&rdquo;.
          </SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Nobody programmed it to recognise cars → it can&apos;t decide.
        </p>
      </Scene>

      {/* What a machine CAN do — the instructions list, drawn as a terminal */}
      <Scene caption="③ A machine is built to follow instructions like these">
        <div className="mx-auto max-w-md rounded-xl bg-ink p-4 font-mono text-[13px] leading-relaxed text-canvas shadow-sm">
          <div className="mb-2 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-bad" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            <span className="h-2.5 w-2.5 rounded-full bg-good" />
          </div>
          <div className="text-ink-faint"># what machines are good at:</div>
          <div>&gt; <span className="text-brand">add</span> 7 + 5  →  12</div>
          <div>&gt; <span className="text-brand">compare</span> x, y</div>
          <div>&gt; <span className="text-brand">multiply</span> 9 × 4</div>
          <div>&gt; <span className="text-brand">print</span> &quot;hello&quot;</div>
          <div>&gt; <span className="text-brand">plot</span> chart(data)</div>
          <div className="mt-2 text-ink-faint"># all explicit rules.</div>
          <div className="text-ink-faint"># no learning, no judgement.</div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Perfect at arithmetic, comparison, printing. Hopeless at &ldquo;is this a car?&rdquo;.
        </p>
      </Scene>

      {/* The bridge — the whole point of ML */}
      <Card tone="brand" rotate={0}>
        <h3 className="mb-2 flex items-center justify-center gap-2 text-center text-base font-bold sm:text-lg">
          <span aria-hidden="true">🌉</span> So what&apos;s missing?
        </h3>
        <p className="text-center text-sm font-semibold leading-relaxed text-ink sm:text-[15px]">
          A way for the machine to{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            learn from examples
          </span>{" "}
          — instead of needing every rule spelled out. That bridge is called{" "}
          <strong className="font-extrabold">machine learning</strong>.
        </p>
      </Card>
    </Infographic>
  );
}
