/**
 * v2 asset — the Thread contract skeleton (expert): how a lesson component
 * opens with the terse agenda StoryMap and runs the derivation as one
 * ACCUMULATING CONSTRAINT LEDGER on a stable architecture stage.
 *
 * The canonical primitives live in the repo at
 * `components/infographic/scenes.tsx` (Scene, StoryMap, StoryMapStep) —
 * import from there; do not copy this file into the repo. This asset
 * documents the v2 shape for lesson authors and the infographic-scaffolder.
 *
 * Rules encoded below (SKILL.md §2.4):
 *   1. Agenda StoryMap directly under InfographicHeader — 3–5 terse claims,
 *      the conclusion last. No icons.
 *   2. Every caption opens with an argument connective (So/But/Because/
 *      Therefore) + "Rung N" when the ledger is the spine.
 *   3. One architecture stage: same topology all lesson; scenes SLICE it,
 *      never redraw it.
 *   4. One accented delta per scene, GHOST-DIFFED — the previous state
 *      stays visible dimmed so the delta is an argument.
 *   5. Notation pre-stage binds every symbol before its formula; the ledger
 *      accumulates; the Boundary beat STRIKES the row that flips.
 */

import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "../primitives";
import { Scene, StoryMap } from "../scenes";

export function LessonTemplate() {
  return (
    <Infographic>
      <InfographicHeader
        title="TODO: the failing system / design tension — no warm-up"
        subtitle="TODO: the case-so-far strip (✓ prior constraints · + today's)"
      />

      {/* 1 — the agenda: the whole argument at a glance, conclusion last. */}
      <StoryMap
        steps={[
          { label: "TODO claim 1" },
          { label: "TODO claim 2" },
          { label: "TODO claim 3" },
          { label: "TODO — the conclusion" },
        ]}
      />

      {/* 2 — chapter scene: problem-first. The architecture topology drawn
          here keeps its positions for the whole lesson. */}
      <Scene caption="① TODO — the hard evidence (trace, metrics, drop)">
        {/* TODO: the case architecture at rest; the failing span marked */}
      </Scene>

      {/* 3 — continue scene: SAME topology, the span under argument
          accented, everything else dimmed but present. */}
      <Scene variant="continue" caption="② But TODO — the reflex, and what the evidence says instead">
        {/* TODO: one accented delta on the same stage */}
      </Scene>

      {/* 4 — continue scene: the LEDGER accumulates — constraint → forced
          consequence rows stack; established rows dim, the row under
          argument takes the accent; nothing disappears. */}
      <Scene variant="continue" caption="Rung 3 of 4 — because TODO(prior row), TODO(forced consequence)">
        {/* TODO: ledger-so-far (compact rows) + the picture state it forces */}
      </Scene>

      {/* 5 — continue scene: the BOUNDARY strikes the row whose constraint,
          relaxed, flips the conclusion. Mandatory. */}
      <Scene variant="continue" caption="⑤ Therefore TODO — until TODO(constraint) relaxes; then TODO(flipped)">
        {/* TODO: struck row (line-through, semantic-bad tint) + amended state */}
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>TODO: the top rung in one sentence + its boundary.</Takeaway>
      </Card>
    </Infographic>
  );
}
