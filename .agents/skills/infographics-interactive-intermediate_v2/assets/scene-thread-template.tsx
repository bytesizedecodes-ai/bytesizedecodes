/**
 * v2 asset — the Thread contract skeleton: how a lesson component opens with
 * the StoryMap strip and alternates chapter/continue scenes so the lesson
 * reads as one connected story.
 *
 * The canonical primitives live in the repo at
 * `components/infographic/scenes.tsx` (Scene, StoryMap, StoryMapStep) —
 * import from there; do not copy this file into the repo. This asset
 * documents the v2 shape for lesson authors and the infographic-scaffolder.
 *
 * Rules encoded below (SKILL.md §2.4):
 *   1. StoryMap directly under InfographicHeader — 3–5 slots, ≤4 words each.
 *   2. Every caption opens with a connective (So/But/Because/That's why),
 *      plus "Rung N of M" when the ladder is the spine.
 *   3. One stable stage: the through-line object keeps position/identity;
 *      chapter scenes open beats, continue scenes keep the stage.
 *   4. One accented delta per scene; the prior state GHOSTS (dim outline)
 *      when a value changes.
 */

import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "../primitives";
import { Scene, StoryMap } from "../scenes";

export function LessonTemplate() {
  return (
    <Infographic>
      <InfographicHeader
        title="TODO: the lesson's question"
        subtitle="TODO: the case, one line — re-entered via the case-so-far strip"
      />

      {/* 1 — the story map: the arc at a glance. Slot labels are promises
          the scene captions below must pay off (reuse the words). */}
      <StoryMap
        steps={[
          { label: "TODO slot 1 — the situation" },
          { label: "TODO slot 2 — the puzzle" },
          { label: "TODO slot 3 — the mechanism" },
          { label: "TODO slot 4 — the payoff" },
        ]}
      />

      {/* 2 — chapter scene: opens the beat, establishes the STAGE.
          The through-line object drawn here keeps this position all lesson. */}
      <Scene caption="① TODO — the situation, in the case's own terms">
        {/* TODO: the stage at rest — same object, same positions every scene */}
      </Scene>

      {/* 3 — continue scene: SAME stage, one accented delta.
          Note the connective (But/So/Because) opening the caption. */}
      <Scene variant="continue" caption="② But TODO — the tempting reading, visibly failing">
        {/* TODO: the delta takes the accent; everything inherited stays neutral.
            When a value changes, ghost the previous state:
            <span className="opacity-40 [text-decoration-line:line-through]">old</span> */}
      </Scene>

      {/* 4 — continue scene: the ladder rail (intermediate/expert).
          Each rung ACCUMULATES on stage — established rungs dim, the rung
          under construction takes the accent; nothing disappears. */}
      <Scene variant="continue" caption="Rung 2 of 4 — because TODO(rung 1), TODO(consequence)">
        {/* TODO: the rail-so-far (compact stack), new rung accented */}
      </Scene>

      {/* 5 — chapter scene may close the arc (Transfer/Resolution). */}
      <Scene caption="⑤ That's why TODO — the capability, one line">
        {/* TODO: the stage in its "understood" state */}
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>TODO: the top rung / aha in one sentence.</Takeaway>
      </Card>
    </Infographic>
  );
}
