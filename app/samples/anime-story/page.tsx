import { HowHumansLearn } from "@/components/infographic/HowHumansLearn";
import { MotionProvider } from "@/components/infographic/motion";
import { AnimeHowHumansLearn } from "./AnimeHowHumansLearn";

/**
 * PROTOTYPE — anime.js storytelling vs the shipped motion system.
 * Same lesson (layman ML, Lesson 1: "How a human learns"), two motion
 * systems. Delete this directory with the rest of /samples when decided.
 *
 *   A — shipped: motion/react scroll reveals. Four panels; each fades up
 *       once as you scroll. Server-rendered, declarative, zero JS in the
 *       scene file itself.
 *   B — prototype: one anime.js timeline. One stage, the story plays like
 *       a ~9s film (beats, SVG line drawing, a signal riding a path),
 *       with replay / pause / scrub controls.
 */
export default function AnimeStorySamplePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
          Motion prototype
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          anime.js storytelling
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          The same beginner-ML lesson told twice. Scroll through <strong>A</strong> to
          feel the shipped rhythm; then watch <strong>B</strong> play as one
          choreographed story. anime.js v4 is MIT-licensed, ~24.5 KB modular.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          A — shipped · motion/react scroll reveals
        </h2>
        <MotionProvider>
          <HowHumansLearn />
        </MotionProvider>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          B — prototype · anime.js timeline (plays once on view; then it&apos;s yours to scrub)
        </h2>
        <AnimeHowHumansLearn />
      </section>

      <footer className="mt-12 rounded-2xl border border-ash bg-surface-elevated p-5 text-sm text-ink-soft">
        <p className="font-semibold text-ink">What to compare</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            A is four independent panels — the learner sets the pace by scrolling.
            B is one film — the timing is authored, and every beat is exact.
          </li>
          <li>
            B&apos;s beat chips, status line, path drawing and bubble flip are all
            synced by the same timeline — scrub the slider and watch all of them
            move together.
          </li>
          <li>
            Cost: A is a Server Component with zero animation code. B must be a
            Client Component and owns ~120 lines of imperative choreography.
          </li>
        </ul>
        <p className="mt-3 text-xs">
          Prototype only — nothing on the real lesson routes changed.
        </p>
      </footer>
    </div>
  );
}
