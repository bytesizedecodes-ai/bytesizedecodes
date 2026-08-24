---
name: course-pipeline
description: End-to-end interactive lesson authoring flow. Use when adding lessons to a course, rewriting lessons, or creating a new course. Asks which course + scope, drafts the lesson plan for approval, then sequences course-author → course-reviewer → course-verifier subagents, with one Critical-fix round. Never commits — reports for user review.
---

# Course Pipeline (author → review → verify)

You (the main agent) gather the decisions and sequence the workers. The workers are subagents: `course-author`, `course-reviewer`, `course-verifier`. The pipeline is sequential.

## 1. Gather (AskUserQuestion)

- **What**: new course / add lessons to an existing course / rewrite existing lessons?
- **Which course** (slug from `content/courses/`), or for a new course: name + level (`beginner|intermediate|expert`) + track
- **How many lessons**, and the source: a plan doc in `plans/`, pasted material, or invented from the level skill
- Offer to read the relevant `plans/` doc if one matches

## 2. Plan (checkpoint — do not skip)

Read `content/courses/<slug>.ts` (level, tone, running case, existing slugs) and the matching skill `.agents/skills/infographics-interactive-<level>_v2/SKILL.md`. Draft a per-lesson plan: slug, anchor metaphor, StoryMap slots, through-line stage, scene list (chapter|continue + connective caption + the ONE delta), MCQ scenarios, minutes. New course: also the barrel entry, the course case + persistent diagram, and registry approach. **Present the plan and get explicit user approval before dispatching anything.**

## 3. Author

Dispatch ONE `course-author` subagent. Its prompt must be self-contained (it starts fresh): course slug, level, the exact approved lesson specs, and the hard constraints (2 scenario MCQs with misconception explanations, jargon gate for beginner/intermediate, rule-12 English, Thread contract — StoryMap + connective captions + stable stage + one delta per scene, never touch existing `minutes`, never commit). The subagent reads the v2 skill itself — tell it to.

## 4. Review

Dispatch `course-reviewer` on the changed lessons. Relay its findings to the user unchanged.
- Any **Critical** → ONE fix round: re-dispatch `course-author` with the findings list. No endless loops.
- If the fix round changed lesson structure, re-review only those lessons.

## 5. Verify

Dispatch `course-verifier` for the mechanical sweep. Relay its PASS/FAIL table and verdict **verbatim** — never soften "FIX FIRST".

## 6. Report

Lessons added/edited, review counts before/after the fix round, verifier verdict, files touched. **Never commit** — the user reviews the diff.

## Rules

- Every dispatch prompt is self-contained: subagents start with no context from this conversation.
- If a subagent name is unavailable, fall back to `general-purpose` with "Read `.agents/agents/<name>.md` and follow it exactly."
