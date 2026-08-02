import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  CodePanel,
  Takeaway,
} from "./primitives";
import { Scene, Operator } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Lesson infographic: "What is ML?" (intermediate course).
 *
 * Split into one concept per scene (P3), using the signature motion beats the
 * skill calls for:
 *  - "Data + Algorithm → Model" built with Operator + Stagger — the formula
 *    build (skill §5 signature beat, P6 segmenting).
 *  - The training pipeline as a Stagger — each step lands one beat (P6).
 *  - The three families get their own scene (they're a full lesson in the
 *    layman course; cramming them into bullet cards was overload).
 *  - Short code via the shared CodePanel primitive (intermediate allowance).
 *
 * Visual cohesion: CodePanel + Takeaway match the rest of the course.
 */
export function WhatIsML() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Machine Learning?"
        subtitle="The system discovers the rules — the programmer supplies the data"
      />

      {/* Scene 1 — the formula build (signature beat). */}
      <Scene caption="The whole idea, as one line">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <FormulaBox label="Data" sub="labelled examples" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <FormulaBox label="Algorithm" sub="a learning procedure" tone="white" />
          </MotionChild>
          <MotionChild>
            <Operator>→</Operator>
          </MotionChild>
          <MotionChild>
            <FormulaBox label="Model" sub="rules it learned itself" tone="brand" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          The model is the output. Nobody wrote its rules by hand.
        </p>
      </Scene>

      {/* Scene 2 — the formal layer (code). Intermediate allowance.
          `model.fit` learns; `model.predict` applies. Two beats.
          Uses the shared CodePanel primitive (matches Lesson 1 + the app's code style). */}
      <Scene caption="In code, it's two calls">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <CodePanel
              label="Train · learn the rules"
              caption="The algorithm fits patterns from labelled examples"
              code={`model.fit(X_train, y_train)
# the algorithm fits patterns
# from labelled examples`}
            />
          </MotionChild>
          <MotionChild>
            <CodePanel
              label="Infer · apply them"
              caption="No labels given here — the model decides"
              accent
              code={`prediction = model.predict(x_new)
# no labels given here —
# the model decides`}
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 3 — the pipeline, segmented (P6). */}
      <Scene caption="The training pipeline — one step at a time">
        <Stagger className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
          {[
            { n: "1", label: "Collect", detail: "labelled data" },
            { n: "2", label: "Fit", detail: "run algorithm" },
            { n: "3", label: "Model", detail: "rules learned" },
            { n: "4", label: "Predict", detail: "new inputs" },
          ].map((step, i, arr) => (
            <MotionChild key={step.n} as="div">
              <div className="contents">
                <div className="flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-canvas sm:flex-col sm:gap-0.5 sm:py-3.5">
                  <span className="text-[10px] font-extrabold text-canvas/70">
                    {step.n}
                  </span>
                  <span>{step.label}</span>
                  <span className="text-[10px] font-medium text-canvas/80">
                    {step.detail}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span
                    className="mx-auto text-xl font-bold text-ink sm:mx-0"
                    aria-hidden="true"
                  >
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                )}
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* Scene 4 — the three families. Their OWN scene now. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card tone="white" rotate={0.4}>
          <CardTitle>Supervised</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Learns from <strong className="font-bold">labelled</strong> examples.
            Output = a label or a number.
          </p>
        </Card>
        <Card tone="white" rotate={-0.4}>
          <CardTitle>Unsupervised</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            No labels. Finds <strong className="font-bold">structure</strong> —
            clusters, groupings.
          </p>
        </Card>
        <Card tone="white" rotate={0.4}>
          <CardTitle>Reinforcement</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Learns by trial and error, guided by{" "}
            <strong className="font-bold">reward</strong>.
          </p>
        </Card>
      </div>

      {/* The aha — withheld behind the families, then resolved (P7).
          Shared Takeaway primitive for course-wide cohesion. */}
      <Reveal>
        <Takeaway>
          The family is decided by{" "}
          <strong className="font-extrabold">what feedback the data gives</strong>:
          labels, nothing, or rewards.
        </Takeaway>
      </Reveal>
    </Infographic>
  );
}

/* ------------------------------------------------------------------ */
/* Local helper — a formula box for the Data + Algorithm → Model line. */
/* ------------------------------------------------------------------ */

function FormulaBox({
  label,
  sub,
  tone,
}: {
  label: string;
  sub: string;
  tone: "white" | "brand";
}) {
  const cls =
    tone === "brand"
      ? "border-brand bg-brand-wash"
      : "border-ash bg-surface-elevated";
  return (
    <div className={`flex min-w-[7rem] flex-col items-center rounded-xl border px-5 py-3.5 text-center shadow-sm ${cls}`}>
      <span className="text-base font-extrabold text-ink sm:text-lg">{label}</span>
      <span className="mt-0.5 text-[11px] font-medium text-ink-soft">{sub}</span>
    </div>
  );
}
