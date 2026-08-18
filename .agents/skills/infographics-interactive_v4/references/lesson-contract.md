# Lesson learning contract (v4)

Complete this short brief **before** writing lesson markup. It is a design
artifact, not user-facing copy. It prevents a polished scene, widget, quiz, and
application prompt from teaching four disconnected things — and prevents an
animated glossary with a bolted-on control.

```md
## Lesson: <title> — <course level>

### Learning target
- Capability: After this lesson, the learner can <observable action>.
- Prerequisite misconception: They may think <tempting but wrong conclusion>.
- Aha: They notice <hidden relationship>.

### Story and continuity
- Framework: <Anchored Story-Mountain | PIC | CER> → <scene-by-scene beat list>.
- Through-line visual: <one persistent object/diagram; what stays the same>.
- Scene picture changes: <beat → what changes in the picture (one thing each)>.
- Course case (intermediate/expert): <new signal, constraint, or decision this lesson adds>.
- Capstone artifact (if any): <claim / SLO / telemetry field / runbook step>.

### Active learning (fused)
- Interaction beat: <which framework beat | none — justify if none>.
- Pattern: <passive | toggle-compare | click-to-elaborate | drag-to-tune | evidence matrix | decision gate>.
- Prediction (Constructive): Before evidence, the learner commits to <choice/claim>.
- BEFORE picture: <the tempting / incomplete view>.
- Action: They <toggle / inspect / tune / choose a claim / decide>.
- AFTER picture: <how the graphic re-composes; what is newly obvious>.
- Feedback: If they conclude <misconception>, say <correction tied to evidence>.
- Next investigation: <concrete next slice, trace, counter-example, or action>.

### Transfer and evidence
- Transfer prompt: In a new situation, ask the learner to <decide/explain/design>.
- Completion evidence: <MCQ explanation, selected claim, short artifact, or capstone input>.
- Optional measurement plan: record only <prediction/state/conclusion/misconception category>;
  never raw prompts, model responses, secrets, or free text by default.
```

## Quality tests

- The capability uses a verb that can be demonstrated: *diagnose, choose,
  explain, design,* or *justify*—not merely *understand* or *know*.
- The through-line is stable; scenes change **state**, not metaphor.
- The interaction (if any) sits on the mapped beat from
  `visual-interactive-storytelling.md` §2 — not after the takeaway.
- Prediction, interaction, feedback, question, and transfer test the same
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
