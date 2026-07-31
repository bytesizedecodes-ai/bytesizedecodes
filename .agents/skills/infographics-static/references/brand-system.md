# Brand system

The exact visual language every infographic must match. Tokens live in
`app/globals.css` under `@theme` and are usable as Tailwind classes.

## Colour tokens

| Token | Class | Hex | Use |
|---|---|---|---|
| canvas | `bg-canvas` | `#f8f8f8` | Page background (already on `<body>`) |
| dot | (via body bg-image) | `#d8d8d8` | The dot-grid texture |
| ash | `bg-ash`, `border-ash` | `#e8e8e8` | Subtle surfaces, borders |
| ink | `text-ink` | `#080808` | Primary text |
| ink-soft | `text-ink-soft` | `#4a4a4a` | Body prose |
| ink-faint | `text-ink-faint` | `#8a8a8a` | Captions, disabled |
| brand | `bg-brand`, `text-brand` | `#7898c8` | Primary accent, CTAs |
| brand-deep | `bg-brand-deep`, `text-brand-deep` | `#6888c8` | Hover/active accent |
| brand-wash | `bg-brand-wash` | `#eef2f9` | Tinted backgrounds, active chips |
| good | `bg-good`, `border-good`, `text-good` | `#5f9e77` | Success states |
| good-wash | `bg-good-wash` | `#edf5f0` | Success backgrounds |
| bad | `bg-bad`, `border-bad` | `#c1706b` | Error states |
| bad-wash | `bg-bad-wash` | `#f9efee` | Error backgrounds |
| gold | `bg-gold` | `#c9a961` | Critical/highlight accents |

**Never use raw hex.** Always the token class. If a colour isn't here, you can't
use it — add it to `app/globals.css` `@theme` first (and that's a design decision
worth confirming with the user).

## Text contrast rule (non-negotiable)

**Text is only ever `text-ink` (near-black) or `text-canvas` (near-white). Never
blue (`text-brand` / `text-brand-deep`) and never grey (`text-ink-soft` /
`text-ink-faint`).**

Blue text on a blue-tinted background, and grey captions on white, were the two
readability failures users reported. They are now banned regardless of surface.
The decision tree is mechanical:

| Surface background | Text colour | Token |
|---|---|---|
| White / `canvas` / `ash` / `brand-wash` / `good-wash` / `bad-wash` (any light) | **Black** | `text-ink` |
| `brand` / `brand-deep` / `ink` / `good` / `bad` / `gold` (any dark/saturated) | **White** | `text-canvas` |

Rules this produces:

1. **No `text-brand` or `text-brand-deep` for text or labels.** This is the most
   common mistake — subtitles, scene captions, pill labels, "→" arrows, and the
   `Operator` (+/=) symbols all used to be blue. They must be `text-ink`. The
   only legitimate use of `text-brand` is a tiny decorative underline, never a
   readable character. If you need emphasis on a light card, use
   `font-bold`/`font-extrabold` — not a blue hue.
2. **No `text-ink-soft` / `text-ink-faint` for body text or captions.** These
   greys fade on the dotted-canvas and tinted washes. Use `text-ink` and lower
   the weight (`font-medium`, smaller size) to create hierarchy instead. The
   greys survive only for genuinely disabled/chrome elements like terminal
   comments (`# like this`) inside a dark `bg-ink` block, where `text-canvas`
   variants would be the light alternative.
3. **Accent colours that were blue text become structural, not textual.** A
   `font-bold` underline (`decoration-brand-deep`) is fine because the character
   itself is still `text-ink`. The `Operator` symbols stay bold-black, not blue.
4. **On a brand-coloured card, body text is `text-ink`** (black reads fine on the
   light `#7898c8`), and only on `brandDeep`/`ink` does it flip to `text-canvas`.

Before finishing any component, grep it for `text-brand`, `text-brand-deep`,
`text-ink-soft`, `text-ink-faint` and justify each surviving occurrence. New
blue/grey text is a bug.

## Typography

- Font: Inter, loaded globally via `app/layout.tsx`. No need to import per-component.
- Headings: `font-bold tracking-tight`. Hero `text-2xl sm:text-3xl`, section
  `text-lg`, card titles `text-base sm:text-lg`.
- Body: `text-sm sm:text-[15px] leading-relaxed text-ink-soft`.
- Labels/chips: `text-[11px] font-semibold uppercase tracking-wide`.

## Design language

1. **Dot-grid canvas** — already on `<body>`. Don't add a background to the
   infographic root; let the page texture show through.
2. **Rounded cards** — use the `@utility card` (`className="card"`) or the
   `Card` primitive. `rounded-2xl`, `1px solid ash` border, soft shadow
   (`shadow-sm`).
3. **Hand-drawn rotations** — cards and key elements get a tiny rotation
   (`rotate={-0.4}` or `0.5` degrees via the `Card` prop, or inline `style`).
   Alternate the sign between adjacent cards so they don't all lean the same way.
4. **SVG over emoji for diagrams** — neural nets, nested circles, flow arrows
   are `<svg>` with `viewBox` so they scale. Emoji are fine as decorative icons
   in card titles (`🧠`, `🎯`) but never as structural elements.
5. **✦ bullet marker** — use the `BulletList` primitive. On brand-coloured cards
   pass `onBrand` so the marker switches to canvas-white.

## Responsive rules (critical)

Infographics must reflow, not scale. A phone is ~375px wide; a fixed 1200px
design scaled to 375px is unreadable. Rules:

- **No fixed pixel widths.** Use `w-full`, `max-w-md`, the grid system.
- **Two-column layouts stack on mobile.** Pattern: `grid grid-cols-1 sm:grid-cols-2`.
  Side-by-side appears at `sm` (640px) and up.
- **Three-column layouts:** `grid grid-cols-1 sm:grid-cols-3`.
- **Horizontal pipelines go vertical on mobile.** Use `flex-col sm:flex-row` and
  swap the arrow: `<span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span>`.
- **SVGs use `viewBox` + `className="h-auto w-full"`** so they scale
  proportionally. A neural-network diagram drawn at 950×320 will shrink cleanly.
- **The VS badge in a comparison** should hide on mobile (it only makes sense
  side-by-side): `className="hidden sm:block"` or render it conditionally.
- **Padding scales:** `px-4 py-3 sm:px-6 sm:py-5`. Text scales:
  `text-sm sm:text-[15px]`.

## The shared primitives

Import from `components/infographic/primitives.tsx`:

- `<Infographic>` — wrapper, just a flex column with gap.
- `<InfographicHeader title="" subtitle="" />` — centred title + brand underline.
- `<Card tone="white|ash|brand|brandDeep|brandWash" rotate={0.5}>` — the surface.
  `rotate` is in degrees, defaults to 0.
- `<CardTitle icon="🧠">Title</CardTitle>` — card heading with optional emoji.
- `<BulletList items={[...]} onBrand={false} />` — the ✦ list.
- `<Tag>Chip text</Tag>` — small pill for examples.

Use these instead of re-styling from scratch. They encode the brand language.

## Motion

`prefers-reduced-motion` is respected globally (see `app/globals.css`). Don't
add animations that would bother someone with motion sensitivity. The
`animate-pop` utility exists for reward moments only — don't use it on
infographics.
