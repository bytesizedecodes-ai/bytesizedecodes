# Visual interactive storytelling (v2, beginner)

How to fuse **Story-Mountain beats**, **picture continuity**, and **earned
interaction** into one lesson arc — and, new in v2, how to make the lesson
read as **one connected picture-story instead of a deck of flashcards**.

The v2 governing rule: **a scene never starts from scratch.** Every scene
inherits the previous scene's stage and characters, then changes exactly one
thing. A child reading only the pictures should experience one continuous
story.

---

## 1. The fusion rule (unchanged from v1)

A lesson is one story told in three channels that must agree:

| Channel | Job |
|---|---|
| **Framework beat** | Where we are in the arc (hook → anchor → tension → reveal → resolution) |
| **Visual state** | What the picture shows *now* vs the previous scene |
| **Learner action** | What they toggle, guess, or drag — if anything |

If the widget could be moved to a different lesson without changing its meaning,
it is not fused. If the picture does not change across scenes, you have slides,
not a story.

**Default:** passive scroll-reveal + withheld-conclusion aha beat.
**Escalate to a widget only when** the concept requires acting (comparison,
trade-off, trying a guess).

---

## 2. The Thread contract (v2 — beginner calibration)

Six rules, all mandatory.

### 2.1 The journey strip opens the lesson

