"use client";

/**
 * Homepage primary CTA: Begin → social sign-in if needed → onboarding → today.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuthState } from "@/lib/data/provider";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/Button";

export function BeginLearningCta({
  className = "px-7 py-3 text-base",
  label = "Begin learning",
}: {
  className?: string;
  label?: string;
}) {
  const { status, hasProfile } = useAuthState();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  function onClick() {
    if (status === "loading") return;
    if (status === "unauthed") {
      setAuthOpen(true);
      return;
    }
    if (!hasProfile) {
      router.push("/onboarding");
      return;
    }
    router.push("/today");
  }

  return (
    <>
      <Button className={className} onClick={onClick}>
        {label} <ArrowRight className="h-4 w-4" />
      </Button>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to begin"
        description="A free social account saves your learning path and daily progress."
        redirectTo="/onboarding"
      />
    </>
  );
}
