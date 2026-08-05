# Release and deploy (`dev` → `main`)

Process for shipping bytesizedecodes to production. Agent-facing stack notes stay in
[`docs/`](../../docs/); this file is the release ritual.

## Branch model

| Branch | Role |
| --- | --- |
| `dev` | Integration / staging. Daily work lands here. |
| `main` | Production only. Netlify production branch. No direct pushes. |

Optional short-lived feature branches merge into `dev` first, then promote
`dev` → `main` with a PR when ready.

```text
work on dev → push → open PR to main → CI + preview → merge → Netlify + Convex prod
```

## Promote prerequisites

1. Product smoke: onboarding, Today, one lesson, practice, Build/gallery, Profile.
2. CI green: `npm test`, `npm run typecheck`, `npm run build` (GitHub Actions job `CI`).
3. Deploy Preview looked good on the PR.
4. If backend changed: Convex production deploy will run from `main` (see below).
5. Env parity: Netlify production has `NEXT_PUBLIC_CONVEX_URL` and social auth
   UI flags (`NEXT_PUBLIC_AUTH_GOOGLE_ENABLED`, optionally `_GITHUB_`) matching
   secrets on the Convex production deployment.
6. If the diff touches auth / `convex/` / `lib/data/`: run Cursor Security Review or Bugbot.
   Agent review does **not** block merge by itself — CI does.

PR template: [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md).

## CI

[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs on pushes and PRs to
`main` and `dev`. Status check name: **`CI`**.

## Netlify

Config file: [`netlify.toml`](../../netlify.toml).

Dashboard (required once):

1. Connect the GitHub repo.
2. **Production branch** = `main` (not `dev`).
3. Enable **Deploy Previews** for pull requests.
4. Set env vars for production (and preview if needed):
   - `NEXT_PUBLIC_CONVEX_URL` — production Convex deployment URL
   - `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` — `true` only when Google auth is configured on Convex
   - `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` — `true` only when GitHub auth is configured on Convex
5. Confirm build command is `npm run build` (from `netlify.toml`).

Do not point Netlify production at `dev`.

## Convex production deploy

Local / `dev` work uses `npx convex dev`.

Production deploys are coupled to `main` via
[`.github/workflows/deploy-convex.yml`](../../.github/workflows/deploy-convex.yml):

1. In Convex dashboard → production deployment → create a **Deploy Key**.
2. Add GitHub Actions secret `CONVEX_DEPLOY_KEY` on this repo.
3. On every push to `main` (including promote merges), the workflow runs
   `npx convex deploy`.

If the secret is missing, the Convex job is skipped — add the secret before the
first real production cutover.

Auth secrets live on the Convex **production** deployment (not in git):

- Google: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- GitHub: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (when enabling)
- `ADMIN_EMAILS` for operators
- Convex Auth JWT material from the auth install path

See [`.env.example`](../../.env.example) for setup comments.

## Branch protection

GitHub **branch protection / rulesets require GitHub Pro** on private
personal repositories. This private repo cannot enable server-side protection
until the account upgrades (or the repo is under an org plan that includes it).

Until then:

1. **Local guard** — enable the repo hook once per clone:

   ```bash
   git config core.hooksPath .githooks
   ```

   [`.githooks/pre-push`](../../.githooks/pre-push) rejects direct pushes to
   `main`. Promote with a PR from `dev` instead.

2. **Discipline** — never push `main` with `--no-verify` unless recovering from
   an emergency.

3. **When on Pro** — create a ruleset on `main`:
   - Require a pull request (0 approving reviews is fine for solo)
   - Require status check **`CI`**
   - Block force-pushes (`non_fast_forward`)

   Example (after upgrading):

   ```bash
   gh api repos/bytesizedecodes-ai/bytesizedecodes/rulesets --method POST --input - <<'EOF'
   {
     "name": "Protect main",
     "target": "branch",
     "enforcement": "active",
     "conditions": { "ref_name": { "include": ["refs/heads/main"], "exclude": [] } },
     "rules": [
       {
         "type": "pull_request",
         "parameters": {
           "required_approving_review_count": 0,
           "dismiss_stale_reviews_on_push": false,
           "require_code_owner_review": false,
           "require_last_push_approval": false,
           "required_review_thread_resolution": false
         }
       },
       {
         "type": "required_status_checks",
         "parameters": {
           "strict_required_status_checks_policy": true,
           "required_status_checks": [{ "context": "CI" }]
         }
       },
       { "type": "non_fast_forward" }
     ]
   }
   EOF
   ```

## Security review habit

On promote PRs that change `convex/`, `lib/data/`, auth, or public APIs:

1. Open PR `dev` → `main`
2. Wait for CI
3. Run `/review-security` (or Bugbot)
4. Fix real findings
5. Merge

Do not install flaky LLM checks as required merge blockers yet.
