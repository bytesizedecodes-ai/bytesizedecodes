import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * BSD favicon — matches the header `BrandMark`: dark rounded square with the
 * initials "BSD" as a tight bold monogram in white. Generated at request time
 * via the Next.js icon convention (no static asset).
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171713",
          color: "#ffffff",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "-0.08em",
          borderRadius: 8,
          lineHeight: 1,
        }}
      >
        BSD
      </div>
    ),
    { ...size },
  );
}
