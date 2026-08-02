# Admin console and feedback loop

The `/admin` console is an in-app route (not a subdomain) for platform
operators. It has three jobs: see who's learning, triage user feedback, and
(eventually) trigger scheduled emails. Access is gated by an admin role.

## Where things live

| Concern | Path |
| --- | --- |
| Admin route (UI) | `app/admin/` — dashboard, users, feedback triage |
| Admin gate (client, defense-in-depth) | `app/admin/AdminGate.tsx` |
| Admin guard (server, the real check) | `convex/lib/admin.ts` → `requireAdmin` |
| Admin queries | `convex/admin/queries.ts` — `getStats`, `listUsers`, `listFeedback` |
| Admin mutations | `convex/admin/mutations.ts` — `updateFeedbackStatus`, `bootstrapAdminRole` |
| Public feedback submission | `convex/admin/mutations.ts` → `submitFeedback` (NOT admin-gated) |
| Feedback widget (learner side) | `components/FeedbackWidget.tsx` |
| Provider hooks | `lib/data/provider.tsx` → `useAdminStats`, `useAdminUsers`, `useAdminFeedback`, `useUpdateFeedbackStatus`, `useSubmitFeedback`, `useBootstrapAdminRole` |

## The security model (critical)

**Every admin query/mutation derives identity server-side via
`ctx.auth.getUserIdentity()` and checks `role === "admin"` — it NEVER accepts
a `userId` or `isAdmin` flag from the client.** This follows the Convex AI
guideline: *"NEVER accept a userId for authorization purposes."*

- `requireAdmin(ctx)` (`convex/lib/admin.ts`) is the single guard. It loads the
  profile by the auth identity and throws `Forbidden` if `role !== "admin"`.
- The UI `AdminGate` is defense-in-depth only — it redirects non-admins to
  login, but even if bypassed the backend refuses. **Do not rely on UI hiding.**
- The learning-path mutations (lessons, drills, SRS) intentionally keep their
  anonymous-transition trust (`convex/lib/getUser.ts`); only admin hardens it.

## Becoming an admin

There is no UI button to become admin. Promotion is server-side via an email
allowlist:

1. Set `ADMIN_EMAILS=you@example.com,other@example.com` in the Convex env.
2. Sign in with Google/GitHub using an allowlisted email (requires phase-4
   Google/GitHub auth to be live — see
   `plans/coherent-v1/phases/phase-4-auth-and-social.md`).
3. `bootstrapAdminRole` runs (called on sign-in) and promotes that profile to
   `role: "admin"`. Idempotent — safe to call repeatedly.

Until Google/GitHub auth is configured, no one is admin and `/admin` always
redirects to login. This is intentional — anonymous admin is not permitted.

## The feedback loop (user → admin → fix)

```
learner hits a problem on a lesson
  → taps the floating "Feedback" button (FeedbackWidget, on every learner page)
  → picks a kind (bug / content_error / idea / praise / other) + writes body
  → submitFeedback mutation writes to the `feedback` table (public, no auth)
admin opens /admin/feedback
  → sees the queue, filtered by status
  → expands a row → reads body + the URL it was submitted from
  → sets status (viewed → in_progress → resolved / wontfix)
  → optionally adds an adminReply
```

The `feedback` table (`convex/schema.ts`): `userId`, `kind`, `body`, `url`,
`status`, `adminReply?`, `createdAt`, `resolvedAt?`. Indexed by status (the
triage read), by user, and by creation date.

**Rate limiting:** `submitFeedback` is currently unauthenticated with a 2000-char
body cap only. Before production scale, add `@convex-dev/rate-limiter` to cap
submissions per user per hour. The learning-path mutations do not need this.

## Email scheduling (designed, not yet built)

Email reminders are **phase-4 dependent** — no email is collected today
(anonymous + Google auth only). The design is documented here so it's ready:

- **Channel:** Resend. Native `scheduled_at` for one-off delayed sends; no cron
  needed for a single scheduled email.
- **Pattern:** Convex mutation → `ctx.scheduler.runAfter` → internal action →
  Resend HTTP call. Recurring digests reuse the existing `convex/crons.ts`.
- **Trigger:** only after a learner has an authenticated email AND has opted in
  to reminders (per the ethical guardrails in `engagement-and-retention.md`).
- **Content (from the strategy doc):** due count, est. time, the exact skill/
  step, one deep link. Never "your streak is about to die."

A stub `convex/admin/email.ts` with the intended signatures should be added
when this is built; it is deliberately omitted now to avoid dead code.

## Pre-launch checklist for admin

- [ ] Google/GitHub auth live (`AUTH_GOOGLE_*` / `AUTH_GITHUB_*` env set).
- [ ] `ADMIN_EMAILS` env set with the operator email(s).
- [ ] Sign in once with an allowlisted email → confirm promoted to admin.
- [ ] Visit `/admin` as admin → dashboard loads.
- [ ] Visit `/admin` in a fresh (non-admin) browser → redirected to `/login`.
- [ ] Submit feedback from a lesson → appears in `/admin/feedback`.
- [ ] Triage a feedback item → status updates.
- [ ] Add `@convex-dev/rate-limiter` to `submitFeedback` before public launch.
