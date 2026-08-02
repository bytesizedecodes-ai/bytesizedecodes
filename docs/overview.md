# Overview

**bytesizedecodes** — “Learn AI visually. Practise it. Build something real.”

A goal-based AI learning platform for:

- Curious beginners
- Students and graduates
- Working professionals
- Aspiring founders

## Product promise

Learners pick a goal, get a daily plan, learn with visual + active lessons,
practise with diagnostic drills, review with spaced repetition, and (later)
build real artifacts.

## What is shipped today

- Next.js App Router UI with Today, Learn, Courses, Progress, Profile, Build navigation
- Anonymous onboarding (goal, level, weekly minutes, time mode)
- Convex Auth: anonymous by default; Google when env vars are set (**no email OTP**)
- Convex-backed progress behind a `DataLayer` seam
- Typed lesson/byte content, courses (with domain + level fields), skills, tracks, unified Learn + Courses catalogs
- Two courses: "Machine Learning" (4 lessons) and "Machine Learning for Layman" (19 lessons, picture-led)
- Personalized daily plan query
- Procedural drill generators + authored review
- SM-2 review queue, streaks, XP, streak rollover cron
- Pyodide code cell (worker + timeout)
- Opt-in project gallery (publish from Build)
- SEO foundation: per-page metadata, sitemap, robots, OpenGraph images, JSON-LD structured data

## What is not ready

- Google OAuth until `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are configured
- Daily reminder email (intentionally deferred — no Resend)
- Public social features, peer review moderation, and real leaderboards (the
  leaderboard component exists but is deliberately not rendered — see
  [`engagement-and-retention.md`](./engagement-and-retention.md))
- Any monetization, billing, or paywall (no code exists — see
  [`monetization-and-subscription.md`](./monetization-and-subscription.md))
- Full Python / LLM curriculum depth
- Complete anonymous→Google account-linking edge cases under abuse

## Related reading

- Agent rules: [`../CLAUDE.md`](../CLAUDE.md)
- Engagement & retention (what's built vs missing): [`./engagement-and-retention.md`](./engagement-and-retention.md)
- Monetization & subscription model: [`./monetization-and-subscription.md`](./monetization-and-subscription.md)
- Admin console & feedback loop: [`./admin-and-feedback.md`](./admin-and-feedback.md)
- Current plans: [`../plans/coherent-v1/`](../plans/coherent-v1/)
- Historical plans: [`../plans/historical/`](../plans/historical/)
