# Weekend stack: two-sided live hospice / vendor order board

**Date (machine-local):** 2026-08-14
**Question:** Which stack ships a two-sided live hospice/vendor order board fastest for a ~24 hour hackathon?
**Scope:** Primary sources only (official framework and vendor docs). No product code. No stack re-decision of constraints already locked in the repo.

## Verdict

**Use Next.js App Router + Supabase (Postgres + optional Auth + Realtime) + Vercel.**

Nothing in official docs is *clearly faster* for this builder than the Bloom production stack. Convex is the only alternative with a documented realtime shortcut (`useQuery` is already a live subscription). That shortcut does not beat Bloom once you count a new backend model, extra Vercel deploy wiring, and auth that is either a third-party (Clerk) or beta/experimental on Next.js. Local SQLite on Vercel cannot be the shared board: function filesystems are not durable. Neon/Turso Postgres-or-SQLite without Supabase persist data but do not give hospice and vendor a first-class live subscription.

Certainty: facts below are level 2 (pointed at official docs). "Fastest for Craig + agents this weekend" is an inference from those facts plus repo constraints. It is not a timed bake-off (not level 4).

---

## Constraints treated as given

From `docs/about-me.md`, `AGENTS.md`, `docs/primary-bounty.md`, `docs/hackathon.md`, and the official bounty brief:

- Owner already ships **Next.js + Supabase + Vercel** on Bloom. Prefer that unless something else is clearly faster.
- Need a **clickable app**, not Figma. Hospice and vendor must see the **same order, status, and timestamps**.
- Auth may be a **demo role switcher** (not decided). Synthetic data only. Free tiers / event credits.
- Shared **real-time status** is a named differentiator in the BetterRX brief (`docs/briefs/dme-hackathon-bounty-brief.html`, Shared / Notification Layer).
- Solo PM who ships with AI agents. Competitive clock ~24 hours (Fri 1:30 PM to Sat 2:00 PM).

What "fastest" means here: fewest new vendors, fewest new mental models, shortest path to two browsers showing one order row update without a refresh. Not "best architecture for production HIPAA."

---

## Comparison (facts vs weekend cost)

| Stack | Shared durable store | First-class live status | Official time-to-scaffold | Weekend cost vs Bloom |
|---|---|---|---|---|
| **1. Next.js App Router + Supabase + Vercel** | Hosted Postgres | Yes: Realtime Postgres Changes | `npx create-next-app@latest -e with-supabase` | Default. Skip full Auth if using a role switcher. |
| **2. Next.js + local SQLite / Postgres on Vercel (no Supabase)** | Local SQLite: no. Hosted Neon/Turso: yes. | No first-class client subscription. DIY poll, SSE, or WebSockets. | `create-next-app` + `vercel install neon` (or Turso) | Slower. You still invent the differentiator. |
| **3. Next.js + Convex + Vercel** | Convex cloud DB | Yes: `useQuery` is automatically realtime | `npm create convex@latest` or 10-step Next.js quickstart | Not clearly faster. New query/mutation model + extra deploy key. Auth is extra. |

Firebase Firestore also has official `onSnapshot` listeners. It was checked and dropped as "the" alternative because it adds a second SDK split (client vs Admin) and no Bloom muscle memory. See Alternative notes below.

---

## 1. Next.js App Router + Supabase + Vercel

### Facts (official docs)

**Scaffold and Next.js**

