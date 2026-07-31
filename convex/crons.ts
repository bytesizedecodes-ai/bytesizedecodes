/**
 * Scheduled jobs. Currently disabled — the rollover logic in mutations.runRollover is
 * implemented and tested against the same settleOnRollover the client used, but during
 * active development we don't want a cron mutating the dev database at midnight.
 *
 * To enable for production: uncomment the schedule below. Runs at 00:30 IST daily —
 * half an hour past midnight gives the day boundary room to settle.
 *
 *   crons.runRollover: "* 30 19 * * *"   // 19:30 UTC == 00:30 IST
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Disabled during development. See file header for how to enable.
// crons.cron(
//   "rollover",
//   "30 19 * * *", // 00:30 IST daily
//   internal.mutations.runRollover,
//   {},
// );

export default crons;
