"use client";

/**
 * Structured (tabular) lead form for /advertise and /subscribe.
 * Submits to Convex `inquiries.submit` → stored + emailed to CONTACT inbox.
 */

import { FormEvent, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/site";

const ADVERTISE_INTENTS = [
  { id: "sponsored_content", label: "Sponsored content / lesson" },
  { id: "brand_placement", label: "Brand placement" },
  { id: "newsletter", label: "Newsletter / email sponsorship" },
  { id: "partnership", label: "Strategic partnership" },
  { id: "other", label: "Other" },
] as const;

const SUBSCRIBE_INTERESTS = [
  { id: "product_updates", label: "Product updates" },
  { id: "new_courses", label: "New free courses" },
  { id: "product_launches", label: "Paid product / advanced tracks" },
  { id: "paid_plans", label: "Pro / Advanced plans (when priced)" },
  { id: "build_features", label: "Build & project features" },
] as const;

const BUDGETS = [
  "Under $500",
  "$500 – $2,000",
  "$2,000 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

export function InquiryForm({
  kind,
  initialInterests = [],
}: {
  kind: "advertise" | "subscribe";
  /** Pre-checked subscribe interests (e.g. from ?intent=pro). */
  initialInterests?: string[];
}) {
  const submit = useMutation(api.inquiries.submit);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [budget, setBudget] = useState("");
  const [intent, setIntent] = useState("");
  const [interests, setInterests] = useState<string[]>(() =>
    kind === "subscribe" ? [...initialInterests] : [],
  );
  const [message, setMessage] = useState(() =>
    kind === "subscribe" && initialInterests.includes("paid_plans")
      ? "I want to be notified when Pro / Advanced plans have a price."
      : "",
  );

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await submit({
        kind,
        name,
        email,
        company: company || undefined,
        website: website || undefined,
        budget: budget || undefined,
        intent: intent || undefined,
        interests: interests.length ? interests : undefined,
        message,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-good/30 bg-good-wash px-5 py-6 text-sm text-ink"
      >
        <p className="font-semibold text-ink">Request received</p>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Thanks — we saved your details and emailed{" "}
          <span className="font-medium text-ink">{CONTACT_EMAIL}</span>. We will reply when we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
      <p className="text-xs text-ink-faint">
        Fields marked <span className="text-bad">*</span> are required. Submissions go to{" "}
        {CONTACT_EMAIL}.
      </p>

      <div className="overflow-hidden rounded-2xl border border-ash">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-ash">
            <FormRow label="Full name" required htmlFor="inq-name">
              <input
                id="inq-name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </FormRow>
            <FormRow label="Work email" required htmlFor="inq-email">
              <input
                id="inq-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
              />
            </FormRow>

            {kind === "advertise" && (
              <>
                <FormRow label="Company / brand" required htmlFor="inq-company">
                  <input
                    id="inq-company"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass}
                    placeholder="Company name"
                  />
                </FormRow>
                <FormRow label="Website" htmlFor="inq-website">
                  <input
                    id="inq-website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={inputClass}
                    placeholder="https://"
                  />
                </FormRow>
                <FormRow label="What do you need?" htmlFor="inq-intent">
                  <select
                    id="inq-intent"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select…</option>
                    {ADVERTISE_INTENTS.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </FormRow>
                <FormRow label="Budget range" htmlFor="inq-budget">
                  <select
                    id="inq-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select…</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </FormRow>
              </>
            )}

            {kind === "subscribe" && (
              <FormRow label="I’m interested in" htmlFor="inq-interests">
                <div id="inq-interests" className="flex flex-col gap-2 py-1">
                  {SUBSCRIBE_INTERESTS.map((i) => (
                    <label key={i.id} className="flex items-center gap-2 text-ink-soft">
                      <input
                        type="checkbox"
                        checked={interests.includes(i.id)}
                        onChange={() => toggleInterest(i.id)}
                        className="h-4 w-4 rounded border-ash text-brand-deep"
                      />
                      {i.label}
                    </label>
                  ))}
                </div>
              </FormRow>
            )}

            <FormRow label="Message" required htmlFor="inq-message" vertical>
              <textarea
                id="inq-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder={
                  kind === "advertise"
                    ? "Goals, timeline, audience, and anything we should know…"
                    : "What product or learning outcomes matter most to you?"
                }
              />
            </FormRow>
          </tbody>
        </table>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-bad-wash px-3 py-2 text-xs text-bad">
          {error}
        </p>
      )}

      <Button type="submit" disabled={busy} className="w-full sm:w-auto">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {busy ? "Sending…" : kind === "advertise" ? "Send advertise request" : "Get product updates"}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-ash bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/40";

function FormRow({
  label,
  htmlFor,
  required,
  vertical,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  vertical?: boolean;
  children: ReactNode;
}) {
  if (vertical) {
    return (
      <tr className="bg-surface-elevated/40">
        <td colSpan={2} className="px-4 py-3 sm:px-5">
          <label htmlFor={htmlFor} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {label}
            {required ? <span className="text-bad"> *</span> : null}
          </label>
          {children}
        </td>
      </tr>
    );
  }
  return (
    <tr className="bg-surface-elevated/40">
      <th
        scope="row"
        className="w-[36%] whitespace-nowrap px-4 py-3 align-middle text-xs font-semibold uppercase tracking-wide text-ink-faint sm:w-44 sm:px-5"
      >
        <label htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-bad"> *</span> : null}
        </label>
      </th>
      <td className="px-4 py-3 sm:px-5">{children}</td>
    </tr>
  );
}
