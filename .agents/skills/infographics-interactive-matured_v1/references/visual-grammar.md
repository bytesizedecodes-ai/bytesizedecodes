# The Plate grammar — printed-plate minimalism

The matured visual identity, decoded from illustrated technical guidebooks
(flat, thin-line, whitespace-led diagrams): matured lessons look like
**plates in a printed book**, not like app UI. The rest of the site's
lessons use the shared card/chip chrome (`Scene`, `Card`, `StoryMap`,
pill badges) — matured lessons deliberately do not. A matured lesson that
renders boxed panels with shadows and pill badges is a bug, even when its
content is perfect.

## 1. The system

Build from `components/infographic/plate.tsx`:

| Primitive | Job |
| --- | --- |
| `PlateSet` | wraps the whole infographic; hairline rules between plates |
| `Plate` | one full-width section; optional mono `kicker` label |
| `PlateHeader` | kicker + left-aligned title + one-line dek (replaces `InfographicHeader`) |
| `PlateMap` | the lesson arc as ONE line of plain-text steps joined by thin arrows (replaces `StoryMap` chips) |
| `InkBox` | thin-stroke rounded outline, `plain / accent / dim / dashed` tones |
| `Glyph` | line-art icon set (person, chat, gear, terminal, db, chip, doc, search, server, globe) — stroke-only `currentColor` |
| `FlowArrow` | thin downward arrow with optional mono label |
| `NoteRule` | the closing takeaway: one sentence under a thin accent rule — no card |

## 2. The rules that make it look printed, not UI

1. **No boxes around scenes.** The plate IS the scene; hairlines from
   `PlateSet` separate beats. Never nest `bg-surface-elevated` +
   `border` + `shadow-sm` panels — that is the house card look this skill
   exists to leave behind. `InkBox` outlines group content ONLY when the
   picture needs a container (a chat window, an envelope, a table cell).
2. **No shadows, no gradients, no glow — anywhere.** Flat inks only.
3. **Thin strokes, generous air.** Ink strokes at ~1–1.75px; whitespace
   does the grouping (`py-8` plate rhythm). If a plate feels dense, delete
   chrome before deleting content.
4. **Labels are written, not typeset.** Kickers/role labels in small mono
   uppercase; object labels in regular-weight sentence case at `text-xs`.
   NO rounded-full pill badges, NO bold centered figcaptions.
5. **One accent, soft.** The single brand accent marks the scene's delta,
   as a soft fill (`bg-brand-wash`) or an accent stroke on the `InkBox`.
   Everything else is ink on canvas. Semantic good/bad only for
   correct-vs-incorrect teaching moments.
6. **Arrows carry the logic.** Thin, small heads; DASHED arrows for
   loop-backs and re-sends (the dashed envelope IS the re-send lesson).
   Arrow labels are tiny mono, written along the connector.
7. **Glyphs are line-art, matched.** Use the `Glyph` set so every lesson
   draws a person, a database, a model-chip the SAME way. Missing glyph?
   Draw it in the same grammar (stroke-only, currentColor, 1.75, 24-grid)
   and add it to `plate.tsx` — do not import cutesy or filled icons.
8. **Machine text stays monospace** (§ technical-stage.md) but renders on
   `bg-canvas` or inside an `InkBox` — not in heavy inverted terminal
   panels, unless the contrast is genuinely load-bearing.

## 3. Layout rhythm

- Plates read top-to-bottom like a page; within a plate, left-to-right.
- One idea per plate; the PlateMap line up top is the table of contents.
- The interactive plate (when earned) sits mid-lesson on its beat, using
  the same inks: thin-outlined rows, plain mono annotations, the newest
  state accented, prior states dimmed. `controls.tsx` primitives remain
  for the actual knobs (a11y chrome stays) — everything around them is
  plate-styled.
- Both themes must hold: every color is a token or `currentColor`; check
  the plate in dark mode where the "white page" becomes a dark sheet.

## 4. The litmus test

Step back from the screen. If the lesson could be mistaken for a settings
page or a dashboard — cards, chips, shadows, centered bold labels — it
fails. If it could be photographed and pasted into a technical guidebook
as a figure — it passes.
