/**
 * The anime.js leaf for the infographic layer — PROTOTYPE.
 *
 * Where motion.tsx is declarative (variants + whileInView), this leaf is the
 * engine for *choreographed* stories: one anime.js Timeline per stage that
 * plays like a short film (beats at absolute times, SVG line drawing, a signal
 * travelling a path). Attach the returned ref to the story root, build the
 * timeline in `setup`, and the leaf handles the lifecycle:
 *
 *  - prefers-reduced-motion → no timeline at all; the stage stays as its
 *    authored (fully readable) markup. Mirrors MotionConfig reducedMotion.
 *  - plays once when ~30% of the stage scrolls into view (like whileInView
 *    once), then never auto-replays.
 *  - reverts the timeline on unmount so anime-owned styles never leak.
 *
 * The scene component using this hook must itself be a Client Component
 * (setup is a function prop — it cannot cross the server→client boundary).
 * Unlike motion.tsx (the ONE client leaf everything imports), each anime
 * story scene is its own client file. That is the architectural cost of this
 * approach, accepted for story scenes only.
 *
 * Requires the `animejs` package (v4, MIT): npm install animejs
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import type { Timeline } from "animejs";

/** Scene-side choreography: add tweens to `tl` at absolute positions. */
export type AnimeStorySetup = (tl: Timeline, root: HTMLElement) => void;

/**
 * Owns one anime.js Timeline for a story stage.
 *
 * Returns:
 *  - `stageRef` — attach to the story root element (queries scope to it).
 *  - `reduced` — true when the user prefers reduced motion (render a static
 *    board and skip controls).
 *  - `playing` — whether the timeline is currently running.
 *  - `armed` — flips true the moment the story is first revealed.
 *  - `replay` / `toggle` / `seek(fraction 0..1)` — control bar helpers.
 */
export function useAnimeStory(setup: AnimeStorySetup) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<Timeline | null>(null);
  // setup closes over scene markup; keep it fresh without re-running the
  // effect (the timeline is built exactly once per mount).
  const setupRef = useRef(setup);
  setupRef.current = setup;

  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    const tl = createTimeline({
      autoplay: false,
      defaults: { ease: "outExpo", duration: 700 },
      onBegin: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onComplete: () => setPlaying(false),
    });
    tlRef.current = tl;
    setupRef.current(tl, root);

    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!done && entries[0]?.isIntersecting) {
          done = true;
          setArmed(true);
          tl.play();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      tl.revert();
      tlRef.current = null;
    };
  }, []);

  const replay = useCallback(() => {
    tlRef.current?.restart();
  }, []);

  const toggle = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.completed) tl.restart();
    else if (tl.paused) tl.play();
    else tl.pause();
  }, []);

  const seek = useCallback((fraction: number) => {
    const tl = tlRef.current;
    if (!tl || tl.duration <= 0) return;
    tl.pause();
    tl.seek(fraction * tl.duration);
  }, []);

  return { stageRef, reduced, playing, armed, replay, toggle, seek };
}
