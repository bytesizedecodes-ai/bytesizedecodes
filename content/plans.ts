/**
 * Plans / tiers marketing copy — single source for /plans comparison.
 * Aligned with docs/monetization-and-subscription.md (no fake prices).
 */

export type PlanTierId = "free_learn" | "free_account" | "pro";

export type PlanFeatureValue = "yes" | "no" | "soon";

export type PlanTier = {
  id: PlanTierId;
  name: string;
  priceLabel: string;
  status: "available" | "coming_soon";
  blurb: string;
  ctaLabel: string;
  /** Internal route intent for primary CTA */
  cta: "courses" | "account" | "notify";
};

export type PlanFeature = {
  id: string;
  label: string;
  values: Record<PlanTierId, PlanFeatureValue>;
};

export const PLAN_PAGE = {
  eyebrow: "Plans",
  title: "What you get — free and paid",
  description:
    "Read free forever. Create a free account with a social sign-in to save progress. Advanced courses and builds are coming soon — fee not decided yet.",
  heroLine: "Read free forever. Account free for progress. Advanced coming soon.",
} as const;

export const PLAN_TIERS: readonly PlanTier[] = [
  {
    id: "free_learn",
    name: "Free learning",
    priceLabel: "$0 · no account",
    status: "available",
    blurb: "Browse free courses and lessons without signing in. Built for SEO and curious visitors.",
    ctaLabel: "Browse free courses",
    cta: "courses",
  },
  {
    id: "free_account",
    name: "Free account",
    priceLabel: "$0 · social sign-in",
    status: "available",
    blurb:
      "Everything in free learning, plus a saved path: daily plan, practice, streaks, Build drafts, and Profile export.",
    ctaLabel: "Sign in free",
    cta: "account",
  },
  {
    id: "pro",
    name: "Pro / Advanced",
    priceLabel: "Fee TBD",
    status: "coming_soon",
    blurb:
      "Paid courses, advanced builds, and future certificates when we ship them. Price and checkout are not live yet.",
    ctaLabel: "Notify me",
    cta: "notify",
  },
] as const;

export const PLAN_FEATURES: readonly PlanFeature[] = [
  {
    id: "free_courses",
    label: "Free courses & full lessons",
    values: { free_learn: "yes", free_account: "yes", pro: "yes" },
  },
  {
    id: "public_gallery",
    label: "Public project gallery (view)",
    values: { free_learn: "yes", free_account: "yes", pro: "yes" },
  },
  {
    id: "saved_progress",
    label: "Saved course progress",
    values: { free_learn: "no", free_account: "yes", pro: "yes" },
  },
  {
    id: "daily_plan",
    label: "Daily plan (/today)",
    values: { free_learn: "no", free_account: "yes", pro: "yes" },
  },
  {
    id: "xp_streaks",
    label: "XP, levels, streaks & freezes",
    values: { free_learn: "no", free_account: "yes", pro: "yes" },
  },
  {
    id: "practice_review",
    label: "Practice drills & spaced review",
    values: { free_learn: "no", free_account: "yes", pro: "yes" },
  },
  {
    id: "build",
    label: "Build projects & private drafts",
    values: { free_learn: "no", free_account: "yes", pro: "yes" },
  },
  {
    id: "export",
    label: "Export / import / delete data",
    values: { free_learn: "no", free_account: "yes", pro: "yes" },
  },
  {
    id: "paid_courses",
    label: "Advanced paid courses",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
  {
    id: "advanced_build",
    label: "Advanced build projects",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
  {
    id: "certificates",
    label: "Certificates",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
  {
    id: "priority_support",
    label: "Priority support",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
] as const;
