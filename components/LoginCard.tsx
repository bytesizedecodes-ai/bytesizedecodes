"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

/**
 * Login form — PLACEHOLDER for Phase 1 auth.
 *
 * Visually complete and validated, but the submit handler does not call a real auth
 * backend. When Convex Auth ships, the only change is the onSubmit body: it calls
 * signIn("password", ...) from @convex-dev/auth/react instead of showing the notice.
 * Identity wiring already flows through lib/data/identity.ts + convex/lib/getUser.ts.
 */
export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const normalizedEmail = email.trim().toLowerCase();

  const emailError = useMemo(() => {
    if (!triedSubmit && email.length === 0) return null;
    if (!normalizedEmail) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
      return "Use a valid email format.";
    return null;
  }, [email, normalizedEmail, triedSubmit]);

  const passwordError = useMemo(() => {
    if (!triedSubmit && password.length === 0) return null;
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  }, [password, triedSubmit]);

  const isFormValid =
    !emailError &&
    !passwordError &&
    normalizedEmail.length > 0 &&
    password.length >= 8;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTriedSubmit(true);
    setNotice(null);
    if (!isFormValid) return;
    setSubmitting(true);
    // PLACEHOLDER: simulate a request, then surface the honest "not yet" message.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setNotice(
      "Real accounts arrive with Phase 1 auth. Your progress is saved to this browser for now.",
    );
  }

  return (
    <form className="card space-y-4 p-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-ash bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(emailError)}
          disabled={submitting}
        />
        {emailError && <p className="text-xs text-bad">{emailError}</p>}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="login-password"
          className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full rounded-xl border border-ash bg-white px-3 py-2.5 pr-11 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(passwordError)}
            disabled={submitting}
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((p) => !p)}
            disabled={submitting}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {passwordError && <p className="text-xs text-bad">{passwordError}</p>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-xs text-ink-soft">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-3.5 w-3.5 rounded-sm border border-ash"
            disabled={submitting}
          />
          Remember me
        </label>
        <button
          type="button"
          className="text-xs font-medium text-brand-deep hover:underline"
          onClick={() =>
            setNotice(
              "Password reset arrives with Phase 1 auth. For now, your progress stays in this browser.",
            )
          }
          disabled={submitting}
        >
          Forgot password?
        </button>
      </div>

      {notice && (
        <p className="rounded-lg border border-brand/30 bg-brand-wash px-3 py-2 text-xs text-ink-soft">
          {notice}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        disabled={submitting || !isFormValid}
      >
        {submitting ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>

      {/* "or continue with" divider — matches CEMVP's social-login row, visual only */}
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-ash" />
        <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          or continue with
        </span>
        <span className="h-px flex-1 bg-ash" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="Google" disabled={submitting} onClick={() => setNotice("Google sign-in arrives with Phase 1 auth.")}>
          <GoogleG />
        </SocialButton>
        <SocialButton label="GitHub" disabled={submitting} onClick={() => setNotice("GitHub sign-in arrives with Phase 1 auth.")}>
          <GithubMark />
        </SocialButton>
      </div>

      <p className="text-center text-xs text-ink-soft">
        New here?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-deep hover:underline"
          onClick={() => setNotice("Account creation arrives with Phase 1 auth.")}
        >
          Create account
        </Link>
      </p>
    </form>
  );
}

function SocialButton({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-ash bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand/50 disabled:opacity-40"
    >
      {children}
      {label}
    </button>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.32z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
