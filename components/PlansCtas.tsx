"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthState } from "@/lib/data/provider";
import { AuthModal } from "@/components/AuthModal";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { PlanTier } from "@/content/plans";

/** CTAs for each plan tier — account tier opens social auth when needed. */
export function PlanTierCta({ tier }: { tier: PlanTier }) {
  const { status, hasProfile } = useAuthState();
  const [authOpen, setAuthOpen] = useState(false);

  if (tier.cta === "courses") {
    return (
      <ButtonLink href="/courses" variant="secondary" className="w-full">
        {tier.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    );
  }

  if (tier.cta === "notify") {
    return (
      <ButtonLink href="/subscribe?intent=pro" variant="secondary" className="w-full">
        {tier.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    );
  }

  // free account
  function onAccount() {
    if (status === "loading") return;
    if (status === "unauthed") {
      setAuthOpen(true);
      return;
    }
    if (!hasProfile) {
      window.location.href = "/onboarding";
      return;
    }
    window.location.href = "/today";
  }

  return (
    <>
      {status === "authed" && hasProfile ? (
        <ButtonLink href="/today" className="w-full">
          Go to Today
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      ) : (
        <Button className="w-full" onClick={onAccount}>
          {tier.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Create a free account"
        description="Sign in with Google or GitHub to save progress, streaks, and your daily plan — no paid plan required."
        redirectTo="/onboarding"
      />
    </>
  );
}

export function PlansHeaderLinks() {
  return (
    <p className="mt-6 text-sm text-ink-soft">
      Or jump straight to{" "}
      <Link href="/learn" className="font-semibold text-brand-deep hover:underline">
        Learn
      </Link>{" "}
      ·{" "}
      <Link href="/courses" className="font-semibold text-brand-deep hover:underline">
        Courses
      </Link>
      .
    </p>
  );
}
