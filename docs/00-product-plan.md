# ByteSizedCodes — Product Plan

Status: draft v1 · Owner: Suren · Last updated: 2026-07-26

---

## 1. What this is

A daily-habit product for learning AI/ML, not a course library.

The long-term vision is a one-stop shop where a beginner goes from "what is a gradient"
to "I launched an AI product." The version we build first is deliberately narrow: a
five-minute daily practice loop aimed at Indian college grads and early-career engineers
trying to break into AI/ML roles.

### Why narrow

A habit product needs a sharp initial user because the daily unit has to feel urgent to
*someone*. "Learn AI" is an intention. "Be interview-ready by placement season" is an
anxiety, and anxiety is what produces daily return visits.

### Positioning statement

> Five minutes a day until you can pass an ML interview.
> Not another course. Practice, not playlists.

Everything on the site should be defensible against the question *"why wouldn't I just
ask ChatGPT?"* The answer must always be one of: it grades me, it remembers what I forgot,
it shows me where I stand, or it gives me something to show a recruiter.

---

## 2. Audience

**Primary (v1):** Indian college students in years 3–4 and grads 0–2 years into a career,
preparing for placements or trying to switch into data/ML roles.

| Attribute | Implication for design |
| --- | --- |
| One timezone (IST) | Cron scheduling is trivial in v1 — single 19:00 IST trigger |
| Phone-first, patchy data | Daily unit must work one-handed on 3G; heavy assets lazy-loaded |
| Placement anxiety | Frame everything as interview readiness, not curiosity |
| Price-sensitive | Free tier must be genuinely useful; paid tier targets the job-urgency moment |
| Peer-comparative | Leaderboards and shareable proof work well here |

**Secondary (later):** complete beginners, working engineers upskilling, aspiring founders.
Do not build for them yet. Their needs are addressed by widening the content library, not
by changing the product.

---

## 3. The Hook loop, concretely

Nir Eyal's model: **Trigger → Action → Variable Reward → Investment**, where the investment
loads the next trigger. Here is our instantiation.

### 3.1 Trigger

**Internal triggers** we are designing for, in priority order:

1. *Placement anxiety* — "I'm not ready and the interviews start in N weeks."
2. *Boredom* — the 8-minute gap between classes, on a bus, in a queue.
3. *Status anxiety* — a batchmate posted about a model they built.
4. *FOMO* — a new model dropped and I don't understand the terminology.

**External triggers** we control:

| Trigger | Mechanism | Phase |
| --- | --- | --- |
| 19:00 IST daily email | Convex cron → Resend; "Today's byte + your review queue (N cards due)" | 1 |
| Streak-risk nudge | 21:00 IST, only to users with an active streak who haven't practiced | 2 |
| Daily infographic post | LinkedIn + Instagram, links to that day's byte | 0 (also how Phase 0 testers are recruited) |
| Share cards | User-generated results shared to WhatsApp/LinkedIn | 2 |
| Weekly league result | Monday morning email: promoted/relegated | 3 |

Email is the workhorse. iOS web push is unreliable and nobody installs a PWA.

### 3.2 Action

The simplest rewarded action must be **under 5 minutes, phone-friendly, and doable
without logging in.**

The daily session has three parts, any of which counts as "practiced today":

1. **Today's Byte** — one concept: one infographic, ~150 words, one runnable code cell,
   2–3 questions. New bytes ship 2×/week, not daily.
2. **Review queue** — spaced-repetition cards resurfacing items you've seen before,
   weighted to what you keep getting wrong.
3. **Drills** — procedurally generated interview-style questions, effectively unlimited.

**Anonymous users can complete today's session without an account.** The signup prompt
fires *after* the reward, at peak motivation: "You earned 60 XP. Create an account to keep
your streak." Progress made anonymously migrates into the account on first sign-in.

### 3.3 Variable reward

All three of Eyal's reward types, because using only one flattens fast.

**Rewards of the hunt** — XP is variable, not fixed. Base XP per item with a seeded random
bonus, plus a low-probability "critical" multiplier. Occasional surprise unlocks
(a bonus byte, a rare badge). Crucially the roll is **server-side and seeded by
`(userId, day, itemKey)`** so it cannot be re-rolled by refreshing.

**Rewards of the self** — a mastery bar per topic that reflects genuine spaced-repetition
strength, not lessons clicked. A skill map that fills in. Concrete capability statements
("you can now read a paper abstract and know what the metrics mean").

**Rewards of the tribe** — how you did on today's drill vs everyone else who did it
(percentile, not raw rank). Weekly cohort leagues of ~30 people. Comments on bytes.

### 3.4 Investment

Each of these makes the product more valuable tomorrow than it was today:

- **Review queue** — grows and personalises with every session. Unportable.
- **Public profile** (`/u/handle`) — XP, streak, topic mastery, badges, shipped projects.
- **Saved code** — solutions to exercises, retrievable.
- **Declared goal** — "interviewing in 8 weeks" drives a personalised plan.
- **Referrals / follows** — social capital.

