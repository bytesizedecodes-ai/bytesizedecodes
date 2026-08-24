/**
 * PROTOTYPE — anime.js retelling of the layman course's Lesson 1
 * ("How a human learns"), the same story the shipped HowHumansLearn scene
 * tells with scroll reveals. Delete with /samples/anime-story.
 *
 * What this version demonstrates that motion/react does not:
 *  - ONE stage, ONE timeline: the story plays like a short film (~9s) with
 *    beats at absolute times, instead of 4 panels revealed by scroll.
 *  - Beat chips + status line are synced BY the timeline (not React state).
 *  - SVG line drawing (the signal path draws itself) + a dot travelling the
 *    path (svg.createMotionPath).
 *  - Video-style controls: replay, play/pause, scrub — timelines are seekable.
 *
 * Known cost vs the shipped scene: this file must be a Client Component and
 * owns imperative animation code; the shipped scene is a Server Component
 * that inherits motion from the shared Scene/Reveal primitives.
 */

"use client";

import { useCallback } from "react";
import { stagger, svg, utils } from "animejs";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useAnimeStory } from "@/components/infographic/anime";
import { PersonFigure, CarShape, BikeShape } from "@/components/infographic/scenes";

/** The four beats — chips render from this AND the timeline swaps the status
 *  line from it, so the strip and the film can never drift apart. */
const BEATS = [
  {
    chip: "① ??? — no idea yet",
    status: "A car rolls past. The child has no examples yet — only a guess.",
  },
  {
    chip: "② Examples, with names",
    status: "Four photos, each with its name. This is the “experience”.",
  },
  {
    chip: "③ A pattern forms",
    status: "Not memorising photos. Pulling out a rule: wheels + roof → car.",
  },
  {
    chip: "④ New photo → “BIKE!”",
    status: "A picture never seen before. The learned rule answers it instantly.",
  },
] as const;

