## Promote checklist (especially `dev` → `main`)

- [ ] Smoke: onboarding, Today, one lesson, practice/review, Build/gallery, Profile export
- [ ] CI green (`test`, `typecheck`, `build`)
- [ ] Netlify Deploy Preview URL checked
- [ ] Convex prod deploy planned/done if `convex/` or schema changed (secret `CONVEX_DEPLOY_KEY`)
- [ ] Env vars confirmed on Netlify + Convex production
- [ ] Security review run if this touches `convex/`, `lib/data/`, auth, or public APIs
  - In Cursor: `/review-security` (or Bugbot on the PR)
  - Agent review is advisory — fix real findings before merge; CI remains the merge blocker

## Summary

-

## Notes

-
