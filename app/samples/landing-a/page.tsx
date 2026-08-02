import { LandingShell } from "./LandingShell";

/**
 * Landing Direction A (reworked) — Black + Twitter blue, with a dark/light
 * theme toggle at the top-right. Twitter blue (#1D9BF0) accents on true black
 * (dark) or cream (light).
 *
 * The page is a thin server wrapper; the theme state + toggle live in the
 * client `LandingShell` so switching is instant and flash-free after hydration.
 */
export default function LandingAPage() {
  return <LandingShell />;
}
