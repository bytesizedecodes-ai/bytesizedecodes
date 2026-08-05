"use client";

/**
 * Keeps already-authenticated users off /login.
 *
 * Signed-in users with onboarding complete → /today (or ?next=).
 * Signed-in users without onboarding → /onboarding (or ?next=).
 */

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "@/lib/data/provider";
import { readNextParam } from "@/lib/auth";

export function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, hasProfile } = useAuthState();

  useEffect(() => {
    if (status !== "authed") return;
    const next = readNextParam();
    router.replace(next ?? (hasProfile ? "/today" : "/onboarding"));
  }, [status, hasProfile, router, searchParams]);

  return null;
}
