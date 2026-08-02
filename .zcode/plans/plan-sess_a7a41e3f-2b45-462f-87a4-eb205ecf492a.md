## Goal
An admin console at `/admin` (same app, not a subdomain) with: a user-count dashboard, a feedback collection + triage loop, and the scaffolding for email scheduling (built after Google/GitHub auth lands). Plus documenting the refined three-tier business model (free learning → login-to-build → paid-advanced).

## Decisions locked
- **Admin location:** `/admin` route in this app (shares auth/Convex/UI, no subdomain/cookie infra).
- **Business model (refined):** all courses free forever (no login to learn); `/build` requires authentication (login, not paywall); *later*, a paywall on advanced courses + advanced build projects. Documented as the canonical model; supersedes the earlier "paid certificates" framing.
- **Admin promotion:** Google/GitHub auth + whitelisted email → server-side promotion to admin role on first sign-in. No anonymous admin.
- **Scope now:** admin shell + feedback system + dashboard. Email scheduling is documented + scaffolded but built after phase-4 auth.

## Critical prerequisite (security) — do first
The audit found `convex/lib/getUser.ts:20` **trusts the client-supplied `userId`** during the anonymous transition, and the Convex AI guidelines (line 213) say *"NEVER accept a userId for authorization."* An admin role built on a client-trusted id is forgeable. Before any admin code:
- Harden the admin path specifically: admin queries/mutations MUST derive identity server-side via `ctx.auth.getUserIdentity()` and check the role there — never accept `userId`/`isAdmin` from the client for admin operations. (The learning-path mutations can keep their current anonymous-transition behavior; only admin endpoints need the hardening. This avoids a big-bang auth refactor.)

## Schema changes (`convex/schema.ts`)
1. **`profiles.role`** — add `role: v.optional(v.union(v.literal("user"), v.literal("admin")))`, default absent = "user". Existing profiles unaffected.
2. **New `feedback` table** — `userId`, `kind` (bug|content_error|idea|praise|other), `body`, `url` (where it was submitted), `status` (new|viewed|in_progress|resolved|wontfix), `adminReply?`, `createdAt`, `resolvedAt?`. Indexes: `by_status`, `by_user`, `by_created`.

## Auth hardening + admin guard (`convex/lib/admin.ts`, new)
- `requireAdmin(ctx)`: calls `ctx.auth.getUserIdentity()` (server-derived), loads the profile by `tokenIdentifier` (per guideline line 212, not `subject`), throws if not found or `role !== "admin"`. Every admin query/mutation calls this first. No client-supplied id is trusted for admin operations.
- `ADMIN_EMAILS`: env-var allowlist (`ADMIN_EMAILS=you@example.com,...`). `claimLegacyProgress` / a new `bootstrapAdminRole` mutation promotes a profile to admin when the authenticated email is in the allowlist, on sign-in. One-time, idempotent.

## Admin backend (`convex/queries.ts` + `convex/mutations.ts`)
**Queries (all gated by `requireAdmin`):**
- `admin.getStats` — total learners, active 7/30d (from `attempts`/`analyticsEvents`), anonymous vs. authenticated split, courses started/completed counts, feedback counts by status. (Replaces the placeholder `practicingNow` fake with real numbers.)
- `admin.listUsers` — paginated profiles (name, email-if-authed, track, xp, streak, createdAt, lastActive). The legit version of the orphaned `getLeaderboard`/`getUserCounts`.
- `admin.listFeedback` — by status, with pagination.

**Mutations (all gated):**
- `admin.updateFeedbackStatus({ id, status, adminReply })` — the triage action.
- `admin.bootstrapAdminRole()` — promotes whitelisted-email authenticated user to admin (idempotent; callable once by the first admin sign-in).

## Admin UI (`app/admin/*`)
Server components by default; a client island where needed.
- **`app/admin/layout.tsx`** — gating: server-side check; if not admin, redirect to `/login?next=/admin`. Reuses `Shell` with an "Admin" active state (nav-hidden, or a minimal admin nav).
- **`app/admin/page.tsx`** — dashboard: stat cards (learners, active 7d, feedback queue size), a feedback-status breakdown, recent-signups list.
- **`app/admin/users/page.tsx`** — user table (paginated).
- **`app/admin/feedback/page.tsx`** — feedback triage: filter by status, expand a row to read body + URL, set status + reply. The "fix loop" you described.

## Feedback widget (`components/FeedbackWidget.tsx`)
- A floating "Feedback" button on learner pages (lessons, bytes, courses) → opens a small form (kind selector + body + auto-captured URL).
- Submits via a public `submitFeedback` mutation (no auth required — anonymous users can report issues; rate-limited via `@convex-dev/rate-limiter` to prevent spam). This is the user→admin feedback loop.

## Documentation (`docs/`, `plans/`)
1. **Update `docs/monetization-and-subscription.md`** — replace the "free learning / paid certificates" model with the refined **three-tier model**: free learning (no login) → login-to-build → paid-advanced (future). Explain the evolution and why it protects the habit loop.
2. **New `docs/admin-and-feedback.md`** — the admin console: routes, role model, the `requireAdmin` guard, feedback lifecycle, the email-scheduling plan (scaffolded, built after phase-4), and the security note about server-derived identity.
3. **Update `docs/overview.md`** + `docs/README.md` + `CLAUDE.md` — index the new admin doc; note the role field on profiles; note the feedback table.

## Email scheduling — documented + scaffolded, built later
Since no email is collected today (anonymous auth), email reminders are **phase-4 dependent**. Document the design now so it's ready:
- **Channel:** Resend (native `scheduled_at` for one-offs; no cron needed for delayed send).
- **Pattern:** Convex mutation → `ctx.scheduler.runAfter` → internal action → Resend. Recurring digests via the existing `convex/crons.ts`.
- **Trigger:** only after a learner has an authenticated email (Google/GitHub) AND has opted in (per the ethical guardrails in `engagement-and-retention.md`).
- Leave a stub `convex/admin/email.ts` with the intended function signatures (not wired) so the plan is concrete.

## What I will NOT do
- No separate app/port 3001 (decided: `/admin` route).
- No content paywall now (decided: free learning; paywall is future, advanced-only).
- No shipping email (decided: scaffold + document, build after auth).
- No global-XP leaderboard in admin (separate decision, already documented).
- No big-bang auth refactor — only the admin path hardens `getUserId`; learning mutations keep current behavior to avoid scope explosion.

## Verification
- `npm run typecheck` + `npm test` after schema/backend/UI.
- Manual: non-admin visiting `/admin` → redirected to login; whitelisted-email Google sign-in → promoted to admin → sees dashboard; submit feedback from a lesson → appears in admin queue; triage → status updates.
- Confirm `requireAdmin` throws for unauthenticated/non-admin on every admin endpoint (not just UI-hidden).

## Build order
1. Schema (`role`, `feedback` table) + `requireAdmin` guard + email allowlist bootstrap.
2. Admin backend (stats, listUsers, listFeedback, updateFeedbackStatus).
3. Admin UI (layout gating, dashboard, users, feedback triage).
4. Feedback widget on learner pages.
5. Docs (monetization update, new admin doc, index updates).

## Scope honesty
This is a meaningful feature (~12 files) touching auth, schema, queries, mutations, UI, and docs. The auth-hardening is the load-bearing part — without it, "admin" is cosmetic. I'll build it tier by tier and verify the gating actually works before declaring done.