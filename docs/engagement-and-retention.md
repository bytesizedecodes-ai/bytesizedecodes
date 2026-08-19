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
| Variable reward | Energy + levels (deterministic, anti-grind, crit rolls) | ✅ built | `convex/lib/xp.ts`, `components/StatsHud.tsx` |
| Variable reward | Streaks + freezes (1 freeze per 7 days) | ✅ built | `convex/lib/streak.ts`, `components/StatsHud.tsx` |
| Variable reward | Reward banner (CSS pop, crit variant) | ✅ minimal | `components/RewardBanner.tsx` |
| Investment | Skill evidence + mastery tracking | ✅ built | `convex/schema.ts` `skillEvidence`, `app/progress` |
| Investment | Free account identity (progress sticks) | ✅ built | Convex Auth social OAuth |
| — | Opt-in project gallery | ✅ built (read-only) | `app/gallery`, `projects` table |
| — | Rollover cron (settles streaks/freezes nightly) | ✅ where enabled | `convex/crons.ts` |
| — | Freemium / Plans narrative | ✅ marketing | `/plans`, `content/plans.ts` |

## What is missing — the habit-formation gaps

These are the gaps that matter for retention. Ranked by leverage.

### 1. External triggers are generic, not personalized ⚠️ (highest-impact gap)
Outbound email infrastructure **now exists**: `convex/crons.ts` runs
`daily_due_reminder` (09:00 IST) and `weekly_digest` (Mon 10:00 IST) through
Resend (`convex/admin/emailActions.ts`), admin-toggleable in `adminTriggers`,
plus broadcast campaigns (`app/admin/email/page.tsx`). But the current sends are
generic `{{name}}` broadcasts to all users with an email — not per-user content.
- **SRS due cards are a strong *internal* trigger, but the user doesn't know
  they're waiting without opening the app. A personalized daily email ("3 cards
  due, ~4 min, starts with the skill you missed yesterday") is the top gap.**
- No "your streak is at risk" nudge, no per-user weekly recap with real stats.
  Web push / notifications: still zero code.

### 2. The leaderboard is fully built but hidden (and conflicts with strategy)
`components/Leaderboard.tsx`, `useLeaderboard`, and demo-seeded profiles
all exist — but the component is **imported by zero pages**. It ranks by
**global lifetime XP**. The strategy doc flags this as an anti-pattern.
- **Resolution:** do not ship the global-XP leaderboard as-is. Prefer
  cohort/weekly or personal-best (see "Leaderboard decision" below).

### 3. `weeklyMinutes` is partially tracked
Onboarding asks for weekly time (30/75/150 min) and it's persisted. `/today`
shows an estimated progress (`practised days × session minutes` vs goal). True
timer-based tracking is still a gap, but the weekly goal is no longer only static.

### 4. No achievements / badges / milestones
Raw `skillEvidence` only — no trophies, unlock moments, or capability statements
surface UX.

### 5. Onboarding plants a light return-visit hook
Onboarding copy points learners to tomorrow’s Due items on `/today`. Reminder
opt-in / email is still deferred.

### 6. Celebratory moments are minimal
One CSS-pop banner is the entire reward vocabulary — no dedicated level-up
modal or streak-milestone celebration.

## Hooked model → what to build (mapped to the strategy)

### Trigger (the biggest gap)
1. **Decide on a channel.** Email is available after social sign-in for many
   users; Web push needs service worker + VAPID. **In-app (shipped):**
   `/today` shows due count + time estimate and Continue CTA with due
   context. **Shipped but generic:** Resend daily/weekly admin triggers
   (`convex/crons.ts`). **Next:** personalize the daily send (due count, est.
   time, the exact skill/step, one deep link) with per-user opt-in.
2. **Reminder content** (from the strategy): due count, est. time, the exact
   skill/step, one deep link. Never *"your streak is about to die."*
3. **New-content trigger:** publish 2 visual concepts/week; reminders point at
   active practice + self-checks, not only read.

