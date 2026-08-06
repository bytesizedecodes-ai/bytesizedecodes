/**
 * Named rate limits for public, unauthenticated endpoints.
 *
 * DESIGN NOTE — why these are global buckets, not per-user/per-IP:
 * The endpoints they guard (feedback submission, lead-form inquiry) accept anonymous
 * input by design. A Convex mutation does not have direct access to the caller's IP,
 * and there is no logged-in subject for anonymous callers, so there is no reliable
 * per-caller key to partition on. We therefore cap total throughput globally with a
 * fixed window. This bounds cost amplification, DB write volume, and outbound email
 * spam (each inquiry schedules a lead email) — the risks flagged in the security
 * review. It is the honest server-side constraint without additional infra (e.g. a
 * verifying CAPTCHA or edge-layer IP throttling). If a per-caller limit is needed
 * later, key on the resolved auth subject (signed-in callers) and keep a global
 * fallback bucket for anonymous ones.
 *
 * Limits are enforced with `throws: true`, so exceeding the limit aborts the mutation
 * with a `RateLimitError` — see `isRateLimitError` for detecting it client-side.
 */

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "../_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Anonymous feedback: 5 per minute globally. Generous enough for real users across
  // the app, tight enough to stop a spam loop. The 2000-char body cap further bounds
  // stored volume.
  feedback: { kind: "fixed window", rate: 5, period: MINUTE },

  // Lead forms (advertise / subscribe): 10 per hour globally. Each one schedules an
  // outbound email via FormSubmit, so this caps notification spam and abuse of the
  // inbox. Real lead volume is far below this.
  inquiry: { kind: "fixed window", rate: 10, period: HOUR },
});
