# Visual interactive storytelling (v4)

How to fuse **framework beats**, **picture continuity**, and **earned
interaction** into one lesson arc. Read this after picking the level framework
in `narrative-structures.md`. The goal: the learner’s action *is* a story beat,
not a dashboard bolted onto an animated glossary.

---

## 1. The fusion rule

A lesson is one story told in three channels that must agree:

| Channel | Job |
|---|---|
| **Framework beat** | Where we are in the arc (hook → tension → reveal, or PIC / CER) |
| **Visual state** | What the picture shows *now* vs the previous scene |
| **Learner action** | What they predict, toggle, inspect, claim, or decide — if anything |

If the widget could be moved to a different lesson without changing its meaning,
it is not fused. If the picture does not change across scenes, you have slides,
not a story.

**Default:** passive scroll-reveal + one Constructive predict beat.  
**Escalate to a widget only when** the concept requires acting (comparison,
investigation, trade-off, claim selection, or a justified decision).

---

## 2. Beat → interaction map

Assign **at most one** primary interaction to the beat where it earns its keep.
Other beats stay visual + caption.

### Beginner — Anchored Story-Mountain

| Beat | Interaction? | Guidance |
|---|---|---|
| Hook | Usually none | Picture the stake. Don’t make them click yet. |
| Concrete anchor | Rarely | Optional: toggle two familiar states (car idle vs warning). Keep 2–3 presets. |
| Tension / impasse | **Best Active slot** | Constrained toggle or click that surfaces the puzzle. |
| Reveal + fade | Prefer passive | Let the visual do the fade; don’t bury the aha in chrome. |
| Resolution | Constructive via prediction | `PredictionCard` / withheld takeaway — generate, don’t click-hunt. |

### Intermediate — Predict–Investigate–Case (PIC)

| Beat | Interaction? | Guidance |
|---|---|---|
| Scenario | None / light setup | Establish the case picture (one persistent system diagram). |
| Predict | **Required Constructive** | Commit *in or before* the scene — not a disconnected ritual MCQ alone. Prefer an in-scene prompt that names the same claim the widget will test. |
| Observe | **Primary widget beat** | Toggle-compare, click-to-elaborate, or drag-to-tune *is* the observation. |
| Explain-via-case | Feedback + highlight | Widget feedback names misconception + next investigation; picture highlights supporting evidence. |
| Transfer | Decision / short prompt | Adjacent situation; same visual language, new numbers. |

### Expert — Problem-First Diagnostic (CER)

| Beat | Interaction? | Guidance |
|---|---|---|
| Problem-first | None | Hard case visual; minimal scaffolding. |
| You diagnose | **Primary widget** | Evidence matrix or open inspection with minimal labels. |
| Claim / Evidence / Reasoning | **Constructive commit** | Learner selects claim (or writes the claim the UI captures as a choice). Feedback cites evidence only. |
| Counter-examples | Optional second state | One toggle or alternate cohort that breaks the first claim. |
| What / So-What / Now-What | Decision gate | One justified next action — not a branching game. |

### Anti-maps (don’t do these)

- Widget only in the final scene as “bonus interactivity.”
- Prediction that tests a different idea than the widget.
- Every beat interactive (load + seductive detail).
- Expert lesson that forces Story-Mountain clicks.

---

## 3. Visual narrative grammar

### 3.1 One through-line object

Pick **one persistent visual model** for the lesson (and, for intermediate/
expert courses, for the whole course case). Every scene is a new *state* of
that model — not a new metaphor.

| Level | Through-line examples |
|---|---|
| Beginner | Same car → dashboard gauges → AI as “another engine” |
| Intermediate | Same request path / service diagram; each lesson lights a new span or signal |
| Expert | Same multi-agent / multi-region topology; each lesson adds a constraint or failure mode |

Write the through-line in the lesson contract before markup.

### 3.2 Shot language (scene-to-scene)

Use this progression unless the content truly needs another shape:

1. **Establish** — whole system / whole object (wide).
2. **Focus** — one part under tension (close-up).
3. **Act** — learner changes state (if widget earned).
4. **Reveal** — relationship that was hidden is now visible.
5. **Resolve** — one-line takeaway; through-line at rest in the “understood” state.

Between scenes, change **one** primary thing: which part is accented, which
value is wrong, which claim is selected, which window is active. If two things
change, split into two scenes (P3 / P6).

### 3.3 Interaction as a story turn

Model every widget as three picture states:

```
BEFORE  →  LEARNER ACTS  →  AFTER
(tempting view)   (control)   (evidence view + feedback)
```

- **Before** should invite a wrong or incomplete reading (the misconception).
- **Act** must look clickable and carry a verb-led instruction (skill §6 gates).
- **After** must make the hidden relationship obvious *in the picture*, then
  caption with specific feedback — not only “correct.”

If AFTER is only a number change with no visual re-composition (highlight,
re-layout of evidence, verdict band), strengthen the graphic.

### 3.4 Where the analogy breaks (beginner / intermediate)

