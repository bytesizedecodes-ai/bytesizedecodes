# Release model (agent note)

Production ships from **`main`**. Day-to-day work lands on **`dev`**. Promote with
a PR (`dev` → `main`).

Required automated gates: GitHub Actions job **`CI`** (`npm test`,
`npm run typecheck`, `npm run build`).

- Frontend host: **Vercel**, production branch `main` (Vercel auto-detects Next.js;
  no `vercel.json` needed). `netlify.toml` is a leftover from an earlier host and is
  unused on Vercel — safe to ignore or delete.
- Convex production: deploy on push to `main` when `CONVEX_DEPLOY_KEY` is set
  ([`.github/workflows/deploy-convex.yml`](../.github/workflows/deploy-convex.yml)).
  Alternative (tighter coupling, recommended if Vercel is the only frontend host):
  set the Vercel **Build Command** to `npx convex deploy --cmd 'npm run build'`
  with `CONVEX_DEPLOY_KEY` as a Vercel env var — this guarantees the deployed
  Convex functions always match the deployed frontend commit.
- Full ritual, env checklist, and security-review habit:
  [`../plans/coherent-v1/release-and-deploy.md`](../plans/coherent-v1/release-and-deploy.md)
- Local `main` push guard: `git config core.hooksPath .githooks` (GitHub Pro needed for server-side branch protection on private repos)

## Production env (parity checklist)

**Vercel (Next) — Project Settings → Environment Variables, Production:**

- `NEXT_PUBLIC_CONVEX_URL` — **production** Convex URL (a different deployment than
  the `dev:...` one used locally — run `npx convex deploy` once, or let the build
  command above create it)
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true` only when Google is configured
- `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true` only when GitHub is configured
- `CONVEX_DEPLOY_KEY` — only if using the Vercel build-command deploy pattern above

**Convex production deployment** (dashboard / `npx convex env set ... --prod`, not git —
this is a *separate* deployment from the `dev:` one; env vars do not carry over):

- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (if using Google) — and update the Google
  Cloud Console authorized redirect URI to the **production** `*.convex.site` URL
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (if using GitHub) — same redirect-URI update
- JWT / Convex Auth keys from install path
- `ADMIN_EMAILS` for `/admin` operators
- `RESEND_API_KEY`, `EMAIL_FROM` for the `/admin/email` campaign/trigger feature —
  without these, campaigns record a clear `failed` status instead of silently no-op'ing

Template with setup comments: [`.env.example`](../.env.example).

Never use `npx convex deploy` casually against production from a feature experiment.
Use `npx convex dev` while developing.

## Vercel launch checklist (one-time)

- [ ] Production Convex deployment created and `NEXT_PUBLIC_CONVEX_URL` on Vercel points to it (not the `dev:` URL)
- [ ] All "Convex production deployment" env vars above are set on that deployment
- [ ] OAuth redirect URIs updated for the production domain + production `*.convex.site`
- [ ] `ADMIN_EMAILS` set on **production** Convex, then sign in once with that email to trigger `bootstrapAdminRole`
- [ ] `/samples/*` internal design drafts are noindexed (done — `app/samples/layout.tsx`) or removed once a direction is final
- [ ] Confirm `npm run build` is clean and `npm test`/`npm run typecheck` pass in CI before merging to `main`
