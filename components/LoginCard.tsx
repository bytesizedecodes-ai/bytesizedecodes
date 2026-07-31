"use client";

import { CheckCircle2, Cloud, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/Button";

export function LoginCard() {
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const googleConfigured = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";

  async function continueWithGoogle() {
    setBusy(true);
    setNotice(null);
    try {
      await signIn("google", { redirectTo: "/profile" });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Google sign-in is not configured on this deployment yet.",
      );
      setBusy(false);
    }
  }

  return (
    <section className="card space-y-5 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-wash text-brand-deep">
        <Cloud className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink">
          {isAuthenticated ? "Signed in on this device" : "Save progress across devices"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          bytesizedecodes starts anonymously so learning is instant. Link Google later when
          you want the same progress on another device — no email codes required.
        </p>
      </div>
      <ul className="space-y-3 text-sm text-ink-soft">
        {[
          "Anonymous learning is already active in this browser.",
          "Google linking migrates this browser's progress once.",
          "Export/import works anytime from Profile.",
        ].map((item) => (
          <li key={item} className="flex gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
            {item}
          </li>
        ))}
      </ul>
      {googleConfigured ? (
        <Button className="w-full" disabled={busy} onClick={() => void continueWithGoogle()}>
          <LogIn className="h-4 w-4" />
          {busy ? "Redirecting…" : "Continue with Google"}
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() =>
            setNotice(
              "Google is ready in code. When you add AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET and set NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true, this button will sign you in.",
            )
          }
        >
          <LogIn className="h-4 w-4" />
          Continue with Google
        </Button>
      )}
      {isAuthenticated && (
        <Button variant="ghost" className="w-full" onClick={() => void signOut()}>
          Sign out
        </Button>
      )}
      {notice && (
        <p role="status" className="rounded-xl bg-brand-wash px-3 py-2.5 text-xs text-ink-soft">
          {notice}
        </p>
      )}
    </section>
  );
}
