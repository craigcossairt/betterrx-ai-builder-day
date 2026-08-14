# Primary bounty lock

This repo exists to compete for the **BetterRX DME Ordering and Visibility** bounty ($10,000) at AI Builder Day Part 2.

GOED lives in [startup-state-2](https://github.com/craigcossairt/startup-state-2). All-track notes live in [ai-builder-day-part-2](https://github.com/craigcossairt/ai-builder-day-part-2). Do not merge those products into this app.

## Decision

**Primary bounty: BetterRX ($10,000).**

Two-sided hospice / DME coordination. Shared live status. At-risk **before** late. Explainable flag. Day-one value without an existing vendor network.

Craig is a healthcare PM (PillPack, Infor), not a hospice or DME operator. Treat vendor-side ops as research, not lived experience.

## Weekend-sized slice

The smallest path a judge can click against the rubric:

1. **Shared order board.** Hospice and vendor see the same order, same status, same timestamps. Lifecycle: Ordered → Dispatched → In Transit / At Risk → Delivered → Pickup Triggered → Pickup Delayed.
2. **Discharge-readiness.** Hospice cannot mark a patient ready to go home until required equipment is Delivered (or they override with a reason).
3. **Post-death pickup trigger.** Patient status change (death) automatically flags equipment for retrieval. No extra phone call as the happy path.
4. **One explainable at-risk rule.** Fire *before* late. First rule: ETA vs discharge window (or pickup window after death). Surface "why flagged" in plain words. Escalate to a person.
5. **Cold-start vendors.** Demo vendors are fixtures, plus a thin invite/onboard path so the story does not assume BetterRX already has a network.

Out of this slice: a real vendor marketplace, GPS routing, serialized warehouse inventory, claims submission, live EMR, SSO, cost-of-care analytics beyond a simple DME-next-to-meds line.

## Demo scenarios (from the brief)

1. Discharge-ready: bed + oxygen must land before the patient goes home. At-risk fires when ETA misses the window.
2. Post-death pickup: death triggers pickup. Delayed pickup is visible to both sides.
3. Prevent a miss: an at-risk flag escalates before the family or the discharge nurse finds out the hard way.

## AI posture

Rules first. The at-risk signal starts as a deterministic rule (ETA vs deadline, plus vendor on-time history if we have fixture numbers). Use AI only if it beats that baseline out loud. Statuses and patient facts stay grounded. High-stakes actions stay human-confirmed. "Rules are better here" is a valid answer.

## Scoring reminder

| Criteria | Weight |
|---|---|
| Differentiation from current DME (phone / fax / portals) | 30% |
| Real user problems (discharge, pickup, visibility) | 25% |
| Architecture / integration sketch | 15% |
| AI ROI (or honest skip) | 15% |
| UX | 15% |

A working two-sided board beats a prettier hospice-only portal.
