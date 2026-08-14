# BetterRX weekend demo spec

## Destination

A locked spec for the Saturday BetterRX demo: a working hospice-first DME app a judge can click through discharge-ready, post-death pickup, and prevent-a-miss. The spec is `docs/prd.md`. This map does not build the app.

## Notes

- Domain: hospice DME coordination. Glossary: `CONTEXT.md`. Slice: `docs/primary-bounty.md`. Clock and rubric: `docs/hackathon.md`. FAQ overlay: `docs/briefs/betterrx-bounty-faq.md`. Room notes: `docs/briefing-qa.md`.
- Tracker: GitHub Issues (`docs/agents/issue-tracker.md`). These files are the charting notes.
- Plan, don't do. No product code on this map. Next step is tracer-bullet tickets against `docs/prd.md`, not more grilling.
- Craig is a healthcare PM, not a hospice or DME operator. Treat vendor-side ops as labeled assumptions.
- Synthetic data only. No real patient, hospice, or vendor records.
- Refer to tickets by name, not by bare number.

## Decisions so far

- [What transaction shape do the sample orders imply?](issues/01-sample-order-shape.md) — One shared card (order, patient, hospice, HCPCS, note). Vendor nullable until Dispatched. Sample at-risk is ETA vs discharge window, or days since pickup with no retrieval.
- [What BetterRX eRx surface can we sketch against?](issues/02-betterrx-erx-surface.md) — Partner-connection data share, not a public API. DME is a second order on the same patient key. PRD names HCHB as the primary EMR story.
- [Which stack ships a two-sided live board fastest this weekend?](issues/03-weekend-stack.md) — Nothing clearly faster than Next.js + hosted Supabase Realtime + Vercel.
- [What is the vendor-side original move?](issues/04-vendor-side-original-move.md) — SMS / magic-link confirm, no network-building. Hospice UX is the claim. See `docs/prd.md`.
- [Where does AI earn its score versus an honest skip?](issues/05-ai-earn-or-skip.md) — Honest skip. At-risk and ranking are rules.
- [How do hospice and vendor share one demo without real identity?](issues/06-demo-identity.md) — Hospice role switcher. Vendor confirm is a simulated SMS inbox. No real auth.
- [How should the shared order board behave?](issues/07-shared-board-behavior.md) — Skip the throwaway. Build the running app from the PRD.
- [Which weekend stack do we lock?](issues/08-lock-weekend-stack.md) — Next.js + TypeScript + Tailwind on Vercel. Supabase only if a real table is needed.

## Not yet specified

- Fixture catalog size beyond the six sample orders (how many vendors, prices, preferred-option set)
- Pitch script wording for the 5-minute slot (content is in `docs/prd.md`; sequence is not)
- Whether the simulated SMS inbox is a panel in the same app or a second route

## Out of scope

Work beyond this map's destination. Closed, never graduates.

- Vendor marketplace / recruitment
- GPS routing
- Serialized warehouse inventory
- Claims submission (X12 837)
- Live EMR connection, live SMS, or SSO
- Native apps or a family app
- Supplies as a second app (stretch on the same board only after DME works)
- GOED, MadeThis, or other bounty tracks