The profile is the highest-leverage one: it is simultaneously the investment, the status
reward, and the acquisition loop, because people share portfolios that make them look good.

### 3.5 Deliberate anti-patterns

Research on gamified education apps documents *goal drift* (engagement shifts from mastery
to metric maintenance) and *gamified obligation* (guilt on exit). Duolingo's guilt-tripping
owl is widely mocked. We take the opposite position and market it:

- **Streak freezes**, earned not bought, plus an explicit **Pause** that preserves the
  streak for a declared period. No shame copy anywhere.
- **XP weighted toward artifacts**, not attendance. Shipping a project is worth more than
  thirty login days.
- **Honest mastery** — the mastery bar decays because memory decays, and we say so.
- **Easy exit** — one-click unsubscribe, no dark-pattern retention flows.

This is both correct and a differentiator. Say it on the landing page.

---

## 4. Differentiation

Ranked by defensibility.

1. **Auto-graded, in-browser code.** Python runs client-side via Pyodide, hidden tests run
   against submissions, XP is awarded automatically. Zero marginal compute cost — the
   learner's laptop does the work. This is the thing a chat window cannot do.
2. **Procedural interview drills.** Eight generators produce unlimited parameterised
   questions with automatically correct answers. Solves the content-supply problem
   permanently and maps directly onto real interview questions.
3. **Spaced repetition for ML.** The most honest daily-return mechanic available, and the
   source of personalisation that can't be copied or exported.
4. **Ship, don't certify.** The end of every track is a deployed artifact and a public
   profile line, not a PDF.
5. **The infographic engine.** Already built. One canonical visual per concept is our
   visual identity, our social content, and the thing people screenshot — from one pipeline.
6. **Anti-streak-anxiety positioning.** Free brand differentiation against the category leader.

Explicitly **not** doing: video, an AI tutor chatbot (commodity, burns margin), a native
mobile app, or long-form courses.

---

## 5. Content strategy under a 1–2 pieces/week constraint

The binding constraint is authoring capacity, not engineering. A daily product needs ~30
units of activity per month; hand-authoring yields 6–8. The gap is closed by decoupling
**publishing cadence** from **engagement cadence** — Duolingo does not ship new lessons
daily either; the daily activity is practice.

| Source | Units/month | Authoring cost |
| --- | --- | --- |
| New bytes (2/week) | ~8 | High — 90 min each, hard cap |
| Review queue over existing items | Unlimited | Zero after authoring |
| Procedural drills (8 generators) | Unlimited | One-time, ~1 day each |

**Season 1 target: 12 bytes, ~40 authored questions, 8 generators.** At 2 bytes/week that
is roughly six to eight weeks of evenings, and it is enough for a real daily loop.

**Authoring rules to make 90 minutes achievable:**

- One byte = one MDX file. Frontmatter carries the questions.
- Reuse the existing infographic generator as the visual template — never start from blank.
- LLM writes the first draft; you edit. You are the editor, not the author.
- Batch: two bytes in one sitting, once a week.
- If a byte takes over 90 minutes, cut scope rather than extending the session.

**Publishing cadence:** new bytes Tuesday and Friday, announced by email. The *daily*
appointment is the practice session, not new content.

---

## 6. Roadmap

Each phase ends with something shippable and measurable. Do not start the next phase until
the current phase's exit metric is measured (even if the answer is disappointing).

### Phase 0 — Frontend only, no backend (weeks 1–4)

Full detail in `03-phase-0-frontend-first.md`. Validates content quality and feel before any
backend exists, which is possible because the drill generators, SRS scheduling, grading, and
Python execution are all client-side by design.

- Next.js + Tailwind; typed TypeScript content modules (MDX deferred — same authoring
  model, type-checked, zero build step); 3 bytes first to time the authoring budget
- Generators G2, G1, G4, G8 with renderer, practice mode, explanations
- XP, streaks, review queue, mastery map — all against localStorage
- Pyodide code cell, read-and-run
- The `DataLayer` seam with a local adapter, so Phase 1 is an adapter swap not a rewrite
- Deployed publicly to Netlify and put in front of ~10 real students

**Exit criteria:** byte authoring ≤ 90 min; generator tests green over 10k seeds; median
session under 5 min; ≥ 7 of 10 student testers say they'd use it daily.

**Hard cap: four weeks.** This phase deliberately does not test retention, so time spent
polishing beyond the exit criteria is time spent avoiding the real question.

### Phase 1 — The loop (weeks 5–8)

Backend, accounts, and the trigger that makes it a habit.

- Convex + Convex Auth (Google OAuth), schema per `01-architecture.md` §4
- `lib/data/convex/` implementing the same contract; flip the adapter flag
- XP ledger with variable rewards, server-settled streaks with freezes
- 19:00 IST daily email via Convex cron + Resend
- `claimAnonymousProgress` to migrate Phase 0 testers
- Remaining bytes and generators G3, G5, G6, G7

**Exit metric:** D7 retention of signups ≥ 25%.

### Phase 2 — The spread (weeks 9–12)

Make it social and shareable.

