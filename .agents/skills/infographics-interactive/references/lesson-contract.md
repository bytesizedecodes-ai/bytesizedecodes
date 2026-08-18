# Lesson learning contract (v3.1)

Complete this short brief **before** writing lesson markup. It is a design
artifact, not user-facing copy. It prevents a polished scene, widget, quiz, and
application prompt from teaching four disconnected things.

```md
## Lesson: <title> — <course level>

### Learning target
- Capability: After this lesson, the learner can <observable action>.
- Prerequisite misconception: They may think <tempting but wrong conclusion>.
- Aha: They notice <hidden relationship>.

### Story and continuity
- Framework beats: <named framework> → <scene-by-scene beat list>.
- Course case (intermediate/expert): <new evidence or decision this lesson adds>.
- Visual model: <what the picture makes visible; why prose alone is weaker>.

### Active learning
- Prediction: Before seeing the evidence, the learner commits to <choice/claim>.
- Action: They <toggle / inspect / tune / choose a claim / make a decision>.
- Evidence exposed: <the data/state the action reveals>.
- Feedback: If they conclude <misconception>, say <specific correction tied to evidence>.
- Next investigation: <the concrete next slice, trace, counter-example, or action>.

### Transfer and evidence
- Transfer prompt: In a new situation, ask the learner to <decide/explain/design>.
- Completion evidence: <MCQ explanation, selected claim, short artifact, or capstone input>.
- Optional measurement plan: record only <prediction/state/conclusion/misconception category>;
  never raw prompts, model responses, secrets, or free text by default.
```

## Quality tests

- The capability uses a verb that can be demonstrated: *diagnose, choose,
  explain, design,* or *justify*—not merely *understand* or *know*.
- The prediction, interaction, feedback, question, and transfer prompt all test
  the same learning target from different angles; they do not restate it.
- The feedback explains **why the evidence changes the conclusion** and gives
  one next investigation. It is not a generic success/error toast.
- In intermediate/expert courses, the lesson advances the same case and leaves
  a reusable artifact for the capstone (a claim, SLO, telemetry field, release
  decision, or runbook step).

## Worked micro-example — intermediate observability

- Capability: Diagnose whether a RAG quality regression is caused by retrieval
  or by the model response.
- Misconception: “The answer is wrong, so the model must be the cause.”
- Prediction/action: Choose the most likely cause, then filter traces by
  retrieval status and prompt version.
- Evidence/feedback: Empty retrieval clusters with failures; explain that model
  changes cannot repair context that was never retrieved, then direct the
  learner to inspect index freshness.
- Transfer: Given a new cohort slice, choose the first signal to inspect and
  justify it.
