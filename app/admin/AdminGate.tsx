"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/data/provider";

/**
 * Client-side gate for /admin. Redirects non-admins to /login.
 *
 * The server-side backend ALSO enforces admin on every query/mutation via
 * requireAdmin (see convex/lib/admin.ts), so this gate is defense-in-depth for
 * the UI only — even if bypassed, the data layer refuses.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const profile = useCurrentUser();
  const router = useRouter();

  const loading = profile === undefined;
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (loading) return;
    if (!profile || !isAdmin) {
      router.replace("/login?next=/admin");
    }
  }, [loading, profile, isAdmin, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-ink-faint">
        Checking admin access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-ink-faint">
        Redirecting to sign-in…
      </div>
    );
  }

  return <>{children}</>;
}
