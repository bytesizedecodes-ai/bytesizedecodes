/**
 * Scheduled jobs. Streak rollover runs at 00:30 IST daily so missed-day freezes
 * settle even if the learner never opens the app.
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

export default crons;
