# ByteSizedCodes — Product Execution Roadmap

Status: proposed implementation plan · 2026-07-31  
Planning horizon: prototype → validated learning platform

Phased delivery plans live under [`phases/`](./phases/). This file holds the
shared strategy, backend/data plan, metrics, analytics outline, validation
cadence, backlog, and decision gates.

---

## Strategy

The repository has enough infrastructure. The next milestone is not more pages
or more gamification. It is one coherent end-to-end learning journey:

> Choose a goal → receive a daily plan → learn actively → review later → build an artifact → see verified progress.

Implement and validate this journey on a small foundation course and one project
before expanding the catalog.

## Delivery phases

| Phase | Doc |
| --- | --- |
| 0 — Truthful and testable | [`phases/phase-0-truthful-and-testable.md`](./phases/phase-0-truthful-and-testable.md) |
| 1 — Unify learning loop | [`phases/phase-1-unify-learning-loop.md`](./phases/phase-1-unify-learning-loop.md) |
| 2 — Active AI Foundations | [`phases/phase-2-active-ai-foundations.md`](./phases/phase-2-active-ai-foundations.md) |
| 3 — Python and projects | [`phases/phase-3-python-and-projects.md`](./phases/phase-3-python-and-projects.md) |
| 4 — Auth and social | [`phases/phase-4-auth-and-social.md`](./phases/phase-4-auth-and-social.md) |
| 5 — AI Product Builder | [`phases/phase-5-ai-product-builder.md`](./phases/phase-5-ai-product-builder.md) |
| 6 — Expand curriculum | [`phases/phase-6-expand-curriculum.md`](./phases/phase-6-expand-curriculum.md) |

---

## Backend and data plan

### Required entities

- Auth users
- Profiles and learner goals
- Skills
- Learning units/content versions
- Enrollments and unit progress
- Attempts and skill evidence
- Review cards
- Projects and artifact checkpoints
- Feedback/reports
- Cohorts and memberships
- Notification preferences

### Data rules

- Public functions validate arguments and returns.
- User-data functions authenticate and verify ownership.
- Query lists use indexes and pagination.
- Scheduled work calls internal functions.
- No wall-clock reads in reactive queries; pass day keys or materialize state.
- Preserve immutable evidence events; derive summaries.
- Version content so old progress remains interpretable.

### Content storage

Keep authored instructional content in version-controlled TypeScript modules at
first.

Store in Convex:

- Learner state
- Attempts
- Reviews
- Project artifacts
- Social submissions
- Content version identifiers

Do not move all authored content into a CMS until nontechnical authoring is a
proven bottleneck.

---

## Metrics

### North-star learning metric

> Weekly learners who demonstrate one improved skill or complete one meaningful project checkpoint.

This excludes page views and empty streak activity.

### Activation

- Goal selected
- Diagnostic completed
- First useful action completed
- First investment saved

Target sequence:

- 70% complete first action
- 40% save progress/create account
- 30% return for the loaded next action

Targets are hypotheses; establish a baseline before treating them as commitments.

### Engagement

- Daily-plan completion
- Due-review completion
- Sessions after a missed day
- Weekly active learning days
- Voluntary reminder opt-in and disable rate

### Learning

- Diagnostic to delayed-test improvement
- Hint-free accuracy
- Transfer-question accuracy
- Misconception recurrence
- Mastery calibration
- Project rubric improvement

### Course

- Unit-to-unit continuation
- Time to first active interaction
- Code-run rate
- Project start and completion
- Abandonment point and stated reason

### Founder track

- Customer conversations completed
- Evaluation cases created before MVP
- Deployed prototypes
- External test users
- Repeat use
- Continue/pivot/stop decisions supported by evidence

### Social health

- Helpful rating for peer feedback
- Review reciprocity
- Reports per submission
- Opt-in project publication
- Whether feedback improves the next artifact version

---

## Analytics event outline

Core events:

- `onboarding_started`
- `goal_selected`
- `diagnostic_completed`
- `daily_plan_started`
- `daily_plan_completed`
- `unit_started`
- `interaction_submitted`
- `hint_used`
- `unit_completed`
- `review_graded`
- `capability_unlocked`
- `project_checkpoint_saved`
- `project_published`
- `peer_review_submitted`
- `reminder_changed`

Every event should include only necessary, privacy-safe properties:

- Anonymous/auth learner ID
- Content and version ID
- Skill IDs
- Track
- Session mode
- Duration bucket
- Result category

Do not put free-text explanations, code, email, or sensitive project data into
generic analytics payloads.

---

## Validation cadence

### Every two authored units

- Observe three learners use them without help.
- Record where they hesitate, guess, or misunderstand.
- Review wrong-answer clusters.
- Rewrite feedback before adding more content.

### Every project checkpoint

- Test with one learner from each intended audience.
- Confirm the artifact has value outside the course.
- Remove steps that only produce platform activity.

### Every month

- Review delayed learning, not only retention.
- Compare high-XP learners with demonstrated skill.
- Check whether reminders create returns after missed days.
- Interview people who stopped.

---

## Immediate backlog

### Now

- [ ] Update product positioning and remove stale phase copy
- [ ] Hide or clearly label simulated social data
- [ ] Fix topic deep links
- [ ] Resume courses from first incomplete lesson
- [ ] Add active completion to visual-only lessons
- [ ] Stop orphaned lesson SRS cards
- [ ] Add actual response timing

### Next

- [ ] Define skill and learning-unit schemas
- [ ] Add goal/level/time onboarding
- [ ] Build personalized daily plan
- [ ] Support authored review cards
- [ ] Add review effort grading
- [ ] Add diminishing repeat XP
- [ ] Consolidate duplicate foundation content

### Then

- [ ] Build reusable interaction renderer
- [ ] Finish active AI Foundations
- [ ] Upgrade Pyodide execution
- [ ] Add project artifact model
- [ ] Build Python mini-project
- [ ] Add authentication before real social features

---

## Decision gates

Stop or change direction if:

- Learners return for XP but delayed learning does not improve.
- Content takes too long to author without reuse.
- Beginners cannot explain the product or next action.
- Projects are completed only as platform forms and have no outside value.
- Founder learners build before validating a problem despite the sequence.
- Social comparison reduces participation among newcomers.

Double down if:

- Misconception feedback causes visible correction.
- Personalized daily plans increase meaningful completions.
- Saved artifacts drive return without reminders.
- One concept package is reused across multiple tracks.
- Projects produce portfolio, work, or customer value outside the platform.
