# BetterRX weekend demo spec

## Destination

A locked spec for the Saturday BetterRX demo: a working two-sided hospice and DME app a judge can click through discharge-ready, post-death pickup, and prevent-a-miss. The spec is ready to collapse with `/to-spec` and slice into tracer-bullet tickets. This map does not build the app.

## Notes

- Domain: hospice DME coordination. Glossary: `CONTEXT.md`. Slice: `docs/primary-bounty.md`. Clock and rubric: `docs/hackathon.md`. Official brief: `docs/briefs/`.
- Tracker: `docs/agents/issue-tracker.md`. Tickets are files under `.scratch/betterrx-weekend-demo/issues/`.
- Plan, don't do. No product code on this map. When the map is clear, run `/to-spec` on it, then `/to-tickets`. Do not implement from open decision tickets.
- Destination was named from Craig's own weekend slice in `docs/primary-bounty.md`, not from a live grill in this charting session. Redraw the destination if that cut is wrong.
- HITL grilling: never answer for Craig. Research tickets may resolve in the charting session.
- Craig is a healthcare PM, not a hospice or DME operator. Treat vendor-side ops as research, not lived experience.
- Synthetic data only. No real patient, hospice, or vendor records.
- Refer to tickets by name, not by bare number.

## Decisions so far

- [What transaction shape do the sample orders imply?](issues/01-sample-order-shape.md) — One shared card (order, patient, hospice, HCPCS, note). Vendor nullable until Dispatched. Sample at-risk is ETA vs discharge window, or days since pickup with no retrieval.
- [What BetterRX eRx surface can we sketch against?](issues/02-betterrx-erx-surface.md) — Partner-connection data share, not a public API. DME is a second order on the same patient key. Sketch MatrixCare or Axxess.
- [Which stack ships a two-sided live board fastest this weekend?](issues/03-weekend-stack.md) — Nothing clearly faster than Next.js + hosted Supabase Realtime + Vercel. Not a lock; see [Which weekend stack do we lock?](issues/08-lock-weekend-stack.md).

## Not yet specified

- Which EMR the integration diagram names (MatrixCare vs Axxess vs HCHB), once we need a picture
- Discharge override: who can override, and what reason is enough
- Pickup delayed window (sample uses 4 days; brief says "expected window")
- Whether DME spend next to meds appears in the demo UI or only in the pitch
- Bedside mobile as a real layout vs a responsive board
- Fixture design beyond the six sample orders (how many vendors, how an invite is seeded)
- Pitch script for the 5-minute slot
- Billing-on-delivery as a vendor-side signal vs left as a sketch

## Out of scope

Work beyond this map's destination. Closed, never graduates.

- Real vendor marketplace
- GPS routing
- Serialized warehouse inventory
- Claims submission (X12 837)
- Live EMR connection or SSO
- Cost-of-care analytics beyond a simple DME-next-to-meds line
- GOED, MadeThis, or other bounty tracks
