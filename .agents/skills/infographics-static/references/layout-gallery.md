# Layout gallery

20 layout patterns for visual explanations. Pick the pattern whose *shape*
matches the idea — not by aesthetic. Most ML/AI concepts fit one of these
cleanly; if a slide fits two, it's probably two ideas (split into two lessons).

## How to use this

Each entry has:
- **Best for** — the content shape it communicates
- **Sketch** — an ASCII diagram of the structure
- **Build** — how to assemble it from the brand primitives (`Card`, `BulletList`,
  SVG, Tailwind grid classes) and the responsive rules
- **In this project** — a worked example if one exists

The primitives: `Infographic`, `InfographicHeader`, `Card`, `CardTitle`,
`BulletList`, `Tag` (from `components/infographic/primitives.tsx`). Brand tokens
are in `references/brand-system.md`. All layouts must reflow on mobile — default
to `grid-cols-1 sm:grid-cols-N`.

---

## linear-progression
**Best for:** timelines, processes, step-by-step tutorials.
```
[1]──[2]──[3]──[4]──[5]
```
**Build:** horizontal row of step cards with arrows; on mobile stack vertically
with down-arrows. Use the pattern from `WhatIsML.tsx`'s pipeline section:
`flex-col sm:flex-row`, swap `↓`/`→`. Final step gets `bg-brand-deep` emphasis.
**In this project:** `WhatIsML.tsx` pipeline (collect → run → find → learn → decide).

## binary-comparison
**Best for:** A vs B, before-after, pros-cons.
```
┌─────┐   VS   ┌─────┐
│  A  │        │  B  │
└─────┘        └─────┘
```
**Build:** two `Card`s side-by-side (`grid-cols-1 sm:grid-cols-2`), each with a
coloured header band and a list with ✕/✓ markers. Hide the VS badge on mobile.
**In this project:** `WhatIsAI.tsx` (intelligent vs non-intelligent machines).

## comparison-matrix
**Best for:** comparing 3+ options across multiple factors.
```
        | Factor1 | Factor2 | Factor3
Opt A   |    ✓    |    ✕    |    ✓
Opt B   |    ✓    |    ✓    |    ✕
Opt C   |    ✕    |    ✓    |    ✓
```
**Build:** an HTML `<table>` inside a `Card tone="white"`. Header row `bg-ash`,
body rows `border-b border-dot`. Use ✓/✕ with `text-good`/`text-ink-faint`. Add
`overflow-x-auto` so it scrolls on narrow screens instead of breaking layout.

## hierarchical-layers
**Best for:** pyramids, priority levels, abstraction stacks.
```
       /\
      /__\
     /____\
    /______\
```
**Build:** stack 3-5 `Card`s with decreasing width (`w-full` → `w-4/5` → `w-3/5`)
and increasing tone intensity (`brandWash` → `brand` → `brandDeep`). Centre each
with `mx-auto`. Top = highest priority/abstraction.

## tree-branching
**Best for:** categories, taxonomies, decision trees.
```
            [root]
           /  |  \
       [A]  [B]  [C]
```
**Build:** a root `Card` at top, then a `grid-cols-1 sm:grid-cols-3` of children.
Draw connectors as inline SVG between them, or skip connectors and let hierarchy
come from indentation. Each branch can recurse one level.

## hub-spoke
**Best for:** central concept with related facets/examples radiating out.
```
         [B]
          |
     [A]--[hub]--[C]
          |
         [D]
```
**Build:** a centred pill-shaped hub (`rounded-full bg-brand`) above a
`grid-cols-1 sm:grid-cols-2` of facet cards. See `WhatIsML.tsx`.
**In this project:** `WhatIsML.tsx` (hub = ML, spokes = supervised/unsupervised/reinforcement/capabilities).

## structural-breakdown
**Best for:** exploded views, cross-sections, "what's inside X".
```
┌─────────────────┐
│ ▢ outer layer    │
│  ▢ middle layer  │
│   ▢ core         │
└─────────────────┘
```
**Build:** nested `Card`s with decreasing padding, each tone-darker than its
parent. Or an SVG with offset rectangles + dashed lines showing the "explode".

## bento-grid  (DEFAULT when unsure)
**Best for:** multiple topics, overview, when no single pattern dominates.
```
┌────┬──────┐
│ A  │  B   │
├────┴──┬───┤
│   C   │ D │
└───────┴───┘
```
**Build:** `grid grid-cols-2 sm:grid-cols-3 gap-3` of `Card`s, some spanning 2
cols (`sm:col-span-2`). Each card one idea, ~3 bullets max. Reach for this when
content is a list of independent points.

## iceberg
**Best for:** surface vs hidden aspects, visible symptoms vs root causes.
```
~~~~~~~~~  [visible]
~~~~~~~~
~~~~~~~ [hidden — the bulk]
~~~~
~~
```
**Build:** a horizontal "waterline" divider, content above in `Card tone="white"`,
content below in `Card tone="brandDeep text-canvas"`. The below section should
be visibly larger to convey "this is the real substance."

## bridge
**Best for:** problem → solution, current state → desired state.
```
[problem]──────[bridge]──────[solution]
```
**Build:** three elements in a row (or stacked on mobile): two `Card`s
(problem/solution) flanking a connecting element labelled with the bridging
concept (a technique, a tool, an insight).

