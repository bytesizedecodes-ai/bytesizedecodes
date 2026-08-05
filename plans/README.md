# Plans

Product and delivery **planning** lives here. **Do not treat these as the current
codebase source of truth** — for that, read [`docs/`](../docs/) and
[`CLAUDE.md`](../CLAUDE.md).

Many phase docs predate social-auth-without-anonymous and the public free-course
model. Prefer agent docs for “what ships now.”

Whenever you create or update product plans, roadmaps, audits, or phased
delivery docs, put them under this `plans/` folder (not `docs/`).

| Planning phase | Path | What it is |
| --- | --- | --- |
| Historical (frontend-first prototype) | [`historical/`](./historical/) | Early product, architecture, generators — archive |
| Coherent V1 (current direction) | [`coherent-v1/`](./coherent-v1/) | Strategy, curriculum, engagement, phased execution |
| Release / deploy | [`coherent-v1/release-and-deploy.md`](./coherent-v1/release-and-deploy.md) | `dev` → `main`, CI, Netlify, Convex prod |

Execution work inside Coherent V1 is split by delivery phase under
[`coherent-v1/phases/`](./coherent-v1/phases/). For **implemented** product
behavior (auth, freemium, site pages), see [`docs/overview.md`](../docs/overview.md).
