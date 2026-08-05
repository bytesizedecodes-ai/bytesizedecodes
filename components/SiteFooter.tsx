import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const PRODUCT = [
  { href: "/learn", label: "Learn" },
  { href: "/courses", label: "Courses" },
  { href: "/plans", label: "Plans" },
  { href: "/bytes", label: "Bytes" },
  { href: "/gallery", label: "Gallery" },
] as const;

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/advertise", label: "Advertise" },
  { href: "/subscribe", label: "Product updates" },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/**
 * Multi-column site footer: brand + product + company + legal.
 * Guest-safe destinations only (no auth-gated Today/Profile links).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ash bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-2.5 rounded-lg font-semibold tracking-tight text-ink"
            >
              <BrandMark withAccent />
              <span>{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">{SITE_TAGLINE}</p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-ink-faint">
              Free courses to read without an account. Sign in when you want saved
              progress and a daily plan.
            </p>
          </div>

          <FooterColumn title="Product" links={PRODUCT} />
          <FooterColumn title="Company" links={COMPANY} />
          <FooterColumn title="Legal" links={LEGAL} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ash pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/privacy" className="focus-ring rounded-sm hover:text-ink-soft">
              Privacy
            </Link>
            <Link href="/terms" className="focus-ring rounded-sm hover:text-ink-soft">
              Terms
            </Link>
            <Link href="/contact" className="focus-ring rounded-sm hover:text-ink-soft">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring rounded-sm text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
