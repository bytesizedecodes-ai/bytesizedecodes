# Brand system

The exact visual language every infographic and page must match. Tokens live in
`app/globals.css` under `@theme` (light, the default) and `[data-theme="dark"]`
(dark overrides) — usable as Tailwind classes. **The app has a dark/light theme
system; every color must work in both.**

## The theme system (read this first)

- **Light is the default.** Dark mode activates when `<html data-theme="dark">`
  (set by the no-FOUC bootstrap script + the `ThemeToggle`).
- Every token below resolves to a CSS variable (`--color-canvas`, `--color-ink`, …).
  In dark mode, those variables are overridden in `[data-theme="dark"]`. So
  `bg-canvas` / `text-ink` / etc. **flip automatically** — use them freely.
- **Never bypass the tokens.** `bg-white`, `text-white`, and literal hex
  (`#4f72aa`, `fill="#3a2a1a"`) do NOT flip — they stay fixed and become
  invisible in dark mode. See "Theme-safe color cheat-sheet" below.

## Colour tokens

The hex values shown are the **light-mode** defaults; dark-mode values are in
`app/globals.css` under `[data-theme="dark"]`.

| Token | Class | Light hex | Use |
|---|---|---|---|
| canvas | `bg-canvas` | `#f7f5ef` | Page background (on `<body>`) |
| surface | `bg-surface` | `#fffefa` | Subtle raised surface |
| surface-elevated | `bg-surface-elevated` | `#ffffff` | **Cards, panels, bubbles — the "white card" token. Use this, never `bg-white`.** |
| dot | (body bg-image) | `#ddd8cc` | The dot-grid texture |
| ash | `bg-ash`, `border-ash` | `#e7e2d7` | Subtle surfaces, borders |
| ink | `text-ink` | `#171713` | Primary text |
| ink-soft | `text-ink-soft` | `#55544d` | Body prose |
| ink-faint | `text-ink-faint` | `#8b897f` | Captions, disabled |
| brand | `bg-brand`, `text-brand` | `#1d9bf0` | Primary accent (Twitter blue) |
| brand-deep | `bg-brand-deep`, `text-brand-deep` | `#0f8cd8` | Hover/active accent |
| brand-wash | `bg-brand-wash` | `#e8f6fe` | Tinted backgrounds, active chips |
| brand-muted | `bg-brand-muted` | `#b3e0ff` | Muted brand fills |
| warm | `bg-warm`, `text-warm` | `#e7a765` | Warm accent (streaks, highlights) |
| warm-wash | `bg-warm-wash` | `#fbefe1` | Warm backgrounds |
| good | `bg-good`, `border-good`, `text-good` | `#1db954` | Success states |
| good-wash | `bg-good-wash` | `#e7f7ee` | Success backgrounds |
| bad | `bg-bad`, `border-bad`, `text-bad` | `#f4212e` | Error states |
| bad-wash | `bg-bad-wash` | `#fde7e8` | Error backgrounds |
| gold | `bg-gold`, `text-gold` | `#c9a961` | Critical/highlight accents |

**Never use raw hex or `bg-white`/`text-white`.** Always the token class. If a
colour isn't here, you can't use it — add it to `app/globals.css` `@theme`
(and its dark override) first, and that's a design decision worth confirming.

## Theme-safe color cheat-sheet (critical)

| You want… | Use | NEVER use |
|---|---|---|
| A white card surface | `bg-surface-elevated` | `bg-white` (stays white in dark) |
| Foreground on a dark/colored fill | `text-canvas` (flips) | `text-white` (stays white) |
| Page background | `bg-canvas` | `bg-white`, `#f7f5ef` |
| Brand accent in SVG | `fill="currentColor"` + wrapper `text-brand` | `fill="#1d9bf0"` |
| Structural dark accent in SVG (tires, hubs) | `fill="var(--tire)"`, `var(--hub)` | `fill="#3a2a1a"` |
| Windows/screen in SVG | `fill="var(--window)"`, `var(--screen)` | `fill="#cfe0f0"`, `#080808` |
| Semantic colors in SVG | `var(--color-good)`, `var(--color-bad)` | `fill="#5f9e77"`, `#c1706b` |

