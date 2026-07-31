import Google from "@auth/core/providers/google";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Auth methods:
 * - Anonymous: seamless first-run learning without an account
 * - Google: upgrade / cross-device identity (requires AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET)
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Anonymous,
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google]
      : []),
  ],
});
