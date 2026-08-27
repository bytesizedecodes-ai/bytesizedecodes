# Story devices — the seven canonical layouts

The guidebook plates feel simple because **nothing is freeform-composed**.
Every figure in the book is one of a handful of canonical layouts, reused
until the reader recognizes the shape. That reuse IS the storytelling: the
fifth time the reader sees the "one actor, many windows" layout, they read
it in a second — and a lesson that invents a new layout per plate reads as
noise no matter how clean each plate is.

Rule: **pick a device from this list for every plate.** If a plate genuinely
fits none of the seven, simplify the idea until one fits — or split it into
two plates. A new layout is a design decision to justify, not a default.## 1. Actor → targets (fan-out)

One actor glyph on the left, thin arrow, 2–3 named targets stacked on the
right. Teaches "one thing reaches many things" — an agent searching three
sources, a router hitting routes, a tool list. The actor carries the
lesson's role label; each target is a small window/box with a name label
above it. Variation: the arrow is labeled with the verb ("searches",
"routes to").

## 2. Chain with loop-back (the cycle)

3–4 nodes left-to-right joined by thin arrows; one long curved arrow
returns from the last process node to the first. The terminal node is
visually distinct (different stroke color / shape) — the exit. This is THE
agent-lesson device: Thought → Action → Observation → (Answer | loop).
The loop-back arrow is dashed when the return is a re-send, solid when it
is control flow. Label the loop-back ("again", "until done") — an
unlabeled loop reads as a drawing error.

## 3. Two-box conversation (ping-pong)

Two actors/machines facing each other, arrows alternating between them,
each arrow labeled with its payload word ("query", "response", "action").
Teaches protocols and request/response. Keep to ≤4 arrows; more is a
sequence (use device 2).

## 4. Before / after pair

The SAME small scene drawn twice side by side — one thing differs. The
differing element carries the accent. Teaches what a change does: with
memory vs without, cached vs uncached, one agent vs a team. Caption states
the delta in words; the picture must not differ in layout between the two
halves, only in content.

## 5. Catalog grid

A titled grid of small uniform tiles (2–4 columns), each tile = one glyph
+ one name + one ≤8-word job line. Teaches an inventory — the tool
landscape, memory types, failure modes. Uniformity is the point: same tile
size, same type scale, same glyph grammar. Max 12 tiles; more becomes a
reference table — move it to the `diagram` layer or prose.

## 6. Level ladder

The same minimal scene repeated N times in a grid, one per level, numbered
1–5, each level adding exactly one element (a router, a tool, a sub-agent,
autonomy). Reading order is the argument: control shifts from human to
system as the eye moves. The added element in each level carries the
accent; everything else stays identical. Never skip a level to save space —
the skipped level is where the reader was.

## 7. Boundary map (inside / outside)

One thin rounded boundary (dashed = logical, solid = physical) enclosing a
small group of nodes; everything outside stays outside. Teaches trust
boundaries, sandboxes, context windows, what the model can and cannot
touch. Arrows crossing the boundary are the lesson — label what crosses
("tool_call out", "observation in"). One boundary per plate.

## Casting the glyphs (the book's second trick)

The book's figures are readable at a glance because each actor is ONE
glyph + ONE name label, and the same glyph always means the same thing
across the whole book: person = user, chip/brain = model, gear = tool,
cylinder = database, globe-window = web source, robot = autonomous agent.
Adopt the same discipline per course: fix the glyph→meaning mapping in the
course's lesson 1 (a tiny legend plate is allowed), then never re-cast a
glyph. A glyph that means "tool" in lesson 2 and "validator" in lesson 5
breaks the visual vocabulary the reader is building.

## Simplicity budget (per plate)

- ≤ 4 focal elements (nodes, actors, tiles-columns) + 1 accented delta.
- ≤ 2 font sizes per plate (label size, annotation size).
- ≤ 1 boundary, ≤ 1 loop-back, ≤ 3 arrows between any pair of nodes.
- One sentence of picture-caption per plate; the kicker carries the
  connective ("But…"), the picture carries the rest.
- If the plate needs a second sentence to explain the picture, the picture
  has two ideas — split the plate.
