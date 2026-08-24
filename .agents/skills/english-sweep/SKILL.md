---
name: english-sweep
description: Batch rule-12 English simplification across course files. Use for "simplify the English in <courses>" or periodic sweeps. Confirms the course list, fans out english-simplifier subagents one per file (max 4 concurrent), then runs typecheck + content tests once and reports per-course stats. Never commits.
---

# English Sweep (rule 12, batch)

You (the main agent) orchestrate; one `english-simplifier` subagent per course file. Files are independent — one agent per file so a single failure never blocks the batch.

## 1. Scope (AskUserQuestion)

Offer: all courses / a named list / only files currently modified (`git status --porcelain content/courses/`). Confirm the final list before dispatching.

## 2. Dispatch

One `english-simplifier` subagent per file, parallel batches of **max 4 concurrent** (larger batches hit API rate limits). Queue the rest; dispatch as earlier ones finish. Each prompt must be self-contained: the course file path (absolute), its level (beginner/intermediate get the jargon-gloss treatment; expert keeps terms), and the report contract — strings edited, sentence stats before/after, typecheck + `npx vitest run content/` results. Tell it: touch only that file, never commit.

## 3. Failures

- Subagent fails or returns no stats → re-dispatch once with the same prompt.
- Fails again → mark the file "not swept" and continue; never block the batch.
- If a subagent name is unavailable, fall back to `general-purpose` with "Read `.agents/agents/english-simplifier.md` and follow it exactly."

## 4. Final check (you)

`npm run typecheck` && `npx vitest run content/` — each agent ran these, but run once more after the whole batch to catch cross-file issues.

## 5. Report

Table: course → strings edited → sentences >30 words before → after → tests green. List any unswept files with the reason. **Never commit** — the user reviews the diff.
