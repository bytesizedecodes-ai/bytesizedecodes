"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";

/**
 * Gates a route behind authentication. Used on /today, /progress,
 * /build, /practice, /profile — personalised loop surfaces.
 *
 * Free courses and public Learn browse remain login-free.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/today");
      router.replace(`/login?next=${next}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-10">
        <div className="h-8 w-56 animate-pulse rounded bg-ash" />
        <div className="h-40 animate-pulse rounded-2xl bg-ash/70" />
      </div>
    );
  }

  return children;
}
