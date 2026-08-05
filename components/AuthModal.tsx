"use client";

/**
 * Login / signup modal — social identity (Google live; GitHub when enabled).
 */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { SIGN_IN_COPY } from "@/lib/authProviders";

export function AuthModal({
  open,
  onClose,
  redirectTo,
  title = SIGN_IN_COPY.modalDefaultTitle,
  description = SIGN_IN_COPY.modalDefaultDescription,
}: {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  title?: string;
  description?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        tabIndex={-1}
        className="card animate-pop relative w-full max-w-md space-y-5 p-6 outline-none"
      >
        <div className="flex items-start justify-between">
          <p className="eyebrow">Account</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-1 -mt-1 rounded-lg p-1 text-ink-soft transition-colors hover:bg-ash/60 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <h2 id="auth-modal-title" className="text-lg font-semibold tracking-tight text-ink">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{description}</p>
        </div>

        <SocialAuthButtons redirectTo={redirectTo} />

        <p className="text-center text-[11px] leading-relaxed text-ink-faint">
          Free courses stay readable without an account. By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-ink-soft" onClick={onClose}>
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-ink-soft" onClick={onClose}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>,
    document.body,
  );
}
