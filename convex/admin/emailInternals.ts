/**
 * Internal queries used by email actions (no "use node").
 */

import { internalQuery } from "../_generated/server";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";

const MAX_RECIPIENTS_PER_CAMPAIGN = 200;

export const loadCampaignRecipients = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      email: v.string(),
      name: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    const byEmail = new Map<string, { email: string; name: string }>();
    for (const p of profiles) {
      if (p.seed) continue;
      let email = p.email?.trim().toLowerCase() ?? null;
      let name = p.displayName;
      if (!email && p.authUserId) {
        const user = await ctx.db.get(p.authUserId as Id<"users">);
        if (user?.email) email = user.email.trim().toLowerCase();
        if (user?.name) name = user.name;
      }
      if (!email || !email.includes("@")) continue;
      if (!byEmail.has(email)) byEmail.set(email, { email, name });
    }
    return [...byEmail.values()].slice(0, MAX_RECIPIENTS_PER_CAMPAIGN);
  },
});

export const getCampaign = internalQuery({
  args: { campaignId: v.id("emailCampaigns") },
  returns: v.union(
    v.object({
      _id: v.id("emailCampaigns"),
      subject: v.string(),
      body: v.string(),
      status: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, { campaignId }) => {
    const c = await ctx.db.get(campaignId);
    if (!c) return null;
    return {
      _id: c._id,
      subject: c.subject,
      body: c.body,
      status: c.status,
    };
  },
});

export const getEnabledTrigger = internalQuery({
  args: { key: v.string() },
  returns: v.union(
    v.object({
      key: v.string(),
      enabled: v.boolean(),
      subjectTemplate: v.string(),
      bodyTemplate: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, { key }) => {
    const row = await ctx.db
      .query("adminTriggers")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (!row || !row.enabled) return null;
    return {
      key: row.key,
      enabled: row.enabled,
      subjectTemplate: row.subjectTemplate,
      bodyTemplate: row.bodyTemplate,
    };
  },
});
