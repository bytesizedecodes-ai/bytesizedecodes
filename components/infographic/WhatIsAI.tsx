import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  CodePanel,
  Takeaway,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Lesson infographic: "What is AI?" (intermediate course).
 *
 * Calibration: the concrete anchor (calculator vs spam filter) stays but is
 * tightened; we reach the formal representation (deterministic vs adaptive
 * code) faster. Short illustrative code is introduced (intermediate
 * allowance). The "aha" is engineered: the two programs land in sequence, the
 * tension "which one is intelligent?" is held a beat, then resolved (P7). We
 * state where the "machines think like humans" analogy breaks (P2).
 *
 * Visual cohesion: uses the shared CodePanel + Takeaway primitives so this
 * lesson reads as one design with the rest of the course. Definition card is
 * brandWash (neutrals carry the load; the accent CodePanel is the focal blue).
 */
export function WhatIsAI() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Artificial Intelligence?"
        subtitle="The divide isn't speed or size — it's whether behaviour is fixed or learned"
      />

      {/* Scene 1 — formal definition (brandWash so the code panel below is the focal accent). */}
      <Card tone="brandWash" rotate={-0.3}>
        <p className="text-base font-semibold leading-snug sm:text-lg">
          <strong className="font-extrabold">Artificial Intelligence</strong> is
          the branch of computer science that builds systems which{" "}
          <strong className="font-extrabold">adapt their behaviour from data</strong>{" "}
          — instead of only executing fixed instructions.
        </p>
      </Card>

      {/* Scene 2 — the divide, as code. THE KEY INTERMEDIATE LIFT.
          Two programs land in sequence (Stagger), tension is held, then resolved. */}
      <Scene caption="Two programs. Same job — sort email. What's different?">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <CodePanel
              label="Non-intelligent · deterministic"
              caption="A human wrote every rule"
              code={`def is_spam(email):
    if "lottery" in email:
        return True
    return False
# same input → same output, always`}
            />
          </MotionChild>
          <MotionChild>
            <CodePanel
              label="Intelligent · adaptive"
              caption="Rules learned from data"
              accent
              code={`def is_spam(email):
    return model.predict(email)

# model.fit(10_000 labelled emails)
# behaviour changes as data changes`}
            />
          </MotionChild>
        </Stagger>

        {/* The aha — withheld a beat behind the two panels, then resolved (P7). */}
        <Reveal>
          <Takeaway>
            The difference isn&rsquo;t <em>what</em> it does — it&rsquo;s{" "}
            <strong className="font-extrabold">who writes the rules</strong>. A
            human, or the data.
          </Takeaway>
        </Reveal>
      </Scene>

      {/* Scene 3 — the three goals. Kept (good content), tightened. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card tone="white" rotate={0.4}>
          <CardTitle>Reason</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Draw inferences from inputs — diagnose, rank, decide.
          </p>
        </Card>
        <Card tone="white" rotate={-0.4}>
          <CardTitle>Learn</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Update behaviour from new data instead of a re-write.
          </p>
        </Card>
        <Card tone="white" rotate={0.4}>
          <CardTitle>Perceive</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Turn raw pixels, audio, or text into usable structure.
          </p>
        </Card>
      </div>

      {/* Scene 4 — where the analogy breaks (P2). Required at intermediate. */}
      <Card tone="ash" rotate={-0.3}>
        <CardTitle>Where the &ldquo;think like a human&rdquo; analogy breaks</CardTitle>
        <ul className="space-y-1.5 text-sm font-medium leading-relaxed text-ink sm:text-[15px]">
          <li className="relative pl-5">
            <span aria-hidden="true" className="absolute left-0 top-[0.15em] text-xs text-ink">✦</span>
            &ldquo;Intelligent&rdquo; here means <strong className="font-bold">adaptive</strong>, not conscious.
            The spam filter doesn&rsquo;t <em>understand</em> email — it fits patterns.
          </li>
          <li className="relative pl-5">
            <span aria-hidden="true" className="absolute left-0 top-[0.15em] text-xs text-ink">✦</span>
            A system can be AI without being ML: hand-coded expert systems act
            &ldquo;smart&rdquo; but never learn. (We&rsquo;ll place that boundary in the last lesson.)
          </li>
        </ul>
      </Card>
    </Infographic>
  );
}
