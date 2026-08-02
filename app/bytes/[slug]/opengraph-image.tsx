import { getByte } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Per-byte OG image — byte title + "Applied byte" kicker. */
export default async function ByteOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const byte = getByte(slug);
  return renderOgImage({
    title: byte?.title ?? "Applied byte",
    kicker: "Applied byte",
  });
}
