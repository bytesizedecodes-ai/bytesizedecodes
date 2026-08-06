/**
 * Public inquire forms (Advertise / Subscribe).
 * - Guests may submit without auth.
 * - Rows are stored on `inquiries`.
 * - A scheduled action emails FormSubmit → CONTACT mailbox (Gmail).
 *
 * First-time FormSubmit delivery requires one confirmation click on the
 * inbox you configured (see FormSubmit docs).
 */

import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin } from "./lib/admin";
import { rateLimiter } from "./lib/rateLimit";

/** Inbox for lead notifications — keep in sync with lib/site CONTACT_EMAIL. */
const LEAD_INBOX = "bytesizedecodes@gmail.com";

const kindValidator = v.union(v.literal("advertise"), v.literal("subscribe"));

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function trimLen(s: string, max: number): string {
  return s.trim().slice(0, max);
}

export const submit = mutation({
  args: {
    kind: kindValidator,
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    website: v.optional(v.string()),
    budget: v.optional(v.string()),
    intent: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    message: v.string(),
  },
  returns: v.object({ ok: v.boolean(), id: v.id("inquiries") }),
  handler: async (ctx, args) => {
    // Global rate limit (anonymous endpoint, each submission emails a lead inbox).
    // Throws a RateLimitError when exceeded.
    await rateLimiter.limit(ctx, "inquiry", { throws: true });

    const name = trimLen(args.name, 120);
    const email = trimLen(args.email, 200).toLowerCase();
    const message = trimLen(args.message, 4000);
    if (name.length < 2) throw new Error("Please enter your name.");
    if (!isValidEmail(email)) throw new Error("Please enter a valid email address.");
    if (message.length < 10) throw new Error("Please add a short message (at least 10 characters).");

    const company = args.company ? trimLen(args.company, 160) : undefined;
    const website = args.website ? trimLen(args.website, 300) : undefined;
    const budget = args.budget ? trimLen(args.budget, 80) : undefined;
    const intent = args.intent ? trimLen(args.intent, 80) : undefined;
    const interests = (args.interests ?? [])
      .map((i) => trimLen(i, 60))
      .filter(Boolean)
      .slice(0, 12);

    if (args.kind === "advertise" && !company) {
      throw new Error("Company or brand name is required for advertise requests.");
    }

    const id = await ctx.db.insert("inquiries", {
      kind: args.kind,
      name,
      email,
      company: company || undefined,
      website: website || undefined,
      budget: budget || undefined,
      intent: intent || undefined,
      interests: interests.length ? interests : undefined,
      message,
      createdAt: Date.now(),
      emailNotified: false,
    });

    await ctx.scheduler.runAfter(0, internal.inquiries.sendLeadEmail, { inquiryId: id });
    return { ok: true, id };
  },
});

export const getInquiry = internalQuery({
  args: { inquiryId: v.id("inquiries") },
  returns: v.union(
    v.object({
      _id: v.id("inquiries"),
      kind: kindValidator,
      name: v.string(),
      email: v.string(),
      company: v.optional(v.string()),
      website: v.optional(v.string()),
      budget: v.optional(v.string()),
      intent: v.optional(v.string()),
      interests: v.optional(v.array(v.string())),
      message: v.string(),
      createdAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, { inquiryId }) => {
    const doc = await ctx.db.get(inquiryId);
    if (!doc) return null;
    return {
      _id: doc._id,
      kind: doc.kind,
      name: doc.name,
      email: doc.email,
      company: doc.company,
      website: doc.website,
      budget: doc.budget,
      intent: doc.intent,
      interests: doc.interests,
      message: doc.message,
      createdAt: doc.createdAt,
    };
  },
});

export const markEmailNotified = internalMutation({
  args: { inquiryId: v.id("inquiries") },
  returns: v.null(),
  handler: async (ctx, { inquiryId }) => {
    await ctx.db.patch(inquiryId, { emailNotified: true });
    return null;
  },
});

/**
 * Notify Gmail via FormSubmit AJAX API.
 * First submission triggers a confirmation email — click confirm once for this address.
 */
export const sendLeadEmail = internalAction({
  args: { inquiryId: v.id("inquiries") },
  returns: v.null(),
  handler: async (ctx, { inquiryId }) => {
    const inquiry = await ctx.runQuery(internal.inquiries.getInquiry, { inquiryId });
    if (!inquiry) return null;

    const subject =
      inquiry.kind === "advertise"
        ? `[BSD Advertise] ${inquiry.company ?? inquiry.name}`
        : `[BSD Subscribe] ${inquiry.name}`;

    const lines = [
      `Kind: ${inquiry.kind}`,
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      inquiry.company ? `Company: ${inquiry.company}` : null,
      inquiry.website ? `Website: ${inquiry.website}` : null,
      inquiry.budget ? `Budget: ${inquiry.budget}` : null,
      inquiry.intent ? `Intent: ${inquiry.intent}` : null,
      inquiry.interests?.length ? `Interests: ${inquiry.interests.join(", ")}` : null,
      "",
      "Message:",
      inquiry.message,
      "",
      `Inquiry id: ${inquiryId}`,
      `Submitted at: ${new Date(inquiry.createdAt).toISOString()}`,
    ]
      .filter((x) => x !== null)
      .join("\n");

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${LEAD_INBOX}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _replyto: inquiry.email,
          name: inquiry.name,
          email: inquiry.email,
          company: inquiry.company ?? "",
          website: inquiry.website ?? "",
          budget: inquiry.budget ?? "",
          intent: inquiry.intent ?? "",
          interests: (inquiry.interests ?? []).join(", "),
          kind: inquiry.kind,
          message: inquiry.message,
          details: lines,
          _honey: "",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("FormSubmit lead email failed", res.status, text);
      }
    } catch (err) {
      console.error("FormSubmit lead email error", err);
    }

    await ctx.runMutation(internal.inquiries.markEmailNotified, { inquiryId });
    return null;
  },
});

/** Admin: recent lead form submissions. */
export const listInquiries = query({
  args: {
    kind: v.optional(kindValidator),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("inquiries"),
      kind: kindValidator,
      name: v.string(),
      email: v.string(),
      company: v.optional(v.string()),
      website: v.optional(v.string()),
      budget: v.optional(v.string()),
      intent: v.optional(v.string()),
      interests: v.optional(v.array(v.string())),
      message: v.string(),
      createdAt: v.number(),
      emailNotified: v.optional(v.boolean()),
    }),
  ),
  handler: async (ctx, { kind, limit }) => {
    await requireAdmin(ctx);
    const cap = Math.min(limit ?? 50, 100);
    const docs = kind
      ? await ctx.db
          .query("inquiries")
          .withIndex("by_kind", (q) => q.eq("kind", kind))
          .order("desc")
          .take(cap)
      : await ctx.db.query("inquiries").withIndex("by_created").order("desc").take(cap);
    return docs.map((d) => ({
      _id: d._id,
      kind: d.kind,
      name: d.name,
      email: d.email,
      company: d.company,
      website: d.website,
      budget: d.budget,
      intent: d.intent,
      interests: d.interests,
      message: d.message,
      createdAt: d.createdAt,
      emailNotified: d.emailNotified,
    }));
  },
});
