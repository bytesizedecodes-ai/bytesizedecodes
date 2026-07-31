# ByteSizedCodes — Technical Architecture

Status: draft v1 · Last updated: 2026-07-26
Companion to `00-product-plan.md`.

---

## 1. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js (App Router) + TypeScript | Best-supported Convex integration; SSG for content, client components for the app |
| Styling | Tailwind CSS | Fast, and the existing infographic palette maps cleanly to CSS variables |
| Content | MDX files in git | Free, versioned, LLM-draftable, no CMS to run |
| Backend | Convex | Reactive queries mean leaderboards and streaks update with no socket code; crons and scheduler are built in; all TypeScript |
| Auth | Convex Auth (Google OAuth) | Free with no MAU ceiling; users live in our own database; Auth.js providers give Google in one config block |
| Email | Resend via `@convex-dev/resend` | Official component: queueing, batching, durable retries |
| Python | Pyodide (WASM) | Runs on the learner's device — zero marginal cost, and enables auto-grading |
| Hosting | Netlify | Fine for Next.js via the official plugin |

### Decisions worth recording

**Astro was considered and rejected.** It produces lighter content pages, but every
interactive island needs its own `ConvexProvider` and websocket, and the app layer is now
substantial. Next.js keeps one client for the whole page tree. Revisit only if Core Web
Vitals on content pages become a measured problem.

**Convex Auth over Clerk.** Clerk is faster to set up and more mature, but it prices on
monthly active users, and this is a consumer product whose whole strategy is a large free
tier — the thing we are optimising for (lots of free signups) is the thing that would be
billed. Convex Auth is free at any scale, keeps the users table inside our own database
next to the product data, and supports Google OAuth through the Auth.js provider ecosystem,
which is the only method the audience will realistically use.

The tradeoff accepted: Convex Auth is still beta (0.x), has no MFA, SSO, passkeys, or
organisations, and has known friction with Next.js App Router middleware. None of those
missing features are on our roadmap, and the middleware issue has a documented workaround
(§5.3). Mitigations: pin the version rather than tracking latest, and keep **all** auth
access behind `convex/lib/auth.ts` so nothing else in the codebase knows which library is
in use. If we ever need enterprise features, swapping to Clerk or WorkOS touches one file.

**Netlify over Vercel.** Vercel has smoother Next.js DX, but the difference does not
justify a preference change. Both are a one-afternoon migration.

---

## 2. Repository layout

```
bytesizedecodes/
├── app/                       # Next.js App Router
│   ├── (marketing)/           # Static: landing, pricing, about
│   ├── (content)/bytes/       # SSG lesson pages — the SEO surface
│   ├── (app)/                 # Authenticated: dashboard, practice, review, profile
│   └── u/[handle]/            # Public profiles (SSR, cached)
├── components/
│   ├── drills/                # Drill renderer + answer input widgets
│   ├── code/                  # Pyodide cell, test runner, output pane
│   └── game/                  # XP bar, streak flame, mastery map, share card
├── content/
│   ├── bytes/*.mdx            # Source of truth for lessons + authored questions
│   └── generated/items.json   # Build artifact, consumed by the sync script
├── lib/
│   └── drills/                # PURE TS generators — imported by both app and convex
├── convex/
│   ├── schema.ts
│   ├── lib/{auth,customFunctions,xp,srs,errors}.ts
│   ├── {users,progress,review,drills,daily,leaderboard,content}.ts
│   ├── emails.ts              # "use node" if a provider SDK needs it
│   ├── crons.ts
│   └── convex.config.ts
├── scripts/
│   ├── build-content.ts       # MDX frontmatter -> content/generated/items.json
│   └── new-byte.ts            # Scaffolds a byte from template (authoring speed)
└── docs/
```

**`lib/drills/` must stay pure TypeScript** — no Node APIs, no DOM. Convex bundles imports
from outside `convex/`, so the same generator code runs in the browser (instant practice
feedback) and on the server (cheat-resistant ranked grading). This dual-use is the reason
the directory sits outside `convex/`.

---

## 3. Convex components

```ts
// convex/convex.config.ts
import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config";
import aggregate from "@convex-dev/aggregate/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import migrations from "@convex-dev/migrations/convex.config";

const app = defineApp();
app.use(resend);
app.use(aggregate, { name: "xpLeaderboard" });
app.use(rateLimiter);
app.use(migrations);
export default app;
```