Directly under the `InfographicHeader`, render **`StoryMap`**
(`components/infographic/scenes.tsx`): the whole little story as 3–5
numbered slots with playful icons, one per beat, ≤4 words each
("The chatbot forgets" → "The board overflows" → "Wipe it clean" → "Notes
that stay"). The learner sees the whole story before it starts — no scene
ever feels like it came from nowhere. Every slot label is a promise a scene
must keep: reuse the slot's words in that scene's caption.

### 2.2 The connective caption grammar

Every scene caption opens with a **simple connective** — *So / But / Then /
That's why*:

- "① Mira's chatbot takes a lunch order…"
- "② **But** by message five, it asks 'which order?' — it forgot."
- "③ **So** what if it could keep notes? Wipe the board and watch."
- "④ **That's why** the notes (the **context window**) are the trick."

Ordinals alone (①②③) are decoration; connectives are the story. A reader
scrolling fast, reading only captions, still hears one story — the **scroll
test** (§2.6).

### 2.3 The stage rule — same stage, new state

The anchor object (the whiteboard, the soup pot, the car) keeps its
**position and size** on stage for the whole lesson. Scenes change its
*state* — fuller, emptier, broken, fixed, one more note — never its identity
or position. Never pick an anchor the stage can't hold still.

- **Chapter scenes** (`<Scene variant="chapter">`, the boxed panel) open a
  beat: the hook, the anchor's first appearance, the resolution.
- **Continuation scenes** (`<Scene variant="continue">`, frameless, hung on
  the shared left rule) keep the stage going: the tension deepening, the
  change happening, the reveal landing. Most of the story is continuations.

### 2.4 One accented change per scene — ghosts for "before"

Each scene changes **one** thing, and the change takes the accent color;
everything else stays neutral. When something is replaced, fixed, or
compared, leave the **before** visible as a dim ghost (faint outline, dashed
border) beside the after — the soup before AND after the extra salt is the
lesson; the after alone is just a picture. Two changes = two scenes.

### 2.5 Character and color constancy

The same actor is always the same figure, name, and colors (Mira is always
Mira, parcels are always yellow, the machine is always blue). Nothing new
appears on stage that a previous scene didn't introduce or set up — no
surprise cast, no re-colored objects. Beginners are building the schema;
constancy is what makes it buildable.

### 2.6 The scroll test (ship gate)

Play the lesson at scroll speed. Pass = one continuous picture-story:
captions connect (§2.2), the stage never resets (§2.3), each scene is one
visible change (§2.4). Fail = a deck of flashcards — restructure before
shipping.

---

## 3. Beat → interaction map (Anchored Story-Mountain, v2)

Assign **at most one** primary interaction. Other beats stay visual + caption.

| Beat | Interaction? | Guidance |
|---|---|---|
| Hook | Usually none | Picture the stake. Don't make them click yet. |
| Concrete anchor | Rarely | Optional: toggle two familiar states (car idle vs warning). Keep 2–3 presets. |
| Tension / impasse | **Best Active slot** | Constrained toggle or click that surfaces the puzzle — with the before state ghosting. |
| Reveal + fade | Prefer passive | Let the visual do the fade; don't bury the aha in chrome. |
| Resolution | Constructive via withheld takeaway | "What do you notice?" — generate, don't click-hunt. |

Anti-maps (don't do these):

- Widget only in the final scene as "bonus interactivity."
- Every beat interactive (load + seductive detail).
- A "scene" that is a bullet list — the pictures carry the story.

---

## 4. Interaction as a story turn

```
BEFORE  →  LEARNER ACTS  →  AFTER
(tempting view)   (control)   (evidence view + feedback)
```

- **Before** should invite the wrong reading (the misconception).
- **Act** must look clickable and carry a verb-led instruction ("Tap each
  board and watch what stays").
- **After** makes the hidden relationship obvious *in the picture*, with the
  BEFORE still visible as a ghost — then one line of specific feedback in
  beginner words, never only "Correct!"

---

## 5. Worked exemplar — beginner Story-Mountain (v2, threaded)

**Lesson capability:** See the context window as a whiteboard that gets
wiped — why the chatbot "forgets".

**StoryMap:** [📱 The chatbot forgets] → [🧹 The board gets wiped] → [📝 Notes
that stay] → [✅ The fix].

| Beat | Scene | Caption |
|---|---|---|
| Hook | chapter — Mira orders lunch, chatbot happy | "① Mira's chatbot takes a lunch order…" |
| Anchor | continue — the same chat, now drawn as a whiteboard filling with notes | "② **Then** watch its whiteboard — every message is a note." |
| Tension | continue — same board, message five wipes message one (ghost of the lost note) | "③ **But** the board is small — the oldest note gets wiped." |
| Reveal + fade | continue — the wiped note returns, labeled; one plain sentence | "④ **So** keep the order number in every note — that's the **context window** trick." |
| Resolution | chapter — Mira's chatbot, order remembered | "⑤ **That's why** it repeats your order back." |

The whiteboard never moves, never changes shape; every scene is one more
note, one wipe, one recovery — one story.

---

## 6. Quality rubric — story vs animated glossary (v2)

### Passes (ship)

- [ ] `StoryMap` journey strip renders under the header; every slot paid off.
- [ ] The scroll test passes: captions read as one connected story.
- [ ] One through-line stage — position AND identity stable all lesson.
- [ ] Each scene changes ONE thing, accented; "before" ghosts when it matters.
- [ ] Characters and colors constant; no surprise cast.
- [ ] At most one primary widget, on the mapped beat; BEFORE → ACT → AFTER
      visible in the picture.
- [ ] Feedback names the misconception in beginner words + points at the
      evidence in the picture.

### Fails (rewrite)

- [ ] New metaphor, new layout, or missing anchor object each scene.
- [ ] Ordinal-only captions (①②③) with no connectives.
- [ ] A "scene" that is bullets, a table, or a paragraph panel.
- [ ] Widget could be screenshot-replaced with no learning loss.
- [ ] "Correct!" with no picture pointer; interaction on every scroll section.

---

## 7. Authoring checklist (paste into Step 3)

```md
- Framework: Anchored Story-Mountain
- StoryMap slots: <3–5 labels + playful icons>
- Through-line stage: <the anchor object — what stays fixed, position included>
- Scene list: <beat → chapter|continue → connective caption → the ONE change>
- Ghost moments: <where "before" stays visible>
- Characters/colors: <who and what appears — fixed for the whole lesson>
- Interaction beat: <which beat | none>
- BEFORE misconception view / AFTER evidence view: <…>
- Feedback line (beginner words): <…>
```
