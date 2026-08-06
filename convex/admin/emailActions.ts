"use node";

/**
 * Outbound admin email via Resend HTTP API.
 * Set on Convex deployment: RESEND_API_KEY, optional EMAIL_FROM.
 */

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const dispatchCampaign = internalAction({
  args: { campaignId: v.id("emailCampaigns") },
  returns: v.null(),
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.runQuery(internal.admin.emailInternals.getCampaign, {
      campaignId,
    });
    if (!campaign || campaign.status === "cancelled") return null;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      await ctx.runMutation(internal.admin.mutations.markCampaignResult, {
        campaignId,
        status: "failed",
        recipientCount: 0,
        sentCount: 0,
        error:
          "RESEND_API_KEY not set on Convex deployment. Set RESEND_API_KEY and optional EMAIL_FROM.",
      });
      return null;
    }

    const from =
      process.env.EMAIL_FROM?.trim() || "ByteSizeDecodes <onboarding@resend.dev>";
    const recipients = await ctx.runQuery(
      internal.admin.emailInternals.loadCampaignRecipients,
      {},
    );

    if (recipients.length === 0) {
      await ctx.runMutation(internal.admin.mutations.markCampaignResult, {
        campaignId,
        status: "failed",
        recipientCount: 0,
        sentCount: 0,
        error: "No account holders with email addresses.",
      });
      return null;
    }

    let sent = 0;
    let lastError: string | undefined;

    for (const r of recipients) {
      const text = personalize(campaign.body, r.name);
      try {
        const ok = await sendResend({
          apiKey,
          from,
          to: r.email,
          subject: campaign.subject,
          text,
        });
        if (ok) sent += 1;
        else lastError = "Resend rejected one or more deliveries";
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Send failed";
      }
      await sleep(80);
    }

    await ctx.runMutation(internal.admin.mutations.markCampaignResult, {
      campaignId,
      status: sent > 0 ? "sent" : "failed",
      recipientCount: recipients.length,
      sentCount: sent,
      error: sent < recipients.length ? lastError : undefined,
    });
    return null;
  },
});

/** Cron-fired automated trigger (only sends when enabled + Resend configured). */
export const runAutomatedTrigger = internalAction({
  args: { key: v.string() },
  returns: v.null(),
  handler: async (ctx, { key }) => {
    const trigger = await ctx.runQuery(
      internal.admin.emailInternals.getEnabledTrigger,
      { key },
    );
    if (!trigger) {
      await ctx.runMutation(internal.admin.mutations.markTriggerRun, {
        key,
        result: "skipped (disabled or missing)",
      });
      return null;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      await ctx.runMutation(internal.admin.mutations.markTriggerRun, {
        key,
        result: "failed: RESEND_API_KEY not configured",
      });
      return null;
    }

    const from =
      process.env.EMAIL_FROM?.trim() || "ByteSizeDecodes <onboarding@resend.dev>";
    const recipients = await ctx.runQuery(
      internal.admin.emailInternals.loadCampaignRecipients,
      {},
    );

    let sent = 0;
    for (const r of recipients) {
      try {
        const ok = await sendResend({
          apiKey,
          from,
          to: r.email,
          subject: personalize(trigger.subjectTemplate, r.name),
          text: personalize(trigger.bodyTemplate, r.name),
        });
        if (ok) sent += 1;
      } catch {
        // continue
      }
      await sleep(80);
    }

    await ctx.runMutation(internal.admin.mutations.markTriggerRun, {
      key,
      result: `sent ${sent}/${recipients.length}`,
    });
    return null;
  },
});

function personalize(template: string, name: string): string {
  return template.split("{{name}}").join(name || "there");
}

async function sendResend(args: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      subject: args.subject,
      text: args.text,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error", res.status, text);
    return false;
  }
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
