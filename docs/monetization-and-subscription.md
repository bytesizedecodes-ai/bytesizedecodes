# Monetization and subscription

There is **no Stripe/paywall checkout yet**. Course `access: "free" | "paid"`
exists on the content model; paid courses show a sign-in prompt (payment
comes later). This doc defines how freemium fits the product.

The product **strategy** (audience, promise, learning loop) lives in
[`../plans/coherent-v1/`](../plans/coherent-v1/). This doc is the
business-model and architecture view: *how does a learner keep learning, and
where does paying fit?*

**Effort currency in the product UI is called Energy** (stored as `xpTotal` /
`xpEvents` under the hood — no schema rename required).

## Auth model (current product decision)

**Social identity (OAuth).** Free **course content** is readable without an account
(SSR/SEO). Personal progress, streaks, Energy, Daily plan, Build, Practice, and
Profile require a signed-in account (Google now; GitHub when configured). There
is **no anonymous session** for the product UI.

Do **not** reintroduce anonymous auto-login — it made every visitor look
"signed in" and broke Login / Profile UX.

## The continuous-learning flow

```
guest reads free courses/lessons (SEO)
  → Begin / progress CTA → social sign-in → onboarding
  → daily plan → learn → practise → review → mastery
  → next day's due cards + streak pull them back
```

Foundational free courses stay free to **read**. The **saved loop** (progress,
streaks) requires a real identity so investment sticks per account and habits form.

## Plans page (marketing tiers)

`/plans` and `content/plans.ts` document three tiers for users and sales:

| Tier | Price | Reality |
| --- | --- | --- |
| **Free learning** | $0 · no account | Read free courses/lessons |
| **Free account** | $0 · social sign-in | Saved path, Today, practice, Energy, streaks, free Build drafts, Profile |
| **Pro** | Fee TBD · coming soon | **Advanced courses** + advanced builds + **private GitHub portal** of AI project ideas and starter codes (work / startup / hobby). Notify via `/subscribe?intent=pro` |

This is marketing truth for “fee not decided yet” — not Stripe products.

**Pro is not an AI tutor chat product.** The paid upgrade packages depth of
curriculum and **real project kits** (codes + ideas on GitHub) so learners can
implement AI at work or ship a side project / startup MVP.

Lead capture (not payment):

- `/subscribe` — product updates / Pro interest
- `/advertise` — partnership/ad inquiries
- Stored in `inquiries` + emailed to `CONTACT_EMAIL` (`lib/site.ts`)

## What the architecture already supports

- **Every signed-in user has a real `userId`** via Convex Auth (OAuth subject).
- **`profiles`** is the home for future `plan` / `entitlement` / Stripe ids.
- **DataLayer** (`lib/data/provider.tsx`) is where `useEntitlement()` should land.
- **`Course.access`** drives Free/Paid badges and soft gates for paid courses.

## The recommended model: free content, login for progress, paid-advanced

| Tier | Cost | What's gated | What stays free |
| --- | --- | --- | --- |
| **1. Free content** (now) | $0 | Nothing for **reading** free courses / lessons | All free courses fully public SEO |
| **2. Login for progress** (now) | Free social account | Progress, streaks, Energy, Today, free Build, Practice, Profile | Free course reading without login |
| **3. Pro** (later) | Subscription or one-time | `access: "paid"` **advanced courses**, advanced builds, GitHub project portal | Free foundational courses forever |

### What stays free forever

- Foundational free courses and lessons (read).
- After sign-in: streaks freezes, Energy, daily plan, free drills/review — not paywalled.

### Paid later (Pro)

- Courses with `access: "paid"` (advanced curriculum).
- Advanced build tracks.
- Private GitHub access: curated AI project ideas + starter code for work, startup, and hobby builds.

Do not gate free course **reading** behind payment. Progress savings need a
signed-in identity so daily return has an account to attach to.
