# Release model (agent note)

Production ships from **`main`**. Day-to-day work lands on **`dev`**. Promote with
a PR (`dev` → `main`).

Required automated gates: GitHub Actions job **`CI`** (`npm test`,
`npm run typecheck`, `npm run build`).

- Netlify production branch: `main` (see [`../netlify.toml`](../netlify.toml))
- Convex production: deploy on push to `main` when `CONVEX_DEPLOY_KEY` is set
- Full ritual, env checklist, and security-review habit:
  [`../plans/coherent-v1/release-and-deploy.md`](../plans/coherent-v1/release-and-deploy.md)
- Local `main` push guard: `git config core.hooksPath .githooks` (GitHub Pro needed for server-side branch protection on private repos)

## Production env (parity checklist)

**Netlify (Next):**

- `NEXT_PUBLIC_CONVEX_URL` — production Convex URL
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true` only when Google is configured
- `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true` only when GitHub is configured

**Convex production deployment** (dashboard / `convex env set`, not git):

- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (if using Google)
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (if using GitHub)
- JWT / Convex Auth keys from install path
- `ADMIN_EMAILS` for `/admin` operators

Template with setup comments: [`.env.example`](../.env.example).

Never use `npx convex deploy` casually against production from a feature experiment.
Use `npx convex dev` while developing.
