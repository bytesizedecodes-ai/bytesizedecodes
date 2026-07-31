# ByteSizedCodes — Repository and Product Audit

Status: current-state audit · 2026-07-31  
Scope: learner experience, courses, practice, retention, progress, and product positioning.

---

## Executive finding

ByteSizedCodes already has a stronger technical foundation than its visible product suggests:

- Reactive Convex persistence is active.
- Four procedural drill generators cover five difficulty levels each.
- Spaced repetition, topic mastery, XP, streaks, course progress, and executable Python already exist.
- The infographic components create a recognizable visual teaching style.

The main problem is no longer “can this be built?” It is **product coherence**.

The repository currently behaves like four partially connected products:

1. A visual course library under `/courses`
2. A separate Byte lesson library under `/bytes`
3. An interview-oriented drill and review app
4. A demo social layer with a global leaderboard and fake presence

They share some infrastructure, but they do not yet produce one clear learner journey. The next phase should unify them around:

> Learn a concept, practise it, prove mastery, and use it to build something.

The platform can serve beginners, students, professionals, and founders, but it should not present one generic curriculum to all of them. A short onboarding should choose the learner’s **goal**, **starting level**, **available time**, and **desired outcome**, then assemble a path from shared course modules.

---

## What exists today

### Learning surfaces

- `/courses` lists two visual courses from `content/courses.ts`.
  - `machine-learning`: four foundational lessons with prose and MCQs; one lesson has a Pyodide exercise.
  - `machine-learning-for-layman`: five infographic-only lessons with no questions or completion interaction.
- `/bytes` contains three independent lessons:
  - Precision and recall
  - Gradient descent
  - Tensors and shapes
- `/practice` serves procedural questions from:
  - Confusion matrix metrics
  - Tensor shapes
  - Gradient steps
  - Output heads and loss functions
- `/review` presents due drill cards using the SM-2 scheduler.
- `/mastery` visualizes durable mastery for procedural-drill topics.
- `/today` shows the user’s next Byte, review queue, practice CTA, streak, XP, and seven-day activity.

### Interaction and reward systems

- MCQs with immediate explanations: `components/ByteBody.tsx`
- Procedural questions with misconception-specific feedback: `components/DrillPlayer.tsx`
- Runnable Python via Pyodide: `components/CodeCell.tsx`
- Variable XP and critical rewards: `lib/data/xp.ts`, `convex/lib/xp.ts`
- Streaks and earned freezes: `lib/data/streak.ts`, `convex/lib/streak.ts`
- Spaced repetition and topic mastery: `lib/srs.ts`, `convex/lib/srs.ts`
- Reactive persistence: `lib/data/provider.tsx` → Convex queries and mutations
- Demo leaderboard and aggregate stats: `components/Leaderboard.tsx`, `components/StatsBoard.tsx`

### Backend state

The application is no longer frontend-only:

- `convex/schema.ts` defines profiles, SRS cards, progress, attempts, and XP events.
- `convex/queries.ts` and `convex/mutations.ts` are active.
- The frontend provider uses `ConvexProvider`, `useQuery`, and `useMutation`.
- Identity is still an unauthenticated local browser UUID.
- The rollover cron exists but is disabled.

---

## What is already good

### 1. Misconception-based feedback is a real differentiator

The generated drills do not merely mark an answer wrong. Distractors encode a specific error such as swapping precision and recall or forgetting convolution padding. This is far more educational than generic quiz feedback and should become a platform-wide content standard.

### 2. The visual course format is memorable

The infographic registry in `components/infographic/index.tsx` provides a coherent teaching medium. Most AI learning sites are text/video libraries. ByteSizedCodes can own “visual explanation followed by active practice.”

### 3. Practice has effectively unlimited supply

Generators are deterministic functions of seed and difficulty. This solves the content-volume problem for selected topics and enables daily practice without publishing a new lesson every day.

### 4. Mastery is based on memory, not clicks

`app/mastery/page.tsx` derives mastery from review intervals rather than lesson completion. That is honest and aligns rewards with learning.

### 5. The data seam worked

The provider was moved from local storage to Convex without changing the component API. That validates the architecture described in the earlier planning documents.

### 6. Course lessons already support interactive enrichment

`ByteBody` is reused by both standalone Bytes and course lessons. Existing lessons can gain questions and code without redesigning the route system.

