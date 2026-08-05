/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_mutations from "../admin/mutations.js";
import type * as admin_queries from "../admin/queries.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as lib_admin from "../lib/admin.js";
import type * as lib_dailyPlan from "../lib/dailyPlan.js";
import type * as lib_day from "../lib/day.js";
import type * as lib_getUser from "../lib/getUser.js";
import type * as lib_parseDrillKey from "../lib/parseDrillKey.js";
import type * as lib_reviewKey from "../lib/reviewKey.js";
import type * as lib_rng from "../lib/rng.js";
import type * as lib_srs from "../lib/srs.js";
import type * as lib_streak from "../lib/streak.js";
import type * as lib_xp from "../lib/xp.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as shared from "../shared.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/mutations": typeof admin_mutations;
  "admin/queries": typeof admin_queries;
  auth: typeof auth;
  crons: typeof crons;
  http: typeof http;
  inquiries: typeof inquiries;
  "lib/admin": typeof lib_admin;
  "lib/dailyPlan": typeof lib_dailyPlan;
  "lib/day": typeof lib_day;
  "lib/getUser": typeof lib_getUser;
  "lib/parseDrillKey": typeof lib_parseDrillKey;
  "lib/reviewKey": typeof lib_reviewKey;
  "lib/rng": typeof lib_rng;
  "lib/srs": typeof lib_srs;
  "lib/streak": typeof lib_streak;
  "lib/xp": typeof lib_xp;
  mutations: typeof mutations;
  queries: typeof queries;
  shared: typeof shared;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
