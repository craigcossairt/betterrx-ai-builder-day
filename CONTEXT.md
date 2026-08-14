# BetterRX AI Builder Day

Language for the BetterRX DME Ordering and Visibility bounty. A hospice and a DME vendor need the same picture of an order from admission through pickup. Quality bar: a case manager or dispatcher has a better day. Figma does not count.

## Language

**Order**:
One request for equipment for one patient. Identified with HCPCS E-codes. Lives through Ordered → Dispatched → In Transit / At Risk → Delivered → Pickup Triggered → Pickup Delayed.
_Avoid_: ticket, shipment as the primary noun, collapsing several patients into one row

**Shared board**:
The product. Hospice and vendor look at the same Order, same status, same timestamps.
_Avoid_: vendor portal the hospice cannot see, hospice tracker the vendor never opens

**Discharge-readiness**:
A hospice flag that required equipment is in the home before the patient leaves the facility. Equipment-before-discharge.
_Avoid_: clinical readiness, meds-ready, treating delivery as optional

**Pickup trigger**:
Patient status change (death, or leaving hospice) automatically flags equipment for retrieval. The happy path is not a phone call.
_Avoid_: manual-only retrieval, waiting for the family to ask

**At-risk**:
A signal that fires *before* an Order is late. First rule: ETA vs discharge window, or pickup window after death. Must say why it fired.
_Avoid_: red after it already missed, black-box score, "AI flagged it"

**Vendor cold-start**:
BetterRX has no DME network today. Demo vendors are fixtures. The product still needs a path to invite and activate a vendor. Day-one value cannot require vendors already plugged in.
_Avoid_: assuming a national network, building a marketplace first

**Proof of delivery**:
Signature, photo, timestamp that an item landed (or left). Billing and family notification hang off this, not a verbal "we dropped it."
_Avoid_: status typed by hand with no capture

**Integration sketch**:
A diagram, not a live pipe. BetterRX eRx plus one of HCHB, Axxess, WellSky, MatrixCare. Equipment uses HCPCS E-codes. DME has no pharmacy-style e-prescribing standard.
_Avoid_: claiming a live EMR, inventing a DME eRx protocol

**Synthetic order**:
Fixture data only. Use `docs/briefs/dme-sample-orders.html` and CMS PUFs for distributions. Never real patients, hospices, or vendors.
_Avoid_: employer data, live PHI, using PUF rows as fake orders
