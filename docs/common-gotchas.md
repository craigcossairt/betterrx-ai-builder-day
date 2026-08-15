# Common Gotchas

Symptom → root cause → fix patterns discovered in this project. Agents: append a row after every
bug fix (see AGENTS.md § Autonomous Housekeeping). Check this table FIRST when diagnosing a bug -
the symptom may already be documented.

Keep entries terse: future sessions are the consumer and they have a limited attention budget.
Include a commit SHA and issue reference when known.

| Symptom | Root Cause | Fix | Date | Ref |
|---|---|---|---|---|
| Next.js 500: `parseRole() from the server but parseRole is on the client` | `parseRole` lived in a `"use client"` file and the server page imported it | Move role helpers to `src/ui/roles.ts` with no client directive | 2026-08-15 | #9 |
| `next build` typechecks vendored pstack Bun scripts | Root `tsconfig` included `**/*.ts` | Exclude `vendor` | 2026-08-15 | #9 |
| `next dev` appends a Next.js block to `AGENTS.md` | Next 16 writes agent rules unless disabled | Set `agentRules: false` in `next.config.ts` | 2026-08-15 | #9 |
| DON idle days stay 4 for any trigger date | `censusPpd` added four days to `triggeredAt` instead of measuring now | Pass `now` and use `daysBetween(triggeredAt, now)` | 2026-08-15 | #15 |
| Cloud agent cannot `psql` to Supabase | Cursor redacts Vercel sensitive env to `[SENSITIVE]` on disk; REST `orders` 404s until DDL runs | Apply schema in `npm run build` on Vercel, where `POSTGRES_URL` is real | 2026-08-15 | persist |
| Vercel MCP `list_projects` missed BetterRX | MCP listing was stale or filtered; REST `/v9/projects` showed `betterrx-ai-builder-day` | Use the Vercel REST API with `VERCEL_TOKEN` when MCP 404s | 2026-08-15 | persist |
| Vercel `npm run build` fails TS5097 on seed script | `tsconfig` included `**/*.mts`, so Next typechecked `scripts/seed-if-empty.mts` | Exclude `scripts` from `tsconfig` | 2026-08-15 | persist |
| Judge-placed STAT order confirms as vendor-1 with no risk flag | `confirmOrderAction` hardcoded vendor-1 and a fresh `now+4h` deadline; place stored `vendorId: null` and dropped the chosen offer | Keep `quotedVendorId` / `quotedEta` on place; `confirmQuotedOrder` uses them against the stored `targetAt` | 2026-08-15 | demo |
| Empty override or discharge reason shows a raw Next error screen | `chooseOffer` and `markDischargeReadyAction` threw; no `error.tsx`; inputs were not required | Return `{ error }` from those actions, add `src/app/error.tsx`, mark reason fields required when shown | 2026-08-15 | demo |
| Second isolate still shows the old census after a replace | `createSupabaseStore.snapshot()` read a module Map and never re-listed | Re-list on `snapshot()` and `get()`; add `reset()` that deletes and reseeds | 2026-08-15 | demo |
| Vercel `next build` fails TS2339 on `assessed.riskWhy` | `confirmQuotedOrder` returns a union; Next typechecks `*.test.ts` | Narrow with `if (assessed.status !== "in_transit_at_risk") throw` before reading `riskWhy` | 2026-08-15 | #17 |
| `tsc` fails TS2339 on `order.eta` inside a status speaker table | `Record<OrderStatus, (order: Order) => …>` widens every arm to the full union | Map `{ [S in OrderStatus]: Speaker<S> }` and switch on `order.status` before the call | 2026-08-15 | #18 |
| Order tiles do nothing on `127.0.0.1:3000` | Next 16 blocks `/_next/static` for that host; the form still posts without JS | Set `allowedDevOrigins: ["127.0.0.1", "localhost"]` in `next.config.ts` | 2026-08-15 | #18 |
| Vendor → Admissions RN still shows the vendor inbox | Demo chrome kept `panel=inbox` when leaving vendor | `chromeQuery` clears panel when the role leaves vendor | 2026-08-15 | #18 |
| Claude Design drew Helen as an on-service $3 hold | Locked 2a census has Helen deceased with pickup in motion | Bind DON hold/retro to live `costGate` rows. Do not rewrite Helen or June to match a mock. | 2026-08-15 | 2a frames |
| DON desktop shows Equipment oversight with no way back after a census tap | Right pane swapped to the chart and nothing in the product cleared `patient` | `panel=oversight` plus a labeled footer link. Logo and census lede clear panel and patient. | 2026-08-15 | nav |
| Request pickup on DME-09803 drops the delayed demo | `triggerPickup` rewrote `pickup_delayed` to `pickup_triggered` and stripped `riskWhy` | Return the delayed order unchanged; use `markPickedUp` to stop the PPD clock | 2026-08-15 | #20 |
