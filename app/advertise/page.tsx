import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { InquiryForm } from "@/components/InquiryForm";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Advertise",
  description: `Partner with ${SITE_NAME}: sponsorships, placements, and sponsored learning experiences.`,
  alternates: { canonical: "/advertise" },
};

export default function AdvertisePage() {
  return (
    <Shell active="/advertise">
      <ContentPage
        eyebrow="Company"
        title="Advertise with us"
        description={`${SITE_NAME} reaches learners who care about AI literacy — beginners through founders. Tell us about your brand and goals.`}
      >
        <ContentSection title="What we consider">
          <ul className="list-disc space-y-2 pl-5">
            <li>Sponsored content that teaches something real (not pure ads dressed as lessons)</li>
            <li>Brand placements that fit thoughtfully next to free courses</li>
            <li>Email or launch partnerships when product updates go out</li>
            <li>Longer strategic partnerships</li>
          </ul>
          <p className="text-xs text-ink-faint">
            We reserve the right to decline offers that would harm learners or the brand.
          </p>
        </ContentSection>

        <ContentSection title="Request form">
          <p className="mb-4">
            Submit the table below. We store the request and email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand-deep hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            . Prefer a short note? Use that address with subject{" "}
            <span className="font-medium text-ink">Advertise</span>.
          </p>
          <InquiryForm kind="advertise" />
        </ContentSection>

        <p className="text-sm">
          Looking for product updates instead?{" "}
          <Link href="/subscribe" className="font-semibold text-brand-deep hover:underline">
            Subscribe here
          </Link>
          .
        </p>
      </ContentPage>
    </Shell>
  );
}
