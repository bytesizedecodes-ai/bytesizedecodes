import type { Metadata } from "next";
import { Check, Minus, Clock } from "lucide-react";
import { Shell } from "@/components/Shell";
import { PlanTierCta, PlansHeaderLinks } from "@/components/PlansCtas";
import { Badge } from "@/components/ui/Badge";
import {
  PLAN_FEATURES,
  PLAN_PAGE,
  PLAN_TIERS,
  type PlanFeatureValue,
} from "@/content/plans";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plans",
  description: PLAN_PAGE.description,
  alternates: { canonical: "/plans" },
};

export default function PlansPage() {
  return (
    <Shell active="/plans">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <p className="eyebrow">{PLAN_PAGE.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {PLAN_PAGE.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{PLAN_PAGE.heroLine}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-faint">{PLAN_PAGE.description}</p>
          <PlansHeaderLinks />
        </header>

        {/* Tier cards */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLAN_TIERS.map((tier) => {
            const isPro = tier.id === "pro";
            const isAccount = tier.id === "free_account";
            return (
              <section
                key={tier.id}
                className={`flex flex-col rounded-2xl border p-6 ${
                  isAccount
                    ? "border-brand/40 bg-brand-wash/40 shadow-sm"
                    : "border-ash bg-surface-elevated"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-ink">{tier.name}</h2>
                  {tier.status === "coming_soon" ? (
                    <Badge tone="warm">Coming soon</Badge>
                  ) : (
                    <Badge tone="good">Available</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-ink-soft">{tier.priceLabel}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{tier.blurb}</p>
                <div className="mt-6">
                  <PlanTierCta tier={tier} />
                </div>
                {isPro && (
                  <p className="mt-3 text-center text-[11px] text-ink-faint">
                    No charge yet — join the interest list only. Pro packages advanced
                    courses and the project portal together.
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl border border-brand-muted bg-brand-wash/30 p-6 sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight text-ink">What’s in Pro</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-ink-soft sm:grid-cols-2">
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-deep" aria-hidden />
              <span>
                <span className="font-semibold text-ink">Advanced courses</span> — paid
                curriculum beyond free foundations (`access: paid` when live).
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-deep" aria-hidden />
              <span>
                <span className="font-semibold text-ink">GitHub project portal</span> —
                AI ideas and starter codes for work tasks, startup MVPs, and hobby
                builds.
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-deep" aria-hidden />
              <span>
                <span className="font-semibold text-ink">Advanced builds</span> —
                deeper implementation tracks on top of free drafts.
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-deep" aria-hidden />
              <span>
                Core free lessons, Energy, and streaks stay free forever — Pro is depth
                and shipping, not habit hostage.
              </span>
            </li>
          </ul>
        </section>

        {/* Comparison table */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Compare features</h2>
          <p className="mt-1.5 text-sm text-ink-soft">
            How {SITE_NAME} free tiers work today versus paid advanced later.
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-ash">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-ash bg-surface-elevated">
                  <th scope="col" className="px-4 py-3 font-semibold text-ink sm:px-5">
                    Feature
                  </th>
                  {PLAN_TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className="px-3 py-3 text-center font-semibold text-ink"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {PLAN_FEATURES.map((row) => (
                  <tr key={row.id} className="bg-canvas/40">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-ink-soft sm:px-5"
                    >
                      {row.label}
                    </th>
                    {PLAN_TIERS.map((tier) => (
                      <td key={tier.id} className="px-3 py-3 text-center">
                        <FeatureCell value={row.values[tier.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 max-w-2xl space-y-3 text-sm leading-relaxed text-ink-soft">
          <h2 className="text-lg font-semibold text-ink">Honest notes</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Free courses stay readable without payment. We do not plan to wall foundational
              lessons forever.
            </li>
            <li>
              A free social account is required only to <em>save</em> progress and use Today,
              practice, and Build.
            </li>
            <li>
              Pro fee is not set. There is no checkout yet — use Notify me if you want first access.
            </li>
          </ul>
        </section>
      </div>
    </Shell>
  );
}

function FeatureCell({ value }: { value: PlanFeatureValue }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center justify-center text-good" title="Included">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === "soon") {
    return (
      <span
        className="inline-flex items-center justify-center gap-1 text-xs font-medium text-warm"
        title="Coming soon"
      >
        <Clock className="h-3.5 w-3.5" aria-hidden />
        Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center text-ink-faint" title="Not included">
      <Minus className="h-4 w-4" aria-hidden />
      <span className="sr-only">No</span>
    </span>
  );
}
