"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/data/provider";

/**
 * Client-side gate for /admin. Defense-in-depth only — the backend ALSO
 * enforces admin on every query/mutation via requireAdmin (see
 * convex/lib/admin.ts), so even if this gate is bypassed the data layer
 * refuses.
 *
 * IMPORTANT: only redirect to /login when the visitor is unauthenticated.
 * If they ARE signed in but simply aren't an admin, redirecting to
 * /login?next=/admin creates an infinite loop — LoginRedirect sends any
 * authenticated user straight back to `next` regardless of role, which
 * bounces the browser between /login and /admin forever (visible as
 * continuous flashing). Signed-in non-admins get an in-place "access
 * denied" message instead.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const profile = useCurrentUser();
  const router = useRouter();

  const loading = profile === undefined;
  const unauthed = profile === null;
  const isAdmin = !loading && !unauthed && profile.role === "admin";

  useEffect(() => {
    if (loading) return;
    if (unauthed) {
      router.replace("/login?next=/admin");
    }
  }, [loading, unauthed, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-ink-faint">
        Checking admin access…
      </div>
    );
  }

  if (unauthed) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-ink-faint">
        Redirecting to sign-in…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-sm font-semibold text-ink">Access denied</p>
        <p className="mt-2 text-sm text-ink-soft">
          Your account is signed in but isn&apos;t an admin. Ask an existing
          admin to add your email to the operator allowlist.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
