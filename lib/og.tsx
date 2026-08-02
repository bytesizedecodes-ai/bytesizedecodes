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
