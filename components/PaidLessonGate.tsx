"use client";

import { useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useAuthState } from "@/lib/data/provider";
import { AuthModal } from "@/components/AuthModal";

/**
 * Soft gate for paid-course lesson bodies (v5 monetization: free account to
 * read, Stripe checkout later). The lesson header + concept brief render as
 * the public teaser above this gate; everything inside — infographic, diagram,
 * prose, questions, pager — renders only for signed-in users. Unsigned users
 * get the locked panel + the same AuthModal flow CourseCard uses.
 *
 * Pre-Stripe this is a UX gate, not an entitlement: the page is still
 * statically rendered. When checkout lands, this component is the single
 * place to swap the auth check for an entitlement check.
 */
export function PaidLessonGate({
  redirectTo,
  children,
}: {
  /** Where the sign-in flow returns the learner after auth. */
  redirectTo: string;
  children: ReactNode;
}) {
  const { status } = useAuthState();
  const [authOpen, setAuthOpen] = useState(false);

  if (status === "authed") {
    return <>{children}</>;
  }

  return (
    <>
      <div className="mt-6 rounded-2xl border border-brand-muted bg-brand-wash px-5 py-6 text-center shadow-sm">
        <span
          aria-hidden="true"
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-brand-muted bg-surface-elevated"
        >
          <Lock className="h-4 w-4 text-brand-deep" />
        </span>
        <p className="mt-3 text-sm font-bold text-ink sm:text-base">
          The rest of this lesson is part of Pro
        </p>
        <p className="mx-auto mt-1 max-w-md text-[13px] font-medium leading-relaxed text-ink-soft">
          Sign in with a free account to keep going — checkout and the GitHub project
          portal come later with Pro. The concept brief above stays free, always.
        </p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="focus-ring mt-4 rounded-full border border-brand bg-brand px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-brand-deep"
        >
          Sign in to unlock
        </button>
      </div>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to unlock this lesson"
        description="Paid advanced courses need a free account first. Checkout and GitHub project portal access come later with Pro."
        redirectTo={redirectTo}
      />
    </>
  );
}
