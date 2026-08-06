# Overview

**bytesizedecodes** — “Learn AI visually. Practise it. Build something real.”

A goal-based AI learning platform for:

- Curious beginners
- Students and graduates
- Working professionals
- Aspiring founders

## Product promise

Learners pick a goal, get a daily plan, learn with visual + active lessons,
practise with diagnostic drills, review with spaced repetition, and build real
artifacts.

## Access model (current)

| Visitor state | What they can do |
| --- | --- |
| **Guest** | Read free courses/lessons (public SEO), browse Learn catalog, Plans, About/Legal, Advertise/Subscribe forms |
| **Signed-in, not onboarded** | Social account → onboarding (goal, level, weekly minutes, time mode) |
| **Signed-in + onboarded** | Full loop: Today · Learn · Courses · Build · Progress · Plans · Profile |

There is **no anonymous product session**. Guests can read free content; saving
progress requires a **social identity** (Google OAuth live; GitHub when env is
set). **No email OTP / Resend** for auth.

## What is shipped today

### Product UI and navigation

- **Public nav:** Learn · Courses · Plans · Login (Login on the right)
- **Authed + onboarded:** Today · Learn · Courses · Build · Progress · Plans + account menu
- Auth modal + `/login` with **Continue with Google** and **Continue with GitHub** (GitHub “Soon” until enabled)
- Onboarding after first social sign-in
- Site footer (Brand · Product · Company · Legal) and contact email `bytesizedecodes@gmail.com`
- Trust pages: `/about`, `/contact`, `/privacy`, `/terms`
- Lead forms: `/advertise`, `/subscribe` (stored in Convex `inquiries` + FormSubmit email)
- `/plans` tiers: Free learning · Free account · Pro (coming soon, fee TBD)

### Auth and data

- Convex Auth social OAuth (`convex/auth.ts`) — Google when `AUTH_GOOGLE_*` set; GitHub when `AUTH_GITHUB_*` set
- `getUserId` derives identity **only** from `ctx.auth` (client-supplied userId ignored)
- Profile from identity (name / email / avatar); `ensureProfile` on sign-in
- Convex-backed progress behind a `DataLayer` seam (`lib/data/provider.tsx`)
- Opt-in project gallery (publish from Build)

### Learning content and loop

- Typed lesson/byte content, courses with domain + level + `access: "free" | "paid"`
- Two free courses: “Machine Learning” (4 lessons) and “Machine Learning for Layman” (19 lessons)
- Personalized daily plan (signed-in), procedural drills, SM-2 review, streaks, Energy
- Pyodide code cell (worker + timeout)
- SEO foundation: metadata, sitemap, robots, OpenGraph, JSON-LD

### Ops

- `/admin` console: users (name/email), feedback triage + replies, email campaigns & triggers; `requireAdmin` + `ADMIN_EMAILS` allowlist
- `dev` → `main` promote, CI, Netlify, Convex production workflow

## What is not ready

- **GitHub OAuth** until `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` (Convex) and
  `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true` (Next) are configured — UI placeholder is present
- Daily reminder email / push (no Resend or outbound channel)
- Public social features, peer moderation, cohort leaderboards (global-XP component exists but is not rendered)
- Stripe / real checkout for `access: "paid"` courses and Pro pricing
- Full Python / LLM curriculum depth
- `lib/data/identity.ts` browser UUID remains for legacy shapes only — not product login

## Related reading

- Agent rules: [`../CLAUDE.md`](../CLAUDE.md)
- Engagement & retention: [`./engagement-and-retention.md`](./engagement-and-retention.md)
- Monetization & tiers: [`./monetization-and-subscription.md`](./monetization-and-subscription.md)
- Admin & feedback: [`./admin-and-feedback.md`](./admin-and-feedback.md)
- Current plans: [`../plans/coherent-v1/`](../plans/coherent-v1/)
- Historical plans: [`../plans/historical/`](../plans/historical/)
