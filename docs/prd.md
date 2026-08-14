# PRD: Hospice-first DME ordering and visibility

Weekend product for the BetterRX DME Ordering and Visibility bounty. Sources: official brief, FAQ, Friday Q&A notes, sample orders, BetterRX public product pages. This is the build spec. `docs/primary-bounty.md` is the shorter weekend slice.

Certainty: brief and FAQ are BetterRX's written words. Q&A notes are Craig's capture of the room. BetterRX meds-product facts are from [betterrx.com](https://www.betterrx.com/) and [betterrx.com/technology](https://www.betterrx.com/technology). Vendor day-to-day ops are **stated assumptions** (FAQ §1).

## Problem Statement

A hospice nurse needs a hospital bed and oxygen in the home before the patient leaves the facility. After a death, that equipment has to leave the home quickly and respectfully. The hospice does not run the DME company. Families and CAHPS still blame the hospice when the bed is late, dirty, or still in the living room four days later.

Today the nurse orders by phone, fax, or a vendor portal she barely uses. She cannot see stock, ETA, and price in one place. The admissions nurse is in her car, on a phone, not at a desk. The case manager notices progression at a visit or IDT and has to start another phone tree. The director of nursing finds out about cost and delays in a report after the miss.

BetterRX already solved this shape for **medications**: mobile ordering, real prices, Guardrails that steer the right choice, DON approvals, EMR ADT in, pharmacy confirm out. DME has no equivalent. DME is also less regulated than prescriptions (open authorization), so the order can live in this product without pretending to be an eRx.

BetterRX has no DME vendor network. Delivery timestamps for DME do not exist in their production system. The weekend product has to help the hospice anyway, with vendor participation treated as given (SMS or email confirm, not a recruitment marketplace).

## Solution

A phone-first hospice DME surface that sits next to BetterRX meds for the same patient.

The admissions nurse (or case manager) places an order by choosing equipment with three facts on the card: **available / unknown stock**, **expected delivery**, **price**. Guardrails put the preferred, on-time, cost-aware option first. Crossing a cost threshold asks the DON to approve, with a one-line reason. The hospice sees the same status the vendor just confirmed. A miss is flagged **before** the discharge time or pickup window, with a plain-language why. When the patient dies, the nurse in the home taps Pickup; the EMR death event is the backup if she cannot.

Vendors in the demo are fixtures. They confirm by SMS or magic-link email. They do not need an account. A thin portal is a stretch, not the pitch.

DME spend sits next to real medication prices on the patient. Each lifecycle step has a timestamp so the DON can see "hours to pickup" and hold a vendor to it.

## User Stories

1. As an admissions nurse, I want to order a hospital bed and oxygen from my phone in the car, so that a new patient can go home the same day without a fax.
2. As an admissions nurse, I want to see whether the item is in stock, when it should arrive, and what it costs, so that I can pick a vendor that will actually beat discharge.
3. As an admissions nurse, I want the preferred option shown first, so that I do not have to guess the "right" DME choice.
4. As an admissions nurse, I want to place a STAT order without waiting on paperwork, so that care is not blocked when ADT already landed but forms have not.
5. As an admissions nurse, I want a discharge time on the order, so that I know whether the ETA will miss the window before I hang up.
6. As an admissions nurse, I want to see that the order was confirmed, dispatched, and delivered, so that I stop calling the vendor for status.
7. As a case manager, I want to see what equipment is already in the home, so that I do not double-order a bed that is already there.
8. As a case manager, I want to add equipment when the patient's condition progresses, so that I can act from a visit or IDT without a new phone tree.
9. As a case manager, I want an at-risk flag before the family calls, so that I can escalate while there is still time.
10. As a case manager, I want to tap Pickup at the bedside when the patient dies, so that retrieval starts before the EMR catches up.
11. As a case manager, I want EMR death or discharge to trigger pickup if I could not tap it, so that a missed tap is not a four-day bed in the living room.
12. As a director of nursing, I want to approve orders over a cost threshold, so that I can balance care and spend without reviewing every oxygen concentrator.
13. As a director of nursing, I want to see DME cost next to medication cost for the same patient, so that PPD is one picture, not two silos.
14. As a director of nursing, I want a reason when a nurse overrides the preferred option, so that I can coach later instead of blocking care now.
15. As a director of nursing, I want timing for each step (ordered, confirmed, delivered, pickup requested, picked up), so that I can hold a vendor accountable with numbers.
16. As a director of nursing, I want a list of at-risk and delayed pickups across the census, so that I am not surprised by CAHPS comments.
17. As a hospice clinician, I want real medication prices on the patient view, so that DME is compared in the same dollars BetterRX already shows for meds.
18. As a hospice clinician, I want HCPCS E-codes on the equipment, so that the order matches how DME is identified in the rest of healthcare.
19. As a hospice clinician, I want to pick among more than one vendor in a market, so that I have a fallback when one cannot deliver today.
20. As a hospice clinician, I want same-day SLA language on STAT admission equipment and 24-hour language on routine items, so that "late" has a definition.
21. As a hospice clinician, I want proof of delivery (time, and if possible a photo), so that "we dropped it" is not a phone claim.
22. As a hospice clinician, I want to mark a patient discharge-ready only when required equipment is delivered, or override with a reason, so that nobody goes home to an empty bedroom.
23. As a hospice clinician, I want an explanation of why an order is at-risk in plain words, so that I know whether to call the vendor or change the discharge time.
24. As a hospice clinician, I want escalation to a named person when at-risk crosses a threshold, so that the flag is not a dead badge.
25. As a DME vendor contact, I want to confirm or decline an order from a text or email link without creating an account, so that I can respond from the warehouse floor.
26. As a DME vendor contact, I want to send a delivery timestamp and optional photo from that same link, so that the hospice sees proof without my logging into a portal.
27. As a DME vendor contact, I want to confirm a pickup window from that same link, so that the family is not left waiting on a phone tag.
28. As a BetterRX product person, I want DME status events to look like medication events beside the same patient id, so that this can sit on the existing eRx ADT pipe.
29. As a BetterRX product person, I want the ordering flow to work when live inventory is unknown, so that day-one value does not wait on a vendor API.
30. As a BetterRX product person, I want stated assumptions about vendor ops visible in the demo, so that judges can see what is fixture versus product.
31. As a family member (indirect), I want the bed gone within a day of death, so that the house is not a medical warehouse while I grieve. (We serve this by making pickup fast and visible to hospice, not by building a family app.)
32. As a judge, I want to click a discharge-ready miss, a death pickup, and a prevented miss on a running app, so that the rubric has evidence.

## Implementation Decisions

- **Hospice-first.** Judging weight is the hospice experience (FAQ §3). Vendor recruitment / network-building is out of scope.
- **Vendor baseline: no login.** Order goes to a fixture vendor. Confirm / decline / POD via SMS or magic-link email. A vendor portal is stretch.
- **Demo vendors are fixtures.** Treat participation as given. Do not build invite-and-activate marketplace flows for the weekend.
- **Personas in the UI:** admissions nurse (default), case manager (same order board + pickup), DON (approvals + timing report). Role switcher is enough; no real auth.
- **Phone-first web app.** No native install. Thumb-sized primary actions. Desktop is a wider version of the same screens, not a different product.
- **Three-factor order cards:** stock (in / out / unknown), ETA, price. Unknown stock still lets the nurse order (FAQ §9 fallback).
- **Guardrails:** preferred equipment + vendor ranked by "beats discharge window, then price, then known stock." Override requires a short reason. DON sees overrides.
- **Open authorization.** No DEA, formulary prior-auth, or insurance gate on DME. Cost threshold is a hospice policy, not a payer rule.
- **Care before paperwork.** ADT patient record is enough to order. Missing forms do not block STAT.
- **Pickup:** nurse "Request pickup" is primary. `newOrUpdatePatient` / death-equivalent EMR event is fallback. Both write the same pickup-triggered state.
- **SLA assumption (state in UI and pitch):** STAT / admission bed or oxygen = same calendar day. Routine = 24 hours. Pickup expected window = 24 hours after trigger. Configurable constants, not a contract.
- **At-risk rule (deterministic):** fire when `eta > deadline` (discharge time for delivery, trigger + pickup SLA for retrieval) **or** when a step has no vendor confirm past a short grace period. Surface the comparison in words. No model required. AI ROI story is "rules beat an LLM here."
- **Lifecycle timestamps** on every transition: Ordered, Vendor confirmed, Dispatched, In transit, Delivered, Pickup requested, Pickup scheduled, Picked up, plus At-risk and Pickup delayed flags.
- **Discharge-readiness:** required items must be Delivered, or DON/nurse override with reason.
- **DME next to meds:** patient view shows fixture meds from `erx-sample-payloads.json` with visible prices, plus DME lines. Prices are labeled synthetic except where we can cite CMS PUF averages.
- **Identity of equipment:** HCPCS E-codes (E0250 bed, E0601 concentrator/CPAP, E1130 wheelchair as in sample orders).
- **Condition photo:** optional on delivery and pickup confirm. Differentiator, not a blocker if time runs out.
- **Who pays (pitch, not billing engine):** hospice PPD bundled with BetterRX pharmacy-tech PPD (FAQ §5). Do not invent a vendor-spread marketplace.
- **Integration sketch (diagram, not live EMR):** BetterRX already receives ADT. Ingest `newOrUpdatePatient` and `newMedications`. Emit DME order/status events keyed by the same `patient.identifiers`. Name HCHB as the primary EMR story (dedicated DME integration layer); mention WellSky's 2024 DME acquisition as the competitive risk.
- **Stack default:** Next.js + TypeScript + Tailwind on Vercel, Supabase (Postgres) if we need a real table, otherwise fixture JSON in-repo for the first clickable slice. Matches Bloom so Craig can steer it. Revisit only if something is clearly faster.
- **Synthetic data only.** Seed from `docs/briefs/sample-orders.json` and `docs/briefs/erx-sample-payloads.json`. No real PHI.
- **Vendor ops assumptions to label in the demo:** ETAs are fixture; stock is fixture or unknown; driver routing is out of scope; SMS is simulated in-app (message inbox panel) unless a free SMS sandbox is already wired.

## Testing Decisions

- Test **observable behavior**, not React internals: order created, status moved, at-risk reason string, pickup from nurse tap vs EMR event, DON approval gate, discharge-ready blocked.
- First seam: a pure function / service for order lifecycle + at-risk rule + pickup trigger. UI tests after that seam is green.
- Good tests use the sample-order literals (DME-10305 misses 4:30 PM with 5:10 PM ETA; DME-09803 pickup delayed four days) as expected values, not recomputed copies of the scoring code.
- No live EMR, SMS, or CMS API in unit tests. Fixtures only.
- Mutate the at-risk condition (flip `eta > deadline` to `>=` or remove it) and confirm DME-10305 goes green-when-it-should-fail before trusting the suite.

## Out of Scope

- Vendor recruitment, onboarding, or marketplace.
- Live EMR, SSO, eRx write-back, or real SMS.
- GPS routing, serialized warehouse inventory, claims 837 submission.
- Family-facing app.
- Native iOS/Android.
- Real patient, hospice, or vendor data.
- Measuring at-risk accuracy against a hidden dataset (does not exist).
- Solving dirty/broken equipment as a required workflow (photo is optional stretch).
- Spreading DME margin as a BetterRX-owned network.

## Further Notes

**Copy BetterRX meds, do not invent a new genre.** Public product: mobile nurse ordering, Guardrails, transparent prices, DON/admin reporting, EMR in, pharmacy out, no faxes. DME should feel like that with E-codes instead of NDCs.

**Original brief vs FAQ.** The brief still calls the vendor side the hardest / differentiating work and asks for cold-start recruitment. The FAQ, written as pre-build survey answers, tells teams to treat the network as given, judge mainly on hospice UX, and use SMS/email as the vendor baseline. Weekend scope follows the FAQ. Production vision in the pitch can still name "how we would grow a vendor network later."

**Demo script (the three required scenarios):**

1. **Discharge-ready.** Admissions nurse orders E0250 + oxygen for a same-day discharge. Card shows stock / ETA / price. ETA misses the window → at-risk explains why → escalate. Override discharge-ready is visible.
2. **Post-death pickup.** Case manager taps Pickup in the home. Clock starts. If she does not, an EMR death event does. Delayed pickup shows hours elapsed and that the family has called (fixture).
3. **Prevent a miss.** At-risk fires before late. DON sees the timing report. Nurse switches vendor or pulls discharge left.

**AI posture for the pitch:** rules for at-risk and ranking. Honest skip. If time allows, a small LLM pass that drafts the "why flagged" sentence from structured fields is worse than a template, so do not. Optional later: diagnosis → suggested equipment list with human confirm (C90.00 in the sample patient is multiple myeloma; still confirm, never auto-order).

**Ground rules that still fail a demo:** Figma-only, hallucinated status, real PHI, AI with no baseline.