When using a concrete anchor, dedicate one short caption or label to the break:
what must *not* be imported from the analogy. Put it after the fade, not in the
hook.

---

## 4. In-scene Constructive beats (beyond ritual PredictionCard)

`PredictionCard` before the infographic is the cheap Constructive floor. v4 also
asks for **alignment**: the prediction, the widget, the MCQ, and the transfer
prompt test the *same* capability.

Prefer at least one of these **inside** the visual arc when a widget exists:

| Pattern | In-scene commit |
|---|---|
| Toggle-compare | “Which window hides the spike? Pick, then toggle.” |
| Click-to-elaborate | Default selection away from the bottleneck; “Which step costs the most?” |
| Drag-to-tune | “Set it where you’d sleep at night, then read false alarms vs misses.” |
| Evidence matrix | Select the claim first; evidence highlighting follows. |
| Decision gate | Choose action + reason; reveal impact + missing evidence. |

Do not stack a PredictionCard, an in-widget guess, *and* a post-hoc MCQ that all
restate the same sentence — that is redundancy (P1). Vary the angle: predict →
investigate → transfer.

---

## 5. Course continuity — visual + artifact

For intermediate / expert courses (§1.2 in `SKILL.md`):

1. Define the **case** in 2–4 sentences once for the course.
2. Name the **persistent diagram** (e.g. “support RAG path: user → retrieve →
   LLM → tools → answer”).
3. Each lesson adds **one** of: new signal, new constraint, new decision, or
   new counter-example — drawn on that same diagram.
4. Name the **reusable artifact** the capstone will consume (telemetry map,
   SLO, claim, runbook step).

If a lesson’s widget does not add evidence to the case, cut or redesign it.

---

## 6. Worked exemplar — intermediate PIC (fused)

**Lesson capability:** Notice that a 24h aggregate can hide a short error spike
that a 1h window reveals — so window choice is part of diagnosis.

**Through-line:** one “service health” dashboard (same three tiles every state).

| Beat | Visual state | Learner action |
|---|---|---|
| Scenario | Dashboard at rest; subtitle names the incident (“errors felt spiky after release”) | — |
| Predict | Prompt chip above toggle: “Which window will show the spike?” | Commit 1h / 24h / 7d |
| Observe | Toggle-compare widget (`MetricsDashboard` shape); 24h errors go semantic-bad | Toggle windows |
| Explain | Feedback: “24h averages the spike into noise / or 1h shows it — …” tied to tiles | Read feedback; optional click sparkline peak |
| Transfer | Same tiles, new copy: “Overnight batch job — which window first?” | Short decision |

**Misconception feedback example:** “Starting on 7d smooths incidents into a
gentle slope. Inspect 1h before declaring the service healthy.”

**What this is *not*:** three definition scenes about “what is a metric,” then a
dashboard with no prediction and a takeaway that restates the definition.

---

## 7. Worked exemplar — expert CER (fused, sketch)

**Lesson capability:** Choose the first investigation when quality drops after a
release without blaming the model by default.

**Through-line:** one release timeline + evidence strip (eval score, retrieval-
empty rate, latency, prompt version).

| Beat | Visual state | Learner action |
|---|---|---|
| Problem-first | Timeline with quality drop marked | — |
| Diagnose | Evidence matrix, all cards neutral | Inspect / filter |
| CER | Claims: model / retrieval / traffic | Select claim |
| Counter-example | Alternate cohort where latency, not retrieval, leads | Optional toggle |
| Now-what | Decision gate: canary vs rollback vs inspect index | Action + reason |

**Feedback:** cite empty-retrieval clusters; name what would falsify the claim;
give one next slice (index freshness). Minimal chrome; no car analogies.

---

## 8. Quality rubric — story vs animated glossary

### Passes (ship)

- [ ] One through-line object; each scene is a new state of it.
- [ ] Framework beats are identifiable in order (not reshuffled randomly).
- [ ] At most one primary widget; it sits on the mapped beat.
- [ ] BEFORE → ACT → AFTER is visible in the picture.
- [ ] Feedback names misconception + evidence + next investigation.
- [ ] Prediction / widget / transfer share one capability verb.
- [ ] Intermediate/expert: lesson advances the course case.

### Fails (rewrite)

- [ ] Scenes are “Definition → Diagram → Unrelated widget → Takeaway.”
- [ ] New metaphor every scene (car, then mailroom, then factory).
- [ ] Widget could be screenshot-replaced with no learning loss.
- [ ] “Correct!” with no evidence pointer.
- [ ] Interaction on every scroll section.
- [ ] Expert lesson wrapped in beginner story-mountain chrome.

---

## 9. Authoring checklist (paste into Step 3)

```md
- Framework: <Story-Mountain | PIC | CER>
- Through-line visual: <one sentence>
- Scene list: <beat → what changes in the picture>
- Interaction beat: <which beat | none>
- Pattern: <passive | toggle | click | drag | evidence matrix | decision gate>
- BEFORE misconception view: <…>
- AFTER evidence view: <…>
- Feedback line: <…>
- Transfer: <…>
- Course case add (if any): <signal / constraint / decision>
```
