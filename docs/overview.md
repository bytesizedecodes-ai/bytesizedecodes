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

- Next.js App Router UI with Today, Learn, Progress, Profile, Build navigation
- Anonymous onboarding (goal, level, weekly minutes, time mode)
- Convex Auth: anonymous by default; Google when env vars are set (**no email OTP**)
- Convex-backed progress behind a `DataLayer` seam
- Typed lesson/byte content, courses, skills, tracks, unified Learn catalog
- Personalized daily plan query
- Procedural drill generators + authored review
- SM-2 review queue, streaks, XP, streak rollover cron
- Pyodide code cell (worker + timeout)
- Opt-in project gallery (publish from Build)

## What is not ready

- Google OAuth until `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are configured
- Daily reminder email (intentionally deferred — no Resend)
- Public social features, peer review moderation, and real leaderboards
- Full Python / LLM curriculum depth
- Complete anonymous→Google account-linking edge cases under abuse

## Related reading

- Agent rules: [`../CLAUDE.md`](../CLAUDE.md)
- Current plans: [`../plans/coherent-v1/`](../plans/coherent-v1/)
- Historical plans: [`../plans/historical/`](../plans/historical/)
