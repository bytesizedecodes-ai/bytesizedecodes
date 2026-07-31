# Phase 0 — Frontend-first build

Status: draft v1 · Last updated: 2026-07-26
Inserted before Phase 1 in `00-product-plan.md`. Companion to `01-architecture.md`.

---

## 1. Purpose

Build and validate the entire learner-facing experience with **no backend**, then add Convex
once the experience is worth keeping.

This is viable because the product's core was already designed to run client-side: the drill
generators are pure functions, practice mode grades locally, byte pages are static MDX, and
Pyodide executes on the learner's device.

## 2. What this phase proves — and what it cannot

**Proves:**

- Can a byte be authored in 90 minutes? (the assumption the whole content plan rests on)
- Are the drills actually good — correct, fairly difficulty-tiered, well-explained?
- Does a 5-minute session feel good on a mid-range Android phone?
- Is the concept legible to a real final-year student in under 30 seconds?
- Does Pyodide perform acceptably on real devices and real networks?

**Cannot prove:**

- **Retention.** The 19:00 IST email is the primary external trigger and needs a backend.
  Nothing here tests whether people come back.
- Cross-device continuity, which is what makes a habit survive real life.
- Anything social: leaderboards, percentiles, profiles, sharing loops.
- Monetisation.

Treat a satisfying Phase 0 as evidence the *content and feel* are right. The loop remains
unvalidated until Phase 1 ships the email.

## 3. Scope

**In:**

- Next.js + Tailwind, MDX content pipeline, `scripts/new-byte.ts`
- 3 bytes first (to time the authoring budget), then up to 12
- Drill generators G2, G1, G4, G8 with the full renderer and answer widgets
- Practice mode with client-side grading and explanations
- SM-2 scheduling and the review queue, running against local state
- XP, levels, streaks, mastery map, day rollover — all local
- Pyodide code cell, read-and-run
- The data layer seam (§4) with a local adapter

**Out:** accounts, email, leaderboards, percentiles, public profiles, server-side grading,
ranked/daily challenge mode, payments.

**Deploy it publicly anyway.** A frontend-only app hosts on Netlify for free and works for
real users with localStorage progress. Validating with ten final-year students is the same
effort as validating alone and a far better signal. Buy the domain now.

## 4. The seam — this is the part that prevents a rewrite

### Rule

No component, page, or hook outside `lib/data/` may import `localStorage`, or later, Convex.
Everything goes through one interface with two implementations selected by
`NEXT_PUBLIC_DATA_ADAPTER=local|convex`.

```ts
// lib/data/types.ts — domain types only, zero Convex or storage imports
export type DayKey = string & { readonly __brand: "DayKey" }; // "YYYY-MM-DD" in IST
export type UserId = string & { readonly __brand: "UserId" };

export interface Profile {
  userId: UserId;
  displayName: string;
  xpTotal: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: DayKey | null;
  streakFreezes: number;
}
```

```ts
// lib/data/contract.ts — the only surface components consume
export interface DataLayer {
  /** undefined = loading, null = signed out. Mirrors Convex's useQuery exactly. */
  useCurrentUser(): Profile | undefined | null;
  useReviewQueue(today: DayKey): ReviewCard[] | undefined;
  useDayProgress(today: DayKey): DayProgress | undefined;
  useByteProgress(slug: string): ByteProgress | undefined;

  submitAttempt(input: AttemptInput): Promise<AttemptResult>;
  completeByte(slug: string): Promise<void>;
  gradeReviewCard(itemKey: string, grade: SrsGrade): Promise<void>;
}
```

### The mock must lie convincingly

The local adapter has to be **reactive and async-shaped**, not synchronous:

- Return `undefined` for at least one render before resolving, so every consumer is forced
  to handle a loading state.
- Return promises from mutations, with ~80ms of artificial latency.
- Notify subscribers on write so the UI updates reactively, the way Convex would.
- Occasionally throw from a mutation behind a dev-only flag, so error paths get built.

A synchronous mock is the failure mode here. It compiles, it feels great locally, and it
guarantees that every screen is missing loading and error handling when Convex arrives.

### Storage format

The local adapter persists one versioned JSON blob under `bsd:anon:v1` — the exact shape
already specified for anonymous sessions in `01-architecture.md` §5.4. Consequence: the
`claimAnonymousProgress` mutation built in Phase 1 doubles as the migration path, so early
Phase 0 users keep their progress when accounts arrive.

### Other rules that avoid rework

- **Day keys, not timestamps.** Use `lib/day.ts` from the first commit. Streaks, due dates,
  and rollover all key off `"YYYY-MM-DD"` in IST.
- **Opaque IDs.** Branded string types. Never parse an ID or assume its format — Convex ids
  look nothing like local ones.
- **Pure generators stay in `lib/drills/`,** outside any React or storage code, so Convex
  can import them unchanged for server-side grading later.
- **SM-2 stays a pure function** in `lib/srs.ts`, taking current state and a grade, returning
  new state. It moves to `convex/lib/srs.ts` verbatim.
- **No auth-shaped UI restructuring later.** Build against `useCurrentUser()` returning a
  local pseudo-profile from day one, so adding real sign-in changes an adapter, not layouts.
- **Day rollover runs on read in Phase 0** (a cron doesn't exist yet), but keep it in one
  pure `settleStreak(profile, today)` function that the Phase 1 cron can call unchanged.

## 5. Exit criteria

Move to Phase 1 when all of these hold:

| Criterion | Target |
| --- | --- |
| Byte authoring time | ≤ 90 min, measured over 3 bytes |
| Drill correctness | Generator test suite green over 10k seeds |
| Drill difficulty calibration | 60–80% accuracy per tier with real testers |
| Session length | Median under 5 minutes |
| Mobile feel | Usable one-handed on a mid-range Android over 3G |
| Pyodide cold start | Under 5s on a mid-range phone, gesture-triggered |
| Qualitative | ≥ 7 of 10 student testers say they'd use it daily |

If byte authoring exceeds 90 minutes, stop and revisit the content strategy in
`00-product-plan.md` §5 before building anything else. That number is load-bearing.

## 6. Convex migration checklist

When Phase 0 exits, adding the backend is:

1. `npx convex dev`, define `schema.ts` as specified in `01-architecture.md` §4
2. Convex Auth with Google OAuth, both providers per §5.3
3. Write `lib/data/convex/` implementing the same `DataLayer` contract
4. Flip `NEXT_PUBLIC_DATA_ADAPTER=convex`; **components change zero lines** (this is the
   test of whether the seam was respected)
5. `claimAnonymousProgress` to migrate existing local users
6. Crons: day rollover, daily digest, streak nudge
7. Move SRS and generator grading server-side for ranked modes only

If step 4 requires touching components, the seam leaked somewhere — find it before adding
features on top.

## 7. Risk this introduces

**The main risk is that Phase 0 feels like progress on the wrong question.** It de-risks
content quality, which matters, while leaving the central bet — that a daily email trigger
plus a five-minute loop produces retention — completely untested. Cap this phase at four
weeks. If it stretches toward eight because the frontend keeps getting more polished, that
is the risk materialising.

Secondary: localStorage progress will be lost for some early testers (cleared cache,
incognito, device switch). Ship an explicit "export progress" button and tell testers
plainly that this is a preview.
