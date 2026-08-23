import { Infographic, InfographicHeader, Card } from "./primitives";
import { PersonFigure, PictureCard, Scene, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 1: "You teach the chef, not build them".
 *
 * Through-line: one chef, two phases. The chef arrives already trained
 * (years of cooking) and only gets orientation in YOUR kitchen. The pictures
 * carry the proportions: giant prior learning, tiny personal adjustment.
 */
export function TuningNotBuilding() {
  return (
    <Infographic>
      <InfographicHeader
        title="You teach the chef, not build them"
        subtitle="The expensive learning already happened — you're doing orientation day"
      />

      {/* SCENE 1 — the chef arrives already trained */}
      <Scene caption="① The chef you hire already knows how to cook">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <PersonFigure label="a trained chef" />
          <SpeechBubble side="left">
            Sauces, knives, timing — years of it.
          </SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Nobody teaches cooking from zero on day one — the skill came with them.
        </p>
      </Scene>

      {/* SCENE 2 — your kitchen is what's new */}
      <Scene caption="② What they DON'T know is your kitchen">
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <PictureCard picture={<span className="text-3xl">🧂</span>} label="where the salt lives" tone="brand" />
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<span className="text-3xl">🥚</span>} label="how regulars like eggs" tone="brand" />
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<span className="text-3xl">📋</span>} label="your unwritten rules" tone="brand" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Small stuff — but it&apos;s the whole difference between their kitchen and yours.
        </p>
      </Scene>

      {/* SCENE 3 — orientation, not construction */}
      <Scene caption="③ Orientation week: a few examples of how YOU plate">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="rounded-xl bg-brand-wash px-4 py-3 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">your examples</div>
            <p className="mt-1 text-sm font-semibold text-ink">plate it like this ↓</p>
          </div>
          <PersonFigure label="the same chef" />
          <SpeechBubble side="left">Got it — your way, from now on.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The chef was never rebuilt. They were <span className="font-bold">adjusted</span>.
        </p>
      </Scene>

      {/* SCENE 4 — the proportions */}
      <Scene caption="④ Keep the proportions — they explain everything">
        <div className="flex items-stretch gap-3">
          <div className="flex-[3] rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">learning language itself</div>
            <p className="mt-1 text-sm font-semibold text-ink">mountains of text · giant computers · millions</p>
          </div>
          <div className="flex-[1] rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">your part</div>
            <p className="mt-1 text-sm font-semibold text-ink">a few hundred examples · an afternoon</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The giant slice is what makes your thin slice possible.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Fine-tuning never builds the chef — it runs{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">orientation in your kitchen</span>.
        </p>
      </Card>
    </Infographic>
  );
}
