## Goal
Replace the "Start free" link in the top nav with a **"Login"** button that opens a popup modal matching the reference image's layout (Google + email/password) and the site's design language. When the user already has a profile, the button stays hidden (today's behavior is preserved).

## What I'm NOT building (being honest about scope)
- **Email/password fields will be visually present but non-functional.** Your auth backend is anonymous + Google only — there is no password verification mutation, no `users` table with credentials, and no email/password provider in `convex/auth.ts`. Wiring real credential auth is a separate, larger task (schema changes, hashing, verification flow, reset flow). The plan adds a clear "Coming soon" affordance on the email path so users aren't misled, and notes the follow-up work.
- **Only the Google button actually signs you in today.** It reuses the exact `signIn("google", { redirectTo: "/profile" })` call already proven in `LoginCard.tsx:20`.

## Files to change

### 1. NEW: `components/AuthModal.tsx` (the popup)
A client component that renders a centered modal over a backdrop. Structure mirrors the reference image but uses the site's tokens:

- **Backdrop:** `fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm`. Clicking it closes the modal.
- **Panel:** `card w-full max-w-md p-6 space-y-5 animate-pop` (reuses the existing `card` @utility + the existing `animate-pop` entrance animation — both already in `globals.css`).
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
  - **Top row:** eyebrow `<p className="eyebrow">Account</p>` on the left, a `ghost`-style `<X>` close button top-right (`focus-ring`), matching FeedbackWidget's close affordance.
  - **Header:** icon badge `flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-wash text-brand-deep` with `Cloud` (mirrors `LoginCard`), then `<h2 className="text-lg font-semibold text-ink">Sign in or create account</h2>` + subtitle `text-sm text-ink-soft`.
  - **Google button (primary, working):** `<Button variant="brand" className="w-full">` with a Google "G" inline SVG + "Continue with Google". Calls `signIn("google", { redirectTo: "/profile" })` via `useAuthActions()`. Shows `Loader2` + "Redirecting…" when busy (matches LoginCard pattern). Gated the same way LoginCard is on `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED`.
  - **Divider:** a row with a `border-t border-ash` line, centered label "or", `text-xs text-ink-faint uppercase tracking-wide`.
  - **Email/password form (present but non-functional):** two `<input>`s styled identically to FeedbackWidget's textarea — `w-full rounded-xl border border-ash bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/40`. A `<Button variant="primary" className="w-full">` "Continue with email" that, on submit, sets a notice: "Email sign-in isn't available yet — use Google for now." (Honest, not a dead-end.)
  - **Footer:** `text-xs text-ink-faint text-center` — "By continuing you agree to our Terms & Privacy." with links to existing routes if present.
  - **Notice line** (same styling as LoginCard): `<p role="status" className="rounded-xl bg-brand-wash px-3 py-2.5 text-xs text-ink-soft">`.

- **Behavior:** Escape key closes; clicking backdrop closes; focus moves to the panel on open; body scroll lock when open (`useEffect` toggling `document.body.style.overflow`).
- **State:** controlled by parent via props `{ open, onClose }` — the parent owns open/close so the nav button and any future trigger share one source of truth. Internal `busy` + `notice` state only.

### 2. EDIT: `components/NavLinks.tsx`
- Desktop (line 76-83): replace the `<Link href="/login">Start free</Link>` with a `<button onClick={() => onOpenAuth()}>Login</button>` styled to match the existing nav pill (`rounded-full px-5 py-2 text-base font-extrabold`) but keeping the brand fill. Change label "Start free" → "Login". Keep the `!hasProfile` gate so authed users still don't see it.
- Mobile (line 113-121): same swap — `<Link>` → `<button>`, label "Start free" → "Login", keep `LogIn` icon.
- Add `useState` for `authOpen` and render `<AuthModal open={authOpen} onClose={...} />` once at the `NavLinks` root (so both desktop + mobile variants share one modal instance).
- Add imports: `useState`, `AuthModal`. `NavLinks` is already `"use client"`, so no new client boundary.

### 3. EDIT: `components/LoginCard.tsx`
- Tighten the placeholder notice text (the existing "Google sign-in is currently disabled…" line). Already accurate after my earlier edit; no change needed unless review shows otherwise. (Will verify during build.)

### 4. NEW (optional, recommended): `components/GoogleIcon.tsx`
A tiny inline-SVG component for the multi-color Google "G" — `lucide-react` has no brand logos, and the reference image shows the real G. Keeps the multi-color SVG out of the JSX in `AuthModal`. ~15 lines.

## What I'm explicitly preserving
- The `/login` page (`app/login/page.tsx` + `LoginCard`) stays as-is — it's still a valid full-page route and a fallback if JS fails. The modal is an *additional* entry point, not a replacement.
- `!hasProfile` gating: authed users with a profile still see the full nav and no Login button.
- The `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` gate controls whether the Google button is live (unchanged behavior).
- All design tokens (`card`, `eyebrow`, `focus-ring`, `animate-pop`, `bg-brand-wash`, etc.) come from existing `globals.css` — no new CSS.

## Build sequence
1. Create `components/GoogleIcon.tsx` (leaf, no deps).
2. Create `components/AuthModal.tsx` (depends on `GoogleIcon`, `Button`, `useAuthActions`).
3. Edit `components/NavLinks.tsx` to wire the button + modal.
4. Typecheck (`npx tsc --noEmit`).
5. Verify visually in the running app at `/profile` (your current URL) and `/`.

## Follow-up I'll flag (not doing now)
- **Real email/password auth** would require: a `users`/`authAccounts` credentials flow in `convex/auth.ts` (Convex Auth supports a `Password` provider), schema for password hashes, and a reset-password path. Recommend doing this as its own task before promoting the email form beyond "coming soon".
- The `/login` page and the modal duplicate sign-in logic; once the modal is proven, the page could redirect to `/?auth=open` or be removed. Out of scope here.