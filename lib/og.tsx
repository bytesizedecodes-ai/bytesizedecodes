import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/**
 * Shared OpenGraph image builder. Renders the brand palette (ink canvas, warm
 * accent, brand eyebrow) with a title + optional kicker. Used by the default
 * OG image and the per-course/lesson/byte OG image routes to keep one visual
 * system.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

// Tailwind token palette mirrored from app/globals.css for the OG canvas.
const INK = "#171713";
const CANVAS = "#f7f5ef";
const BRAND_DEEP = "#4f72aa";
const WARM = "#e7a765";
const INK_SOFT = "#55544d";

export function renderOgImage({
  title,
  kicker,
}: {
  title: string;
  kicker?: string;
}): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: INK,
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.06em",
            }}
          >
            BSD
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: INK }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {kicker ? (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: BRAND_DEEP,
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: INK,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 60, height: 6, borderRadius: 3, background: WARM }} />
          <div style={{ display: "flex", fontSize: 26, color: INK_SOFT }}>{SITE_TAGLINE}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** Strip the Inline formatter's **bold** / `code` markers for the OG canvas. */
function plain(text: string): string {
  return text.replace(/\*\*/g, "").replace(/`/g, "");
}

/** Clip a line for the card, appending an ellipsis when it runs long. */
function clip(text: string, max: number): string {
  const t = plain(text).trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/**
 * Display form of a lesson URL for the card: protocol stripped (noise on a
 * share card) and middle-clipped only past `max`, so the lesson slug — the
 * part that identifies the page — stays visible.
 */
function displayUrl(url: string, max = 118): string {
  const bare = url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (bare.length <= max) return bare;
  const keep = max - 1; // room for the ellipsis
  const head = Math.ceil(keep * 0.55);
  return `${bare.slice(0, head)}…${bare.slice(bare.length - (keep - head))}`;
}

/**
 * Font size that fits the URL on the card's 1072px content width. Satori
 * never wraps — an oversized URL is silently clipped at the card edge — so
 * long course/lesson slugs shrink the font instead of overflowing.
 * 0.62 ≈ conservative per-character width of bold sans-serif.
 */
function urlFontSize(url: string): number {
  return Math.max(16, Math.min(24, Math.floor(1072 / (url.length * 0.62))));
}

/**
 * The shareable per-lesson cheat-sheet card (v6 skill §4.7): anchor → What →
 * When NOT → site URL, on the brand palette. Doubles as the lesson OG image
 * so pasting the lesson URL anywhere previews the card. Derived entirely
 * from the lesson's `concept` data — no separately authored content.
 */
export function renderCheatSheetImage({
  kicker,
  title,
  anchor,
  what,
  whenNot,
  url,
}: {
  kicker: string;
  title: string;
  anchor?: string;
  what?: string;
  whenNot?: string;
  url: string;
}): ImageResponse {
  const shownUrl = displayUrl(url);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: 15,
                background: INK,
                color: "#ffffff",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.06em",
              }}
            >
              BSD
            </div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: INK }}>
              {SITE_NAME}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: BRAND_DEEP,
            }}
          >
            {kicker}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: INK,
              maxWidth: 1020,
            }}
          >
            {clip(title, 64)}
          </div>
          {anchor ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", width: 6, height: 56, borderRadius: 3, background: WARM }} />
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontStyle: "italic",
                  lineHeight: 1.3,
                  color: INK,
                  maxWidth: 980,
                }}
              >
                {clip(anchor, 110)}
              </div>
            </div>
          ) : null}
          {what ? (
            <div style={{ display: "flex", gap: 18, fontSize: 26, lineHeight: 1.35, color: INK_SOFT, maxWidth: 1020 }}>
              <div style={{ display: "flex", fontWeight: 700, color: INK }}>What</div>
              <div style={{ display: "flex", flex: 1 }}>{clip(what, 130)}</div>
            </div>
          ) : null}
          {whenNot ? (
            <div style={{ display: "flex", gap: 18, fontSize: 26, lineHeight: 1.35, color: INK_SOFT, maxWidth: 1020 }}>
              <div style={{ display: "flex", fontWeight: 700, color: INK }}>When NOT</div>
              <div style={{ display: "flex", flex: 1 }}>{clip(whenNot, 120)}</div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 60, height: 6, borderRadius: 3, background: WARM }} />
            <div style={{ display: "flex", fontSize: 24, color: INK_SOFT }}>{SITE_TAGLINE}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontSize: urlFontSize(shownUrl),
                fontWeight: 600,
                color: BRAND_DEEP,
              }}
            >
              {shownUrl}
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
