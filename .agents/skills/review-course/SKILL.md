---
name: review-course
description: Craft review of course lessons against the 7 learning principles via the course-reviewer subagent. Takes a course slug or lesson list, returns severity-tagged findings (Critical/Warning/Suggestion) with file:line and a one-line fix each. Read-only; changes nothing.
---

# Review Course

Scope: the argument (course slug or lesson slugs), or ask which course. Dispatch the `course-reviewer` subagent with a self-contained prompt: the course file path and the lessons in scope (or the whole course).

Relay its findings **verbatim**, ordered by severity (Critical → Warning → Suggestion), including the counts and its "three fixes first" list. Do not fix anything and do not editorialize the findings — the user decides.

If the subagent is unavailable, fall back to `general-purpose` with "Read `.agents/agents/course-reviewer.md` and follow it exactly."
