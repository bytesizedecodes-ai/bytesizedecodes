/**
 * Scheduled jobs.
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "rollover",
  "30 19 * * *", // 19:30 UTC == 00:30 IST
  internal.mutations.runRollover,
  {},
);

/** Flush scheduled admin email campaigns every 5 minutes. */
crons.interval(
  "process scheduled email campaigns",
  { minutes: 5 },
  internal.admin.mutations.processScheduledCampaigns,
  {},
);

/** Daily due reminder trigger — 09:00 IST = 03:30 UTC. */
crons.cron(
  "daily due email trigger",
  "30 3 * * *",
  internal.admin.emailActions.runAutomatedTrigger,
  { key: "daily_due_reminder" },
);

/** Weekly digest — Monday 10:00 IST = 04:30 UTC Monday. */
crons.cron(
  "weekly digest email trigger",
  "30 4 * * 1",
  internal.admin.emailActions.runAutomatedTrigger,
  { key: "weekly_digest" },
);

export default crons;