- Next.js recommends `create-next-app` with App Router as the default for new apps. ([Installation](https://nextjs.org/docs/app/getting-started/installation), [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app))
- Supabase's official Next.js quickstart is one command: `npx create-next-app@latest my-app -e with-supabase`. The template is pre-configured with cookie-based Auth, TypeScript, Tailwind, `@supabase/supabase-js`, and `@supabase/ssr` clients for browser and server. ([Use Supabase with Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs))
- Same starter is published as Vercel's "Supabase Starter" template. ([vercel.com/templates/next.js/supabase](https://vercel.com/templates/next.js/supabase))
- Deploy: `vercel` / `vercel --prod`, or Git import. Storage can be provisioned with `vercel install supabase`. ([Getting started with Vercel](https://vercel.com/docs/getting-started-with-vercel))

**Realtime (the bounty differentiator)**

- Postgres Changes: subscribe to `INSERT` / `UPDATE` / `DELETE` / `*` on a table after adding it to the `supabase_realtime` publication. Client uses `.channel(...).on('postgres_changes', ...)`. ([Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes))
- Supabase currently recommends **Broadcast** for scale, and **Postgres Changes** as the simpler, lower-setup path. ([Subscribing to database changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes))
- For a demo board, Postgres Changes is the documented "minimal setup" option. Hospice and vendor clients subscribe to the same `orders` (or equivalent) table; a status UPDATE is pushed to both.

**Auth**

- Official SSR path for Next.js is two clients (browser + server) plus a Proxy to refresh cookies, because Server Components cannot write cookies. Package `@supabase/ssr` is still described as beta. ([Creating a client](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [Server-Side Rendering](https://supabase.com/docs/guides/auth/server-side))
- The `with-supabase` template **redirects unauthenticated visitors to login** for most routes. The official quickstart shows how to skip that redirect for a public page. ([Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) step 6)
- That matters: if the weekend auth choice is a role switcher, fighting the template's login wall is extra work unless you skip or punch a hole in the proxy.

**Free-tier gotchas**

- Free plan: **2 free projects** (paused projects do not count). Org-wide quotas include **500 MB DB / project**, **50,000 Auth MAU**, **2 million Realtime messages**, **200 Realtime peak connections**. ([Billing](https://supabase.com/docs/guides/platform/billing-on-supabase), [Realtime pricing](https://supabase.com/docs/guides/realtime/pricing))
- Concurrent Realtime connections on Free: **200**. Messages/sec cap **100**. Exceeding connections returns `too_many_connections`. ([Realtime limits](https://supabase.com/docs/guides/realtime/limits))
- Free projects **pause after ~7 days of low activity**. Warning email ~1 week before. Restore window **1 year**. Paid plans do not auto-pause. ([Project pausing](https://supabase.com/docs/guides/platform/free-project-pausing))
- Weekend implication: a brand-new Free project will not pause during a 24-hour hackathon. Pausing is a post-event gotcha, not a Saturday-demo risk.

**Local-dev speed**

- Full local stack: `supabase init` then `supabase start`. Requires Docker (or compatible runtime). **First run is slow** because images download (Postgres, Auth, Realtime, Studio, SMTP, etc.). ([CLI getting started](https://supabase.com/docs/guides/local-development/cli/getting-started))
- Official local-dev guide lists benefits: iterate without waiting for remote deploys, offline work, no cloud quota burn. ([Local development](https://supabase.com/docs/guides/local-development))
- Weekend implication: hitting a **hosted Free project** from `next dev` is fewer moving parts than Docker on a venue laptop. Local CLI is optional, not required.

**Vercel Hobby (frontend host)**

- Hobby is free. Included: 1M function invocations, 4 CPU-hrs, 360 GB-hrs provisioned memory, 100 deployments/day, function max duration **300s**. ([Hobby plan](https://vercel.com/docs/plans/hobby), [Function limitations](https://vercel.com/docs/functions/limitations))
- Hobby fair-use: **non-commercial, personal use**. ([Hobby plan](https://vercel.com/docs/plans/hobby), [Fair use](https://vercel.com/docs/limits/fair-use-guidelines))
- If Bloom already has a Pro/team Vercel account, deploy there. If using a personal Hobby account for a judged bounty demo, treat commercial-use wording as a policy risk (not a technical blocker).

### Inferences (not in vendor docs)

- Two Client Components (hospice board + vendor board) subscribed to the same `postgres_changes` channel is enough to show "same order, same status, same timestamps" live.
- A demo role switcher can be a cookie or query param. You do not need `@supabase/ssr` login to win the rubric. If you keep the starter template, disable the unauthenticated redirect for `/hospice` and `/vendor`.
- RLS can stay open for synthetic demo roles (`anon` read/write on `orders`) for Saturday. That is unsafe for real PHI. The brief requires synthetic data only.
- Agent familiarity with Bloom's stack is a speed input the official docs cannot measure. It still dominates a 24-hour solo build.

---

## 2. Next.js + local SQLite / Postgres on Vercel (no Supabase)

This is two different ideas that get bundled. Official docs split them.

### 2a. SQLite file next to the Next.js app

**Facts**

- Vercel Functions have a **read-only filesystem** with writable **`/tmp` scratch space up to 500 MB**. That scratch is not documented as shared durable storage across instances. ([Runtimes: file system support](https://vercel.com/docs/functions/runtimes))
- Turso's Vercel docs treat `/tmp` as **ephemeral filesystem** and split two models: SQL over HTTP to a **remote** Turso/libSQL database, or experimental in-function SQLite that **replicates pages into `/tmp`** with **writes going to the remote database**. ([Turso + Vercel](https://docs.turso.tech/integrations/vercel))
- A SQLite file committed in the repo or written under `/tmp` is therefore not a shared hospice/vendor store on Vercel. Two function instances do not share one file. A new deploy does not keep `/tmp`.

**Inference:** "Local SQLite on Vercel" fails the same-order requirement as soon as you deploy. It can work on `next dev` on one laptop. Judges clicking a Vercel URL will not see a coherent two-sided board.

### 2b. Hosted Postgres (Neon) or hosted SQLite (Turso) without Supabase Realtime

**Facts**

- Vercel can provision Neon with `vercel install neon --name my-database --plan free`. Same CLI path exists for Supabase. ([Getting started](https://vercel.com/docs/getting-started-with-vercel), [Marketplace storage](https://vercel.com/docs/marketplace-storage))
- Neon Free: $0, 0.5 GB storage/project, 100 CU-hours/project, **scale to zero after 5 min**. ([Neon plans](https://neon.com/docs/introduction/plans))
- Neon **logical replication** is CDC to other databases/warehouses, not a browser subscription API. Enabling it changes `wal_level` permanently and restarts computes. ([Logical replication](https://neon.com/docs/guides/logical-replication-guide), [Enable logical replication](https://neon.com/docs/guides/logical-replication-neon))
- Next.js does **not** ship a built-in live query. Official App Router data refresh is `router.refresh`, `revalidatePath`, `revalidateTag`. For client polling, Next.js points at **SWR / TanStack Query**. ([Caching](https://nextjs.org/docs/15/app/guides/caching), [SPA guide](https://nextjs.org/docs/app/guides/single-page-applications), [SWR](https://nextjs.org/docs/app/guides/client-side-data-fetching/swr))
- Vercel **does** support WebSockets on Functions (Fluid compute). Next.js "does not expose an API for handling WebSocket upgrades"; the documented workaround is `experimental_upgradeWebSocket`. Connections **close when the function hits max duration** (Hobby **300s**). Durable pub/sub **must live in an external store** (docs suggest Redis) because reconnects can land on a different instance. ([WebSockets](https://vercel.com/docs/functions/websockets))

**Inferences**

- Neon/Turso get you a durable shared row. They do **not** get you the bounty differentiator without extra work (poll every N seconds, or DIY WebSockets + Redis).
- Polling can fake a demo. It is not what the brief labels "real-time status visible to both sides." Judges with two laptops will notice lag or refresh.
- DIY WebSockets on Next.js is an experimental API plus reconnect plus Redis. That is more surface than Supabase `.on('postgres_changes')`.
- Cold-start from Neon scale-to-zero (5 min idle) can stall the first judge click. Supabase Free does not scale-to-zero on that interval (it pauses on a 7-day inactivity window instead).

**Local-dev speed:** `better-sqlite3` or a local Postgres is faster to boot than `supabase start`. That local speed is real. It does not survive deploy without a hosted DB, at which point you have reinvented half of Supabase minus Realtime.

---

## 3. Alternative checked for a real time-to-first-board advantage: Convex

Evaluated because official docs claim realtime is automatic. Firebase is noted after, then rejected as the comparison pick.

### Facts (Convex)

**Realtime**

- "Turns out Convex is automatically realtime! You don't have to do anything special if you are already using query functions, database, and client libraries." Client subscriptions update to the same snapshot. ([Realtime](https://docs.convex.dev/realtime))
- Next.js path: wrap with `ConvexProvider`, then `useQuery(api.tasks.get)` in a Client Component. That hook **is** the live board. ([Next.js quickstart](https://docs.convex.dev/quickstart/nextjs))

**Scaffold**

- Fastest documented setup: `npm create convex@latest`, or a **10-step** Next.js App Router guide (`create-next-app`, `npm install convex`, `npx convex dev`, import JSONL, write a query, provider, `useQuery`). `npx convex dev` logs in with GitHub and syncs functions to a **cloud** dev deployment. ([Next.js quickstart](https://docs.convex.dev/quickstart/nextjs))

**Hosting**

- Frontend still deploys to Vercel. Official build command override: `npx convex deploy --cmd 'npm run build'`. Requires `CONVEX_DEPLOY_KEY` (production and, separately, preview). Preview backends are **fresh** and do not share data with prod unless you `--preview-run` a seed function. ([Using Convex with Vercel](https://docs.convex.dev/production/hosting/vercel))
- Marketplace install exists (`vercel.com/marketplace/convex`). That is another vendor account/team unless you already have Convex.

**Auth**

- Convex endpoints are on the open internet; clients must authenticate. Recommended path is a third party: **Clerk, WorkOS AuthKit, Auth0**. ([Authentication](https://docs.convex.dev/auth))
- **Convex Auth** (in-Convex passwords/OTP) is **beta**, "isn't complete," and **Next.js support is under active development / experimental**. ([Authentication](https://docs.convex.dev/auth))
- Clerk + Convex on Next.js is a multi-step provider/middleware setup. Clerk does **not** support `https://<project>.vercel.app` as a production origin; custom domain required for that combo. ([Clerk](https://docs.convex.dev/auth/clerk), [Vercel hosting / Authentication](https://docs.convex.dev/production/hosting/vercel))
- Convex does **not** use RLS. Authorization is "check the user at the start of each public function." ([Authentication](https://docs.convex.dev/auth))

**Free-tier gotchas**

- Free: hard caps. **0.5 GB** DB, **1M function calls/month** (subscription updates count as function calls), **1 GB** file storage, **6 developers**, **40 deployments**, S16 class (**1,000 concurrent sessions**). After Free caps, mutations that insert/update may fail. ([Limits](https://docs.convex.dev/production/state/limits), [Pricing](https://www.convex.dev/pricing))
- Demo-sized board is well inside these caps. The gotcha is billing surprise if you switch to Starter (pay-as-you-go) rather than staying Free.

**Local-dev speed**

- Default `npx convex dev` is **cloud sync**, not a local Postgres. Faster than downloading Supabase Docker images. Requires GitHub login and network. That is a real first-hour win if Convex is the chosen backend.

### Inferences (Convex vs Bloom this weekend)

- **Lines of live UI after Convex exists:** fewer than Supabase. You do not enable a publication or write `.on('postgres_changes')`. That is the documented advantage.
- **Time to first two-sided board for this repo:** not clearly smaller.
  - New backend language (queries/mutations vs SQL + PostgREST).
  - Extra Vercel build command and deploy keys.
  - Auth is either skipped (public functions + shared secret, which Convex itself documents for services) or Clerk/beta Convex Auth.
  - Agents and Craig already operate Bloom's Next.js + Supabase patterns. Convex is a second framework to keep correct under Saturday time pressure.
- A demo role switcher on Convex is fine (public queries, no Clerk). Same is true on Supabase. Convex's realtime win does not require its auth stack. Even then, you still pay the new-backend tax.

**Honest bar from AGENTS.md:** prefer Bloom unless something is *clearly* faster. Convex is *possibly* faster for a Convex-native team. Official docs do not show a clear win for a Bloom operator in 24 hours.

### Firebase (why it is not the comparison pick)

**Facts**

- Firestore `onSnapshot` is first-class realtime for documents and queries. ([Listen](https://firebase.google.com/docs/firestore/query-data/listen))
- Listener billing: **one read per document added/updated in the result set**, and again on many reconnects. Free quota: **50,000 reads/day**, 20,000 writes/day, 1 GiB stored, one free database per project. ([Firestore pricing](https://firebase.google.com/docs/firestore/pricing))
- Spark Realtime Database (separate product) is capped at **100 simultaneous connections**. ([Firebase pricing](https://firebase.google.com/pricing/))
- There is no official `create-next-app -e with-firebase` equivalent to `with-supabase`. App Router usage commonly splits **client SDK** (listeners, Auth UI) and **firebase-admin** (Server Components). That split is extra weekend surface.

**Inference:** Firebase can do the live board. It is not clearly faster than Supabase for this builder, and Convex already occupies the "fewer realtime lines" slot.

---

## Auth: role switcher vs real Auth

Constraint: auth may be a demo role switcher.

| Approach | Official support | Weekend cost |
|---|---|---|
| Query param / cookie `role=hospice\|vendor` | Not a vendor feature. Just Next.js. | Fastest. Two URLs, same table. |
| Supabase Auth (email magic link) | First-class, but SSR cookie + Proxy is non-trivial; starter redirects the anonymous user. | Easy to lose an hour. Skip unless judges must log in. |
| Convex + Clerk | Official, multi-file. Custom domain if using Clerk in prod. | Slowest of the three. |
| Convex Auth | Beta; Next.js experimental. | Do not bet the bounty on a beta. |

Inference: ship the role switcher. Put a note in the pitch that production would use hospice SSO / vendor invite. That matches "sketch only" integration in the brief.

---

## Local-dev speed (summary)

| Path | First boot (official) | Two-browser live demo on localhost |
|---|---|---|
| Hosted Supabase + `next dev` | Dashboard project + env vars. No Docker. | Yes, via Realtime WebSocket to the cloud project. |
| `supabase start` + `next dev` | Docker image download on first run (explicitly slow). | Yes, local Realtime at `http://127.0.0.1:54321`. |
| Local SQLite + `next dev` | Fastest boot. | Same process only. Breaks on Vercel. |
| Neon + `next dev` | Fast if using cloud Neon. Scale-to-zero can add first-query delay. | Not live unless you add poll/SWR/WebSockets. |
| `npx convex dev` + `next dev` | GitHub login; cloud backend; no Docker. | Yes, `useQuery` is live. |

Weekend recommendation: **hosted Supabase Free project + `next dev`**. Skip Docker unless you already have it warm.

---

## Free-tier gotchas that can actually hit Saturday

1. **Supabase 200 concurrent Realtime connections** — fine for a room of judges. Not fine if you leave a public `*` schema subscription open and the URL leaks. Subscribe to one table, not the whole schema.
2. **Supabase 7-day pause** — irrelevant during the event; resume later if the project sleeps.
3. **Vercel Hobby 300s WebSocket duration** — only matters if you DIY WebSockets. Supabase Realtime connections do not ride your Vercel function duration.
4. **Vercel Hobby commercial-use wording** — prefer Bloom's existing Vercel team if it can host this repo.
5. **Neon scale-to-zero (5 min)** — only if you pick stack 2.
6. **Convex Free hard caps** — unlikely to hit; preview deployments are empty unless you seed.
7. **Firestore listener reads** — two open boards polling a collection can burn the 50k/day quota if you also hammer writes in a live demo. Another reason not to pick Firebase.

---

## Certainty ladder

| Claim | Level | Where it stopped |
|---|---|---|
| Supabase Postgres Changes can push the same row UPDATE to two browser clients | 2 | Official Realtime docs. Not run in this session. |
| Vercel `/tmp` is not a durable shared SQLite store | 2 | Official runtimes + Turso Vercel docs. |
| Next.js has no built-in live query; refresh/poll is the native path | 2 | Next.js caching and SPA guides. |
| Convex `useQuery` is a live subscription with no extra channel setup | 2 | Convex realtime + Next.js quickstart. |
| Convex is not *clearly* faster than Bloom for this weekend | Inference | Combines those facts with `docs/about-me.md` (existing Bloom stack, PM + agents, 24h clock). Not a timed bake-off. |
| Role switcher is enough for the rubric | Inference | Brief requires a working two-sided app, not SSO. Auth "not decided" in constraints. |

The one fact the recommendation is safe because of: **the bounty differentiator is shared live status, and Supabase already sells that as a one-subscription API on the database Craig already knows, while "SQLite on Vercel" is documented as non-durable and Convex's live-query win is offset by a new backend plus extra deploy/auth surface.**

---

## What this unblocks

- **Lock the weekend stack:** Next.js App Router + hosted Supabase (Postgres + Realtime) + Vercel. Do not introduce Convex, Firebase, Neon, or Turso unless Bloom's Supabase project cannot be created in time.
- **Skip:** local Docker Supabase unless already running; full SSR Auth; DIY WebSockets; SQLite files.
- **Build next:** one `orders` table (status + timestamps), publication enabled, two routes (hospice / vendor) on the same subscription, fixture rows from `docs/briefs/dme-sample-orders.html`, a visible role switcher.
- **Pitch line:** shared live status is a Realtime subscription on one Postgres row, not a vendor portal poll. That is the differentiator the brief asked for.
- **Does not unblock:** schema design, at-risk rule, discharge-readiness UX, or vendor cold-start flow. Those are product slices, not stack.
