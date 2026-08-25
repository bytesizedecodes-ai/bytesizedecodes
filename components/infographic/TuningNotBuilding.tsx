import { Infographic, InfographicHeader, Card } from "./primitives";
import { PersonFigure, PictureCard, Scene, StoryMap, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 1: "You teach the chef, not build them"
 * (v2 Thread retrofit).
 *
 * Through-line stage: the new chef, center stage for the whole lesson — the
 * course cast lands here. Rasoi Express (Arjun's Pune cloud kitchen) hires a
 * chef who already cooks; the only change per scene is what the kitchen adds
 * to them: the quirks cards (accented), the orientation examples, then the
 * proportions bar. The chef never moves, never gets rebuilt — orientation,
 * not construction.
 */
export function TuningNotBuilding() {
  return (
    <Infographic>
      <InfographicHeader
        title="You teach the chef, not build them"
        subtitle="The expensive learning already happened — you're doing orientation day"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">👨‍🍳</span>, label: "The chef already cooks" },
          { icon: <span aria-hidden="true">🧂</span>, label: "Arjun's kitchen differs" },
          { icon: <span aria-hidden="true">📋</span>, label: "Orientation, not building" },
          { icon: <span aria-hidden="true">⚖️</span>, label: "Keep the proportions" },
        ]}
      />

      {/* SCENE 1 — the chef arrives already trained */}
      <Scene caption="So Arjun opens Rasoi Express and hires a chef who already cooks.">
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
      <Scene variant="continue" caption="But the chef has never seen THIS kitchen — Arjun's salt shelf, Arjun's regulars.">
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
      <Scene variant="continue" caption="Then orientation week: a few examples of how Rasoi Express plates.">
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
      <Scene variant="continue" caption="That's why the proportions matter — the giant slice came first.">
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
