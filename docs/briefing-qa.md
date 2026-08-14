# Friday briefing Q&A notes

Craig's notes from the BetterRX bounty presentation Q&A (AI Builder Day Part 2, Friday). Transcribed as captured, then interpreted against the official brief and FAQ.

Raw notes are the source. Interpretations are labeled. Where notes collide with `docs/briefs/dme-hackathon-bounty-brief.html`, the **FAQ** (`docs/briefs/betterrx-bounty-faq.md`) plus these notes win for weekend scope.

## Raw notes

> Design for least technical users
> Philosophy of care - guardrails for user to guide correct choices
> Give clinicians visibility into what is happening within the DME
> Use real prices for meds
> Need DME on-time - 3 ordering decision factors (in-stock, when expected to be delivered, price)
> Side issue to keep in mind - betterRX works with pharmacies. Hospice gets the blame for DME not showing up on time/dirty - How to help the hospice make the right choice and hold accountability
> There are knowledge gaps for partnership (use their software?) - okay to make assumptions
> 3 key personas
> Admissions Nurse - most likely to be ordering DME. Entered into EMR (electronic medical record) flows into BetterRX system.
> Case Manager - regularly visiting patient, making order when they see progression in diagnosis. IDT Meeting.
> Director of Nursing - oversee staff. Makes approvals for cost thresholds. Manages reporting. Responsible for balance of care and cost.
> DME not as regulated as prescriptions - open authorization
> Want ordering capability within DME system
> DME is not regulated by insurance/government
> Primary device is phone, sometimes tablets, or laptops. Hospice is nurse working out of her care - no inventory in an office. Current software is web-based
> Track/report timing for steps (i.e. how long to pickup)
> Most hospice EMR homeware/homebase, well sky, etc Epic is more hospital focused.
> ADT message can assume has been received. Paperwork does not always land before the patient. Care matters more than the paperwork.

## Structured takeaways

### Design posture

- **Least-technical users.** Phone-first, large tap targets, short copy, no DME jargon. BetterRX's own meds product is "100% mobile, works on every smartphone, no app required" ([betterrx.com/technology](https://www.betterrx.com/technology)). Copy that bar.
- **Philosophy of care / guardrails.** Do not dump a catalog and hope. Guide the nurse to the clinically appropriate, cost-aware choice the way BetterRX Guardrails do for meds (preferred option first, exception with a reason, DON sees overrides).
- **Assumptions are allowed** where partnership / "do we use their software?" is unknown. State them. The FAQ says the same for vendor ops.

### Ordering

- Ordering lives **in this DME surface**, not only as a tracker of orders placed by fax.
- Three decision factors, in this order of "will it be there when we need it":
  1. **In stock** (or unknown, with a fallback — FAQ: live inventory API is unlikely; design the option)
  2. **When expected to be delivered**
  3. **Price**
- **Real prices for meds** on the same patient view so DME spend sits next to pharmacy spend (brief: total cost-of-care; BetterRX already sells transparent pass-through med pricing).
- DME is **open authorization** (not eRx / DEA / payer prior-auth). That is why a nurse can place the order from the car. Do not copy pharmacy compliance chrome onto DME.

### Personas (hospice)

| Persona | When they order | What they need from the demo |
|---|---|---|
| **Admissions nurse** | Most likely to order DME. Patient entered in EMR, ADT flows into BetterRX. | Fast phone order at admission. STAT bed + oxygen. Discharge window visible. |
| **Case manager** | Regular visits. Orders when diagnosis progresses. IDT meeting. | Visibility of what is already in the home. Add equipment without a new phone tree. |
| **Director of nursing** | Rarely places the order. Approves cost thresholds. Reporting. Balance of care and cost. | Approval queue, override reasons, step-timing report, DME next to meds. |

Vendor dispatcher is **not** a primary persona for judging (FAQ §3). Bonus: SMS / email confirm, optional photo of condition.

### Accountability and blame

Hospice gets blamed when DME is late or dirty even though BetterRX's current partners are pharmacies, not DME vendors. Help the hospice:

- **Make the right vendor / item choice** up front (stock, ETA, price, condition history if we have fixture data)
- **Hold a timestamped trail** of each step (ordered → vendor confirmed → dispatched → delivered → pickup requested → picked up) so "how long to pickup" is a number, not a he-said

Condition / cleanliness is a **differentiator, not required** (FAQ §9). A photo or checklist on delivery / pickup is the smallest version.

### Devices and setting

- Primary device: **phone**. Tablets and laptops exist. No office inventory closet. Nurse is in the car / at the bedside.
- Current BetterRX software is **web-based**. Do not require a native app install for the demo.

### Integration facts from the room

- Hospice EMRs: Homecare Homebase (HCHB), WellSky, and the rest of the brief's four (Axxess, MatrixCare). **Epic is hospital-focused**, not the hospice default.
- **ADT can be assumed received.** BetterRX already gets admission / discharge / death into eRx (FAQ §4). Paperwork often lags the patient. **Care before paperwork** — do not block a STAT bed on a missing form.
- Pickup: notes plus FAQ §8 — **nurse in the home is primary**; EMR death event is fallback.

### SLA assumption to state in the pitch

Urgent / admission (bed, oxygen): **same day**. Routine: **within 24 hours**. Configurable. Not a BetterRX contract term (FAQ §7).
