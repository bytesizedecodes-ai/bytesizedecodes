import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing use of ${SITE_NAME}: accounts, content, projects, and acceptable use.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Shell active="/terms">
      <ContentPage
        eyebrow="Legal"
        title="Terms of Service"
        description={`These Terms govern access to and use of ${SITE_NAME} at ${SITE_URL.replace("https://", "")}. By using the service you agree to them.`}
        showLastUpdated
      >
        <ContentSection title="1. The service">
          <p>
            {SITE_NAME} provides educational content and tools for learning about artificial
            intelligence and related topics: courses, lessons, practice, review, optional projects,
            and related product features.
          </p>
          <p className="text-xs text-ink-faint">
            These Terms describe how the product works today and what we expect of users. They are
            not a substitute for advice from a lawyer in your jurisdiction.
          </p>
        </ContentSection>

        <ContentSection title="2. Eligibility">
          <p>
            You must be able to form a binding agreement and meet any minimum age required in your
            region to use online services. If you use a social identity provider (Google, GitHub,
            etc.), you must also comply with that provider’s terms for the account.
          </p>
        </ContentSection>

        <ContentSection title="3. Accounts">
          <p>
            Some features (progress, streaks, Energy, daily plan, Build, Profile tools) require signing
            in with a social account. You are responsible for activity under your account. Keep
            access to your identity provider secure. Notify us if you believe your account was
            misused.
          </p>
        </ContentSection>

        <ContentSection title="4. Free content and product features">
          <p>
            Free courses and lessons may be available without an account. Signed-in features and
            future paid courses (when offered) may require authentication or purchase under
            separate pricing we display at the time. Free does not mean unlimited rights to
            scrape, redistribute, or resell our content.
          </p>
        </ContentSection>

        <ContentSection title="5. Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Break the law or infringe others’ rights</li>
            <li>Attempt unauthorized access, scraping at scale, or disruption of the service</li>
            <li>Impersonate others or misrepresent your identity</li>
            <li>Upload malware or harmful content to projects or feedback</li>
            <li>Use the service primarily to reverse-engineer or clone our curriculum for resale</li>
          </ul>
          <p>We may suspend access for abuse or security risk.</p>
        </ContentSection>

        <ContentSection title="6. Your content">
          <p>
            You retain rights in content you create (for example project notes and artifacts). You
            grant us a license to host, process, and display that content as needed to run the
            product.
          </p>
          <p>
            Projects default to private unless you publish them. If you publish to the public
            gallery, you grant a license for us and visitors to view that published material in
            context of the gallery feature. Do not publish content you do not have the right to
            share.
          </p>
        </ContentSection>

        <ContentSection title="7. Our content">
          <p>
            Lessons, courses, drills, brand assets, and software are owned by {SITE_NAME} or our
            licensors. You may use them for personal learning through the service. You may not
            copy courseware wholesale for a competing product or public mirror without permission.
          </p>
        </ContentSection>

        <ContentSection title="8. Educational disclaimer">
          <p>
            Content is for education and general literacy. It is not professional, legal, medical,
            financial, or investment advice. AI and technology change quickly; verify critical
            decisions with current primary sources and qualified professionals.
          </p>
        </ContentSection>

        <ContentSection title="9. Availability">
          <p>
            We aim for reliable service but do not guarantee uninterrupted or error-free operation.
            Features may change as we improve the product.
          </p>
        </ContentSection>

        <ContentSection title="10. Limitation of liability">
          <p>
            To the fullest extent permitted by law, {SITE_NAME} and its operators are not liable for
            indirect, incidental, special, consequential, or punitive damages, or lost profits or
            data, arising from your use of the service. Our aggregate liability for claims relating
            to the service is limited to the greater of amounts you paid us for the service in the
            twelve months before the claim (if any) or zero if the service is free to you.
          </p>
          <p>
            Some regions do not allow certain limitations; in those places the above limits apply
            only as far as local law allows.
          </p>
        </ContentSection>

        <ContentSection title="11. Termination">
          <p>
            You may stop using the service at any time and may delete account learning data from
            Profile where available. We may suspend or terminate access for Terms violations or to
            protect the service and users.
          </p>
        </ContentSection>

        <ContentSection title="12. Privacy">
          <p>
            Our{" "}
            <Link href="/privacy" className="font-semibold text-brand-deep hover:underline">
              Privacy Policy
            </Link>{" "}
            explains how we handle personal data. By using the service you also acknowledge that
            policy.
          </p>
        </ContentSection>

        <ContentSection title="13. Changes to these Terms">
          <p>
            We may update these Terms. The “Last updated” date changes when we do. Continued use
            after an update constitutes acceptance of the revised Terms for subsequent use.
          </p>
        </ContentSection>

        <ContentSection title="14. Contact">
          <p>
            Questions about these Terms:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand-deep hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or our{" "}
            <Link href="/contact" className="font-semibold text-brand-deep hover:underline">
              Contact
            </Link>{" "}
            page.
          </p>
        </ContentSection>
      </ContentPage>
    </Shell>
  );
}
