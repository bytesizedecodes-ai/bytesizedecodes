import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap, PersonFigure, MachineFigure, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 1: "What is an AI Harness?"
 * (v2 Thread retrofit)
 *
 * Course cast: Divya's small team ships Vaani, a chat product. Through-line
 * stage: Vaani's engine — one model figure, same spot, three states: bare on
 * the bench (hook) → the car's layers assembling around it (reveal) → the
 * finished car Divya's team ships (resolution). The engine-and-car anchor:
 * instructions (the dashboard), memory (the mirrors), tools (the wheels),
 * rules (the brakes). Brand blue accent only; good/bad never needed here.
 * Beginner density: ~3 elements per scene.
 */
export function WhatIsAnAgentHarness() {
  return (
    <Infographic>
      <InfographicHeader
        title="The engine and the car"
        subtitle="A model is an engine. A harness is the car built around it."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🔩</span>, label: "Engine on a bench" },
          { icon: <span aria-hidden="true">🧱</span>, label: "Build the car" },
          { icon: <span aria-hidden="true">🚗</span>, label: "Vaani drives off" },
        ]}
      />

      {/* Scene 1 — hook + anchor: the engine on the bench */}
      <Scene caption="So Divya's team unboxes Vaani's engine — brilliant, but bolted to a bench.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <PersonFigure label="Divya" />
          <SpeechBubble side="right" className="max-w-[16rem] text-center">
            What&apos;s the weather tomorrow? And what did I ask you five minutes ago?
          </SpeechBubble>
          <MachineFigure confused label="Vaani's raw model" />
        </div>
        <p className="mt-4 text-center text-sm font-medium leading-relaxed text-ink sm:text-[15px]">
          The model is amazing at one thing — predicting text. But on its own it
          <span className="font-bold"> can&apos;t remember </span>
          between turns,
          <span className="font-bold"> can&apos;t act </span>
          on the world, and
          <span className="font-bold"> knows nothing new</span>.
        </p>
      </Scene>

      {/* Scene 2 — the reveal: layers assembled around the model */}
      <Scene
        variant="continue"
        caption="Then they build the rest of the car around that same engine."
      >
        <div className="mb-3 flex justify-center">
          <MachineFigure label="same engine, same spot" />
        </div>
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MotionChild>
            <LayerCard icon="🧭" title="Instructions" note="who to be and how to behave — the dashboard" />
          </MotionChild>
          <MotionChild>
            <LayerCard icon="🪞" title="Memory" note="the conversation so far, fed back every turn — the mirrors" />
          </MotionChild>
          <MotionChild>
            <LayerCard icon="🔧" title="Tools" note="search, calculator, real actions — the wheels" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          …plus <span className="font-bold text-ink">rules</span> that stop it doing anything harmful — the brakes.
        </p>
      </Scene>

      {/* Scene 3 — resolution: the whole machine */}
      <Scene caption="That's why Vaani, the car the team ships, is drivable — nobody drives an engine.">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <MachineFigure className="mx-auto" label="Vaani — model + harness" />
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink sm:text-base">
            When Vaani remembers your name, checks a fact, or books a
            table — the <span className="font-bold">model predicted the words</span>, but the{" "}
            <span className="font-bold">harness did the work</span>.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The one-line map</CardTitle>
        <Takeaway>
          Model = engine. Harness = the car around it. Vaani — the product you use — is the car.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One labelled layer of the harness, assembled in the stagger build. */
function LayerCard({
  icon,
  title,
  note,
}: {
  icon: string;
  title: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <div className="mt-1 text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
