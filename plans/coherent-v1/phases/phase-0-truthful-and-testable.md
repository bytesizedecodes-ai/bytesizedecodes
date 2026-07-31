# Phase 0 — Make the current product truthful and testable

Parent: [`../05-product-execution-roadmap.md`](../05-product-execution-roadmap.md)  
Duration: ~1 week  
**Status: implemented in Coherent V1 (2026-07-31)**

## Product work

- Replace interview-only homepage positioning with:
  - Learn AI visually
  - Practise it
  - Build something real
- Present four goals:
  - Understand AI
  - Build technical skills
  - Prepare for an AI/ML role
  - Build an AI product
- Remove “Phase 0” and browser-only claims from learner-facing copy.
- Clearly label or hide simulated leaderboard and presence.
- Simplify navigation to Today, Learn, Build, Progress, and Profile
  (Build deferred until projects exist).

## Technical work

- Keep contributor guidance current and mark old phase plans as historical.
- Fix `/practice?topic=` deep links.
- Make course CTA resume the first incomplete lesson.
- Add explicit completion interaction to infographic-only lessons.
- Stop creating review cards that the queue cannot render.
- Measure real response time instead of storing zero.
- Replace the password/GitHub placeholder login with accurate Google OAuth and
  email-OTP preview copy until auth is implemented.
- Validate every generator `relatedBytes` slug, then render the repair link
  after a misconception.

## Verification

- Test every learner route on mobile and desktop.
- Test first visit, reload, and a second browser profile.
- Confirm all visible persistence statements are accurate.
- Confirm demo data cannot be mistaken for live user activity.

## Exit criteria

- A new tester can explain the product in one sentence.
- No visible copy contradicts the architecture.
- Every current lesson can be completed intentionally.
- Every generated SRS card can be reviewed.