### Action
Mostly done — daily plan and time modes are solid. Gaps:
1. First-session "aha" before account is optional for *reading*; Begin still
   wants account for a saved path. Free SEO courses reduce signup friction.
2. Resume the first incomplete step mid-lesson where possible.

### Variable reward
1. **Reward of the self (priority):** capability statements on mastery.
2. Tame crit rolls if loot-box feel is strong (`xp.ts`).
3. Real level-up moment beyond the single banner line.

### Investment
1. Saved notes / “explain in my words” — not built.
2. Personal cheat-sheet from completed units — not built.
3. Exportable project artifacts — gallery exists; stronger personal export is still the moat.
4. Surface yesterday’s misconceptions on today’s plan — data exists; UX doesn’t.

## Leaderboard decision

**Do not ship the hidden global-XP leaderboard as-is. Build cohort or personal-best,
or leave comparison out for v1.**

| Option | Verdict |
| --- | --- |
| Ship global lifetime XP | ❌ Conflicts with strategy |
| Cohort + weekly | ✅ Matches strategy Experiment 5 |
| Personal best only | ✅ Safest for v1 |
| None for v1 | ✅ Recommended if launch is soon |

## Pre-launch retention checklist

1. ~~Activate `weeklyMinutes` as a tracked weekly goal on `/today`~~ (estimate on `/today`)
2. ~~Add in-app “N due” on `/today`~~
3. ~~Decide leaderboard~~ (orphaned global-XP component + query removed; revisit as
   cohort/weekly or personal-best only if comparison ships later)
4. ~~Plant a return hook in onboarding~~ (copy); reminder opt-in later.
5. ~~Capability-statement rewards~~ (RewardBanner + lesson capability)
6. ~~Level-up treatment~~ (CelebrationModal for level-ups and streak milestones)
7. Personalize the outbound daily reminder (Resend infra exists; sends are
   still generic broadcasts, not per-user due counts).
8. Product-facing effort currency is **Energy** (not XP).
9. Pro = advanced courses + GitHub AI project portal (work/startup/hobby) — not an AI coach.
10. ~~Course skill map squares~~
11. ~~Mastery Challenge packaging~~ (`/review`, daily plan, Progress)
12. ~~Khan-style mastery ladder labels on Progress topics~~

## Pending at launch (deferred on purpose)

Tasks deliberately parked until launch time. Do them last; don't pull them
into the current phase.

| # | Task | Why it's deferred | Where it will touch |
| --- | --- | --- | --- |
| L1 | **Personalize the daily reminder email** — per-user content ("3 cards due, ~4 min, starting with the skill you missed yesterday") with per-user opt-in, replacing the generic `{{name}}` broadcast | Highest-impact remaining retention lever, but belongs to the launch push alongside opt-in flows and send-window tuning | `convex/crons.ts`, `convex/admin/emailActions.ts`, `app/admin/email/page.tsx`; see checklist item 7 |
| L2 | **Manual visual + flow QA pass before deploy** — one full lesson in dark *and* light themes, the course-completion flow (last lesson → completion card → next-course CTA), `/today` per track, and the celebration modals | Verifies the celebration/CTA/repair-card changes render correctly in both themes before real users see them | Manual pass; no code expected unless bugs surface |

## Ethical guardrails (non-negotiable)

- Streak pause (freeze) is visible and free. Never pay to preserve a streak.
- Missing a day never destroys earned mastery or artifacts.
- Reminders are optional, transparent, easy to stop.
- The platform explains *why* an item is recommended.
- Users can export their work and learning history (Profile).
- Public comparison is opt-in. Never rank beginners against experienced users.
- Never fabricate social activity (`practicingNow` fake must not ship as real).

## Metrics to track (and not track)

**Track** (learning-aligned): learning gain per session, return after a missed
streak, voluntary reminder disable rate, % of sessions ending with a
demonstrated skill or artifact, whether high XP correlates with delayed-test
performance.

**Do not optimize**: raw time on site, notification volume, page views per
session, streak length without learning evidence.
