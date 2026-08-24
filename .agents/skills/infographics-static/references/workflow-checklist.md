# Workflow checklist

The implementation half of the skill's 6-step workflow — this covers
**Step 5 (generate the spec)** output and **Step 6 (generate the component)**.
Steps 1-4 (analyze, structure, recommend, confirm) live in `SKILL.md` and
`references/layout-gallery.md`; don't reach this file until those are done and
the user has confirmed the layout.

The file-touch sequence and verification commands below. Follow in order; don't
skip steps — the registry and content entries are what make the lesson appear.

## File sequence

### 1. Create the infographic component
Path: `components/infographic/<PascalName>.tsx`

Start from `assets/lesson-template.tsx`. The component must:
- Be a named export (e.g. `export function WhatIsFoo()`), no default export.
- Take no props.
- Return `<Infographic>...</Infographic>` using the shared primitives.
- Reflow on mobile (see `references/brand-system.md` — no fixed widths).

### 2. Register the component
File: `components/infographic/index.tsx`

Add to the `INFOGRAPHIC_COMPONENTS` map:
```ts
import { WhatIsFoo } from "./WhatIsFoo";

export const INFOGRAPHIC_COMPONENTS: Record<string, ComponentType> = {
  // ...existing
  "what-is-foo": WhatIsFoo,
};
```
The key (kebab-case slug) must match the `slug` you use in `content/courses/`.

### 3. Add the lesson to the course
File: `content/courses/`

Append to the right course's `lessons` array:
```ts
{
  slug: "what-is-foo",          // MUST match the registry key above
  title: "What is Foo?",
  blurb: "One-line summary",
  topic: "some-topic",
  minutes: 4,
  prose: [
    "Paragraph 1 — the core idea.",
    "Paragraph 2 — why it matters.",
    "Paragraph 3 — how it relates to neighbours.",
  ],
  exercise: {                    // optional
    id: "ex1",
    title: "Exercise title",
    prompt: "What the learner should do.",
    starterCode: "def foo():\n    ...\n",
    testCode: `
ok = True
message = "ok"
# ... assert behaviour, set ok=False on failure
`,
  },
  questions: [
    {
      id: "q1",
      kind: "mcq",
      prompt: "Question text",
      choices: [
        { id: "a", label: "..." },
        { id: "b", label: "..." },
        { id: "c", label: "..." },
        { id: "d", label: "..." },
      ],
      answer: "b",
      explanation: "Why b is right AND why each distractor is wrong.",
    },
    // 2-3 questions total
  ],
},
```

## Content quality rules

- **Faithfulness first (core principle #1).** Numbers, terms, and qualifiers
  must match the source verbatim. If the source says "approximately 73%", write
  "approximately 73%" — not "~70%" or "most". If a fact doesn't fit the chosen
  layout, change the layout or split the lesson; don't distort the data.
- **`prose`**: 2-4 paragraphs, ~100-200 words total. One idea per paragraph.
  Plain strings — no markdown, no HTML.
- **`questions`**: 2-3 MCQs. Each must test the learning objective (core
  principle #2 — if the objective is "distinguish X from Y", at least one
  question must ask the learner to distinguish them). The `explanation` must
  teach — name the specific misconception behind each wrong answer (mirrors
  `plans/historical/02-drill-generators.md`'s "every distractor is a named misconception"
  philosophy).
- **`exercise.testCode`**: MUST set `ok = True` (and optionally `message`) on
  success. That's the contract `components/CodeCell.tsx` reads. Test multiple
  cases. Use `abs(got - expected) > 1e-6` for float comparisons.

## Verification commands

Run from the project root (`/Users/suren/Documents/bytesizedecodes`):

```bash
# 1. Typecheck — must be clean
npm run typecheck

# 2. Tests — must still pass (you shouldn't touch lib/, so all 34 should remain green)
npm test

# 3. Route resolves (dev server must be running: npm run dev)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/courses/<course>/<slug>
# expect: 200

# 4. (optional) Render to PNG for a visual check
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 \
  --window-size=1200,1800 \
  --screenshot="/tmp/<slug>.png" \
  "http://localhost:3000/courses/<course>/<slug>"
```

## Common mistakes

- **Slug mismatch** — the registry key, the `content/courses/` `slug`, and the
  component file name must all agree (kebab-case slug, PascalCase component).
  A typo here = a 500 with "No infographic component registered".
- **Forgetting to register** — creating the `.tsx` file isn't enough; it must be
  in `index.tsx` or the lesson route throws.
- **Fixed-width layout** — a `width: 1200px` somewhere will break mobile. Use
  the responsive primitives.
- **`testCode` that doesn't set `ok`** — the code cell will show "tests did not
  run" forever. Always assign `ok = True` on the success path.
- **Raw hex colours** — use the token classes. A stray `#7898c8` in a style
  attribute won't break anything but drifts from the system.

## After it works

Append a one-line entry to `CHANGELOG.md` per the `CLAUDE.md` rule — what was
added, the lesson slug, the course. That's the project convention.
