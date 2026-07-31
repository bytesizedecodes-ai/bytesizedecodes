import { LoginCard } from "@/components/LoginCard";
import { Shell } from "@/components/Shell";

export default function LoginPage() {
  return (
    <Shell active="/login">
      <section className="mx-auto max-w-md pt-4 text-center">
        <p className="eyebrow">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Learn now. Connect when ready.
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-ink-soft">
          Anonymous auth is on. Google OAuth upgrades the same progress for cross-device
          use once credentials are configured.
        </p>
      </section>
      <div className="mx-auto mt-6 max-w-md">
        <LoginCard />
      </div>
    </Shell>
  );
}