---

## Critical product gaps

### P0 — fix before inviting real users

#### 1. Product copy and documentation are materially stale

The site still says “Phase 0,” “progress lives in this browser,” and “accounts arrive with Phase 1,” although progress is already stored in Convex. `README.md`, the footer, homepage, login screen, course pages, and earlier planning documents contradict the running architecture.

Why it matters: users cannot know what is real, private, persistent, or demo-only.

Action:

- Remove phase labels from the learner-facing product.
- Replace “saved in this browser” with an accurate preview statement.
- Add one current architecture/status document and mark `00`–`03` as historical plans.

#### 2. Identity is not safe for real multi-user use

The browser sends a trusted UUID and public mutations accept it. A user can impersonate another ID. This is acceptable for a private prototype, not for public accounts, social features, paid access, or meaningful leaderboards.

Action:

- Add Convex Auth before public social or payment features.
- Resolve user identity in the backend; do not accept `userId` from the client.
- Add ownership checks to every user-data function.

#### 3. Demo social proof is presented like live product data

The leaderboard is populated with seeded learners, and “practising now” is generated from the current minute. The homepage discloses this only in small text.

Why it matters: social proof built on simulated activity can destroy trust.

Action:

- Hide the board until it contains real consenting users, or label every demo module prominently.
- Do not implement a global lifetime-XP leaderboard as the final design. Use weekly, cohort-relative, or personal-best comparisons.

#### 4. The two content systems are disconnected

`content/bytes/*` and `content/courses.ts` are parallel systems. They duplicate concepts, progress namespaces, and authoring models. `/today` recommends only standalone Bytes and ignores course progress.

Action:

- Make “learning units” one canonical content model.
- A lesson may contain visual scenes, prose, questions, code, review-card definitions, and project checkpoints.
- Courses and daily Bytes should become two views over the same units, not separate libraries.

#### 5. Course questions create unusable review records

Correct course/Byte answers call the same `submitAttempt` mutation as drills, which creates SRS cards. But `getReviewQueue` filters out any key that does not match `gen:<generator>:<difficulty>`. Those lesson cards are stored but can never appear in review.

Action:

- Define reviewable content as a typed item with a renderer reference and prompt snapshot.
- Support generator-backed and authored cards in the same review queue.
- Migrate or delete orphaned course/Byte cards.

#### 6. Layman lessons cannot be completed

The layman course intentionally has no prose or questions. `LessonBody` is only rendered when prose exists, and completion lives inside `ByteBody`. Therefore the visual-only lessons have no completion action, XP, saved investment, or retrieval step.

Action:

- Add a lightweight “I understood this” flow only after one active interaction.
- Better: add one prediction, sorting, hotspot, or explain-back interaction to every visual lesson.
- Never award mastery for scrolling to the bottom.

---

## High-priority experience gaps

### 1. The homepage promise is too narrow

“Five minutes a day until the interview” excludes curious beginners, professionals, and founders. Interview preparation should be a path, not the platform identity.

Recommended umbrella promise:

> Learn AI visually. Practise it. Build something real.

Supporting paths:

- Understand AI
- Build ML skills
- Prepare for a role
- Ship an AI product

### 2. “Today” does not assemble a real daily plan

It offers three choices but does not decide what the learner should do. It also ignores courses.

Replace it with one primary CTA:

> Continue today’s 7-minute plan

The plan should contain, in order:

1. Due reviews
2. One weak-skill drill
3. The next small course step or project checkpoint

Allow “Quick 3 min,” “Standard 10 min,” and “Deep 25 min” modes.

### 3. Course pages start from lesson one instead of resuming

The course CTA always links to the first lesson. It should resolve the first incomplete lesson, show course progress, and recommend the next action.

### 4. Course completion is all-or-nothing and MCQ-heavy

Every question must be correct before completion, but code success is not required. This rewards answer retrying more than applied skill.

Action:

- Use completion requirements by lesson objective:
  - Concept: one prediction + one explain-back
  - Procedure: worked example + faded practice
  - Coding: hidden tests must pass
  - Project: artifact checkpoint must be saved
- Permit mistakes; require correction and reflection rather than a perfect first attempt.

### 5. Review grading throws away useful learner judgment