- Public profiles at `/u/handle`
- Daily Drill: one server-generated puzzle everyone gets, with a spoiler-free share card
- Percentile feedback ("you beat 68% of people today")
- Streak-risk nudge email
- Auto-graded coding exercises with hidden tests

**Exit metric:** ≥ 15% of daily-drill completers share their card; organic signups > paid/manual.

### Phase 3 — The pull (weeks 13–20)

Retention depth and first revenue.

- Weekly cohort leagues (~30 people, promotion/relegation)
- Interview Prep track — the first paid product
- Project track #1, ending in a deployed artifact on the user's profile
- Colab handoff for GPU-requiring projects

**Exit metric:** ≥ 3% free→paid conversion; D30 retention ≥ 15%.

### Phase 4 — The vision (months 6+)

Widen to the other three audiences. "Build a business with AI" track. Content library
scales via community contribution.

---

## 7. Metrics

**North Star: Weekly Practicing Learners** — users with ≥ 3 practice days in the trailing
7 days. It captures habit rather than traffic, and it cannot be inflated by a viral spike.

Supporting metrics, reviewed weekly:

- D1 / D7 / D30 retention by signup cohort
- DAU/MAU ratio (target > 0.25 for a habit product)
- Streak length distribution, and *what percentage of streak-breakers return within 7 days*
  (this is the anti-dark-pattern health check)
- Drill accuracy trend per user — is anyone actually learning?
- Email open and click-through by send time
- Share rate on daily drill; signups attributable to shares
- Byte completion rate and drop-off point within a byte

**Anti-metrics** we refuse to optimise: time on site, session length, notification volume.

---

## 8. Cost model

| Item | Free tier | When it breaks | Cost after |
| --- | --- | --- | --- |
| Convex | Generous free tier | Well past 10k users | ~$25/mo |
| Convex Auth | Unlimited users — no MAU pricing | Never | $0 |
| Resend | 3,000/mo, 100/day | **~100 daily-email subscribers** | $20/mo for 50k |
| Netlify | 100GB bandwidth | Unlikely in year 1 | $19/mo |
| Domain | — | — | ~$12/yr |
| Pyodide compute | Runs on user device | Never | $0 |

Total to run Phase 1: **domain only**. Budget ~$20/mo once the email list passes 100, which
is the first real cost and a good problem to have.

Note what this table means strategically: with Convex Auth and client-side Python, **there
is no per-user cost anywhere in the stack.** A free user who signs in with Google, practices
daily, and runs code costs effectively nothing. That is what makes a large permanently-free
tier viable as a growth strategy rather than a liability, and it is the main reason the auth
choice is worth the beta risk.

---

## 9. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Authoring burnout at 2 bytes/week | **Highest** | Hard 90-min cap; templated MDX; LLM drafting; drills carry the daily load so a missed week doesn't break the product |
| Cold start — leaderboards empty | High | Every social feature degrades to single-player; ship single-player first; percentiles instead of ranks until volume exists |
| Nobody comes back (habit doesn't form) | High | Phase 1 exit metric is a real gate; if D7 < 15%, the loop is wrong — fix before building Phase 2 |
| Phase 0 becomes an indefinite polish loop, delaying the retention test | High | Four-week hard cap; exit criteria are content and feel only, and "it could look nicer" is not one of them |
| Phase 0 leaks `localStorage` into components, making the Convex swap a rewrite | Medium | All data access behind the `DataLayer` contract; the adapter flip must touch zero components |
| Scope creep toward "one-stop shop" | High | Phase gates; the vision is stated but v1 is 12 bytes and a drill engine |
| Pyodide bundle hurts performance | Medium | Lazy-load on user gesture only; never on content pages |
| Convex Auth is beta (0.x) — API churn, Next.js middleware friction | Medium | Pin the version; use the documented two-provider middleware pattern; isolate all auth behind `convex/lib/auth.ts` so swapping to Clerk or Better Auth touches one file |
| Cheating on leaderboards | Low | Server-side generation and grading for ranked modes only; rate limiter component |

---

## 10. Decisions

### Settled

- **Backend:** Convex
- **Auth:** Convex Auth with Google OAuth (primary) and email OTP (fallback). No passwords.
- **Frontend:** Next.js App Router
- **Hosting:** Netlify
- **Python:** Pyodide in-browser; Colab only for GPU project work in Phase 3
- **Audience for v1:** Indian college grads / early-career, placement-focused
- **Daily loop:** procedural drills + spaced-repetition review, with new bytes 2×/week
- **Build order:** Phase 0 is frontend-only against a local adapter; Convex arrives in
  Phase 1 as an adapter swap behind the `DataLayer` contract

### Still open

- [ ] Domain name — is `bytesizedecodes.com` available, or a shorter variant?
- [ ] Season 1 curriculum — the exact 12 bytes and their order
- [ ] Free/paid boundary — what exactly is behind the Interview Prep paywall
- [ ] Brand system — carry the existing infographic palette into the site, or redesign
- [ ] Payments provider for Phase 3 (Razorpay is the obvious choice for an Indian audience;
      Polar/Stripe if the market turns out to be international)
