import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${SITE_NAME} for product questions, feedback, or privacy requests.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Shell active="/contact">
      <ContentPage
        eyebrow="Company"
        title="Contact"
        description="We read every thoughtful report. Product feedback is the fastest loop; email works for privacy and account requests."
      >
        <ContentSection title="Product feedback">
          <p>
            While you browse {SITE_NAME}, use the feedback control in the bottom corner of the
            app. It lands in our review queue and is the best place for bugs, content fixes, and
            ideas.
          </p>
        </ContentSection>

        <ContentSection title="Email">
          <p>
            For privacy requests, account issues, or messages that do not fit feedback:
          </p>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand-deep hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-xs text-ink-faint">
            We aim to respond within a few business days. Include enough context that we can
            help without asking three rounds of back-and-forth.
          </p>
        </ContentSection>

        <ContentSection title="Advertise & product updates">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Link href="/advertise" className="font-semibold text-brand-deep hover:underline">
                Advertise with us
              </Link>{" "}
              — sponsorship and partnership requests (structured form → our inbox)
            </li>
            <li>
              <Link href="/subscribe" className="font-semibold text-brand-deep hover:underline">
                Product updates
              </Link>{" "}
              — interest in courses, launches, and product news
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="Privacy and data">
          <p>
            Export, import, reset, and delete controls live on your{" "}
            <Link href="/profile" className="font-semibold text-brand-deep hover:underline">
              Profile
            </Link>{" "}
            when you are signed in. Full detail is in our{" "}
            <Link href="/privacy" className="font-semibold text-brand-deep hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </ContentSection>

        <ContentSection title="What we cannot help with yet">
          <ul className="list-disc space-y-2 pl-5">
            <li>Phone support or live chat</li>
            <li>School licenses and enterprise procurement (coming later)</li>
            <li>Guarantees of job placement or exam scores — we teach; you practice</li>
          </ul>
        </ContentSection>
      </ContentPage>
    </Shell>
  );
}