The UI maps correct to “good” and incorrect to “again.” SM-2 supports Again, Hard, Good, and Easy, but the user cannot report effort.

Action:

- After revealing the answer, ask “How hard was that?” with four buttons.
- Combine correctness, response time, hints, and self-rating to schedule the next review.

### 6. Mastery excludes course learning

The mastery page honestly admits that only four drill topics count. This makes most course work invisible.

Action:

- Define skill IDs shared by lessons, questions, drills, and projects.
- Every activity emits evidence against one or more skill IDs.
- Display separate dimensions:
  - Understanding
  - Recall
  - Application
  - Project proof

### 7. Mastery deep links do not reliably select the target topic

Mastery links use `/practice?topic=...`, while the current practice page initializes its own default and does not consume that query parameter.

Action:

- Make practice selection URL-driven.
- Preserve topic, difficulty, and mode in query parameters so links and browser history work.

### 8. XP can be farmed without additional learning

A correct drill awards deterministic XP every time it is submitted. The amount is stable, but there is no daily uniqueness or diminishing return.

Action:

- Full XP on first correct answer for an item/day.
- Reduced fluency XP for repeated practice.
- Large XP only for durable review, transfer questions, code passes, and project artifacts.

### 9. Navigation exposes the implementation instead of the learner journey

Courses, Practice, Review, Mastery, Bytes, and Login are all top-level destinations. On mobile this is crowded, and “Bytes” versus “Courses” is an internal distinction.

Recommended navigation:

- Today
- Learn
- Build
- Progress
- Profile

Practice and Review become parts of Today and Progress. Bytes become a unit format inside Learn.

---

## Medium-priority gaps

- Pyodide runs on the main browser thread. A runaway loop can freeze the page despite the earlier plan calling for a Web Worker and timeout.
- The Python runner does not persist code, provide reset/diff controls, or award progress/XP based on passing tests. Existing code exercises are therefore outside the verified learning loop.
- Generated questions already declare `relatedBytes`, but `DrillPlayer` does not render them. Some referenced slugs also do not exist, so this repair path must be validated before it is exposed.
- Lesson attempts record `msTaken: 0`, reducing the value of difficulty analytics.
- The global leaderboard ranks lifetime XP, favoring early users and discouraging newcomers.
- Course prerequisites, outcomes, projects, and skill mappings are absent from the content types.
- There is no diagnostic assessment or goal onboarding.
- There is no saved project portfolio, even though “build something real” should be the long-term investment.
- There is no feedback channel on a question or lesson (“confusing,” “wrong,” “too easy”).
- No analytics event model is visible for activation, completion, confusion, or retention experiments.
- The retention trigger is not implemented: email delivery is absent and Convex crons are disabled.
- The placeholder login offers password and GitHub controls even though the selected plan is Google OAuth with email OTP fallback.
- Contributor guidance and early architecture documents still describe an MDX/localStorage frontend that no longer matches the typed-TypeScript/Convex implementation.

---

## Recommended product architecture

### One content graph

Use these entities:

- **Skill** — durable capability such as “choose a metric for imbalanced classification.”
- **Learning unit** — one short concept and interaction.
- **Course** — an ordered path through units and projects.
- **Practice item** — authored or generated evidence for a skill.
- **Project** — a sequence of artifact checkpoints.
- **Track** — a goal-based recommendation over shared courses.

Do not duplicate a concept because it appears in two tracks. Reuse the same unit and vary the surrounding examples or optional challenge.

### One learner state

Track:

- Goal and time budget
- Skills demonstrated
- Due reviews
- Course position
- Saved code and project artifacts
- Reflection and confidence
- Social preferences and privacy

### One daily loop

The user should not choose among six systems every day. The platform should assemble:

> Review something due → solve one meaningful problem → continue one build.

That single loop can serve every audience because the selected skill and project differ by goal.

---

## Recommended immediate decisions

1. Adopt the broad platform promise: **Learn AI visually. Practise it. Build something real.**
2. Keep four goal-based tracks but share one skill graph.
3. Unify Bytes and course lessons before authoring significant new content.
4. Make every lesson active; remove visual-only completion.
5. Make review support authored course items.
6. Replace the global demo leaderboard with private/personal progress until auth and real cohorts exist.
7. Build authentication and accurate product copy before public validation.
8. Make a small founder project the first end-to-end “learn → build → share” proof.

