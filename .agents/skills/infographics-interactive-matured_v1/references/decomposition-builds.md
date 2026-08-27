# The decomposition rule — turning big diagrams into accumulating builds

The failure this file kills: the **big static diagram**. An architecture,
protocol, or pipeline rendered as one large frame — 8–15 labeled boxes, six
arrows crossing, one caption — the reader's eye lands nowhere, and the
lesson ships a picture the reader scrolls past. Static one-shot diagrams
are how technical books hide mechanisms. We build the picture *in time*
instead.

## 1. Sizing: what decomposes and what doesn't

| Picture size | Treatment |
| --- | --- |
| ≤ 5 nodes | May render in one scene (one accent still marks the lesson's delta). |
| 6–9 nodes | **Always a build.** One element added per scene, established elements dim, final scene shows the earned whole. |
| > 9 nodes | Cut scope. This is two diagrams — usually two lessons. (A `diagram` layer, if one earned its place at all, splits per SKILL.md §1.) |

A "node" is anything the eye must bind a label to: a box, a lane, a role
badge, a persistent arrow. Two parallel chips of the same kind (a row of
three example messages) count as ONE element — repetition of a known
referent is not a new node.

## 2. The build grammar

1. **Beat 1 stages the substrate** — the surface the structure will grow
   on (the empty transcript, the blank pipeline, the request envelope) —
   and NAMES every referent (§ technical-stage.md). The substrate is
   neutral; nothing is accented yet, or the one anchor node is.
2. **Each later scene adds exactly ONE element** — a node, an arrow, a
   lane, a role — and that element carries the scene's accent. The caption
   states the forcing constraint as a connective: "Because the model cannot
   run tools itself, the harness…".
3. **Established elements dim to neutrals but never disappear.** The whole
   structure-so-far is on stage at every moment — this is the v2 rail
   generalized beyond ladders: topologies, message flows, layer stacks,
   matrix views.
4. **Render builds as consecutive plates sharing the same stage drawing**
   — hairlines separate beats; the stage never re-boxes and never resets.
   A genuinely new stage (e.g. from the diagram to the widget) may open a
   visually distinct plate, but the referents travel with it unchanged.
5. **The final beat shows the earned whole** — everything accented is now
   neutral, and the takeaway names the structure ("that's the whole loop:
   four roles, one list"). That plate IS the diagram. Do not also attach a
   `diagram` layer restating it — no Input→Process→Output re-run of what
   the build just told; a separate reference view only if genuinely
   distinct (compare grids, decision tables), per SKILL.md §1.

## 3. The re-draw test (ship gate)

After the last build scene, the reader must be able to **re-draw the final
diagram from memory**: list the nodes, draw the arrows, say what forces
each arrow to exist. Test it on your scene list: does any arrow exist in
the final frame that no scene introduced with its "because"? If yes, add
the scene or cut the arrow. A diagram whose arrows the reader cannot
explain is decoration, and the reader knows it.

## 4. Worked example — a message-passing loop, built

Target picture (7 nodes — a build): roles `system · user · assistant ·
tool`, one tool call, one observation, one final answer, plus the loop-back
arrow.

- **Beat 1 (chapter):** empty transcript panel; role badges named:
  `system`, `user`, `assistant`, `tool`. Caption: "So every agent you can
  debug shows you the same artifact — a growing message list with four
  roles." (Substrate + referents. Nothing accented.)
- **Beat 2 (continue):** add the first `assistant` message carrying a
  `tool_call` body — the new row is accented, the JSON is the content.
  Caption: "But the model's answer is not text — it is a request for the
  harness to run something."
- **Beat 3 (continue):** add the `tool` message (the Observation) below
  it, accented; beat 2's row dims. Caption: "Because the model cannot
  execute anything, the harness runs the call and appends the result as a
  new message."
- **Beat 4 (continue):** the loop-back — the whole list re-wrapped in a
  fresh request envelope, token counter shown growing; prior rows all
  neutral, the envelope accent. Caption: "So the next turn re-reads the
  entire transcript — nothing is remembered; everything is re-sent."
- **Beat 5 (chapter, the widget):** a stepper runs the same transcript to
  `Final Answer` across two traces — the earned whole, now interactive.

Re-draw check: every arrow (call, append, re-send) was introduced with its
forcing constraint. The reader can rebuild it.