| Component | Used for | Phase |
| --- | --- | --- |
| `resend` | Daily digest, streak nudge, league results | 1 |
| `aggregate` | Leaderboard ranks and XP sums without table scans | 2 |
| `rate-limiter` | Submission throttling, anti-abuse on ranked drills | 2 |
| `migrations` | Schema evolution once real user data exists | 2 |

---

## 4. Data model

Principles enforced throughout, per project rules: flat documents, relationships by ID,
indexes on every foreign key, `.withIndex()` never `.filter()`, `args` and `returns`
validators on every public function, and **no `Date.now()` inside queries** — the client
passes `today` as an argument.

### Day keys

Every date is stored as a `"YYYY-MM-DD"` string in **Asia/Kolkata**, not a timestamp.
Streaks, review due dates, and daily challenges all key off this string. Because the v1
audience is single-timezone, this removes an entire class of bug. When we expand beyond
IST, `users.timezone` already exists and the day-key helper becomes timezone-aware in one
place (`convex/lib/day.ts`).

### Schema

```ts
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Owned by Convex Auth: users, authAccounts, authSessions, authRefreshTokens,
  // authVerificationCodes, authVerifiers, authRateLimits.
  // Do not add product fields here — see the note below on why we don't override it.
  ...authTables,

  // All product state about a person. Exactly one row per authTables.users row.
  profiles: defineTable({
    userId: v.id("users"),
    handle: v.string(),               // public profile slug
    displayName: v.string(),
    timezone: v.string(),             // IANA, defaults "Asia/Kolkata"
    track: v.union(
      v.literal("grad"), v.literal("beginner"),
      v.literal("engineer"), v.literal("founder"),
    ),
    goalDate: v.optional(v.string()), // "interviewing by" — drives the plan
    emailDaily: v.boolean(),
    emailStreak: v.boolean(),
    xpTotal: v.number(),              // denormalised for fast reads
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastPracticeDay: v.optional(v.string()),
    streakFreezes: v.number(),
    pausedUntil: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_handle", ["handle"])
    .index("by_xp", ["xpTotal"])
    // drives the nightly streak-nudge scan
    .index("by_last_practice_day", ["lastPracticeDay"]),

  // Mirror of content/generated/items.json. Synced at deploy.
  // Exists server-side so ranked modes can grade without trusting the client.
  contentItems: defineTable({
    itemKey: v.string(),              // "byte:gradient-descent:q2"
    byteSlug: v.string(),
    topic: v.string(),
    kind: v.union(v.literal("mcq"), v.literal("numeric"), v.literal("code")),
    difficulty: v.number(),           // 1-5
    answer: v.string(),               // canonical answer, never sent to client
    tolerance: v.optional(v.number()),
  })
    .index("by_item_key", ["itemKey"])
    .index("by_byte", ["byteSlug"]),

  byteProgress: defineTable({
    userId: v.id("users"),
    byteSlug: v.string(),
    status: v.union(v.literal("started"), v.literal("completed")),
    completedDay: v.optional(v.string()),
    xpEarned: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_byte", ["userId", "byteSlug"]),

  // SM-2 spaced repetition state, one row per user per item
  reviewItems: defineTable({
    userId: v.id("users"),
    itemKey: v.string(),
    topic: v.string(),
    ease: v.number(),                 // SM-2 EF, starts 2.5, floor 1.3
    intervalDays: v.number(),
    dueDay: v.string(),               // "YYYY-MM-DD"
    reps: v.number(),
    lapses: v.number(),
    lastReviewedDay: v.optional(v.string()),
  })
    .index("by_user_and_due", ["userId", "dueDay"])
    .index("by_user_and_item", ["userId", "itemKey"])
    .index("by_user_and_topic", ["userId", "topic"]),

  attempts: defineTable({
    userId: v.id("users"),
    itemKey: v.string(),
    mode: v.union(
      v.literal("byte"), v.literal("review"),
      v.literal("practice"), v.literal("daily"),
    ),
    correct: v.boolean(),
    msTaken: v.number(),
    day: v.string(),
    submittedAt: v.number(),
  })
    .index("by_user_and_day", ["userId", "day"])
    .index("by_user_and_time", ["userId", "submittedAt"]),

  // Append-only ledger. Source of truth; users.xpTotal is the cache.
  xpEvents: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),               // "byte_complete" | "drill_correct" | "streak_bonus"
    refKey: v.optional(v.string()),
    day: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_and_day", ["userId", "day"])
    .index("by_day", ["day"]),

  // One shared puzzle per day, created by cron the night before
  dailyChallenges: defineTable({
    day: v.string(),
    generatorId: v.string(),
    seed: v.number(),
    difficulty: v.number(),
  }).index("by_day", ["day"]),

  dailyResults: defineTable({
    userId: v.id("users"),
    day: v.string(),
    correct: v.boolean(),
    attemptsUsed: v.number(),
    msTaken: v.number(),
    shareGrid: v.string(),            // emoji grid, precomputed
  })
    .index("by_day_and_user", ["day", "userId"])
    .index("by_day_and_time", ["day", "msTaken"]),

  // Phase 3
  leagues: defineTable({
    weekKey: v.string(),              // "2026-W31"
    tier: v.number(),
    memberCount: v.number(),
  }).index("by_week_and_tier", ["weekKey", "tier"]),

  leagueMembers: defineTable({
    leagueId: v.id("leagues"),
    userId: v.id("users"),
    weekXp: v.number(),
  })
    .index("by_league", ["leagueId"])
    .index("by_user_and_league", ["userId", "leagueId"]),
});
```

