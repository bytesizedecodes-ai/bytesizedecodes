import { LoginCard } from "@/components/LoginCard";
import { Shell } from "@/components/Shell";
import { LoginRedirect } from "./LoginRedirect";

export default function LoginPage() {
  return (
    <Shell active="/login">
      <LoginRedirect />
      <section className="mx-auto max-w-md pt-4 text-center">
        <p className="eyebrow">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Sign in to learn with progress
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          Free courses stay open to everyone. A free social account saves your path, course
          progress, and daily plan so you can return tomorrow.
        </p>
      </section>
      <div className="mx-auto mt-6 max-w-md">
        <LoginCard />
      </div>
    </Shell>
  );
}
