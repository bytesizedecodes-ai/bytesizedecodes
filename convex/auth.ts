import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Social identity providers (OAuth). Free course content is readable without
 * an account; personal progress requires a signed-in identity.
 *
 * Configure secrets on the Convex deployment (not only Next.js):
 * - Google: AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
 * - GitHub: AUTH_GITHUB_ID, AUTH_GITHUB_SECRET
 *
 * Toggle UI buttons with NEXT_PUBLIC_AUTH_GOOGLE_ENABLED /
 * NEXT_PUBLIC_AUTH_GITHUB_ENABLED in the Next app env.
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google]
      : []),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [GitHub]
      : []),
  ],
});
