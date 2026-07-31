import { LoginCard } from "@/components/LoginCard";
import { Shell } from "@/components/Shell";

export default function LoginPage() {
  return (
    <Shell active="/login">
      <section className="mx-auto max-w-md pt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Log in to keep your streak.
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-ink-soft">
          Real accounts arrive with Phase 1 auth. For now your progress is saved to
          this browser.
        </p>
      </section>
      <div className="mx-auto mt-6 max-w-md">
        <LoginCard />
      </div>
    </Shell>
  );
}
