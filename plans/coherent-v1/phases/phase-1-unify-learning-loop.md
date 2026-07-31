# Phase 1 — Unify the learning loop

Parent: [`../05-product-execution-roadmap.md`](../05-product-execution-roadmap.md)  
Duration: 2–3 weeks  
**Status: technical loop implemented (2026-07-31).** Content consolidation / prediction-application authoring continues in Phase 2.

## Product work

- Add goal, level, and time-budget onboarding.
- Replace the Today choice grid with one assembled daily plan.
- Add Quick, Standard, and Deep time modes.
- Unify Byte and course progress in the learner experience.
- Add “How hard was that?” controls to review.
- Replace generic mastery percentages with capability statements.

## Technical work

- Define canonical `Skill` and `LearningUnit` types.
- Add stable skill IDs to existing content and generators.
- Create typed review sources for generator and authored items.
- Add a daily-plan query that prioritizes:
  1. Due reviews
  2. Weak skills
  3. Current course/project
- Add attempt uniqueness and diminishing XP for repetition.
- Preserve unfinished lesson answers and code.
- Record verified code-test results as skill evidence and include them in
  completion rules.
- Add event analytics for onboarding, plans, lessons, review, and completion.

## Content work

- Consolidate duplicate AI/ML/DL introductory lessons.
- Add one prediction and one review item to each foundation lesson.
- Add one application case per lesson.
- Create plain-language and technical-detail layers rather than separate
  duplicate courses.

## Exit criteria

- At least 70% of new testers complete their first useful action.
- At least 60% can resume without choosing a topic manually.
- Authored lesson items appear correctly in delayed review.
- A learner’s recommendation visibly changes after a misconception.
