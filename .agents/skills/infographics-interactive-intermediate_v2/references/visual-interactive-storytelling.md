# Visual interactive storytelling (v2)

How to fuse **framework beats**, **picture continuity**, and **earned
interaction** into one lesson arc — and, new in v2, how to make the lesson
read as **one connected story instead of a deck of cards**.

The v2 governing rule: **a scene never starts from scratch.** Every scene
inherits the previous scene's stage, referents, and question, then changes
exactly one thing. If a reader covers scene N−1, scene N must still feel like
*the next moment of the same shot*, not slide 2 of a deck.

---

## 1. The fusion rule (unchanged from v1)

A lesson is one story told in three channels that must agree:

| Channel | Job |
|---|---|
| **Framework beat** | Where we are in the arc (PIC here; CER in the expert skill) |
| **Visual state** | What the picture shows *now* vs the previous scene |
| **Learner action** | What they predict, toggle, inspect, claim, or decide — if anything |

If the widget could be moved to a different lesson without changing its meaning,
it is not fused. If the picture does not change across scenes, you have slides,
not a story.

**Default:** passive scroll-reveal + one Constructive predict beat.
**Escalate to a widget only when** the concept requires acting (comparison,
investigation, trade-off, claim selection, or a justified decision).

---

## 2. The Thread contract (v2 — the fix for "disconnected scenes")

Six rules, all mandatory. They are what the course-reviewer checks when it
asks "does this lesson read as one visual story?"

### 2.1 The story map opens the lesson

