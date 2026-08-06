/**
 * Plans / tiers marketing copy — single source for /plans comparison.
 * Aligned with docs/monetization-and-subscription.md (no fake prices).
 *
 * Effort currency is labelled Energy in product UI (stored as xp* in data layer).
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
    "Read free forever. Create a free account to save progress and Energy. Pro unlocks advanced courses plus our private GitHub portal of real AI project ideas and starter codes for work, startups, and hobby builds. Fee not decided yet.",
  heroLine:
    "Free lessons. Free account for the habit loop. Pro for advanced courses and shippable project kits.",
} as const;

export const PLAN_TIERS: readonly PlanTier[] = [
  {
    id: "free_learn",
    name: "Free learning",
    priceLabel: "$0 · no account",
    status: "available",
    blurb:
      "Browse free courses and visual lessons without signing in. Built for SEO and curious visitors.",
    ctaLabel: "Browse free courses",
    cta: "courses",
  },
  {
    id: "free_account",
    name: "Free account",
    priceLabel: "$0 · social sign-in",
    status: "available",
    blurb:
      "Everything in free learning, plus a saved path: daily plan, practice, Energy, streaks, free Build drafts, and Profile export.",
    ctaLabel: "Sign in free",
    cta: "account",
  },
  {
    id: "pro",
    name: "Pro",
    priceLabel: "Fee TBD",
    status: "coming_soon",
    blurb:
      "Advanced paid courses, advanced builds, and access to our private GitHub portal: curated AI project ideas and starter code you can implement at work, launch as a startup, or ship as a hobby project. Price and checkout are not live yet.",
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
    id: "energy_streaks",
    label: "Energy, levels, streaks & freezes",
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
    label: "Advanced courses",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
  {
    id: "github_portal",
    label: "GitHub portal: AI project kits (work / startup / hobby)",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
  {
    id: "advanced_build",
    label: "Advanced build tracks",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
  {
    id: "priority_support",
    label: "Priority support",
    values: { free_learn: "no", free_account: "no", pro: "soon" },
  },
] as const;