### Notes on specific choices

**Why `profiles` is separate from `users`.** Convex Auth ships its own `users` table and
writes to it (`name`, `email`, `image`, `emailVerificationTime`, `isAnonymous`, …). The
library *does* allow overriding that definition to add your own fields, but doing so
couples our product schema to a beta library's expectations — every upgrade becomes a
schema question. Keeping `users` as pure identity and putting everything we own in
`profiles` costs one extra lookup (cached in `getCurrentUser`) and buys a clean seam. It
also means an auth migration later is a data copy, not a schema rewrite.

Every other table still references `userId: v.id("users")`, because the auth user id is the
stable identity. `profiles` is an extension row, not an indirection layer.

**`xpEvents` as a ledger.** XP is append-only with `profiles.xpTotal` as a denormalised cache.
This makes weekly league sums, "XP earned today" checks, and debugging trivial, and it
means a bug in XP awarding is auditable rather than silently baked into a counter.

**`contentItems` mirrors git.** Content is authored in MDX; a deploy step syncs the graded
metadata (including answers) into Convex. Answers live server-side only. Question *text*
is served statically from the MDX build so content pages stay fully static and SEO-visible.

**No `bytes` table.** Lesson metadata lives in the MDX build output and is imported at
build time. Only *gradeable* items need a server-side row.

---

## 5. Auth and access control

### 5.1 Providers

```ts
// convex/auth.ts
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Resend],   // Google OAuth primary, email OTP as fallback
  callbacks: {
    // Create the profiles row on first sign-in; idempotent.
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) { /* ... */ },
  },
});
```

Google OAuth is the primary method — near-universal among the audience and one tap on
Android. Email OTP via Resend is the fallback, and it reuses the Resend account we already
need for the daily digest, so there is one email provider and one API key.

Password auth is deliberately **not** enabled. It adds reset flows, breach exposure, and
support burden for a demographic that will use Google anyway.

### 5.2 The one-file seam

`convex/lib/auth.ts` is the **only** file that imports from `@convex-dev/auth/server` or
touches `ctx.auth`. It exposes exactly one function:

```ts
// convex/lib/auth.ts
import { getAuthUserId } from "@convex-dev/auth/server";

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  if (!profile) throw new Error("Profile not found");

  return { userId, profile };
}
```

Everything downstream consumes `ctx.user`, never an auth library type. This is what makes
the beta-library risk acceptable.

Per project rules, wrap it with `convex-helpers` custom functions rather than repeating the
check — this is Convex's equivalent of row-level security:

```ts
// convex/lib/customFunctions.ts
import { customQuery, customMutation } from "convex-helpers/server/customFunctions";
import { query, mutation } from "../_generated/server";
import { getCurrentUser } from "./auth";

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx) => ({ ctx: { ...ctx, user: await getCurrentUser(ctx) }, args: {} }),
});

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => ({ ctx: { ...ctx, user: await getCurrentUser(ctx) }, args: {} }),
});
```

### 5.3 Known Convex Auth gotchas — read before wiring this up

These are the issues that will actually cost a day if they're discovered at 2am.

**Next.js App Router middleware.** `convexAuth.isAuthenticated()` returning `false` in
middleware while the client reports authenticated is a known open issue. The fix is to use
**two providers**: `ConvexAuthNextjsServerProvider` in `app/layout.tsx` (a server
component) wrapping a `"use client"` `ConvexAuthNextjsProvider`. Get this right on day one
rather than debugging it later.

