import { Infographic, InfographicHeader, Card } from "./primitives";
import { PersonFigure, MachineFigure, Scene, StoryMap, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 2: "The model already read (almost)
 * everything" (v2 Thread retrofit).
 *
 * Through-line stage: Rasoi Express's order assistant, same spot every scene.
 * States: well-read and chatty → confused when asked about the kitchen's own
 * world (Arjun's menu, Arjun's rules) → the library's last-day cards → the
 * read/never-read gap framed around Arjun. Wide public reading, zero personal
 * knowledge — the space fine-tuning works in.
 */
export function TheModelReadEverything() {
  return (
    <Infographic>
      <InfographicHeader
        title="The model already read (almost) everything"
        subtitle="You're hiring a well-read stranger, not a blank slate"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">📚</span>, label: "Read the library" },
          { icon: <span aria-hidden="true">🙈</span>, label: "Never met Rasoi" },
          { icon: <span aria-hidden="true">🚪</span>, label: "The last day" },
          { icon: <span aria-hidden="true">🕳️</span>, label: "The gap to fill" },
        ]}
      />

      {/* SCENE 1 — the library inside */}
      <Scene caption="So before Arjun ever meets it, the order assistant read the city library.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <MachineFigure label="the order assistant" />
          <SpeechBubble side="left">
            Cricket, contracts, Spanish rhymes — ask away.
          </SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The expensive learning (language, public knowledge) arrived before you did.
        </p>
      </Scene>

      {/* SCENE 2 — but never met you */}
      <Scene variant="continue" caption="But ask about Rasoi Express's own world — silence.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <MachineFigure label="the same assistant" confused />
          <SpeechBubble side="left">
            Arjun&apos;s menu? His regulars? Never read them.
          </SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Not dumb — never introduced. Wide reading, zero personal knowledge.
        </p>
      </Scene>

      {/* SCENE 3 — the stop date */}
      <Scene variant="continue" caption="Then check the library card — it has a LAST DAY.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">📰</span>
              <p className="mt-1 text-xs font-semibold text-ink">last night&apos;s news</p>
              <p className="text-[11px] font-medium text-ink-soft">outside the walls</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">💸</span>
              <p className="mt-1 text-xs font-semibold text-ink">today&apos;s price change</p>
              <p className="text-[11px] font-medium text-ink-soft">outside the walls</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">📝</span>
              <p className="mt-1 text-xs font-semibold text-ink">the menu Arjun just edited</p>
              <p className="text-[11px] font-medium text-ink-soft">outside the walls</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Memory closes like a library that stopped buying books — famous or not, new is new.
        </p>
      </Scene>

      {/* SCENE 4 — the gap is the workspace */}
      <Scene variant="continue" caption="That's why the gap is the workspace — everything public read, nothing of Arjun's.">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="rounded-xl bg-brand-wash px-4 py-3 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">read</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">everything public</p>
          </div>
          <PersonFigure className="h-16" label="Arjun" />
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">never read</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">anything yours</p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          A well-read stranger:{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">brilliant and current to its last day</span>{" "}
          — and it has never met you.
        </p>
      </Card>
    </Infographic>
  );
}
