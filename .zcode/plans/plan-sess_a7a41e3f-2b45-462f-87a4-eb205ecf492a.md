## Goal
Apply the approved Landing A design to the real app: Twitter blue (#1D9BF0) brand accent app-wide, a true-black dark theme, and a dark/light toggle in the top-right. **Light is the default.** The change reaches every page with no per-component rewrites.

## The key insight (why this is low-risk)
Every color in the app flows through the `@theme` tokens in `app/globals.css` (`--color-canvas`, `--color-ink`, `--color-brand`, …) — all 1,200+ usages across 80 component files read `bg-canvas`/`text-ink`/etc., which resolve to those CSS variables. So:
- **Rebranding to Twitter blue** = change `--color-brand` / `--color-brand-deep` / `--color-brand-wash` values in `@theme`.
- **The dark theme** = a `[data-theme="dark"]` block that overrides those same CSS variables. Every `bg-canvas`/`text-ink`/etc. flips automatically — no component edits.

## Files to change (only 4)

1. **`app/globals.css`** — the heart of the change:
   - Update the `@theme` brand tokens to Twitter blue family: `--color-brand: #1D9BF0`, `--color-brand-deep: #0F8CD8`, `--color-brand-wash: #e8f6fe`, `--color-brand-muted: #b3e0ff`.
   - Add a `[data-theme="dark"]` block on `:root`/`html` that overrides every color variable for dark mode (black bg, light text, dark surfaces, muted washes). Light stays the default (the current cream values).
   - Keep the body's dot-grid texture reading `var(--color-dot)` so it recolors with the theme.

2. **`app/layout.tsx`** — add the no-FOUC theme bootstrap:
   - An inline `<script>` in `<head>` that reads `localStorage["bsd-theme"]` and sets `document.documentElement.dataset.theme` **before paint** (prevents the flash of the wrong theme — the standard Next.js pattern).
   - Light is the default (no stored key = light).

3. **New `components/ThemeToggle.tsx`** — the sun/moon toggle button (client component): reads/writes `localStorage["bsd-theme"]` and the `data-theme` attribute on `<html>`. Compact, matches the sample.

4. **`components/Shell.tsx`** — place `<ThemeToggle />` in the header's right side (top-right, as you asked) and in the mobile bottom nav area. One import, one placement.

5. **`app/page.tsx`** — replace the live home with the approved Landing A (the dark/light-aware version), ported from the sample to use the app's real nav Shell so it's consistent. (The sample used inline styles; the live version will use the global tokens so it benefits from the toggle automatically.)

## What I will NOT do
- No per-component color rewrites (none needed — the token swap handles it).
- No new dependencies (no `next-themes` — the inline script + data-attribute is lighter and avoids a provider wrapper).
- No SSR changes beyond the one inline script.
- The `/samples/*` routes stay for now (so you can keep comparing); I'll note they can be deleted once you're satisfied.

## Theme palette (the dark overrides)
Dark mode redefines: `--color-canvas: #000`, `--color-surface: #0d0d0f`, `--color-ink: #e7e7ea`, `--color-ink-soft: #9b9ba3`, `--color-ash: #1f1f23`, washes become low-alpha blue/green/red tints. Brand stays Twitter blue in both. Semantic colors (good/bad/gold) get dark-mode-appropriate brighter values.

## Verification
- `npm run typecheck` — clean.
- Browser: load `/`, confirm Twitter blue + light by default; toggle to dark → entire app flips to black; refresh → chosen theme persists (no FOUC); check a lesson, `/courses`, `/today`, `/progress`, `/profile`, the footer dot texture, and the BSD mark all recolor correctly.
- Mobile: toggle reachable; bottom nav readable in dark.