**Google OAuth redirect URI.** Must match exactly:
`https://<deployment>.convex.site/api/auth/callback/google`. Note `.convex.site`, not
`.convex.cloud`.

**Dev deployments carry a region subdomain** (e.g. `<name>.eu-west-1.convex.site`) which
Google Cloud Console may refuse to save, so local OAuth can be harder to configure than
production. Plan to register both URIs, and expect to test Google sign-in against a
preview deployment rather than localhost.

**OAuth consent screen in "Testing" mode** blocks every account not explicitly listed as a
test user. Publish the consent screen before any external user tries to sign in.

**`SITE_URL` must be set** in the production Convex environment or post-auth redirects land
in the wrong place.

**Pin the version.** Convex Auth is 0.x; treat a version bump as a task with testing, not a
routine dependency update.

### 5.4 Anonymous-first sessions

Anonymous progress lives in `localStorage` under a single versioned key
`bsd:anon:v1` (a JSON blob: completed items, attempts, XP earned). On first sign-in the
client calls `profiles.claimAnonymousProgress` with the blob, which is validated,
rate-limited, and capped (max one day's worth of XP) before being written. Design the blob
shape to mirror the server tables so the migration is a straight mapping.

Convex Auth also supports a true anonymous provider that creates a real `users` row. We are
**not** using it in v1: it would put every drive-by visitor in the users table and
complicate the "claim your progress" moment, which is a deliberate conversion point.

---

## 6. Scheduled work

```ts
// convex/crons.ts
const crons = cronJobs();

// 13:30 UTC = 19:00 IST — the daily appointment trigger
crons.cron("daily digest", "30 13 * * *", internal.emails.sendDailyDigest, {});

// 15:30 UTC = 21:00 IST — only to users with a live streak who haven't practiced
crons.cron("streak nudge", "30 15 * * *", internal.emails.sendStreakNudge, {});

// 18:30 UTC = 00:00 IST — roll the day: create tomorrow's challenge, settle streaks
crons.cron("day rollover", "30 18 * * *", internal.daily.rollover, {});

crons.interval("resend cleanup", { hours: 1 }, internal.crons.cleanupResend, {});
```

Rules that apply: only `internal.*` functions are ever scheduled, never `api.*`. Every
scheduler call is awaited. Email sends live in actions; database writes they trigger go
through `internalMutation`.

**Streak settlement runs at rollover, not on read.** At 00:00 IST the job walks `profiles`
via `by_last_practice_day` for rows whose `lastPracticeDay` is not yesterday, spends a
streak freeze if they have one, otherwise resets the streak. Reading a user's streak is then
a plain field read with no time logic — which is also what keeps `Date.now()` out of queries.

**Digest scale.** `sendDailyDigest` pages through opted-in profiles and enqueues via the
Resend component, which batches and retries. Do not `.collect()` the `profiles` table.

---

## 7. Python execution

**Pyodide, loaded lazily, never on a content page by default.** The bundle is multiple
megabytes; it must not sit in the critical path of an SEO page.

- Load on explicit user gesture ("Run") or on entering an exercise page, with a skeleton
  and progress indicator while the runtime initialises.
- One worker per page, kept warm across cells; execution in a Web Worker so a runaway loop
  never freezes the UI. Enforce a wall-clock timeout and terminate the worker on breach.
- Preload only `numpy`, `pandas`, `scikit-learn`, `matplotlib` — and only the ones a given
  exercise declares in its frontmatter.
- Grading: the exercise ships hidden test code that runs after the learner's cell. Result
  (pass/fail + which assertions failed) is posted to Convex for XP.

**Boundary:** everything through classical ML runs in-browser and is auto-graded. Deep
learning that needs a GPU gets an "Open in Colab" button pointing at
`colab.research.google.com/github/<org>/<repo>/blob/main/<nb>.ipynb`. Colab sets framing
headers and **cannot be embedded in an iframe** — that handoff is a one-way trip off the
site, so it is reserved for Phase 3 project work where the session is meant to be long.

Client-side grading is trusted for practice mode (cheating only hurts the cheater). Ranked
and daily modes are graded server-side.

---

## 8. Content pipeline

A byte is one MDX file:

```mdx
---
slug: gradient-descent
title: What gradient descent actually does
topic: optimisation
season: 1
order: 5
difficulty: 2
interviewTags: [optimisation, training, learning-rate]
infographic: /infographics/gradient-descent/infographic.png
packages: [numpy]
questions:
  - id: q1
    kind: mcq
    prompt: The learning rate is too high. What do you expect to see?
    choices: [...]
    answer: "b"
    explanation: ...
  - id: q2
    kind: numeric
    prompt: ...
    answer: "0.82"
    tolerance: 0.01
---

Body in MDX, with <CodeCell /> and <Figure /> components.
```

Build flow:

1. `scripts/build-content.ts` parses frontmatter → `content/generated/items.json`
   (question text and choices, **no answers**) for static rendering.
2. `npx convex run content:syncItems` pushes `itemKey`, `answer`, `tolerance`, `topic`,
   `difficulty` into `contentItems`. Runs as part of deploy.
3. Next.js statically generates `/bytes/[slug]` from the MDX.

`scripts/new-byte.ts` scaffolds a byte from a template — this exists purely to protect the
90-minute authoring budget.

---

## 9. Spaced repetition

SM-2, simplified, in `convex/lib/srs.ts` as a pure function:

```
grade ∈ {again, hard, good, easy}
again → interval = 1 day,  ease -= 0.20 (floor 1.3), lapses += 1
hard  → interval = max(1, round(interval * 1.2)), ease -= 0.15
good  → interval = round(interval * ease)
easy  → interval = round(interval * ease * 1.3), ease += 0.15
dueDay = addDays(today, interval)
```

First exposure to an item creates the `reviewItems` row with `ease = 2.5`,
`intervalDays = 1`. The review queue is a single indexed query:
`by_user_and_due` with `q.lte("dueDay", today)`, where `today` is a **client-supplied
argument**, never `Date.now()`.

Cap the daily queue (20 items) so it never becomes intimidating — an unbounded backlog is
the main reason people abandon SRS apps.

---

## 10. XP and variable rewards

```ts
// convex/lib/xp.ts — deterministic, server-only
function rollXp(userId: string, day: string, itemKey: string, base: number): number {
  const r = hashToUnit(`${userId}:${day}:${itemKey}`); // stable hash → [0,1)
  if (r < 0.05) return base * 3;   // "critical" — rare, memorable
  if (r < 0.25) return base * 2;
  return base + Math.floor(r * base * 0.5);
}
```

Seeding by `(userId, day, itemKey)` means the roll is stable: refreshing cannot re-roll it,
and the same event always yields the same reward. Variability across items is what sustains
the dopamine response; re-rollable randomness is an exploit.

Base values: drill 10, review card 8, byte completion 50, coding exercise 100, shipped
project 1000. The ratio is the message — one shipped project outweighs a hundred logins.

---

## 11. Conventions

- `strict: true`; no `any`. Use `Doc<"table">` and `Id<"table">` from `_generated/dataModel`.
- Every public function declares `args` **and** `returns` validators.
- ESLint with `@convex-dev/eslint-plugin` plus `@typescript-eslint/no-floating-promises`
  set to error, wired into CI and a pre-commit hook. An un-awaited `ctx.db.patch` is the
  single most likely bug in this codebase.
- Business logic in plain TypeScript helpers under `convex/lib/`; query/mutation handlers
  stay thin.
- Throw for exceptional cases, return `null` for expected absence.
- `npx convex dev` during development. `npx convex deploy` only from CI.

---

## 12. Build order

**Phase 0 is frontend-only and comes first** — see `03-phase-0-frontend-first.md`. Nothing
in this document is built until Phase 0 exits its criteria. The `DataLayer` contract defined
there is what makes the transition an adapter swap instead of a rewrite.

Phase 1, once Phase 0 exits:

1. `npx convex dev`; `schema.ts` per §4
2. Convex Auth with Google OAuth end to end (both providers per §5.3), `lib/auth.ts`,
   `lib/customFunctions.ts`, profile creation on first sign-in
3. `lib/data/convex/` implementing the Phase 0 `DataLayer` contract
4. Flip `NEXT_PUBLIC_DATA_ADAPTER=convex` — **verify zero component changes were needed**
5. Attempts, XP ledger, streaks, day rollover cron (reusing the pure `settleStreak`)
6. `contentItems` sync at deploy; move ranked-mode grading server-side
7. Resend daily digest at 19:00 IST
8. `claimAnonymousProgress` to migrate Phase 0 testers
9. Remaining bytes and generators G3, G5, G6, G7

Step 4 is a checkpoint, not a formality. If it requires editing components, the seam leaked
and it is cheaper to fix then than after Phase 2 features are built on top.
