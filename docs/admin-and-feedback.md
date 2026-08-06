# Admin console and feedback loop

The `/admin` console is an in-app route (not a subdomain) for platform
operators. Jobs: see who is learning (name + email), triage feedback with
admin replies, broadcast email (send now / schedule), and toggle automated
email triggers. Access is gated by an admin role.

## Where things live

| Concern | Path |
| --- | --- |
| Admin UI | `app/admin/` — dashboard, users, feedback, email |
| Admin gate (client) | `app/admin/AdminGate.tsx` |
| Admin guard (server) | `convex/lib/admin.ts` → `requireAdmin` |
| Admin queries | `convex/admin/queries.ts` |
| Admin mutations | `convex/admin/mutations.ts` |
| Resend send path | `convex/admin/emailActions.ts` (Node action) |
| Recipient loaders | `convex/admin/emailInternals.ts` |
| Crons | `convex/crons.ts` — campaign flush + daily/weekly triggers |
| Public feedback | `submitFeedback` + `components/FeedbackWidget.tsx` |
| Provider hooks | `lib/data/provider.tsx` → admin + feedback hooks |
| Lead inquiries | `convex/inquiries.ts`, `/advertise`, `/subscribe` |

## Security model

**Every admin query/mutation derives identity server-side via
`ctx.auth.getUserIdentity()` and checks `role === "admin"` — it NEVER accepts
a `userId` or `isAdmin` flag from the client.**

- `requireAdmin(ctx)` is the single guard.
- UI `AdminGate` is defense-in-depth only.
- Outbound mail secrets (`RESEND_API_KEY`) live only on the Convex deployment.

## Becoming an admin

1. Set `ADMIN_EMAILS=you@example.com` on the Convex deployment.
2. Sign in with that email (Google/GitHub).
3. `bootstrapAdminRole` promotes the profile when allowlisted.

## Feedback (user → admin)

```
learner → FeedbackWidget → submitFeedback
admin → /admin/feedback → filter status → expand → reply notes + triage
```

Admin replies are stored on the feedback row (`adminReply`). They are **not**
emailed back to the learner yet (in-admin operational notes).

## Email campaigns and triggers

| Feature | How |
| --- | --- |
| Recipients | Unique emails from non-seed profiles (OAuth-synced `profiles.email` / auth users) |
| Composer | `/admin/email` — subject + body, `{{name}}` personalization |
| Send all | `createEmailCampaign` → schedules `dispatchCampaign` action |
| Schedule | Same mutation with `scheduledForEpochMs`; cron flushes every 5 minutes |
| Cap | ~200 recipients per send |
| Triggers | `daily_due_reminder`, `weekly_digest` — cron-fired, **disabled by default**; toggle + edit templates in UI |

**Required on Convex:**

```bash
npx convex env set RESEND_API_KEY "re_..."
npx convex env set EMAIL_FROM "ByteSizeDecodes <hello@yourdomain.com>"
```

Without `RESEND_API_KEY`, campaigns record `failed` with a clear error; the admin
email page shows config status.

Automated triggers currently send one template to all accounts with email (not
true per-due personalization). Marketing opt-in is not yet enforced — treat
broadcasts carefully.

## Pre-launch checklist for admin

- [ ] Google live (`AUTH_GOOGLE_*` on Convex, `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`)
- [ ] Optional: GitHub live
- [ ] `ADMIN_EMAILS` set
- [ ] Sign in once with allowlisted email → admin role
- [ ] `/admin` loads as admin; non-admin redirects to login
- [ ] Feedback submits and appears in `/admin/feedback`
- [ ] `RESEND_API_KEY` + verified `EMAIL_FROM` if sending mail
- [ ] Rate-limit feedback before public scale (partially present)
