import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { PersonFigure, MachineFigure, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 7: "Is the answer good?" (evaluation)
 * (v2 Thread retrofit)
 *
 * Through-line stage: Mitra's two capital-of-Australia answers, side by side
 * from scene one. The rubric scene grades THOSE same answers (four sharp
 * checks), and the reviewer scene shows who applies them. Beats: hook (two
 * tidy answers, Nisha unsure) → reveal (the rubric makes "good" checkable) →
 * fade (human reviewer, AI judge, or both). Brand accent only; checkmarks
 * are brand, not green, to keep one accent per scene.
 */
export function IsTheAnswerGood() {
  return (
    <Infographic>
      <InfographicHeader
        title="“Is the answer good?” is the hard question"
        subtitle="Break it into checks, then ask a reviewer"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🤷</span>, label: "Two tidy answers" },
          { icon: <span aria-hidden="true">📋</span>, label: "Rubric of checks" },
          { icon: <span aria-hidden="true">⚖️</span>, label: "Human or AI judge" },
        ]}
      />

      {/* Hook — "good" is fuzzy by gut */}
      <Scene caption="So Nisha reads two of Mitra’s answers — both read well. Which is ‘good’?">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <AnswerCard text="“Sydney is the capital of Australia.”" />
          <AnswerCard text="“Canberra is the capital of Australia.”" />
        </div>
        <div className="mt-3 flex justify-center">
          <PersonFigure label="Nisha: unsure" />
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink-soft">
          Both are grammatically fine. ‘Good’ is too fuzzy to measure by feeling.
        </p>
      </Scene>

      {/* Reveal — a rubric breaks "good" into checks, for those same answers */}
      <Scene variant="continue" caption="Then a rubric turns ‘good’ into checkable parts.">
        <Stagger className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <MotionChild>
            <Check label="Correct" />
          </MotionChild>
          <MotionChild>
            <Check label="Helpful" />
          </MotionChild>
          <MotionChild>
            <Check label="On-topic" />
          </MotionChild>
          <MotionChild>
            <Check label="Safe" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Now each answer is graded against the same four checks — no more guessing.
        </p>
      </Scene>

      {/* Fade — two reviewers: human, or AI-as-judge */}
      <Scene variant="continue" caption="That’s why a reviewer applies the checks — a careful human, or a fast AI judge.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <div className="flex flex-col items-center gap-2">
            <PersonFigure label="human reviewer" />
            <span className="text-xs font-medium text-ink-soft">careful, but slow</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MachineFigure label="AI as judge" />
            <span className="text-xs font-medium text-ink-soft">fast, but not perfect</span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Both apply the same rubric. Teams usually blend the two.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Evaluation means turning “is it good?” into “does it pass these
          checks?” — and getting a reviewer, human or AI, to answer.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function AnswerCard({ text }: { text: string }) {
  return (
    <div className="max-w-[14rem] rounded-xl border border-ash bg-surface-elevated px-3 py-2 text-center">
      <p className="text-sm font-semibold text-ink">{text}</p>
    </div>
  );
}

function Check({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-ash bg-surface-elevated px-3 py-2">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20,6 9,17 4,12" />
      </svg>
      <span className="text-sm font-bold text-ink">{label}</span>
    </div>
  );
}
