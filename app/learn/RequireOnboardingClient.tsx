"use client";

import { RequireOnboarding } from "@/components/RequireOnboarding";

export function RequireOnboardingClient({ children }: { children: React.ReactNode }) {
  return <RequireOnboarding>{children}</RequireOnboarding>;
}
