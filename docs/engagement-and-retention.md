# Engagement and retention

The habit-formation **strategy** lives in
[`../plans/coherent-v1/02-hooked-engagement-strategy.md`](../plans/coherent-v1/02-hooked-engagement-strategy.md)
(Nir Eyal's Hooked model: Trigger → Action → Variable Reward → Investment).
This doc is the **engineering reality**: what is built today, what is missing,
and what to change before launch. Read both — the strategy is the *why*,
this is the *what exists and what to build next*.

## What is built today (and where)

| Hook stage | Feature | Status | Where |
| --- | --- | --- | --- |
| Action | Daily plan (review → weak-skill → next unit) | ✅ built | `convex/lib/dailyPlan.ts`, `app/today` |
| Action | Time modes (quick 3m / standard 10m / deep 25m) | ✅ built | `content/tracks.ts`, `app/today` |
| Investment | Spaced repetition (SM-2, anti-abandonment cap=20) | ✅ built | `convex/lib/srs.ts`, `app/review` |
| Variable reward | XP + levels (deterministic, anti-grind, crit rolls) | ✅ built | `convex/lib/xp.ts`, `components/StatsHud.tsx` |
| Variable reward | Streaks + freezes (1 freeze per 7 days) | ✅ built | `convex/lib/streak.ts`, `components/StatsHud.tsx` |
| Variable reward | Reward banner (CSS pop, crit variant) | ✅ minimal | `components/RewardBanner.tsx` |
| Investment | Skill evidence + mastery tracking | ✅ built | `convex/schema.ts` `skillEvidence`, `app/progress` |
| — | Opt-in project gallery | ✅ built (read-only) | `app/gallery`, `projects` table |
| — | Rollover cron (settles streaks/freezes nightly) | ✅ enabled | `convex/crons.ts` |

## What is missing — the habit-formation gaps

These are the gaps that matter for retention. Ranked by leverage.

### 1. No external triggers — the user is never pulled back ⚠️ (highest-impact gap)
There are **zero notifications, reminders, or emails**. The only cron settles
streaks internally; it sends nothing outward. The product relies entirely on
the user opening the app unprompted. This is the single biggest reason a daily
habit will not form.
- SRS due cards are a strong *internal* trigger, but the user doesn't know
  they're waiting without opening the app.
- No "your streak is at risk" nudge, no "2 cards due" push, no weekly recap.
- Auth is anonymous + Google only — **no email is collected**, so an email
  channel requires adding email to the identity model first (a real decision,
  not a config toggle).

### 2. The leaderboard is fully built but hidden (and conflicts with strategy)
`components/Leaderboard.tsx`, `useLeaderboard`, and the demo-seeded profiles
all exist — but the component is **imported by zero pages**. It ranks by
**global lifetime XP**. The strategy doc explicitly flags this as an
anti-pattern: *"Do not rank beginners against experienced users"* and
Experiment 5 tests personal-best/cohort vs **no** comparison.
- **Resolution:** do not ship the global-XP leaderboard as-is. If a social
  comparison is wanted, build the cohort/weekly variant the strategy describes
  (see "Leaderboard decision" below). The existing component is reusable but
  needs its ranking basis changed.

### 3. `weeklyMinutes` is captured but never tracked
Onboarding asks for weekly time (30/75/150 min) and it's persisted and
validated — but it's shown only as a static label (`app/profile`). There is no
"X / 75 min this week" progress, no over/under-target state, no weekly summary.
This is a captured goal with no feedback loop — a missed retention opportunity
that's almost free to activate.

### 4. No achievements / badges / milestones
The only "evidence" concept is the raw `skillEvidence` table. There is no
badges table, no trophy case, no milestone definitions, no unlock moments.
The strategy's "reward of the self" (capability statements like *"You can now
explain why accuracy fails on imbalanced data"*) is the right shape for this
but is not built.

### 5. Onboarding plants no return-visit hook
Onboarding captures goal/level/time and redirects to `/today`. It never sets a
"come back tomorrow" expectation, never asks for notification permission, never
reveals the streak/due-card loop. The first "aha" the strategy wants (before
XP) is not constructed.

### 6. Celebratory moments are minimal
One CSS-pop banner is the entire reward vocabulary. No level-up screen, no
confetti, no sound, no streak-milestone celebration. Compare to the strategy's
"capability unlocks" — none of those fire today.

## Hooked model → what to build (mapped to the strategy)

The strategy doc is the source of truth for *why*. Here is the execution view.

### Trigger (the biggest gap)
1. **Decide on a channel.** Email requires collecting email (identity change).
   Web push requires a service worker + VAPID keys. In-app "due cards" banner
   only works when the user is already open. **Recommendation:** start with
   email once Google OAuth is live (you'll have emails), and an in-app
   "streak at risk" / "N due" banner on `/today` and `/` as the zero-friction
   first step.
2. **Reminder content** (from the strategy): include due count, est. time, the
   exact skill/step, and one deep link. Never *"your streak is about to die."*
3. **New-content trigger:** publish 2 visual concepts/week; the reminder points
   at the prediction + practice, not just the read.

### Action
Mostly done — the daily plan and time modes are solid. Gaps:
1. **First-session "aha" before signup.** The strategy wants a 2-minute
   diagnostic that yields one insight before any account prompt. Not built.
2. **Resume the first incomplete step**, not the first lesson. Partially done
   via `getNextUnit`; verify it resumes mid-lesson, not just next lesson.

### Variable reward
1. **Reward of the self (priority).** Build capability statements that fire on
   mastery thresholds — *"You can now choose precision vs. recall for a case."*
   This is healthier and more retentive than XP alone.
2. **Tame the existing crit rolls** if they feel slot-machine-like. Currently
   5% ×3 and 20% ×2 (`xp.ts:56-58`) — the strategy warns against loot-box feel.
3. **Level-up moment.** Replace the single banner line with a real level-up
   screen/modal (keep it tasteful; no confetti for trivial actions).

### Investment (the strongest moat — per the strategy)
1. **"Explain it in my words" + saved notes.** Not built; high value.
2. **Personal cheat-sheet from completed units.** Not built.
3. **Project artifacts on profile, exportable.** Gallery exists; the
   exportable personal artifact is the retention moat the strategy emphasizes.
4. **Make tomorrow visibly use today's data** — e.g. *"Yesterday you mixed up
   the threshold direction. Today starts there."* The data exists
   (`skillEvidence`, `attempts`); the surfacing does not.

## Leaderboard decision (the question you asked)

**Short answer: do not ship the hidden global-XP leaderboard. Build a cohort
version instead, or leave comparison out for v1.**

The existing `Leaderboard.tsx` ranks all users by total lifetime XP. The
strategy doc — which you should treat as the product's stated intent —
explicitly lists this as a pattern to avoid, because it demoralizes beginners
and rewards time-on-platform over learning. Before launch, choose one:

| Option | What it is | Verdict |
| --- | --- | --- |
| Ship as-is (global lifetime XP) | What's built today | ❌ Conflicts with strategy; demoralizes new learners |
| Cohort + weekly | Rank only against same-goal/same-level peers, reset weekly; ranks effort not just history | ✅ Matches strategy Experiment 5; reuses the component with a new query |
| Personal best only | No social comparison; show "you beat your own weekly best" | ✅ Safest for v1; zero moderation risk |
| None for v1 | Defer all comparison; ship notifications + capability rewards first | ✅ Recommended if launch is soon |

The existing component is salvageable for any option — the change is the
backend query basis (`getLeaderboard` at `convex/queries.ts:591`), not the UI.

## Pre-launch retention checklist

Before going live, in priority order:

1. **Activate `weeklyMinutes` as a tracked weekly goal** (cheapest win; data
   already exists). Show progress vs target on `/today` and `/progress`.
2. **Add an in-app "N due / streak at risk" prompt** on `/today` and the home
   page (zero infra — no email/push needed).
3. **Decide the leaderboard question** above and either rebuild or remove the
   orphaned component so it doesn't ship half-wired.
4. **Plant a return hook in onboarding** — reveal the streak + due-card loop,
   and (once a channel exists) ask for reminder opt-in.
5. **Build at least one "reward of the self"** (capability statement) so the
   variable reward isn't only XP.
6. **Add a real level-up moment** to replace the single banner line.
7. **Once Google OAuth is live + email exists**, add the daily reminder email
   (the strategy's primary external trigger).

## Ethical guardrails (from the strategy — non-negotiable)

These are enforced by product decision, not code. Do not violate them to hit
a retention number:

- Streak pause (freeze) is visible and free. Never pay to preserve a streak.
- Missing a day never destroys earned mastery or artifacts.
- Reminders are optional, transparent, easy to stop.
- The platform explains *why* an item is recommended.
- Users can export their work and learning history.
- Public comparison is opt-in. Never rank beginners against experienced users.
- Never fabricate social activity (the `practicingNow` fake in
  `StatsBoard.tsx` must not ship as real).

## Metrics to track (and not track)

**Track** (learning-aligned): learning gain per session, return after a missed
streak, voluntary reminder disable rate, % of sessions ending with a
demonstrated skill or artifact, whether high XP correlates with delayed-test
performance.

**Do not optimize**: raw time on site, notification volume, page views per
session, streak length without learning evidence.
