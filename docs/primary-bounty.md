# Primary bounty lock

This repo exists to compete for the **BetterRX DME Ordering and Visibility** bounty ($10,000) at AI Builder Day Part 2.

GOED lives in [startup-state-2](https://github.com/craigcossairt/startup-state-2). All-track notes live in [ai-builder-day-part-2](https://github.com/craigcossairt/ai-builder-day-part-2). Do not merge those products into this app.

## Decision

**Primary bounty: BetterRX ($10,000).**

Hospice-first DME ordering and shared status. Phone nurse. Three-factor choice (stock, ETA, price). Guardrails. At-risk **before** late, in plain words. Nurse-in-the-home pickup, EMR as backup. Vendor confirms by SMS/email. No network-building this weekend.

Craig is a healthcare PM (PillPack, Infor), not a hospice or DME operator. Treat vendor-side ops as labeled assumptions, not lived experience. BetterRX interviewed seven hospice executives and no DME dispatchers (`docs/briefs/betterrx-bounty-faq.md`).

## Weekend-sized slice

The smallest path a judge can click against the rubric. Full spec: `docs/prd.md`. FAQ overlay: `docs/briefs/betterrx-bounty-faq.md`. Room notes: `docs/briefing-qa.md`.

1. **Phone order with three facts.** Admissions nurse (default) or case manager picks equipment. Each option shows stock (or unknown), expected delivery, and price. Preferred option first. Open authorization: paperwork does not block STAT.
2. **Shared status the hospice can see.** Lifecycle: Ordered → Vendor confirmed → Dispatched → In Transit / At Risk → Delivered → Pickup Triggered → Pickup Delayed. Vendor participation is a fixture; confirm via simulated SMS / magic-link, not a required portal.
3. **Discharge-readiness.** Hospice cannot mark a patient ready to go home until required equipment is Delivered (or they override with a reason).
4. **Post-death pickup.** Nurse in the field taps Pickup as the primary path. EMR/ADT death is the fallback. No extra phone call as the happy path.
5. **One explainable at-risk rule.** Fire *before* late. First rule: ETA vs discharge window, or pickup window after death. Surface "why flagged" in plain words. Escalate to a person. Step timestamps so the DON can see hours-to-pickup.
6. **DON cost gate, DME-next-to-meds, and DME PPD.** Threshold approval. Fixture med prices beside DME lines. Census DME PPD vs a labeled target, with drivers (idle pickup days, buffer days, preferred-option overrides). This screen answers Todd's buyer question: how do you decrease my DME PPD?

The slice is a **running app**. Mockups and visual prototypes fail the brief and were restated in the room.

**Stretch after the three DME scenarios click:** medical **supplies** on the same patient (third vendor today, beside pharmacy and DME). Same cards and status. No pickup. Pitch: one-stop shop. Do not start here.

Out of this slice: vendor marketplace / recruitment, GPS routing, serialized warehouse inventory, claims submission, live EMR, live SMS, SSO, native apps, family app, condition QA as a required flow (optional photo is stretch), supplies as a second app.

The original brief called vendor-side recruitment the differentiator. The **FAQ supersedes that for weekend scope**: network-building is out of scope; judging weight is hospice-side; no-login vendor UX is bonus, not table stakes.

## Demo scenarios (from the brief)

1. Discharge-ready: bed + oxygen must land before the patient goes home. At-risk fires when ETA misses the window.
2. Post-death pickup: nurse tap (then EMR fallback) triggers pickup. Delayed pickup is visible, with elapsed time.
3. Prevent a miss: an at-risk flag escalates before the family or the discharge nurse finds out the hard way. DON PPD vs target is on screen for the buyer question.

## AI posture

Rules first. The at-risk signal is a deterministic rule (ETA vs deadline). Ranking for guardrails is the same: beats window, then price, then known stock. Use AI only if it beats that baseline out loud. Statuses and patient facts stay grounded. High-stakes actions stay human-confirmed. "Rules are better here" is the planned answer for AI ROI.

## Scoring reminder

| Criteria | Weight |
|---|---|
| Differentiation from current DME (phone / fax / portals) | 30% |
| Real user problems (discharge, pickup, visibility) | 25% |
| Architecture / integration sketch | 15% |
| AI ROI (or honest skip) | 15% |
| UX | 15% |

A working hospice phone order that a nurse can tap, whose status actually moves, beats a prettier prototype. Supplies on that same patient is extra credit, not a substitute for the bed arriving.
