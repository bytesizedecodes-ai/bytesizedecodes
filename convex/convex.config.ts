/**
 * Convex app configuration — component registration.
 *
 * Components are reusable, schema-aware Convex packages. We register them here so
 * their generated API is available under `components.*` in `convex/_generated/api`.
 */

import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

const app = defineApp();

// Rate limiting for public unauthenticated endpoints (feedback, lead forms).
app.use(rateLimiter);

export default app;
