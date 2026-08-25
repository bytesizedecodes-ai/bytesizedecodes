import { Infographic, InfographicHeader } from "./primitives";
import {
  PersonFigure,
  CarShape,
  BikeShape,
  SpeechBubble,
  PictureCard,
  Scene,
  StoryMap,
} from "./scenes";

/**
 * Layman course — Lesson 1: "How a human learns" (v2 Thread retrofit).
 *
 * Through-line stage: Ishaan — Asha's son, the course's original learning
 * machine — meets the same street objects all lesson (the car, the delivery
 * bike). His state changes: blank (???) → shown labelled cards → pattern
 * formed → nails a brand-new photo. Beats: hook (asked, no idea) → anchor
 * (labelled examples arrive) → reveal (the pattern forms) → resolution (new
 * photo, right answer). Course cast introduced here: Asha's tiffin service,
 * Ishaan the learner, and the vehicles that keep stopping by.
 */
export function HowHumansLearn() {
  return (
    <Infographic>
      <InfographicHeader
        title="How a human learns"
        subtitle="Watch Ishaan go from 'no idea' to 'got it' — that's learning"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🧒</span>, label: "Ishaan doesn't know" },
          { icon: <span aria-hidden="true">🖼️</span>, label: "Show labelled examples" },
          { icon: <span aria-hidden="true">💡</span>, label: "Spot the pattern" },
          { icon: <span aria-hidden="true">✅</span>, label: "Nail a new one" },
        ]}
      />

      {/* SCENE 1 — Ishaan doesn't know yet */}
      <Scene caption="So ask Ishaan: what is this object?">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <CarShape />
          <PersonFigure label="Ishaan" />
          <SpeechBubble side="left">???</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          No experience yet → can&apos;t decide.
        </p>
      </Scene>

      {/* SCENE 2 — show examples */}
      <Scene variant="continue" caption="Then show him a few labelled examples">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <PictureCard picture={<CarShape />} label="car" tone="brand" />
          <PictureCard picture={<CarShape />} label="car" tone="brand" />
          <PictureCard picture={<BikeShape />} label="bike" tone="brand" />
          <PictureCard picture={<BikeShape />} label="bike" tone="brand" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A few examples, each with its name. That&apos;s the &ldquo;experience&rdquo;.
        </p>
      </Scene>

      {/* SCENE 3 — the pattern forms */}
      <Scene variant="continue" caption="So a pattern forms — Ishaan spots it">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <div className="flex-1 rounded-xl bg-brand-wash p-4 text-center">
            <CarShape className="mx-auto" />
            <p className="mt-2 text-xs font-semibold text-ink">
              4 wheels + roof → car
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-brand-wash p-4 text-center">
            <BikeShape className="mx-auto" />
            <p className="mt-2 text-xs font-semibold text-ink">
              2 wheels + no roof → bike
            </p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Not memorising each photo — extracting a general rule.
        </p>
      </Scene>

      {/* SCENE 4 — now they can answer on a NEW example */}
      <Scene caption="That's why a brand-new photo — and Ishaan nails it">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex flex-col items-center gap-2">
            <CarShape />
            <span className="rounded-full bg-good px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-canvas">
              new!
            </span>
          </div>
          <PersonFigure label="Ishaan" />
          <SpeechBubble side="left">It&apos;s a CAR! 🎉</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A picture never seen before — handled from the learned pattern.
        </p>
      </Scene>

      {/* The one-line takeaway */}
      <div className="rounded-2xl bg-brand px-5 py-4 text-center shadow-sm">
        <p className="text-sm font-bold text-ink sm:text-base">
          🧠 <span className="underline decoration-brand-deep decoration-2 underline-offset-2">Learning</span> = using past
          experience to decide about new things.
        </p>
      </div>
    </Infographic>
  );
}