## funnel
**Best for:** conversion, filtering, narrowing-down processes.
```
\##########/
 \########/
  \######/
   \####/
    \##/
```
**Build:** stacked `Card`s with decreasing width (`w-full` → `w-4/5` → `w-3/5` →
`w-2/5`), each showing a stage with a count/percentage. Top = all inputs,
bottom = the few that survived.

## isometric-map
**Best for:** spatial relationships, system architecture, "where things live".
**Build:** a hand-drawn SVG with rectangles/boxes positioned in 2D space,
labelled, connected by lines. Use the diagram approach from `WhatIsDeepLearning.tsx`.
Keep labels short; put detail in adjacent `Card`s, not in the SVG.

## dashboard
**Best for:** metrics, KPIs, at-a-glance status.
```
┌────┬────┬────┬────┐
│ M1 │ M2 │ M3 │ M4 │
└────┴────┴────┴────┘
```
**Build:** `grid-cols-2 sm:grid-cols-4` of stat cards. Each: big number
(`text-3xl font-bold`), label below (`text-xs text-ink-faint`). Use `text-good`
for healthy metrics, `text-bad` for problems. See `StatsHud.tsx` for the in-app version.

## periodic-table
**Best for:** categorised collections, many items grouped into families.
```
┌──┬──┬──┬────┬──┐
│A1│A2│  | B1│B2│
└──┴──┴──┴────┴──┘
```
**Build:** a grid of small tiles, each a `Tag` or tiny `Card`, coloured by
family (`bg-brand-wash` / `bg-good-wash` / `bg-ash`). Add a legend mapping colour
→ family. Good for "the types of X" overviews.

## comic-strip
**Best for:** narratives, sequences with a through-line.
```
[1]→[2]→[3]→[4]
```
**Build:** like linear-progression but each panel is taller and contains a small
scene (icon + caption), not just a label. 3-5 panels max. Emphasise the
transformation between panels, not the panels themselves.

## story-mountain
**Best for:** plot structure, tension arcs, difficulty curves.
```
        /\
       /  \
      /    \
     /      \
____/        \____
```
**Build:** an SVG path forming a mountain, with labelled points along it
(exposition → rising action → climax → falling → resolution). Place `Card`s
below the SVG explaining each stage.

## jigsaw
**Best for:** interconnected parts that only make sense together.
```
 ┌──┐ ┌──┐
 │A │ │B │
 ┌──┐ ┌──┐ ┌──┐
 │C │ │D │ │E │
 └──┘ └──┘ └──┘
```
**Build:** a grid of `Card`s with interlocking borders (offset margins to suggest
puzzle pieces), each one part of a whole. A concluding line: "Together these
make X."

## venn-diagram
**Best for:** overlapping concepts, shared vs distinct characteristics.
```
   ___    ___
  /   \  /   \
 |  A  \/  B  |
  \___/\ /\___/
       ( )
```
**Build:** two or three overlapping SVG circles, each a different brand tone
(with `opacity-60` so overlaps blend). Label the non-overlapping regions and the
intersection. See `nested-set` for the non-overlapping containment version.

## winding-roadmap
**Best for:** a journey, milestones over time, multi-phase plans.
```
○─╮     ╭─○
  │     │
  ╰─○───╯
```
**Build:** an SVG path that winds left-right-down, with milestone dots along it.
Each milestone has a number and links to a `Card` below explaining it. More
expressive than linear-progression when the path isn't straight.

## circular-flow
**Best for:** cycles, recurring processes, feedback loops.
```
     ┌─→A─┐
     D    B
     └─C←─┘
```
**Build:** an SVG with 3-5 nodes arranged in a circle and curved arrows
connecting each to the next, the last looping back to the first. Emphasise
"this repeats" with a ↻ symbol. ML training loops, data flywheels fit here.

## dense-modules
**Best for:** high-density reference guides, data-rich overviews.
**Build:** a tightly-packed grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`,
small gaps) of compact `Card`s, each a self-contained factoid: title, 1-2 lines,
maybe a tiny stat. When you have 8+ independent points and bento-grid feels too
sparse, use this. Add a "TL;DR" `Card` at the top.

---

## Choosing

Ask: what is the *shape* of the relationship between the ideas?
- **Sequence over time** → linear-progression, comic-strip, winding-roadmap
- **Two things contrasted** → binary-comparison
- **3+ things contrasted** → comparison-matrix
- **Hierarchy / priority** → hierarchical-layers, funnel
- **Containment** → nested-set (see `references/`), structural-breakdown
- **Overlap** → venn-diagram
- **Cycle** → circular-flow
- **One thing, many facets** → hub-spoke
- **Categories** → tree-branching, periodic-table
- **Problem→solution** → bridge, iceberg
- **Many independent points** → bento-grid (default), dense-modules
- **Narrative arc** → story-mountain
- **Spatial / architectural** → isometric-map
- **Metrics at a glance** → dashboard
- **Parts of a whole** → jigsaw

When unsure, default to **bento-grid** — it handles heterogeneous content
gracefully and never looks wrong.
