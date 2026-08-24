/**
 * v2 asset — the Thread contract skeleton (beginner): how a lesson component
 * opens with the playful StoryMap journey strip and alternates
 * chapter/continue scenes so the pictures read as ONE story.
 *
 * The canonical primitives live in the repo at
 * `components/infographic/scenes.tsx` (Scene, StoryMap, StoryMapStep) —
 * import from there; do not copy this file into the repo. This asset
 * documents the v2 shape for lesson authors and the infographic-scaffolder.
 *
 * Rules encoded below (SKILL.md §2.3):
 *   1. StoryMap journey strip directly under InfographicHeader — 3–5 slots,
 *      ≤4 words, playful icons.
 *   2. Every caption opens with a simple connective (So/But/Then/That's why).
 *   3. One stable stage: the anchor object keeps its place all lesson;
 *      chapter scenes open beats, continue scenes keep the stage going.
 *   4. One accented change per scene; the "before" GHOSTS (dim outline)
 *      when something is replaced or compared.
 *   5. Character and color constancy — no surprise cast, same colors.
 */

import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "../primitives";
import { Scene, StoryMap } from "../scenes";

export function LessonTemplate() {
  return (
    <Infographic>
      <InfographicHeader
        title="TODO: the lesson's everyday question"
        subtitle="TODO: one friendly line with the stake"
      />

      {/* 1 — the journey strip: the whole little story at a glance. */}
      <StoryMap
        steps={[
          { label: "TODO — the moment", icon: <>📱</> },
          { label: "TODO — the trouble", icon: <>😅</> },
          { label: "TODO — the trick", icon: <>💡</> },
          { label: "TODO — the win", icon: <>✅</> },
        ]}
      />

      {/* 2 — chapter scene: the hook + the anchor object ON STAGE.
          The anchor keeps this position and shape for the whole lesson. */}
      <Scene caption="① TODO — a relatable moment, ≤3 elements">
        {/* TODO: PersonFigure / the anchor object (CarShape, whiteboard…) */}
      </Scene>

      {/* 3 — continue scene: SAME stage, ONE new change (accented). */}
      <Scene variant="continue" caption="② But TODO — the trouble appears, visibly">
        {/* TODO: one change, accented; everything else neutral */}
      </Scene>

      {/* 4 — continue scene: the reveal. The "before" GHOSTS beside the
          after — seeing both is the lesson. */}
      <Scene variant="continue" caption="③ So TODO — the trick, shown in the picture">
        {/* TODO: old state as dim ghost (opacity-40, dashed border) + new state accented */}
      </Scene>

      {/* 5 — chapter scene: the resolution back at the opening moment. */}
      <Scene caption="④ That's why TODO — the idea in one plain sentence">
        {/* TODO: the stage in its "understood" state */}
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>TODO: the aha in one friendly line.</Takeaway>
      </Card>
    </Infographic>
  );
}