Directly under the `InfographicHeader`, render **`StoryMap`**
(`components/infographic/scenes.tsx`): the whole arc as 3–5 numbered slots,
one per beat, each a ≤4-word label of what the story establishes
("Ordered batches lie" → "The estimate skews" → "The path zig-zags" → "Shuffle
fixes it"). This is the advance organizer: the learner sees the whole argument
before the first scene, so each scene has somewhere to land. Every slot label
is a promise a scene must keep — reuse the slot's words in that scene's
caption.

### 2.2 The connective caption grammar

Every scene caption opens with a **discourse connective** that states its
relation to the previous scene — *So / But / Because / Meanwhile / That's why* —
plus its position in the framework when there is one:

- "① The incident — errors felt spiky after release"
- "② **But** the 24-hour window looks calm…"
- "③ **So** which window tells the truth? Toggle them."
- "Rung 2 of 4 — **because** each batch estimates one region's gradient…"
- "④ **That's why** the window choice is part of diagnosis."

Ordinal markers alone (①②③) are decorative; connectives are the story. A
reader who scrolls fast reading only captions should still hear one
argument — the **scroll test** (§2.6).

### 2.3 The stage rule — same stage, new state

The through-line object keeps its **position, size, and identity** across the
whole lesson. The pipeline diagram keeps its nodes in the same places; the
dashboard keeps its three tiles; the loss surface keeps its axes. What changes
between scenes is **state** — which span is accented, which value goes bad,
which window is active — never layout.

Mechanics:

- **Chapter scenes** (`<Scene variant="chapter">`, the boxed panel) open a
  beat or change *what* the picture shows.
- **Continuation scenes** (`<Scene variant="continue">`, frameless, hung on
  the shared left rule) keep the current stage and change state. A rung
  scene, a toggle consequence, a second observation of the same diagram are
  continuations, not chapters.
- A scene that redraws the through-line in a new arrangement needs a reason
  the story can justify ("zoom into the retrieve span") — and must carry the
  previous view with it (§2.4).

### 2.4 Change ONE thing — and highlight the delta

Between one scene and the next, change **one** primary thing. Accent the
change (the one brand-color element); keep everything inherited in neutrals,
dimmed but visible. When a value the learner just saw changes, **ghost the
previous state** — leave the old value/path/curve as a faint outline or
dashed ghost next to the new one — so the eye sees the *difference*, not just
a new picture. If two things change, split into two scenes (P3/P6). If
nothing carries over, you changed the stage illegally (§2.3).

### 2.5 Referent stability

Once a quantity, actor, or symbol appears, it keeps its **name, color, shape,
and units** until the lesson ends. The assistant is always Relay, always the
same figure; the window is always the same three tiles; n is always token
count. Re-binding referents ("now imagine a different service…") mid-derivation
spends working memory the derivation needs. Introduce every referent on stage
BEFORE the rung that leans on it (that is the pre-training beat,
`first-principles-ladder.md` v2 §"The rail").

### 2.6 The scroll test (ship gate)

Play the lesson at scroll speed. Pass = it reads like one continuous shot:
captions form a connected argument (§2.2), the stage never resets (§2.3), each
change is visible as a delta (§2.4). Fail = it reads like a deck — restructure
before shipping. The v1 failure mode was real: three boxed cards, three
layouts, the through-line object vanishing after scene 1, a bullet-list
"scene" replacing the picture. All four fail this test.

---

## 3. Beat → interaction map (PIC, v2)

Assign **at most one** primary interaction to the beat where it earns its keep.
Other beats stay visual + caption.

| Beat | Interaction? | Guidance |
|---|---|---|
| Scenario | None / light setup | Establish the case picture — the stage that stays (§2.3). |
| Predict | **Required Constructive** | Commit *in or before* the scene — an in-scene prompt naming the same claim the widget will test. |
| Observe | **Primary widget beat** | Toggle-compare, click-to-elaborate, or drag-to-tune *is* the observation. |
| Derive | Feedback + highlight | The ladder rail (`first-principles-ladder.md` v2); widget feedback names misconception + next investigation. |
| Transfer | Decision / short prompt | Adjacent situation; same visual language, new numbers. |

Anti-maps (don't do these):

- Widget only in the final scene as "bonus interactivity."
- Prediction that tests a different idea than the widget.
- Every beat interactive (load + seductive detail).
- A "scene" that is a bullet list — if the beat compares, the *picture*
  compares (side-by-side states of the stage), not prose bullets.

---

## 4. Interaction as a story turn

Model every widget as three picture states:

```
BEFORE  →  LEARNER ACTS  →  AFTER
(tempting view)   (control)   (evidence view + feedback)
```

- **Before** should invite a wrong or incomplete reading (the misconception).
- **Act** must look clickable and carry a verb-led instruction (skill §8 gates).
- **After** must make the hidden relationship obvious *in the picture* — the
  BEFORE state stays visible as a ghost (§2.4) so the comparison is on stage —
  then caption with specific feedback, never only "correct."

---

## 5. Course continuity — visual + artifact (v2: now visual)

For intermediate courses (SKILL.md §2.1):

1. Define the **case** in 2–4 sentences once for the course.
2. Name the **persistent diagram** (e.g. "Relay's answer path: user →
   retrieve → LLM → tools → answer") — that diagram IS the stage every lesson
   shares; each lesson lights a new span or adds a new signal to it.
3. **Open every lesson with a one-strip "case so far"** — the persistent
   diagram small, with the pieces previous lessons established already marked
   (a chip row: "✓ context window · ✓ retrieval quality · + today: latency").
   The learner re-enters the case in five seconds; the lesson's new evidence
   gets added to the same strip at the Derive beat.
4. Name the **reusable artifact** the capstone will consume (telemetry map,
   SLO, claim, runbook step).

If a lesson's widget does not add evidence to the case, cut or redesign it.

---

## 6. Worked exemplar — intermediate PIC (v2, fused + threaded)

**Lesson capability:** Notice that a 24h aggregate can hide a short error
spike that a 1h window reveals — so window choice is part of diagnosis.

**StoryMap:** [Incident lands] → [Long window looks calm] → [Toggle the
windows] → [Short window shows the spike].

| Beat | Scene | Caption (connective grammar) |
|---|---|---|
| Scenario | chapter — dashboard at rest, three tiles | "① The incident — errors felt spiky after release" |
| Predict | continue — same dashboard, prompt chip above toggle | "② **But** the 24-hour window looks calm — which window will show the spike?" |
| Observe | continue — same tiles, learner toggles 24h→1h; 24h state ghosts | "③ **So** toggle the windows — the spike was averaged away, not absent" |
| Derive | continue — why: the aggregate math on the same sparkline | "④ **Because** 24 hours of samples divide one hour's error by 24" |
| Transfer | chapter — same tiles, new copy (overnight batch) | "⑤ **That's why** the window choice is part of diagnosis — which window first?" |

Note what never happens: the dashboard never re-lays-out, no bullet-list
scene, every caption connects, the previous window state stays visible as the
ghost when toggled.

---

## 7. Quality rubric — story vs animated glossary (v2)

### Passes (ship)

- [ ] `StoryMap` renders under the header; every slot label is paid off by a scene.
- [ ] The scroll test passes: captions read as one connected argument.
- [ ] One through-line stage; position/identity stable all lesson (§2.3).
- [ ] Each scene changes ONE thing; the change is accented; prior state
      ghosts where a value changed (§2.4).
- [ ] Framework beats are identifiable in order; at most one primary widget
      on its mapped beat.
- [ ] BEFORE → ACT → AFTER visible in the picture; feedback names
      misconception + evidence + next investigation.
- [ ] Prediction / widget / transfer share one capability verb.
- [ ] Lesson advances the course case, and the "case so far" strip opened the
      lesson.

### Fails (rewrite)

- [ ] Scenes are "Definition → Diagram → Unrelated widget → Takeaway."
- [ ] New metaphor or new layout every scene; through-line object vanishes.
- [ ] A "scene" that is bullets or a paragraph panel where the picture should
      carry the comparison.
- [ ] Ordinal-only captions (①②③) with no connectives.
- [ ] Widget could be screenshot-replaced with no learning loss.
- [ ] "Correct!" with no evidence pointer; interaction on every scroll section.

---

## 8. Authoring checklist (paste into Step 3)

```md
- Framework: <PIC>
- StoryMap slots: <3–5 labels, ≤4 words each>
- Through-line stage: <one sentence — what stays fixed, position included>
- Scene list: <beat → chapter|continue → connective caption → the ONE delta>
- Ghost moments: <where a previous state stays visible, per §2.4>
- Referents: <actor names, quantities, symbols — fixed for the whole lesson>
- Interaction beat: <which beat | none>
- BEFORE misconception view / AFTER evidence view: <…>
- Feedback line: <…>
- Transfer: <…>
- Case-so-far strip: <what previous lessons established, what today adds>
```
