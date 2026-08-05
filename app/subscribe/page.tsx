import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Shell } from "@/components/Shell";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { InquiryForm } from "@/components/InquiryForm";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { SubscribeFormFromQuery } from "./SubscribeFormFromQuery";

export const metadata: Metadata = {
  title: "Product updates",
  description: `Get ${SITE_NAME} product and course updates by email when we have something worth sharing.`,
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <Shell active="/subscribe">
      <ContentPage
        eyebrow="Company"
        title="Product updates"
        description="Tell us you want updates on products, new courses, and launches. We use this list carefully — no spam."
      >
        <ContentSection title="What you can receive">
          <ul className="list-disc space-y-2 pl-5">
            <li>New free courses and major curriculum updates</li>
            <li>Product launches and advanced tracks when they open</li>
            <li>Pro / Advanced plan pricing when announced</li>
            <li>Improvements to Build, practice, and your daily plan</li>
          </ul>
          <p className="text-xs text-ink-faint">
            Interest signup is stored in our system and emailed to our team. Automated weekly digests
            may ship later; until then we respond personally when relevant.
          </p>
        </ContentSection>

        <ContentSection title="Interest form">
          <p className="mb-4">
            Fill in the table. We save your request and notify{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand-deep hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <Suspense fallback={<InquiryForm kind="subscribe" />}>
            <SubscribeFormFromQuery />
          </Suspense>
        </ContentSection>

        <p className="text-sm">
          Brand or sponsorship inquiry?{" "}
          <Link href="/advertise" className="font-semibold text-brand-deep hover:underline">
            Advertise with us
          </Link>
          . Compare free vs advanced on{" "}
          <Link href="/plans" className="font-semibold text-brand-deep hover:underline">
            Plans
          </Link>
          .
        </p>
      </ContentPage>
    </Shell>
  );
}
