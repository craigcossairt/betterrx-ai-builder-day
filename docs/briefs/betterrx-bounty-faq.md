# Bounty Team FAQ — Pre-Build Responses

Source: BetterRX DME Builders Day FAQ (Word doc from the bounty Drive). Converted to Markdown so agents can read it. Official HTML briefs stay in this folder; this file is the survey-answer overlay.

Questions are grouped by topic. Several teams asked the same things.

## 1. DME vendor access and prior research

**Asked:** Is there a specific DME vendor who could speak to their side of this workflow? Were any DME vendors interviewed? Is there a DME dispatcher we could talk to during the build?

No DME vendor or dispatcher is available to speak with teams, before or during the hackathon. The original discovery study interviewed seven hospice executives. No vendor-side interviews were conducted.

BetterRX has had exploratory conversations with DME-adjacent platforms (competitors and potential partners). That gives visibility into vendor economics, incentive structures, and how those platforms position against players like StateServ and Dragonfly. It does **not** give first-hand insight into a single vendor's day-to-day operations (dispatch, driver logistics, condition/QA at delivery).

Treat vendor operational reality as an **assumption to state clearly**, not something BetterRX can validate this week.

## 2. DME vendor network status

**Asked:** Does BetterRX actually have zero DME vendor relationships, or have they just not said who they are talking to?

BetterRX has **no owned DME vendor relationships today**. Exploratory conversations with adjacent platforms were for competitive and partnership intelligence. No direct vendor partnership exists yet.

## 3. Vendor cold-start, design philosophy, and judging weight

**Asked:** Treat vendor recruitment as a first-class product, or is a believable hospice-side board enough if vendor participation is simulated? Design for vendors who adopt a portal, or vendors who never log in? How much judging weight sits on vendor recruitment/onboarding vs the hospice-side experience?

The hard part on the vendor side is **building the network** (recruiting and activating vendors), not designing a good interface for them. Network-building is **out of scope for a weekend hackathon**. Treat vendor participation as an assumed, given condition rather than something to solve.

Design for a vendor who **may never log into anything** and only ever responds via a confirmation email or text (SMS / magic-link) as the **baseline**. Portal adoption is a reasonable stretch goal, not a requirement.

Judging weight sits **primarily on the hospice-side experience**, because that is where BetterRX has real discovery data to evaluate against. The vendor side earns **bonus credit** for either:

- (a) a lightweight, no-login-required vendor UX, or
- (b) a well-reasoned case for why no vendor UI is needed at all (for example, status inferred from delivery / EMR events rather than vendor input).

Both paths are legitimate. Teams are not scored down for choosing "no UI."

This FAQ answer **overrides** the original brief's "vendor side is the differentiator / recruit vendors from a cold start" emphasis for weekend scope. The brief is still useful for what a production product would need. See `docs/primary-bounty.md` and `docs/decision-log.md`.

## 4. eRx integration and data availability

**Asked:** Does BetterRX's eRx integration already receive patient status events from the EMR (admission, discharge, death)?

Yes. Teams can treat this as existing infrastructure. A DME workflow can key off the same admission / discharge / death signals that already drive medication workflows.

**Asked:** Does BetterRX hold any real delivery timestamp history in production, including from medication delivery?

No for DME. BetterRX does not currently receive or store delivery status data for DME. They do in limited cases for medications where the pharmacy-side integration is available. DME delivery status is a **new capability to build**, not something in production now. Medication-side structured event capture is the pattern to extend.

**Asked:** Is there a sample schema of a BetterRX eRx patient / medication record?

Yes. Representative JSON payloads (BetterRX's actual eRx data model, test values) live in [`erx-sample-payloads.json`](erx-sample-payloads.json):

- `newOrUpdatePatient` — patient / demographics event
- `newMedications` — medication event (NDC, SIG, prescriber NPI)

Use these as the basis for how a DME-alongside-medication integration would read and write patient context.

## 5. Vendor economics — who pays

**Asked:** Who pays for this — the hospice, the vendor, or BetterRX on a spread? Where did BetterRX land?

The hospice pays a **per-patient-day (PPD) fee**, which can be bundled with the existing pharmacy-tech PPD BetterRX already charges today.

## 6. Risk scoring and available data

**Asked:** Will any anonymized vendor-performance or delivery-timing data be available Friday, or is it synthetic-only?

No proprietary or anonymized delivery-timing data will be available. It does not exist in a shareable form today.

Public baseline: [CMS DMEPOS Public Use Files](https://data.cms.gov) provide Medicare claims-based utilization and payment data by referring provider, supplier, and equipment category (wheelchairs, oxygen, hospital beds, and so on), dating back to 2013. That is a legitimate public baseline for typical utilization and cost patterns. It does **not** include delivery timing or fulfillment data. CMS claims reflect billing, not logistics. Timeliness / reliability scoring must rest on **synthetic data or clearly stated assumptions**.

**Asked:** For the AI ROI criterion, will risk scoring be judged on approach and honesty about the baseline, or on measured accuracy against a dataset?

**Approach and honesty about the baseline.** There is no held-out dataset. Manufactured precision will not score well. Prefer a well-reasoned model built on CMS utilization data and clearly labeled assumptions.

## 7. Delivery windows and service-level definitions

**Asked:** Is there a defined delivery window per order type, or is it whatever "as soon as practicable" means that day?

There is no formally defined delivery-window standard today. BetterRX does not hold DME vendor contracts, so this has not been codified.

Industry practice is a reasonable starting assumption:

- **Same-day** for urgent / STAT items (hospital bed or oxygen at admission)
- **Within 24 hours** for routine items

Design against a **same-day-of-admission standard for urgent equipment**, with a defined (even if configurable) SLA for routine orders. **State that assumption explicitly.**

## 8. Pickup trigger

**Asked:** Is an EMR status change actually fast enough, or does the trigger belong in the nurse's hand while she is still in the home?

A **direct trigger from the nurse in the field** at the time of death or discharge is the **preferred design**, rather than relying solely on EMR status propagation.

BetterRX has seen the EMR-only path fail: discovery interviews surfaced a case where a patient's death did not reach the DME vendor's system in time for pickup.

Support **both paths**:

- Nurse-initiated as the **primary, faster** signal
- EMR-based status as a **redundant fallback**

## 9. Equipment condition and vendor verification

**Asked:** Is there a vendor interaction to verify quality, preparedness, and condition of DME delivered? It was stated as a core problem but then seemed backgrounded.

Equipment condition and cleanliness is a **real, recurring pain point** (broken wheelchairs; in one case a chair with visible contamination). It is **not currently scoped as a required feature** in the brief. Teams are not obligated to solve it.

A thoughtful quality / condition verification step (pre-delivery attestation, post-delivery confirmation, or a lightweight photo / checklist flow) would be viewed as a **strong differentiator** given how strongly this pain shows up in the interviews.

**Asked:** Is there anticipated to be a live inventory API for the vendor system so the hospice can verify stock before selecting that org?

Unlikely in practice, given no live DME vendor network today. Design for the **option**: architect the ordering flow so a real-time inventory check could be added later, with a **graceful fallback** to a price / service-based experience when live inventory is not available. Forward-compatible design is the kind of thinking they value in judging.

## 10. Post-hackathon path

**Asked:** What happens to the winning idea after Saturday?

BetterRX will review winning submissions for production quality and intends to use the work (in part or in whole) as a foundation for a future DME product. This is a genuine opportunity for hackathon work to influence their roadmap, not only an exercise.
