---
name: verify
description: One-shot mechanical validation of course content via the course-verifier subagent — typecheck, tests, scene registration, barrel consistency, minutes drift. Returns a PASS/FAIL table and a SHIP or FIX FIRST verdict. Read-only; fixes nothing.
---

# Verify

Dispatch the `course-verifier` subagent with a self-contained prompt: "Run your full check sweep from the repo root and return the report."

Relay the PASS/FAIL table and the final verdict **verbatim** — do not soften "FIX FIRST" or drop failures. Do not fix anything; the user decides next steps.

If the subagent is unavailable, fall back to `general-purpose` with "Read `.agents/agents/course-verifier.md` and follow it exactly."
