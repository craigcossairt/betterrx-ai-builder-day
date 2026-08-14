# Hospice DME coordination

Language for the BetterRX DME Ordering and Visibility bounty. A hospice and a DME vendor need the same picture of an order from admission through pickup. Quality bar: a case manager or dispatcher has a better day. Figma does not count.

Glossary only. Product decisions live on the wayfinder map; implementation decisions live in ADRs once they exist.

## People and orgs

**Hospice**:
The care organization that admits the patient and places DME orders. Takes the blame when delivery or pickup fails, even though it does not run the vendor.
_Avoid_: agency (unless quoting an EMR name), client, customer, provider (too vague)

**Vendor**:
The durable medical equipment company that delivers, services, and retrieves equipment.
_Avoid_: supplier, DME company, HME, partner (overloaded with EMR partners)

**Case manager**:
The hospice staff member who owns discharge timing and escalations when an order is at-risk.
_Avoid_: coordinator, social worker (roles we have not modeled)

**Dispatcher**:
The vendor staff member who assigns a route, sets an ETA, and records proof of delivery.
_Avoid_: driver (a later role), warehouse

**Patient**:
The hospice patient who needs the equipment. In this repo, always synthetic.
_Avoid_: member, beneficiary, resident

**Family**:
People at the home who see late delivery or leftover equipment after a death. Not a login in the weekend slice.

## Orders

**Order**:
One request for equipment for one patient. Identified with HCPCS E-codes. Lives through Ordered → Dispatched → In Transit / At Risk → Delivered → Pickup Triggered → Pickup Delayed. Hospice and vendor see the same record, same status, same timestamps.
_Avoid_: ticket, shipment as the primary noun, collapsing several patients into one row

**Shared board**:
The product. Hospice and vendor look at the same Order, same status, same timestamps.
_Avoid_: vendor portal the hospice cannot see, hospice tracker the vendor never opens

**Equipment**:
The durable item on an order, identified by an HCPCS E-code plus a short name. One order may list more than one item.
_Avoid_: SKU, asset (serialized inventory is out of scope), product

**HCPCS E-code**:
A CMS HCPCS Level II code that identifies a piece of DME (for example E0250 hospital bed, E0601 CPAP / oxygen concentrator).
_Avoid_: NDC (that's drugs), CPT, SKU

**Order type**:
How urgent the order is, as used in the sample records: Admission, Routine, or STAT.
_Avoid_: priority (too generic), STAT as a status (it is a type, not a lifecycle status)

**Proof of delivery**:
Signature, photo, timestamp that an item landed (or left). Billing and family notification hang off this, not a verbal "we dropped it."
_Avoid_: status typed by hand with no capture

## Timing and risk

**Discharge-readiness**:
A hospice flag that required equipment is in the home before the patient leaves the facility. Equipment-before-discharge. Hospice cannot mark ready until those orders are Delivered, unless someone overrides with a reason.
_Avoid_: clinical readiness, meds-ready, treating delivery as optional

**Pickup trigger**:
Patient status change (death, or leaving hospice) automatically flags equipment for retrieval. The happy path is not a phone call.
_Avoid_: manual-only retrieval, waiting for the family to ask

**At-risk**:
A signal that fires before an Order is late. First rule: ETA vs discharge window, or pickup window after death. Must say why it fired.
_Avoid_: red after it already missed, black-box score, "AI flagged it"

**Escalation**:
Handing an at-risk order to a named person (case manager or vendor dispatcher) when a threshold is crossed.
_Avoid_: alert, notification (those are how you hear; escalation is who owns it next)

**Vendor cold-start**:
BetterRX has no DME network today. Demo vendors are fixtures. The product still needs a path to invite and activate a vendor. Day-one value cannot require vendors already plugged in.
_Avoid_: assuming a national network, building a marketplace first

## Demo and integration

**Integration sketch**:
A diagram, not a live pipe. BetterRX eRx plus one of HCHB, Axxess, WellSky, MatrixCare. Equipment uses HCPCS E-codes. DME has no pharmacy-style e-prescribing standard.
_Avoid_: claiming a live EMR, inventing a DME eRx protocol

**Synthetic order**:
Fixture data only. Use `docs/briefs/dme-sample-orders.html` and CMS PUFs for distributions. Never real patients, hospices, or vendors.
_Avoid_: employer data, live PHI, using PUF rows as fake orders
