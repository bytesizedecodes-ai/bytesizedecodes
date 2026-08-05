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
| Public feedback submission | `convex/admin/mutations.ts` → `submitFeedback` |
| Feedback widget (learner side) | `components/FeedbackWidget.tsx` |
| Provider hooks | `lib/data/provider.tsx` → admin + feedback hooks |
| Lead inquiries (not admin product, same ops inbox) | `convex/inquiries.ts`, `/advertise`, `/subscribe` |

## The security model (critical)

**Every admin query/mutation derives identity server-side via
`ctx.auth.getUserIdentity()` and checks `role === "admin"` — it NEVER accepts
a `userId` or `isAdmin` flag from the client.** This follows the Convex AI
guideline: *"NEVER accept a userId for authorization purposes."*

- `requireAdmin(ctx)` (`convex/lib/admin.ts`) is the single guard. It loads the
  profile by the auth identity and throws if `role !== "admin"`.
- The UI `AdminGate` is defense-in-depth only — it redirects non-admins to
  login; even if bypassed the backend refuses. **Do not rely on UI hiding.**
- Learning-path mutations likewise key data only by auth subject
  (`convex/lib/getUser.ts`).

## Becoming an admin

There is no UI button to become admin. Promotion is server-side via an email
allowlist:

1. Set `ADMIN_EMAILS=you@example.com,other@example.com` on the Convex deployment.
2. Sign in with a social account whose email is allowlisted (Google live;
   GitHub when enabled — same identity email path).
3. `bootstrapAdminRole` runs (on sign-in flow) and promotes that profile to
   `role: "admin"`. Idempotent — safe to call repeatedly.

Until a social provider is configured and an allowlisted operator signs in,
`/admin` redirects to login. This is intentional — guest admin is not permitted.

## The feedback loop (user → admin → fix)

```
learner hits a problem on a lesson
  → taps the floating "Feedback" button (FeedbackWidget)
  → picks a kind (bug / content_error / idea / praise / other) + writes body
  → submitFeedback mutation writes to the `feedback` table
admin opens /admin/feedback
  → queue by status → expand → URL context → update status / adminReply
```

**Rate limiting:** `submitFeedback` has a body length cap only. Before
production scale, add `@convex-dev/rate-limiter`.

## Email scheduling (designed, not yet built)

Outbound product email is **not** shipped. Social OAuth can supply email from
Google/GitHub; there is still no Resend integration or reminder cron content.

When built:

- **Channel:** Resend (or equivalent) via Convex action + scheduler
- **Trigger:** signed-in user with email + explicit reminder opt-in
  ([`engagement-and-retention.md`](./engagement-and-retention.md))
- **Content:** due count, est. time, skill/step, deep link — never streak FOMO

## Pre-launch checklist for admin

- [ ] Google live (`AUTH_GOOGLE_*` on Convex, `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`)
- [ ] Optional: GitHub live (`AUTH_GITHUB_*` + `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`)
- [ ] `ADMIN_EMAILS` set with operator email(s)
- [ ] Sign in once with allowlisted email → confirm admin role
- [ ] `/admin` as admin → dashboard loads
- [ ] Fresh non-admin browser → redirected to `/login`
- [ ] Submit feedback from a lesson → appears in `/admin/feedback`
- [ ] Rate-limit `submitFeedback` before public scale
