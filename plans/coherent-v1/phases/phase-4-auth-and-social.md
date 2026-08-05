# Phase 4 — Authentication and real social learning

/** Status note (product docs supersede dated exit criteria):
 *  - Convex Auth social OAuth shipped (Google live; GitHub optional when env set).
 *  - Server identity only (`getUserId`); no product anonymous session.
 *  - Free course reading public; progress requires sign-in.
 *  - Privacy/export/delete on Profile; opt-in project gallery.
 *  Remaining: peer social (explanations, rubrics, squads), abuse moderation,
 *  carefully designed comparison (not global XP), optional migration of any
 *  leftover legacy browser ids. See docs/overview.md + docs/data-layer.md.
 */

## Authentication — original intent

- [x] Convex Auth with Google OAuth (production when secrets set)
- [x] Resolve identity on the server (auth subject)
- [x] Remove client-trusted user IDs for progress
- [~] Migrate anonymous progress after signup (legacy fields exist; product no longer creates anonymous progress)
- [x] Privacy and deletion/export controls (Profile)
- [ ] GitHub OAuth when product enables it (provider + UI ready)

## Social work

Start with:

1. [x] Opt-in project gallery (basic publish/view)
2. [ ] Compare explanations after answering
3. [ ] Rubric-based project review
4. [ ] Small goal-based study squads

Do not ship:

- Global lifetime XP leaderboard
- Public progress by default
- Free-form direct messages
- Unmoderated forum

## Exit criteria (remaining / rephrased)

- Learner progress is keyed only to a signed-in OAuth subject.
- Users control project visibility for published work.
- Peer feedback is useful under a simple rating/rubric before open social.
- Abuse reporting and moderation paths exist before open submission.

For freemium and current nav, see
[`docs/monetization-and-subscription.md`](../../../docs/monetization-and-subscription.md).
