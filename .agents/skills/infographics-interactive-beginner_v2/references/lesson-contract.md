# Lesson learning contract (v2)

Complete this short brief **before** writing lesson markup. It is a design
artifact, not user-facing copy. It prevents a polished scene, widget, quiz, and
application prompt from teaching four disconnected things — and prevents an
animated glossary with a bolted-on control. In v6 it also fixes the **anchor**,
the **explanation-first opening**, the **continuous-playground decision**, and
the **diagram-layer decision** before any markup exists.

```md
## Lesson: <title> — <course level>

### Learning target
- Capability: After this lesson, the learner can <observable action>.
- Prerequisite misconception: They may think <tempting but wrong conclusion>.
- Aha: They notice <hidden relationship>.

### Anchor (v6 — draft FIRST, before the brief)
- Anchor: <one sentence, everyday metaphor, something a 10-year-old touches>.
- Flavor check: <beginner: playful, doubles as the through-line visual |
  intermediate: quick lead-in | expert: one terse professional line>.
- Dramatization: <how the story infographic shows the anchor — the through-line
  object IS the metaphor>.

### Concept brief (v6 opener)
- What: <10-second plain-English summary, key term **bolded**>.
- Why: <core benefit / problem it solves>.
- Where: <2–3 specific real-world applications>.
- When NOT to use: <one testable boundary rule>.
- Bold check: 1–3 load-bearing terms per point, no sentence-bolding.
- Jargon check: every listed term (§2.5) carries its parenthetical gloss at
  first use (beginner/intermediate).

### Story and continuity (v2 — the Thread contract)
- Framework: <Anchored Story-Mountain> → <scene-by-scene beat list>.
- StoryMap slots: <3–5 labels ≤4 words + playful icons — the story at a glance>.
- Through-line stage: <the anchor object — what stays fixed, POSITION
  included; scenes change state, never layout or identity>.
- Scene list: <beat → chapter|continue → connective caption (So/But/Then/
  That's why) → the ONE change>.
- Ghost moments: <where the "before" stays visible when something changes>.
- Characters/colors: <who and what appears — names, figures, colors fixed
  for the whole lesson; no surprise cast>.
- Course case (intermediate/expert): <new signal, constraint, or decision this lesson adds>.
- Capstone artifact (if any): <claim / SLO / telemetry field / runbook step>.

### Diagram layer (v5 reference view — below the infographic)
- Format: <Input-Process-Output flowchart | comparison grid | decision tree | NONE — justify>.
- Node texts: <the [ … ] / < … > labels, ≤ 6 words each>.
- No-duplication check: <what the diagram formalizes that the story showed —
  and confirmation it adds no re-narration>.

### Active learning (fused)
- Interaction beat: <which framework beat | none — justify if none>.
- Knob check (v6): <does the concept have a tunable parameter or toggleable
  state? If yes, the control is a continuous playground — slider/toggle from
  `components/infographic/controls.tsx`, presets as chips, consequence live>.
- Pattern: <passive | continuous playground | toggle-compare | click-to-elaborate | drag-to-tune | evidence matrix | decision gate>.
- BEFORE picture: <the tempting / incomplete view>.
- Action: They <toggle / inspect / tune / choose a claim / decide>.
- AFTER picture: <how the graphic re-composes; what is newly obvious>.
- Feedback: If they conclude <misconception>, say <correction tied to evidence>.
- Next investigation: <concrete next slice, trace, counter-example, or action>.

### Closing scenario MCQs (v5 — exactly 2, both real-life scenarios)
- Q1 scenario (checks the What/Why): <concrete situation with named actors/systems> → asks <decide/diagnose>.
- Q2 scenario (transfers it): <a NEW real-world situation> → asks <decide/explain/design>.
- No prediction card, no application card — the transfer lives inside Q2.
- Explanations resolve the scenario and name the misconception; distractors are diagnostic.

### Cheat-sheet (v6 — derived, nothing to author)
- Card lines read well from `concept.anchor` / `concept.what` / `concept.whenNot`
  (they render verbatim on the share card — if one reads badly, fix the field).

### Transfer and evidence
- Completion evidence: <MCQ explanation, selected claim, short artifact, or capstone input>.
- Optional measurement plan: record only <scenario choice/conclusion/misconception category>;
  never raw prompts, model responses, secrets, or free text by default.
```

## Quality tests

- The capability uses a verb that can be demonstrated: *diagnose, choose,
  explain, design,* or *justify*—not merely *understand* or *know*.
- **The anchor is drafted first**: one sentence, physical, level-calibrated —
  and the through-line visual dramatizes it.
- The concept brief opens the lesson: **anchor**, then all four points, 1–2
  sentences each, specific "Where"s, a testable "When NOT", key terms bolded
  — **and no quiz before it**.
- **Jargon gate:** listed terms are glossed at first use
  (`content/jargon.test.ts` passes for beginner/intermediate).
- The diagram layer (if any) formalizes the story without re-narrating it;
  node texts follow the standardized patterns.
- **Exactly 2 closing MCQs, both real-life scenario prompts** (concrete
  actors/systems — never "What is X?"); the second transfers to a new
  situation.
- The through-line stage is stable — position AND identity; scenes change
  **state**, never layout or metaphor.
- **The scroll test passes:** read at scroll speed, the captions form one
  connected story (connectives present), the stage never resets, and each
  scene is a single accented change with "before" ghosted where it matters.
- The interaction (if any) sits on the mapped beat from
  `visual-interactive-storytelling.md` §2 — not after the takeaway. **If the
  concept has a knob, the control is continuous (§6).**
- The scenario MCQs, interaction, and feedback test the same
  learning target from different angles; they do not triple-restate it.
- Feedback explains **why the evidence changes the conclusion** and gives one
  next investigation. Not a generic success/error toast.
- BEFORE → ACT → AFTER is specified; AFTER is a visual re-composition, not only
  a number swap.
- In intermediate/expert courses, the lesson advances the same case and leaves
  a reusable artifact for the capstone.
- Fails the “animated glossary” smell test in
  `visual-interactive-storytelling.md` §8.

## Worked micro-example — intermediate observability (fused)

- Capability: Choose a metrics window that can reveal a short error spike
  before declaring a service healthy.
- Misconception: “The 7d (or averaged) view is enough to call health.”
- Through-line: one service-health dashboard (latency / spend / errors tiles).
- Interaction beat: PIC *Observe* (toggle-compare); Predict asks which window
  shows the spike.
- BEFORE: 7d selected, errors look calm.
- AFTER: 24h or 1h reveals the semantic-bad error tile + spike sparkline.
- Feedback: “The long window smooths the incident into a gentle slope. Inspect
  1h before declaring the service healthy.”
- Transfer: Overnight batch job — which window first, and why?
