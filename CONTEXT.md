# BetterRX AI Builder Day

Language for the BetterRX DME Ordering and Visibility bounty. A hospice nurse orders DME from her phone and sees the same status the vendor just confirmed. Quality bar: an admissions nurse, case manager, or DON has a better day. Figma, Framer, and other visual prototypes do not count.

## Language

**Order**:
One request for equipment for one patient. Identified with HCPCS E-codes. Lives through Ordered → Vendor confirmed → Dispatched → In Transit / At Risk → Delivered → Pickup Triggered → Pickup Delayed.
_Avoid_: ticket, shipment as the primary noun, collapsing several patients into one row

**Shared status**:
The hospice sees the Order, status, and timestamps. The vendor confirms from SMS or email without an account. A two-sided portal is stretch, not the noun.
_Avoid_: vendor portal the hospice cannot see, treating a dispatcher dashboard as the weekend product

**Three-factor choice**:
Stock (or unknown), expected delivery, price. The three facts on an order card. Preferred option first.
_Avoid_: catalog dump, price-only shopping, blocking the order when stock is unknown

**Guardrail**:
Steer the least-technical user to the clinically appropriate, on-time, cost-aware choice. Override with a reason. DON sees the pattern.
_Avoid_: blocking care, empty "AI recommends" with no rule

**Discharge-readiness**:
A hospice flag that required equipment is in the home before the patient leaves the facility. Equipment-before-discharge.
_Avoid_: clinical readiness, meds-ready, treating delivery as optional

**Pickup trigger**:
Nurse in the home taps Pickup at death or discharge. EMR/ADT status is the fallback, not the happy path.
_Avoid_: phone call as happy path, EMR-only retrieval after BetterRX already said that path fails

**At-risk**:
A signal that fires *before* an Order is late. First rule: ETA vs discharge window, or pickup window after death. Must say why it fired.
_Avoid_: red after it already missed, black-box score, "AI flagged it"

**Vendor confirm**:
Fixture vendor replies by SMS or magic-link. Network recruitment is out of scope. BetterRX has no DME network today; the demo still does not spend the weekend building one.
_Avoid_: assuming a live inventory API, building a marketplace, requiring vendor login

**Proof of delivery**:
Signature, photo, timestamp that an item landed (or left). Billing and family notification hang off this, not a verbal "we dropped it."
_Avoid_: status typed by hand with no capture

**Open authorization**:
DME is not eRx. No DEA, payer prior-auth, or insurance gate. A nurse can order from the car. Paperwork does not block STAT.
_Avoid_: copying pharmacy compliance chrome onto DME, blocking care on missing forms when ADT already landed

**Integration sketch**:
A diagram, not a live pipe. BetterRX eRx already receives ADT. Payloads in `docs/briefs/erx-sample-payloads.json`. Plus one of HCHB, Axxess, WellSky, MatrixCare. Equipment uses HCPCS E-codes. Epic is hospital-focused, not the hospice default. DME has no pharmacy-style e-prescribing standard.
_Avoid_: claiming a live EMR, inventing a DME eRx protocol, leading with Epic

**Working app**:
A running application whose order state moves because code ran. Judges click it.
_Avoid_: Figma, Framer, static HTML, click-dummy slides, "visual prototype"

**PPD**:
Two meanings. **Cost PPD** is average med or DME spend per patient per day (Todd; the buyer question). **Tech PPD** is BetterRX's fee (FAQ §5). The demo shows cost PPD. Pickup stops the DME daily clock. Guardrails steer the cheaper equivalent. Do not invent a savings dollar.
_Avoid_: answering "decrease my DME PPD" with the SaaS fee, cutting the bed to make the number pretty, mixing the two PPDs

**Pharmacy / DME / supplies**:
Three vendor contracts at a hospice today. BetterRX already is pharmacy. This bounty is DME. Supplies (consumables, third vendor) is stretch on the same board after DME works. Consumables are not picked up after death.
_Avoid_: rebuilding eRx, starting with supplies, treating gloves as a hospital bed, a second supplies app

**Synthetic order**:
Fixture data only. Use `docs/briefs/dme-sample-orders.html` / `docs/briefs/sample-orders.json` and CMS PUFs for distributions. Never real patients, hospices, or vendors.
_Avoid_: employer data, live PHI, using PUF rows as fake orders
