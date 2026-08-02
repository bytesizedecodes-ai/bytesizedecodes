# Monetization and subscription

There is **no monetization code in the codebase today** — no Stripe, no
paywall, no plan/tier field, no entitlement check, no ad SDK, no analytics
SDK (only the internal Convex `analyticsEvents` log). This doc defines the
intended model so future work is built toward it, not retrofitted.

The product **strategy** (audience, promise, learning loop) lives in
[`../plans/coherent-v1/`](../plans/coherent-v1/). This doc is the
business-model and architecture view: *how does a learner keep learning, and
where does paying fit?*

## The continuous-learning flow (free, forever)

A learner should be able to learn continuously for free, indefinitely. The
core loop is not gated:

```
goal (onboarding) → daily plan → learn (visual + active)
   → practise (drills) → review (spaced repetition) → mastery
   ↑                              investment (notes, projects, evidence)
   └──────── next day's due cards + streak pull them back ────────┘
```

Every part of that loop is free. Streaks, XP, SRS, the daily plan, all
courses — free. **Do not gate the learning loop.** Gating it kills the habit
that the whole engagement model (`engagement-and-retention.md`) depends on.

## What the architecture already supports

The foundation is ready *to attach billing to*, even though none exists:

- **Every user has a real `userId`** via Convex Auth — even anonymous ones.
  There is already an account entity to attach a `stripeCustomerId` to.
- **The `profiles` table** (`convex/schema.ts:48`) is the natural home for a
  `plan` / `entitlement` / `subscriptionStatus` field.
- **The `DataLayer` seam** (`lib/data/provider.tsx`) means a `useEntitlement()`
  hook can be added in one place and every page reads through it — no paywall
  logic scattered across routes.
- **`skillEvidence` + `projects`** give you something real to gate *behind*
  (verified proof, artifacts) without gating the learning itself.

## The recommended model: free learning, login-to-build, paid-advanced

The model evolves in three tiers as the product and audience grow. Each tier
protects the friction-free learning loop (the foundation of the habit) and
only adds a gate where it's naturally justified.

| Tier | Cost | What's gated | What stays free |
| --- | --- | --- | --- |
| **1. Free learning** (now) | $0, no login | Nothing — all courses, drills, SRS, streaks | Everything in the learning loop |
| **2. Login-to-build** (next) | Free login (Google/GitHub) | The `/build` page (hands-on AI/ML/cybersecurity projects) requires authentication | All courses, lessons, drills, review stay free, no login |
| **3. Paid-advanced** (later, when there are users) | Subscription or one-time | Advanced courses + advanced build projects | Foundational courses + the daily plan stay free forever |

### Why this shape

1. **Tier 1 stays frictionless.** All learning is free and login-free. This is
   the engagement strategy's non-negotiable — gating lessons kills the daily
   return habit (see `engagement-and-retention.md`).
2. **Tier 2 gates only "doing real work."** Building a real AI/ML/cybersecurity
   project needs persistence, so requiring a free login there is justified and
   low-friction. It does NOT gate any lesson or review.
3. **Tier 3 monetizes depth, not foundations.** When advanced/specialized
   content exists and there's an audience, the *advanced* courses and *advanced*
   build projects can sit behind a paywall. Foundations remain free so the
   funnel and habit loop never close.

### What is NEVER gated (explicit)

- Foundational courses, lessons, bytes, drills, spaced review — never.
- Streaks, XP, levels, the daily plan — never.
- Progress tracking and export — never.

The earlier "paid certificates" framing is superseded by this model.
Certificates may still exist as one paid outcome within Tier 3, but they are
not the spine of the model; the gates are on advanced *content and projects*,
not on proof.

### Why this model and not ads or a hard paywall

1. **Ads conflict with the trust positioning.** The product sells credible,
   verifiable skills. Ads (especially programmatic) cheapen that and erode the
   certificate's value. AdSense also rejects low-content sites, and the volume
   needed for meaningful ad revenue (thousands of daily sessions) is far off.
2. **A hard paywall on learning kills the habit loop.** The entire
   engagement strategy depends on friction-free daily return. Gating lessons
   or reviews converts the habit into a pay-per-use transaction and spikes
   churn.
3. **"Free learning, paid proof" aligns revenue with the value learners
   actually want to show** — a credential. It monetizes the *outcome*, not the
   *process*. This is the Coursera/freeCodeSpace model done honestly.

### What is NOT gated (explicit)

- Lessons, bytes, drills, review — never.
- Streaks, XP, levels, the daily plan — never.
- Building projects in the builder — free.
- Progress tracking and export — free.

## Subscription vs. one-time — the decision to make later

Two viable shapes; pick one when you're close to launch:

1. **Recurring subscription** (SaaS model): monthly/annual; includes all
   certificates while subscribed;steady revenue; needs a "what happens to
   certificates if I cancel?" policy (recommend: keep them, they're earned).
2. **One-time per certificate** (course model): learner pays per verified
   certificate when they complete a course; no recurring pressure; lower
   friction; lumpier revenue.

**Recommendation:** start with one-time per certificate — it's the lowest-friction
test of whether people will pay at all, and it avoids the churn machinery of
subscriptions before you have the engagement loops to sustain them. Move to
subscription only if demand and content volume justify it.

## What "paid proof" requires to build (architecture)

When you're ready (not for v1 launch — content volume and the engagement loop
come first):

1. **Certificate entity.** New table: issued certificate with a verifiable ID,
   the userId, the course/skill, the evidence it's based on, issue date, and a
   revoked flag. Lives in Convex.
2. **Public verification route.** `/verify/<cert-id>` — server-rendered, no
   auth, shows the certificate is genuine. This public page is what makes the
   credential trustworthy (recruiters can check it). SEO-indexable.
3. **Stripe integration.** Checkout for the one-time payment; webhook →
   `internal.mutations` to issue the certificate on payment success. Store
   `stripeCustomerId` on `profiles`.
4. **Entitlement hook.** `useEntitlement()` in the DataLayer; gates only the
   *certificate issuance* UI, never the learning.
5. **"How we assess" page.** Public explanation that certificates are
   mastery-based (evidence-driven), not attendance-based. This transparency
   is the real trust multiplier.

## Sequencing — what to do first (honest order)

1. **Launch free.** No paywall, no billing. Get the engagement loop working
   with real users. This is the priority — see `engagement-and-retention.md`.
2. **Add Google OAuth + email.** Needed for any paid flow (you need a stable
   identity and a contact channel). Already scoped in
   `plans/coherent-v1/phases/phase-4-auth-and-social.md`.
3. **Build the certificate + `/verify` route** (no payment yet — issue free
   certificates to validate the trust model).
4. **Only then add Stripe** behind the certificate issuance.
5. **Never add ads.** (Unless the product pivots away from credentials/trust.)

## Guardrails

- The free learning loop is sacrosanct. Any feature that gates learning is a
  regression, not a feature.
- Certificates must reflect real mastery (backed by `skillEvidence`), never
  "watched all videos." A certificate that anyone can buy without
  demonstrating skill is worthless and will destroy the trust the brand is
  built on.
- Never fabricate scarcity ("only 10 certificates left!"). The product's edge
  is honesty.
- Pricing should be transparent and public. No dark patterns.
