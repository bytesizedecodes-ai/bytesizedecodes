import {
  convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";

/**
 * Next.js 16 network boundary (`proxy` — formerly `middleware`).
 * Handles Convex Auth cookies / session refresh for matched routes.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export default convexAuthNextjsMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
