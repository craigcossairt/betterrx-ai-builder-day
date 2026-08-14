# Decision Log

What was decided, when, and why. **Decisions only** - not specs, not current state, not
implementation details. One line per decision; reference issue IDs instead of embedding detail.
If an entry needs more than 2 lines, it belongs in a dedicated doc, not here.

Format: `- **YYYY-MM-DD** - Decision description. See <issue-ref>.`

---

- **2026-08-14** - Created this private repo from craigcossairt/trellis for the BetterRX DME Ordering and Visibility bounty at AI Builder Day Part 2. Git history starts here on purpose. Sibling repos (ai-builder-day-part-2, startup-state-2) stay on their own tracks.
- **2026-08-14** - This repo is the BetterRX product only. Do not fold GOED or MadeThis into it. See `docs/primary-bounty.md`.
- **2026-08-14** - Weekend scope follows the pre-build FAQ over the original brief where they collide: hospice-first judging, vendor participation assumed, no network-building, SMS/email vendor baseline, nurse-in-the-home pickup as primary. See `docs/briefs/betterrx-bounty-faq.md` and `docs/prd.md`.
- **2026-08-14** - Three hospice personas for the demo: admissions nurse (default orderer), case manager (visit / IDT / pickup), director of nursing (cost threshold + timing report). See `docs/briefing-qa.md`.
- **2026-08-14** - Order cards show three factors: stock (or unknown), ETA, price. Guardrails rank preferred option first. DME is open authorization; paperwork does not block STAT. See `docs/prd.md`.
- **2026-08-14** - At-risk stays a deterministic ETA-vs-deadline rule. Planned AI ROI answer is "rules are better here." See `docs/primary-bounty.md`.
- **2026-08-14** - Default weekend stack is Bloom's: Next.js + TypeScript + Tailwind on Vercel, Supabase only if a real table is needed. Revisit only if something is clearly faster. See `docs/prd.md`.
- **2026-08-14** - Demo must be running code with real order state. Mockups and visual prototypes fail. See `docs/prd.md`.
- **2026-08-14** - Bounty is DME only. Pharmacy stays BetterRX (fixture meds). Supplies is stretch after DME works, same board, no pickup, one-stop-shop pitch. See `docs/briefing-qa.md`.
