# Architecture

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict,
  `noUncheckedIndexedAccess`)
- **Tailwind v4** with theme tokens in `app/globals.css`
- **Convex** reactive backend
- **Vitest** for colocated unit tests
- Path alias `@/*` → repo root
- **Pyodide** from CDN at runtime (code cells)

## High-level flow

```text
UI (app/, components/)
  → hooks from lib/data/provider.tsx   (DataLayer)
    → Convex queries/mutations         (convex/)
      → pure domain logic              (lib/drills, lib/srs, lib/day,
                                       lib/data/streak, lib/data/xp,
                                       convex/lib/*)
Content modules (content/) stay in git; learner state lives in Convex.
```

## Important directories

| Path | Role |
| --- | --- |
| `app/` | Routes; server components by default; `"use client"` only where needed |
| `components/` | Shell, DrillPlayer, CodeCell, BlockList, StatsHud, UI primitives |
| `content/` | Authored bytes, courses, tracks, skills, catalog, review helpers |
| `lib/data/` | Provider, contract, identity, streak/xp, types; legacy `local.ts` |
| `lib/drills/` | Pure generators; registry order = practice picker order |
| `lib/srs.ts`, `lib/day.ts` | Pure SM-2 and IST day keys |
| `convex/` | Schema, queries, mutations, shared server pure helpers |
| `docs/` | Agent-facing project docs (this folder) |
| `plans/` | Product planning by phase |

## Auth / identity (temporary)

`lib/data/identity.ts` owns an anonymous browser UUID. The backend currently
trusts the client-supplied `userId`. Replace with Convex Auth before any public
or multi-device release.

## Design system notes

Theme tokens: `canvas, dot, ash, ink, ink-soft, ink-faint, brand, brand-deep,
brand-wash, good, good-wash, bad, bad-wash, gold`. Prefer existing patterns in
`components/ui/` and `app/globals.css`. Respect `prefers-reduced-motion`.