export function AnimeHowHumansLearn() {
  const setup = useCallback((tl: Parameters<import("@/components/infographic/anime").AnimeStorySetup>[0], root: HTMLElement) => {
    const all = (name: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(`[data-a="${name}"]`));
    const one = (name: string) => all(name)[0]!;

    const bubble = one("bubble");
    const bubbleText = one("bubble-text");
    const status = one("status");
    const chips = all("chip");
    const cards = all("card");
    const signal = one("signal") as unknown as SVGCircleElement;
    const path = root.querySelector<SVGPathElement>('[data-a="signal-path"]')!;
    const drawable = svg.createDrawable(path);
    const { translateX, translateY } = svg.createMotionPath(path);

    /* Start states. Authored markup stays fully readable (reduced-motion
     * users and no-JS see a complete board); anime takes over from here. */
    utils.set(one("child"), { opacity: 0, y: 16 });
    utils.set(bubble, { opacity: 0, scale: 0.7, y: 8 });
    utils.set(cards, { opacity: 0, scale: 0.6, y: 10 });
    utils.set(one("pattern"), { opacity: 0, scale: 0.85 });
    utils.set(one("new"), { opacity: 0, x: 36 });
    utils.set(signal, { opacity: 0 });
    utils.set(one("takeaway"), { opacity: 0, y: 12 });
    utils.set(chips, { opacity: 0.4 });

    /* Timeline helpers: light the current chip, dim the previous one, and
     * swap the status line — all ON the timeline, so scrubbing stays in sync. */
    const activateChip = (i: number, at: number) => {
      tl.add(chips[i]!, { opacity: 1, duration: 350 }, at);
      if (i > 0) tl.add(chips[i - 1]!, { opacity: 0.4, duration: 350 }, at);
    };
    const say = (i: number, at: number) =>
      tl.add(
        status,
        {
          duration: 1,
          opacity: 1,
          onBegin: () => {
            status.textContent = BEATS[i]!.status;
          },
        },
        at,
      );

    /* Beat 1 — the child, empty-handed. The position-0 no-op also resets the
     * bubble text on every replay (the beat-4 swap is one-way). */
    tl.add(
      bubble,
      {
        duration: 1,
        opacity: 1,
        onBegin: () => {
          bubbleText.textContent = "???";
        },
      },
      0,
    );
    tl.add(one("child"), { opacity: 1, y: 0, duration: 600 }, 0);
    tl.add(bubble, { opacity: 1, scale: 1, y: 0, duration: 500 }, 350);
    say(0, 0);
    activateChip(0, 350);

    /* Beat 2 — labelled examples pop in. */
    tl.add(cards, { opacity: 1, scale: 1, y: 0, duration: 550, delay: stagger(150) }, 1500);
    say(1, 1500);
    activateChip(1, 1500);

    /* Beat 3 — the cards sink into a rule; the pattern chip lands. */
    tl.add(cards, { opacity: 0, scale: 0.25, y: -8, duration: 480, ease: "inQuad", delay: stagger(90) }, 3500);
    tl.add(one("pattern"), { opacity: 1, scale: 1, duration: 550, ease: "outBack(1.6)" }, 4050);
    say(2, 4050);
    activateChip(2, 4050);

    /* Beat 4 — a NEW photo arrives, the path draws, a signal rides it,
     * and the bubble flips from ??? to the answer. */
    tl.add(drawable, { draw: "0 0", duration: 10 }, 0);
    tl.add(one("new"), { opacity: 1, x: 0, duration: 600, ease: "outCubic" }, 5600);
    tl.add(drawable, { draw: "0 1", duration: 1100, ease: "inOutQuad" }, 6300);
    tl.add(signal, { opacity: 1, duration: 150 }, 6400);
    tl.add(signal, { translateX, translateY, duration: 1100, ease: "inOutQuad" }, 6500);
    tl.add(signal, { opacity: 0, duration: 200 }, 7650);
    tl.add(
      bubble,
      {
        scale: 0,
        duration: 160,
        ease: "inQuad",
        onComplete: () => {
          bubbleText.textContent = "It's a BIKE! 🎉";
        },
      },
      7750,
    );
    tl.add(bubble, { scale: 1, duration: 380, ease: "outBack(2)" }, 7930);
    say(3, 7750);
    activateChip(3, 7750);

    /* Coda — the one-line takeaway lands last. */
    tl.add(one("takeaway"), { opacity: 1, y: 0, duration: 600 }, 8600);
  }, []);

  const { stageRef, reduced, playing, replay, toggle, seek } = useAnimeStory(setup);

  return (
    <div ref={stageRef} className="not-prose">
      {/* Story map — the chips light up in sync with the film. */}
      <ol aria-label="Story beats" className="flex flex-wrap gap-1.5 sm:gap-2">
        {BEATS.map((beat) => (
          <li
            key={beat.chip}
            data-a="chip"
            className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-1.5 text-[11px] font-semibold text-ink-soft"
          >
            {beat.chip}
          </li>
        ))}
      </ol>

      {/* The one stage — scenes change STATE here, the layout never moves. */}
      <div className="relative mt-3 min-h-[430px] overflow-hidden rounded-2xl border border-ash bg-surface-elevated px-4 py-5 shadow-sm sm:min-h-[400px]">
        <p
          data-a="status"
          className="mx-auto min-h-[2.5rem] max-w-md text-center text-sm font-semibold text-ink"
        >
          A car rolls past. The child has no examples yet — only a guess.
        </p>

        {/* Signal path: new photo → child → bubble. Draws itself in beat 4. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            data-a="signal-path"
            d="M 74 72 C 60 68, 34 62, 26 46 C 21 34, 26 20, 33 13"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle data-a="signal" r="2.4" cx="0" cy="0" fill="var(--color-brand)" />
        </svg>

        {/* The child */}
        <div data-a="child" className="absolute left-[4%] top-[36%]">
          <PersonFigure label="the child" />
        </div>

        {/* The speech bubble — swaps text in beat 4 */}
        <div
          data-a="bubble"
          className="absolute left-[26%] top-[12%] w-36 rounded-2xl border border-ash bg-brand-wash px-3 py-2 text-center text-sm font-bold text-ink sm:w-40"
        >
          <span data-a="bubble-text">???</span>
        </div>

        {/* The four labelled examples */}
        <div className="absolute right-[3%] top-[16%] grid w-[40%] grid-cols-2 gap-2">
          {(
            [
              { shape: <CarShape className="h-8 w-auto" />, label: "car" },
              { shape: <CarShape className="h-8 w-auto" />, label: "car" },
              { shape: <BikeShape className="h-8 w-auto" />, label: "bike" },
              { shape: <BikeShape className="h-8 w-auto" />, label: "bike" },
            ] as const
          ).map((card, i) => (
            <div
              key={i}
              data-a="card"
              className="flex flex-col items-center gap-1 rounded-xl border border-ash bg-surface-elevated p-2 shadow-sm"
            >
              {card.shape}
              <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold text-ink">
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* The pattern the child extracts */}
        <div
          data-a="pattern"
          className="absolute left-[36%] top-[56%] rounded-xl bg-brand-wash px-3 py-2 text-center text-xs font-semibold leading-relaxed text-ink sm:text-sm"
        >
          4 wheels + roof → car
          <br />
          2 wheels → bike
        </div>

        {/* The brand-new photo */}
        <div
          data-a="new"
          className="absolute bottom-[6%] right-[4%] flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-brand p-2"
        >
          <BikeShape className="h-12 w-auto" />
          <span className="rounded-full bg-good px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-canvas">
            new!
          </span>
        </div>
      </div>

      {/* Takeaway — the last beat */}
      <div
        data-a="takeaway"
        className="mt-4 rounded-2xl bg-brand px-5 py-4 text-center shadow-sm"
      >
        <p className="text-sm font-bold text-ink sm:text-base">
          🧠 Learning = experience improves the <span className="underline decoration-brand-deep decoration-2 underline-offset-2">next</span> decision.
        </p>
      </div>

      {/* Controls — timelines are seekable, so the story works like a video. */}
      {reduced ? (
        <p className="mt-3 text-xs text-ink-soft">
          Reduced motion is on — the full story stays open as a static board.
        </p>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={replay}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ash bg-surface-elevated text-ink transition-colors hover:bg-brand-wash"
            aria-label="Replay the story"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ash bg-surface-elevated text-ink transition-colors hover:bg-brand-wash"
            aria-label={playing ? "Pause the story" : "Play the story"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <input
            type="range"
            min={0}
            max={1000}
            defaultValue={0}
            onChange={(e) => seek(Number(e.target.value) / 1000)}
            aria-label="Scrub the story"
            className="flex-1 accent-brand"
          />
          <span className="hidden text-[11px] text-ink-soft sm:inline">
            scrubbing moves the picture — captions re-sync on the next play
          </span>
        </div>
      )}
    </div>
  );
}
