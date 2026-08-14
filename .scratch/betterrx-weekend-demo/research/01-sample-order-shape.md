# Sample order transaction shape

**Date (machine-local):** 2026-08-14
**Question:** What transaction shape do the six synthetic sample orders imply?
**Source:** `docs/briefs/dme-sample-orders.html` (official bounty fixture). The page itself says the set is AI-generated, fictional, and not statistically representative.

Certainty: level 2 (pointed at the HTML). Not a live app.

## Shared fields (every card)

| Field | Examples | Notes |
|---|---|---|
| Order id | DME-10231, DME-10198 | `DME-` + five digits |
| Lifecycle status | Ordered; Dispatched; In Transit, At Risk; Delivered; Pickup Triggered; Pickup Delayed | Matches the brief's six states. At-risk is shown as a modifier on In Transit, not a seventh status. |
| Patient | PT-88421 (synthetic) | Id only. No name, address, or clinical facts on the card. |
| Hospice | Sample Hospice A / B / C | Three fixture hospices. |
| Equipment | E0250 Hospital Bed; E1130 Wheelchair; E0601 CPAP / Oxygen Concentrator | HCPCS E-code + short name. Pickup Triggered lists two items on one order. |
| Free-text note | "Discharge scheduled for tomorrow afternoon. No vendor assigned yet." | Always present. Risk reasons live here in prose, not as a separate structured field on the card. |

## Fields that appear by status

| Status | Extra fields | What the note adds |
|---|---|---|
| Ordered | Order type (Admission), Ordered at, Target date ("Aug 4, before 2:00 PM") | Discharge window. **No vendor yet.** |
| Dispatched | Order type (Routine), Vendor, ETA | Route assignment ("route 4"). No urgency flag. |
| In Transit, At Risk | Order type (STAT), Vendor, ETA | **Risk flag:** discharge 4:30 PM, ETA 5:10 PM, miss by ~40 minutes. |
| Delivered | Order type (Admission), Vendor, Delivered at | Proof of delivery: signature and timestamp on file. No photo mentioned. |
| Pickup Triggered | Trigger = Patient status change (deceased), Vendor, Triggered at | Pickup request sent automatically from EMR status change. Awaiting vendor scheduling. Two equipment lines. |
| Pickup Delayed | Trigger = Patient status change (deceased), Vendor, Triggered at ("4 days ago") | **Risk flag:** no scheduled retrieval. Family called the hospice twice. |

## What the at-risk examples actually are

Both risk cards are clean thresholds, not multivariate scores:

1. **Delivery miss:** ETA is after the discharge window (40 minutes).
2. **Pickup miss:** days since trigger with no scheduled retrieval (4 days), plus family callbacks as a consequence, not as the input.

The Ordered card already has the ingredients for the delivery rule (target date, later an ETA) before a vendor exists.

## What this is not

- No addresses, GPS, serialized asset ids, inventory counts, prices, or medication lines.
- No SLA contract object. No billing trigger field. No proof-of-delivery photo.
- E0601 is labeled "CPAP / Oxygen Concentrator" on one card, which collapses two different items. Treat that as fixture sloppiness, not a domain rule.
- CMS PUFs are pointed at for distributions; these six rows are the transaction shape.

## What this unblocks

- The weekend order record can be this card plus timestamps. Do not invent a warehouse schema.
- The first at-risk rule can be ETA vs target/discharge window, with the why copied from the sample note pattern.
- Pickup delayed can be elapsed time since trigger with no scheduled retrieval.
- Multi-item orders are in-scope (one patient, two HCPCS lines).
- Vendor is nullable until Dispatched. Ordered is the cold-start row.
