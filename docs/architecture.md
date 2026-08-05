# Architecture

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict,
  `noUncheckedIndexedAccess`)
- **Tailwind v4** with theme tokens in `app/globals.css`
- **Convex** reactive backend + **Convex Auth** (OAuth providers)
- **Vitest** for colocated unit tests
- Path alias `@/*` → repo root
- **Pyodide** from CDN at runtime (code cells)

## High-level flow

```text
UI (app/, components/)
  → hooks from lib/data/provider.tsx   (DataLayer)
    → Convex Auth session (signed-in | guest)
    → Convex queries/mutations         (convex/)
      → pure domain logic              (lib/drills, lib/srs, lib/day,
                                       lib/data/streak, lib/data/xp,
                                       convex/lib/*)
Content modules (content/) stay in git; learner state lives in Convex.
```

### Guest vs signed-in

- **Guest:** public pages (home, free courses/lessons, Learn browse, Plans, legal,
  advertise/subscribe forms). Personal queries are skipped; mutations that need
  identity throw / UI gates with auth modal.
- **Signed-in:** `getUserId` uses Convex Auth `identity.subject`; progress, Today,
  practice, review, Build, Profile go through that subject only.

## Important directories

| Path | Role |
| --- | --- |
| `app/` | Routes; server components by default; `"use client"` only where needed |
| `components/` | Shell, NavLinks, AuthModal, SocialAuthButtons, DrillPlayer, SiteFooter, UI |
| `content/` | Bytes, courses, tracks, skills, catalog, plans tiers, review helpers |
| `lib/data/` | Provider, contract, types; legacy `local.ts` / `identity.ts` |
| `lib/authProviders.ts` | Client flags for Google/GitHub button enablement + shared sign-in copy |
| `lib/auth.ts` | Post-OAuth redirect helpers |
| `lib/site.ts` | `SITE_URL`, contact email, legal date |
| `proxy.ts` | Next.js 16 network proxy (Convex Auth cookies; was `middleware.ts`) |
| `lib/drills/` | Pure generators; registry order = practice picker order |
| `lib/srs.ts`, `lib/day.ts` | Pure SM-2 and IST day keys |
| `convex/` | Schema, auth, queries, mutations, admin, inquiries, cron |
| `docs/` | Agent-facing project docs (this folder) |
| `plans/` | Product planning by phase (not runtime truth) |

## Auth / identity (current)

| Piece | Detail |
| --- | --- |
| Providers | `convex/auth.ts` — Google and/or GitHub when their `AUTH_*_ID` + `AUTH_*_SECRET` exist on the **Convex deployment** |
| UI enable | `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` / `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` on Next |
| Identity source | `convex/lib/getUser.ts` → `ctx.auth.getUserIdentity().subject` only |
| Profiles | `ensureProfile` + name/email/image from identity |
| No product anonymous session | Do not reintroduce auto-login as anonymous |
| Legacy | `lib/data/identity.ts` browser UUID + `legacyAnonId` schema field — not active login |

Env template and OAuth setup notes: [`.env.example`](../.env.example).

## Site surfaces (non-learning)

| Route | Role |
| --- | --- |
| `/plans` | Tier comparison (`content/plans.ts`) |
| `/about`, `/contact`, `/privacy`, `/terms` | Trust / legal |
| `/advertise`, `/subscribe` | Lead capture → `inquiries` + FormSubmit |
| `/admin/*` | Operator console (`requireAdmin`) |

## Design system notes

Theme tokens: `canvas, dot, ash, ink, ink-soft, ink-faint, brand, brand-deep,
brand-wash, good, good-wash, bad, bad-wash, gold`. Prefer existing patterns in
`components/ui/` and `app/globals.css`. Respect `prefers-reduced-motion`.
