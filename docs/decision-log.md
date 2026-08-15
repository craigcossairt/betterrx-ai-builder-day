# Decision Log

What was decided, when, and why. **Decisions only** - not specs, not current state, not
implementation details. One line per decision; reference issue IDs instead of embedding detail.
If an entry needs more than 2 lines, it belongs in a dedicated doc, not here.

Format: `- **YYYY-MM-DD** - Decision description. See <issue-ref>.`

---

- **2026-08-14** - Created this private repo from craigcossairt/trellis for the BetterRX DME Ordering and Visibility bounty at AI Builder Day Part 2. Git history starts here on purpose. Sibling repos (ai-builder-day-part-2, startup-state-2) stay on their own tracks.
- **2026-08-14** - This repo is the BetterRX product only. Do not fold GOED or MadeThis into it. See `docs/primary-bounty.md`.
- **2026-08-14** - Installed mattpocock/skills (skip his `tdd`) and vendored poteto's pstack. GitHub Issues + default triage labels + single-context `CONTEXT.md`. TDD authority stays `docs/methodology/tdd.md`. See `docs/adr/0001-mattpocock-skills-and-pstack.md`.
- **2026-08-14** - pstack everyday roles use `cursor-grok-4.6-high-fast` (discounted Grok 4.6). Adversarial panels mix Grok, `gpt-5.6-sol-xhigh`, and `claude-opus-5-thinking-high`. See `.cursor/rules/pstack-models.mdc`.
- **2026-08-14** - Weekend scope follows the pre-build FAQ over the original brief where they collide: hospice-first judging, vendor participation assumed, no network-building, SMS/email vendor baseline, nurse-in-the-home pickup as primary. See `docs/briefs/betterrx-bounty-faq.md` and `docs/prd.md`.
- **2026-08-14** - Three hospice personas for the demo: admissions nurse (default orderer), case manager (visit / IDT / pickup), director of nursing (cost threshold + timing report). See `docs/briefing-qa.md`.
- **2026-08-14** - Order cards show three factors: stock (or unknown), ETA, price. Guardrails rank preferred option first. DME is open authorization; paperwork does not block STAT. See `docs/prd.md`.
- **2026-08-14** - At-risk stays a deterministic ETA-vs-deadline rule. Planned AI ROI answer is "rules are better here." See `docs/primary-bounty.md`.
- **2026-08-14** - Default weekend stack is Bloom's: Next.js + TypeScript + Tailwind on Vercel, Supabase only if a real table is needed. Revisit only if something is clearly faster. See `docs/prd.md`.
- **2026-08-14** - Demo must be running code with real order state. Mockups and visual prototypes fail. See `docs/prd.md`.
- **2026-08-14** - Bounty is DME only. Pharmacy stays BetterRX (fixture meds). Supplies is stretch after DME works, same board, no pickup, one-stop-shop pitch. See `docs/briefing-qa.md`.
- **2026-08-14** - Pitch must answer Todd's buyer question: how do you decrease DME cost PPD. DON view shows actual vs target plus drivers. Tech PPD (BetterRX fee) is not that answer. No invented savings dollars. See `docs/prd.md`.
- **2026-08-14** - Weekend planning notes live at `.scratch/betterrx-weekend-demo/`. GitHub Issues is the tracker. See `docs/agents/issue-tracker.md`.
- **2026-08-14** - This environment's GitHub token can create, comment, label, and close issues (probe #5). If a later token 403s, fall back to asking Craig. See `docs/agents/issue-tracker.md`.
- **2026-08-14** - Weekend fixture catalog: six sample orders, three SKUs (E0250, E1390 oxygen, E1130), two vendor options per card, CMS-shaped daily rates plus NADAC meds. Sample E0601-as-oxygen maps to E1390. See [What fixture catalog sits under the six sample orders?](https://github.com/craigcossairt/betterrx-ai-builder-day/issues/7).
- **2026-08-15** - Landed the BetterRX design system as CSS tokens plus typed TSX in `src/ui`. Product screens use the eRX app look (system UI, blue actions, bordered cards). See #9.
- **2026-08-15** - Weekend app is Next.js 16 at the repo root with an in-memory hospice store. Sample JSON is parsed at the boundary. Wire E0601 oxygen maps to E1390. No Supabase for the first board. See #9.
- **2026-08-15** - Order mutations stay on the same `Order` union (`placeOrder`, `confirmVendor`, `triggerPickup`, `assessDeliveryRisk`, `dischargeReady`, `censusPpd`). Vendor confirm is an in-app SMS panel. See #10-#15.
- **2026-08-15** - Place-order shows ranked three-factor cards (stock, ETA, price). Guardrail and $3 DON gates live in `chooseOffer`. At-risk and delayed pickup escalate to named people. See #10 #12.
- **2026-08-15** - Keep the in-memory Order union. Measure idle pickup days from trigger to now. Do not rewrite onto a normalized census before the pitch. See #15.
- **2026-08-15** - Persist the same Order union as jsonb rows in Supabase project nvkjnzagfwvltzpsxfcd. Fall back to memory when keys are missing. PWA is installable standalone and does not cache the census.
- **2026-08-15** - Apply `0001_hospice.sql` from the Vercel build (`scripts/apply-schema.mjs`) using the Supabase-injected `POSTGRES_URL`. Do not hand the owner a SQL paste. Preview env targets include the same keys as production.
- **2026-08-15** - Census chrome is the 2a phone frame: name first, no chips, quiet rows stay closed, one blue Order equipment action. Inbox and reset live in the footnote. Place-order and inbox replace the census inside the same phone shell. Vendor cards speak a sentence. See #18.
- **2026-08-15** - Judge-placed orders keep the chosen vendor quote on `OrderedOrder`. Confirm uses that quote and the stored target. Demo reset reseeds the six fixtures. See the Fable review.
- **2026-08-15** - Census direction is 2a sentences. Locked names are primary (Helen Vargas for PT-87602). STAT never waits on the $3 gate. Elapsed uses hours under 48 hours.
- **2026-08-15** - DON hold is strictly over $3. A rate of exactly $3 stays open. Census lines are quiet or loud; coral is only at-risk.
- **2026-08-15** - Demo chrome (persona + Phone / Desktop) sits outside the app. The app badge only names the role. Vendor sees inbox only. Patient picture has Medication / DME / Supplies. New order is patient search, then kind, then EMR or catalog search. No three-SKU chips. See #18.
- **2026-08-15** - Patient tab shows eRx-shaped chart (DOB, gender, address, phone, diagnoses, allergies). SSN is omitted. Household contact is a hospice fixture, not an eRx field. Medication tab uses newMedications events. See #18.
- **2026-08-15** - Claude Design resume is 2a remaining frames only (chart, med events, supplies, vendor phone, DON approve + clock stop, two-line order). Do not redraw census or 1a/1b/2b/2c. See `docs/claude-design-2a-remaining.md`.
- **2026-08-15** - Round 3 frames land as read-only projectors over the existing Order/chart/PPD types. Tokens stay the ones already in `src/ui/tokens`. Clinician actions stay `Button variant="app"` (blue, 6px). Coral-gradient pills in the mock stay marketing-only.
- **2026-08-15** - Do not change locked census stories to match Claude's hold/death fixtures. Helen stays deceased. June stays admitted. Hold and retro rows bind to `costGate`. A routine over $3 is `ordered` plus a `DON hold` note until approve. `picked_up` is a new status because that tap stops the rental clock.
- **2026-08-15** - Equipment oversight is a named panel (`panel=oversight`). The DON census footer and the logo/lede are the in-product ways back.
- **2026-08-15** - Clinician phone is the Phone surface for Admissions RN, Case Mgr, and DON. It is not a fifth persona. Side-by-side is removed. Old `surface=split` links open Desktop.
- **2026-08-15** - `/integration` is a judge note titled How it connects. The typed `pitchPacket` (AI skip at $0, today vs us, mermaid) lives on that same page. It is not a product screen and it does not call a live EMR. See #19.
- **2026-08-15** - `/integration` now shows three tap links, a four-step HCHB flow, and labeled fixture assumptions. The mermaid string stays in `pitchPacket` for tests. It is not rendered. Census "Vendor confirm" is a link to the no-login vendor text.
- **2026-08-15** - Tracker V6 binds to notes, seed, and inbox maps. Ask why stays on the held line. Propose a time is day and hour chips. Delivery photo is stored on the order. Per-line Try Wasatch/Uintah can split send by vendor. Unknown ICD codes get a fallback sentence. Sam Whitaker `DME-10322` is the non-Helen hold. Ray keeps the wound-care kit. Ray trail timestamps stay the 3e honesty rule.
- **2026-08-15** - Product tabs Census / New order / Oversight live in the app chrome. The clinician inbox is projected from orders. Add supplies keeps the open patient. Switching to DON keeps the open chart. Side-by-side stays removed. Helen stay deceased. June stays admitted.
- **2026-08-15** - Pickup ends in `picked_up` with `pickedUpAt`. `triggerPickup` leaves a delayed row delayed. PPD stops billing that order. See #20.
- **2026-08-15** - Unconfirmed orders stay `ordered`. A 24-hour grace projection flags DME-10231 at-risk. No new status. See #21.
- **2026-08-15** - DON PPD does not print a buffer-day count. The fixture never computed that driver. See #24.
- **2026-08-15** - One STAT send can carry bed and oxygen as two lines on one order. Each line shows its preferred ETA versus the discharge window. See #23.
- **2026-08-15** - Vendor persona opens one order at `?order=`. Confirm, yes-but ETA, decline, delivered, pickup window, and picked up share the Order union. No vendor account. See #22.
- **2026-08-15** - Supplies are real orders with `kind: supply` on the same Order union. Pickup throws. Discharge and PPD ignore them. See #25.
- **2026-08-15** - Proof of delivery may carry an optional fixture `photoUrl`. Missing photo does not block delivered. See #26.
- **2026-08-15** - Discharge override is visible on the patient DME banner. The write-only map was a silent no-op for judges.
- **2026-08-15** - The six-item supply catalog (wound kit, foam, saline, briefs, underpads, gloves) places `kind: supply` orders. Ray's fixture kit still shows until a seed supply order exists. See #25 #29.
