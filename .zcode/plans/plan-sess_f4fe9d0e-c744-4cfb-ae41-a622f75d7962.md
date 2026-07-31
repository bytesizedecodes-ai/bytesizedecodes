## Login page + Leaderboard + Stats board (CEMVP-inspired, existing tokens)

**Decisions locked in:** Placeholder login UI (no real auth yet — visual scaffolding that plugs into the existing auth swap point later). Demo/seed data for the leaderboard/counts. CEMVP *patterns* (stat tiles, ranked podium rows, login form with show/hide + social buttons) rendered in ByteSizedCodes' existing light `ink/ash/brand` token system — no dark mode, no new design system.

One new dependency: **`lucide-react`** (tree-shakeable icons — CEMVP uses it; the current app only has inline SVGs and we need several icons: eye/eye-off, trophy/crown, users, etc.). Clean, minimal.

---

### Backend — 3 additions to the Convex layer

**1. `convex/mutations.ts` → add `seedDemoProfiles` mutation.** Inserts ~18 realistic demo learners with varied `xpTotal`, `currentStreak`, `longestStreak`, `track`, and Indian-context `displayName`s (e.g. "Aarav S.", "Priya K."). Idempotent: marks each with `seed: true` and wipes prior seed docs before re-inserting, so re-running is safe and never touches real profiles. This is what makes the leaderboard and counts look populated during dev.

**2. `convex/schema.ts` → add `seed` field to `profiles`.** `seed: v.optional(v.boolean())` so seed rows are identifiable/clearable. No index needed — at dev scale (~20 profiles) the leaderboard collects all and sorts in JS by `xpTotal`. (I'll note where a `by_xp` index goes later if real user volume demands it.)

**3. `convex/queries.ts` → add two cross-user queries** (the first queries that read across all profiles):
- `getLeaderboard(limit?)` → top N by `xpTotal`. Returns `{ rank, userId, displayName, xpTotal, level, currentStreak, track }[]`. Level derived server-side via `levelFromXp` (already imported).
- `getUserCounts()` → `{ totalLearners, practicingNow, drillsAnswered }`. `totalLearners` = `profiles.count()`; `drillsAnswered` = `attempts.count()`; `practicingNow` is **deterministically faked** from the current minute (fluctuates in a believable range) since there's no presence infra yet — purely cosmetic for the demo, and I'll comment it honestly as a placeholder for `@convex-dev/presence` later.

### Client hooks — 2 additions to `lib/data/provider.tsx`
- `useLeaderboard()` and `useUserCounts()` — the **first hooks that don't call `useUserId()`** (global queries). Same `useQuery` pattern, return `undefined` while loading (matches the existing 3-state semantics every page gates on).

### New components (3) — CEMVP patterns in light tokens

**4. `components/LoginCard.tsx`** (`"use client"`) — adapts CEMVP's `login-form.tsx` structure to the light palette:
- Email field + password field with show/hide toggle (Eye/EyeOff from lucide)
- "Remember me" checkbox + "Forgot password?" link
- Client-side validation (email regex, password ≥ 8) exactly like CEMVP's `useMemo` pattern
- Submit button with loading spinner ("Signing in...")
- "or continue with" divider + Google/GitHub social buttons (placeholder — brand SVGs, no OAuth wired)
- **On submit:** shows a friendly inline notice — *"Real accounts arrive with Phase 1 auth. Your progress is saved to this browser for now."* (honest about the placeholder nature)
- "New here? **Create account**" link → also placeholder
- Styling: `card p-6`, `rounded-xl border border-ash bg-white` inputs, `bg-ink text-white` primary button — matches the existing button convention from `app/page.tsx`

**5. `components/Leaderboard.tsx`** (`"use client"`) — adapts CEMVP's `podium-widget.tsx`:
- Header with Trophy icon + "Leaderboard" title
- Ranked rows: rank badge (`#1` in `text-gold`, `#2`/`#3` tinted silver/bronze), initials avatar (colored circle — no real avatars in demo), name, XP (`text-gold` for points, matching CEMVP's `--feedback-warning` role)
- Top-3 rows get a subtle `bg-brand-wash` highlight
- Loading skeleton (pulse rows) + empty state
- Queries `useLeaderboard()`

**6. `components/StatsBoard.tsx`** (`"use client"`) — adapts CEMVP admin `StatCard` + reuses the existing `StatsHud` Stat pattern:
- Responsive grid `grid-cols-2 sm:grid-cols-4` of stat tiles inside one `card` (matches `StatsHud`'s `grid gap-px bg-ash` split-cell look)
- Tiles: **Total learners**, **Practicing now**, **Drills answered**, **Avg streak** (derived from seeded data)
- Big number (`text-2xl font-semibold tracking-tight`) + uppercase muted label (`text-[11px] text-ink-faint`) — exactly the existing `Stat` typography
- Loading skeleton + lucide icon per tile

### Pages (2)

**7. `app/login/page.tsx`** (new) — server component wrapping `<LoginCard>` in `<Shell active="/login">`. Centered, `max-w-md`, with a short eyebrow + heading ("Welcome back" / "Log in to keep your streak."). Adds `/login` to the nav (`Shell.tsx` NAV list) and a "Login" button in the homepage hero alongside the existing CTAs.

**8. `app/page.tsx`** (edit) — insert two new sections between the feature grid (line 56) and the footer note (line 58):
- `<StatsBoard />` section (`mt-16`, `max-w-3xl`)
- `<Leaderboard />` section (`mt-8`, `max-w-3xl`)
- Update the footer copy (lines 58-61): drop "leaderboards arrive in Phase 1" since it's here now; keep the "progress saved to this browser / real accounts in Phase 1" note. Add a "Login" CTA.

### Run step (you execute, once)
After implementation, seed the demo data so the board isn't empty:
```bash
npx convex run mutations:seedDemoProfiles '{}' --once
```
(Or a one-click "Load demo data" button on `/settings` if you prefer — I'll wire whichever you want; default is the CLI command to keep the UI clean.)

---

### What does NOT change
- Existing hooks, mutations, queries, schema tables (only *additions*: 1 field, 1 mutation, 2 queries, 2 hooks)
- All other pages and components
- The auth swap point (`convex/lib/getUser.ts` + `lib/data/identity.ts`) — when Convex Auth ships, the placeholder `LoginCard` on-submit becomes a real `signIn()` call and the seed data is naturally replaced by real users

### Honest placeholders (called out in code comments)
- Login submit → notice message, no real auth
- Social buttons → visual only
- "Practicing now" count → deterministic fake, no presence backend
- Leaderboard rows → seed data, replaced by real users when auth ships

These are all isolated so the swap to "real" is a small, localized change later.