# Data layer

## Sacred seam

UI and pages import data hooks **only** from `@/lib/data/provider`.

Do **not** import Convex React hooks or browser persistence from pages/
components for product state.

| File | Role |
| --- | --- |
| `lib/data/provider.tsx` | Active Convex-backed adapter (hooks + mutations + auth state) |
| `lib/data/contract.ts` | Mutation / query surface contract |
| `lib/data/types.ts` | Shared client types (profile includes optional social email/avatar) |
| `lib/data/identity.ts` | **Legacy** browser UUID helpers — not used for product auth |
| `lib/data/local.ts` | Legacy localStorage adapter — **not active** |
| `lib/data/streak.ts`, `lib/data/xp.ts` | Pure streak/XP logic |
| `lib/authProviders.ts` | Which social buttons are live + shared copy |

## Auth state (client)

`useAuthState()` / Convex Auth:

| Status | Meaning |
| --- | --- |
| `"loading"` | Session resolving |
| `"unauthed"` | Guest — free content only; Login / AuthModal |
| `"authed"` | Social session live; `hasProfile` when onboarding completed |

After sign-in, provider ensures a `profiles` row (`ensureProfile`) so profile hooks
can resolve name/email/image.

## Server identity

`convex/lib/getUser.ts`:

- `getUserId` → **auth subject only** (throws if not authenticated)
- Optional `userId` args from clients are **ignored for authorization**
- `getIdentityProfile` supplies display fields for Profile UI

Admin functions use `requireAdmin` (role + allowlist email). Learning mutations
are gated the same way: no progressive anonymous trust.

## Loading semantics

Hooks return:

1. `undefined` while loading
2. then data or `null`

Every consumer must handle the loading state. The active provider is reactive
through Convex; do not rely on local-adapter-specific behavior. Public pages
skip personal queries while unauthenticated so guests are not blocked.

## Practice vs review

- **Practice / lesson attempts** grade and may create a review card on first
  exposure (`submitAttempt`). They do **not** advance the SRS schedule.
- **Review** advances the schedule via `gradeReview`.

## Review keys

- Generator reviews: `(generatorId, difficulty)` via `drillItemKey`
- Authored reviews: typed keys from `convex/lib/reviewKey.ts` / content helpers

Review tracks mastery of a skill (or authored item), not a random seed instance.

## Day keys and streaks

- `DayKey` is `"YYYY-MM-DD"` in IST (fixed +05:30). Use `asDayKey()`.
- Pass `today: DayKey` into pure logic; never call `Date.now()` inside pure
  modules or Convex **queries**.
- `settleOnPractice` runs on writes; `settleOnRollover` adjusts query display;
  nightly streak settlement runs via cron where enabled.

## Inquiries (leads)

`/advertise` and `/subscribe` use `InquiryForm` → Convex `inquiries` table
(`convex/inquiries.ts`) and may forward via FormSubmit to the public contact email.
These are **not** learning progress; no social login required to submit.

## Convex work

Before editing Convex functions, read
`convex/_generated/ai/guidelines.md`.

Public functions validate `args` and `returns`. Prefer indexes over `.filter()`.
Await all DB/scheduler promises. Schedule only `internal.*` functions.
