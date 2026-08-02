import { SITE_TAGLINE } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Default OpenGraph image — brand + tagline. Inherited by routes without their own. */
export default function OgImage() {
  return renderOgImage({ title: SITE_TAGLINE });
}