## Text contrast rule (non-negotiable, both themes)

**Text is only ever `text-ink` (dark on light) or `text-canvas` (light on dark).
Never blue (`text-brand`/`text-brand-deep`) for readable text, and never grey
(`text-ink-soft`/`text-ink-faint`) for body text.** Both `text-ink` and
`text-canvas` flip with the theme, so the rule holds in dark mode automatically.

The decision tree is mechanical:

| Surface background | Text colour | Token |
|---|---|---|
| `surface-elevated` / `canvas` / `ash` / `brand-wash` / `good-wash` / `bad-wash` (light surface) | **`text-ink`** | dark-on-light |
| `brand` / `brand-deep` / `ink` / `good` / `bad` / `gold` (saturated fill) | **`text-canvas`** | light-on-dark |

Rules this produces:

1. **No `text-brand`/`text-brand-deep` for text or labels** — use `text-ink`
   with `font-bold` for emphasis. The only legitimate use of `text-brand` is a
   tiny decorative underline or an SVG `currentColor` fill, never readable text.
2. **No `text-ink-soft`/`text-ink-faint` for body text** — these greys fade on
   tinted washes in both themes. Use `text-ink` at a lower weight/size.
3. **On a brand-coloured card, body text is `text-ink`** (dark reads fine on the
   light `#1d9bf0`); only on `brandDeep`/`ink` does it flip to `text-canvas`.

## Typography

- Font: Inter, loaded globally via `app/layout.tsx`. No need to import per-component.
- Headings: `font-bold tracking-tight`. Hero `text-2xl sm:text-3xl`, section
  `text-lg`, card titles `text-base sm:text-lg`.
- Body: `text-sm sm:text-[15px] leading-relaxed text-ink` (use weight for hierarchy).
- Labels/chips: `text-[11px] font-semibold uppercase tracking-wide`.

## Design language

1. **Dot-grid canvas** — already on `<body>`, recolors with the theme. Don't add
   a background to the infographic root; let the page texture show through.
2. **Rounded cards** — use `@utility card` (`className="card"`) or the `Card`
   primitive. `rounded-2xl`, `1px solid ash` border, soft shadow.
3. **Hand-drawn rotations** — cards get a tiny rotation (`rotate={-0.4}` or
   `0.5` degrees). Alternate sign between adjacent cards.
4. **SVG over emoji for diagrams** — drawn with `viewBox` so they scale. Colors
   via `currentColor` + theme variables (see cheat-sheet), never literal hex.
5. **✦ bullet marker** — use the `BulletList` primitive. On brand-coloured cards
   pass `onBrand` so the marker switches to canvas.

## Responsive rules (critical)

Infographics must reflow, not scale. A phone is ~375px wide.

- **No fixed pixel widths.** Use `w-full`, `max-w-md`, the grid system.
- **Two-column layouts stack on mobile:** `grid grid-cols-1 sm:grid-cols-2`.
- **Horizontal pipelines go vertical on mobile:** `flex-col sm:flex-row`.
- **SVGs use `viewBox` + `className="h-auto w-full"`** to scale proportionally.
- **Padding/text scales:** `px-4 py-3 sm:px-6 sm:py-5`, `text-sm sm:text-[15px]`.

## The shared primitives

Import from `components/infographic/primitives.tsx`:

- `<Infographic>` — wrapper, a flex column with gap.
- `<InfographicHeader title="" subtitle="" />` — centred title + brand underline.
- `<Card tone="white|ash|brand|brandDeep|brandWash" rotate={0.5}>` — the surface
  (`white` maps to `bg-surface-elevated`, theme-aware).
- `<CardTitle icon="🧠">Title</CardTitle>` — card heading with optional emoji.
- `<BulletList items={[...]} onBrand={false} />` — the ✦ list.
- `<Tag>Chip text</Tag>` — small pill.

Use these instead of re-styling. They encode the brand + theme language.

## Motion

`prefers-reduced-motion` is respected globally (see `app/globals.css`). The
`animate-pop` utility exists for reward moments only — not on infographics.
