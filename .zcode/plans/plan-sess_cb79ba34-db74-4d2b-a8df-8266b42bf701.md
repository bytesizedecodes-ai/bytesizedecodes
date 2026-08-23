Fix the `infographics-interactive-expert_v1` skill that fails to load because its frontmatter `description` exceeds the 1,024-character limit.

## Step 1 — Trim the description (only change)

Edit line 3 of `.agents/skills/infographics-interactive-expert_v1/SKILL.md`, replacing the description with this (~975 chars, same style as the beginner/intermediate siblings):

```
THE skill for creating and editing EXPERT courses and lessons on ByteSizeDecodes — audience is senior practitioners (~5+ years of AI/ML) who have owned production systems. Use for ANY lesson, course page, infographic, widget, diagram, or cheat-sheet whose course has `level: "expert"` — first-principles visual storytelling (the First-Principles Ladder: derive the design from fundamental constraints rung by rung, plus where the derivation breaks) inside the Problem-First Diagnostic (CER) framework, one persistent production case, terse one-line anchors, full technical precision with NO jargon simplification (exempt from the plain-English gate), full formulas, real code, failure modes, open minimal widgets, and exactly 2 scenario MCQs with 3–4 choices. Read the course's `level` in `content/courses.ts` first; if it says "expert", THIS is the skill — not the generic v6. Derived from infographics-interactive_v6 (the superset); this is v6 pre-calibrated to experts.
```

Cut from the original (all detail preserved in the skill body): "and made architectural trade-offs", "with competing constraints", "(kept, never whimsical)", "higher scene density", "and edge cases", plus minor wording tightening. All routing signals kept: the `level: "expert"` trigger in `content/courses.ts`, audience definition, CER + Ladder + boundary, plain-English-gate exemption, exactly-2-MCQs rule, and the v6 relationship.

## Step 2 — Verify

1. Count the new description's length to confirm < 1,024 (target ~975, byte-safe even with multibyte dashes).
2. Scan all `.agents/skills/*/SKILL.md` descriptions for any others over 1,024 (e.g. a short awk/perl loop) to make sure no other skill is silently failing to load.
3. Note: the skill will show up in the available-skills list starting from the next session (skills load at session start).

## Optional (flag, not default)

`intermediate_v1`'s description is ~1,016 chars — 8 under the limit. Leave it as-is unless you want a small safety trim; say so when approving and I'll tighten it the same way.