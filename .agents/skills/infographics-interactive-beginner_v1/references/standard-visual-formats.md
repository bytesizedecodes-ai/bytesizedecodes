# Standard Visual Formats (v5 reference layer)

The specs for the standardized system diagrams rendered **below** a lesson's
story infographic. The infographic tells the idea as a story; the diagram is
the compact, reusable reference view — the *spare parts manual* for the same
machine. Read SKILL.md §4.5 first: the layering rule and the no-duplication
rule live there.

## 1. Format selection by subject

| Visual format | Best used for | Why it works |
|---|---|---|
| **Input-Process-Output Flowchart** | Supervised learning (e.g., regression, classification), unsupervised pipelines, feature extraction, any k-step algorithm | Shows data going in, the model processing it, and the prediction coming out |
| **Side-by-Side Comparison Grid** | Choosing between models (e.g., kNN vs. centroid), contrasting failure modes (memorizing vs. understanding), score semantics (train vs. test) | Clearly contrasts "Where to Use" and "When NOT to Use" visually |
| **Decision Tree Diagram** | Algorithmic choice / workflow limits: picking the ML family, reading a decision tree, when to distrust an output | Helps students answer: "Is my data labeled? Do I need deep learning or a simple script?" |

If no format fits naturally (definition lessons, pure-analogy lessons), skip
the diagram — a forced diagram that restates the picture 1:1 is duplication.

## 2. Standardized node text patterns

Agents and learners parse structured diagrams best when node text follows
one template. The renderer adds the bracket chrome automatically (mono font,
visible brackets) — author only the inner text.

| Component | Text pattern | Purpose |
|---|---|---|
| Input node | `[ Raw Input Data / Problem Statement ]` | Anchor the context |
| Process node | `[ Core AI/ML Concept / Algorithm ]` | The "What" in action |
| Output node | `[ Prediction / Value Delivered ]` | The "Why" & "Where" result |
| Branch/Filter | `< Decision Check: When NOT to use? >` | Set algorithmic limits |

Style rules:

- Node text ≤ 6 words. It's a label, not a sentence.
- At most ONE short caption per node, definitional not narrative
  ("category = classification · number = regression" ✔;
  "watch the child look at the bike and…" ✘ — that's the story layer's job).
- Decision nodes ask questions; leaves state outcomes.

## 3. Authoring shapes (data, not components)

Diagrams are plain data on the lesson (`content/courses.ts` → `diagram`),
rendered by `components/LessonDiagram.tsx` onto
`components/infographic/flow.tsx`. Never build a bespoke diagram component
when a standard format fits.

### Flowchart

```ts
diagram: {
  kind: "flow",
  steps: [
    { kind: "input",   text: "Labelled samples", caption: "photo + ‘car’" },
    { kind: "process", text: "Learning algorithm" },
    { kind: "output",  text: "Prediction on a new case" },
  ],
  // optional loop-back for cyclical processes:
  loop: "Strategy updates · repeat thousands of times",
}
```

- 3–5 steps. More than 5 → the process has two diagrams in it.
- Chain order is input(s) → process(es) → output.
- `kind` may be `"decision"` mid-chain for a check step
  (e.g. `< Decision Check: … >` before an output).

### Comparison grid

```ts
diagram: {
  kind: "compare",
  left:  { title: "k-Nearest Neighbors", subtitle: "compare against every example" },
  right: { title: "Centroid classifier", subtitle: "one average per class" },
  rows: [
    { label: "Where to use",  left: "…", right: "…" },
    { label: "When NOT to use", left: "…", right: "…" },
  ],
}
```

- Exactly 2 columns; 2–3 rows.
- Reach for the standardized row labels **"Where to use"** and
  **"When NOT to use"**; add at most one domain row (e.g. "What it measures").
- Cell text ≤ 12 words. The right column is accented — put the
  recommended/healthier option there.

### Decision tree

```ts
diagram: {
  kind: "decision",
  root: {
    kind: "decision",
    question: "Are the examples labelled with answers?",
    branches: [
      { label: "Yes", node: { kind: "leaf", answer: "Supervised" } },
      { label: "No",  node: { kind: "decision", question: "…", branches: [ … ] } },
    ],
  },
}
```

- 2–3 branches per decision; ≤ 2 levels of nesting deep total.
- Branch labels are short conditions ("Yes", "sunny", "each side one class").
- Leaves are outcomes, ≤ 4 words.

## 4. Worked examples (from the ML for Layman course)

**Supervised learning → flowchart.** `[ Labelled samples ]` →
`[ Learning algorithm ]` → `[ Prediction on a new case ]`, output captioned
"category = classification · number = regression".

**kNN vs. centroid → comparison grid.** Rows "Where to use" / "When NOT to
use"; the trade-off (accuracy-per-example vs. speed-per-average) lives in the
cells, not in prose.

**The three ML families → decision tree.** `< Are the examples labelled? >`
→ yes → `[ Supervised ]`; no → `< Is feedback a reward or penalty? >` →
yes → `[ Reinforcement ]`; no → `[ Unsupervised ]`.

**When ML fails → decision tree of decision checks.**
`< When NOT to trust the output? >` with branch conditions naming the three
failure sources (training gap / overfitting / bad data).

## 5. Verification checklist (per diagram)

- [ ] Format matches the subject per the §1 table (or the diagram is skipped).
- [ ] Node texts follow the §2 patterns; brackets render (they're automatic).
- [ ] Captions terse and definitional — zero story language.
- [ ] No information the story infographic didn't already show; the diagram
      *formalizes*, it doesn't extend or re-narrate.
- [ ] Renders below the infographic, above the prose; 375px clean; both
      themes legible; reduced-motion safe (shared motion system).
