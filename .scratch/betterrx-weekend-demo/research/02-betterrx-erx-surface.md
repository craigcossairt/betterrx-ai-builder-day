# BetterRX public eRx / pharmacy surface (hackathon integration sketch)

**Date:** 2026-08-14 (machine local)  
**Question:** What public BetterRX eRx / pharmacy product surface can a hackathon demo credibly sketch an integration against?  
**Scope:** Primary sources only (BetterRX's own site, official partner pages). Not a product spec. No implementation.  
**Certainty:** Claims below are graded as *pointed at the owning URL* unless marked otherwise. Absence of a public API is negative evidence from search, not proof that a private partner API does not exist.

**Not used as a BetterRX product spec:** the bounty Integration tab (`docs/briefs/dme-hackathon-bounty-brief.html`) asks teams to sketch a *data-sharing* hop into BetterRX eRx and one EMR. That is a judging requirement, not a description of BetterRX's pharmacy platform. This note answers what BetterRX actually advertises.

---

## Bottom line

A demo can credibly sketch **a partner-connection data share** against BetterRX's hospice pharmacy stack: **Connected RX / BetterRX Connect** (ordering, approvals, tracking, billing types) plus **Better ePrescribe** (DEA/EPCS hospice eRx), sitting next to an EMR the way MatrixCare and Axxess already document, and next to pharmacies the way **Order Hub** already documents. It cannot credibly claim a **public BetterRX API**, a **Surescripts/NCPDP SCRIPT** DME order path, or a field-level WellSky or HCHB interface spec published by BetterRX.

The richest public data shapes to copy in a sketch are:

1. **Axxess → BetterRX "secure interface" events** (patient, medication, CMS claim fields).  
2. **MatrixCare ↔ BetterRX bi-directional med workflow** (demographics, allergies, diagnoses, create/discontinue orders, fulfillment status).  
3. **Order Hub** (pharmacy preview/accept + real-time status back to hospice).

DME-next-to-meds should sit **beside** that hop as a second order object on the same patient key, not inside e-prescribing.

---

## 1. Facts: product surfaces BetterRX advertises

### 1.1 Hospice pharmacy platform (one care-team system)

- BetterRX positions itself as a **real-time hospice pharmacy solution**: technology + local pharmacy network + people, not a traditional PBM. Source: [https://betterrx.com/](https://betterrx.com/)
- Homepage value prop: "One platform for ordering, approvals, prescribing, and reporting. No toggling between portals." Source: [https://betterrx.com/](https://betterrx.com/)
- Technology page: "BetterRX connects nurses, prescribers, and pharmacies through one seamless platform." Source: [https://www.betterrx.com/technology](https://www.betterrx.com/technology)
- Workflow advertised to nurses: mobile medication ordering, dosage adjust at bedside, track status start to finish. Source: [https://www.betterrx.com/technology](https://www.betterrx.com/technology)
- Workflow advertised to clinical directors: approve/edit/review orders, update formulary, automated status notifications. Source: [https://www.betterrx.com/technology](https://www.betterrx.com/technology) and [https://www.betterrx.com/technology/clinical-directors](https://www.betterrx.com/technology/clinical-directors)
- Workflow advertised to administrators: quality/compliance, documentation, 20+ real-time reports, PPD tracking, ordering guardrails. Source: [https://www.betterrx.com/technology/administrators](https://www.betterrx.com/technology/administrators)
- Mobile claim: "100% Mobile. Works on every smartphone, no app required." Source: [https://www.betterrx.com/technology](https://www.betterrx.com/technology)
- Other named capabilities on the same page: unlimited users, easy refill management, real-time medication history, live reporting, interaction warnings, no faxes/phone calls, customizable formularies, "Certified Solution. DEA-approved in all 50 states." Source: [https://www.betterrx.com/technology](https://www.betterrx.com/technology)
- Clinical-directors page repeats "DEA-certified and approved" plus real-time medication history. Source: [https://www.betterrx.com/technology/clinical-directors](https://www.betterrx.com/technology/clinical-directors)

### 1.2 Named software brands

| Name | What BetterRX says it is | Source |
|---|---|---|
| **BetterRX Connect** / **Connected RX (CRX)** | Software that "connects your EMR, your prescribers, and any pharmacy you want to use"; also the reporting/billing platform | [https://www.betterrx.com/careficient](https://www.betterrx.com/careficient), [https://www.betterrx.com/en/blog/billing-types-crx](https://www.betterrx.com/en/blog/billing-types-crx) |
| **Better ePrescribe** | Hospice-specific ePrescribe, contrasted with "3rd party generic ePrescribe" | [https://www.betterrx.com/matrixcare-integration-partner](https://www.betterrx.com/matrixcare-integration-partner), MatrixCare LP below |
| **Order Hub™** | Pharmacy-facing order preview/accept + real-time tracking for hospice and LTC clients | [https://www.betterrx.com/reliable-pharmacy-fulfillment](https://www.betterrx.com/reliable-pharmacy-fulfillment) |
| **BetterRX Guardrails™ / Guardrail Manager™** | Configurable point-of-order decision support (interchange, delivery consolidation, STAT/after-hours limits) | [https://www.betterrx.com/guardrail-manager](https://www.betterrx.com/guardrail-manager) |

CRX billing types: hospice-covered vs non-hospice-covered meds; pharmacies notified to bill private payors for non-hospice-covered drugs; reports formatted so Medicare hospice-covered claims are separated from non-covered. Source: [https://www.betterrx.com/en/blog/billing-types-crx](https://www.betterrx.com/en/blog/billing-types-crx)

Better ePrescribe claims (BetterRX blog, not an API spec): EPCS / electronic DEA registration, dose and drug interaction alerts, audit trails, real-time order status (received / processed / delivered), open pharmacy network, PRN and standing meds, comfort-kit style hospice workflows, prior authorization embedded in prescribing. Sources: [https://www.betterrx.com/en/blog/what-to-look-for-in-hospice-eprescribe-software](https://www.betterrx.com/en/blog/what-to-look-for-in-hospice-eprescribe-software), [https://www.betterrx.com/en/blog/is-your-eprescribe-software-costing-you-time](https://www.betterrx.com/en/blog/is-your-eprescribe-software-costing-you-time)

### 1.3 Pharmacy / fulfillment surface

- Nationwide hospice fulfillment: after-hours, STAT, delivery, in-state mail order, 24/7/365 hospice-trained pharmacists. Source: [https://www.betterrx.com/reliable-pharmacy-fulfillment](https://www.betterrx.com/reliable-pharmacy-fulfillment)
- Order Hub pitch to pharmacies: "Preview and accept orders from hospice and LTC clients faster AND keep them up to speed on the status of orders in real-time." Source: same URL
- BetterRX says orders arrive at pharmacies **ready-to-fill**. Source: same URL
- Network size claim on EMR landing pages: "over 90,000 pharmacies in our network nationwide." Source: [https://www.betterrx.com/careficient](https://www.betterrx.com/careficient), [https://www.betterrx.com/optima](https://www.betterrx.com/optima)
- Pharmacy Success Team: pricing negotiation, quality assurance, reimbursement management. Source: [https://www.betterrx.com/reliable-pharmacy-fulfillment](https://www.betterrx.com/reliable-pharmacy-fulfillment)
- Recruiting pharmacies: [https://www.betterrx.com/join-our-pharmacy-network](https://www.betterrx.com/join-our-pharmacy-network)

### 1.4 Operator login (existence only)

- Marketing site header includes a **Sign In** CTA. Source: [https://www.betterrx.com/partners](https://www.betterrx.com/partners) (and other pages using the same header)
- Host `https://login.betterrx.com` returned HTTP 200 on 2026-08-14. Page body was not readable as HTML in this pass (likely a JS app). **Do not infer API endpoints from this.**

### 1.5 Adjacent (non-EMR) data partnership

- May 30, 2024 press release: BetterRX will ingest Hospice Dynamix **Predicted Length of Stay (PLOS)** into medication ordering to recommend quantities instead of a default 30-day supply. Source: [https://www.betterrx.com/en/blog/hospice-dynamix-betterrx-partnership](https://www.betterrx.com/en/blog/hospice-dynamix-betterrx-partnership)
- Same release describes the BetterRX surface in one sentence: "care teams can easily select medications, secure approvals, digitally order directly to pharmacies, and track order statuses." Source: same URL

---

## 2. Facts: patient / order data BetterRX already moves

Public pages do **not** publish schemas, FHIR resources, NCPDP SCRIPT samples, or field dictionaries. They do publish **event types and payloads in prose**. Those are the only data-shape facts a demo can cite.

### 2.1 MatrixCare (BetterRX + MatrixCare official pages)

BetterRX MatrixCare page states:

- One-way **and** bi-directional medication workflows (customer chooses).
- Real-time syncing; clinicians place and track medication orders **without leaving the EMR**.
- Explicit objects/actions:
  - Admit new patients, including pending/referral
  - Sync **demographics, allergies, and diagnoses**
  - **Create and discontinue** medication orders
  - **Track fulfillment** in real time
- "2-way integration with MatrixCare + local pharmacies and prescribers"
- "Built-in ePrescribe made for hospice"
- Ordering reduced to **Select → Approve → Send**

Source: [https://www.betterrx.com/matrixcare-integration-partner](https://www.betterrx.com/matrixcare-integration-partner)

MatrixCare's own landing page (official partner, not BetterRX) lists the same hop with directionality:

1. Automatic syncing of **patient demographics from MatrixCare to BetterRX**
2. Automatic syncing of **patient allergies from MatrixCare to BetterRX**
3. Faster ePrescribe for MatrixCare users
4. Instant **medication ordering status and updates in MatrixCare**
5. Instant **medication removal and changes in MatrixCare**
- "Prescribers can access **Better ePrescribe** from anywhere at any time."
- Page claims an "integration map" diagram (not recoverable as text from the fetch).
- Positions BetterRX as "full PBM services and ePrescribe technology for hospice."

Source: [https://go.matrixcare.com/EM-BT-2020-04-01-ePrescribe-Hospice-Prospects-LP.html](https://go.matrixcare.com/EM-BT-2020-04-01-ePrescribe-Hospice-Prospects-LP.html)

BetterRX case study language: "enter medications that sync flawlessly with MatrixCare"; "e-Prescribe directly within the system—versus utilizing a separate system"; "bi-directional EMR integration with MatrixCare." Source: [https://www.betterrx.com/en/blog/discover-a-hospices-success-with-emr-integration-and-cost-optimization](https://www.betterrx.com/en/blog/discover-a-hospices-success-with-emr-integration-and-cost-optimization)

Brightree (MatrixCare family) page: "BetterRX is Matrixcare/Brightree's PBM partner and preferred ePrescribe solution." Source: [https://www.betterrx.com/brightree](https://www.betterrx.com/brightree)

### 2.2 Axxess (official Axxess help, not BetterRX.com)

Axxess documents a **BetterRX pharmacy integration** that agencies must activate through Axxess. Three pipes:

| Pipe | Triggers / payload (as Axxess names them) |
|---|---|
| **Patient updates** | Patient Admission; Patient Discharge; Patient Death; Patient Demographic Updates; Diagnosis Updates; Allergy Information Updates; Patient Location Updates |
| **Medication updates** | Adding New Medications; Discontinuing Medications; Updating Medications; Refilling Medications; Cancelling Medication Deliveries. Includes "medication dispensing information." |
| **CMS claim information** | Sent at an org-chosen frequency. Populates claim **Service Lines**: Revenue Code, Description, Units, Total Charges |

Axxess calls this a **"secure interface"** (not a public API). Pricing and activation go through Axxess, not a self-serve developer portal.

Source: [https://www.axxess.com/help/axxesshospice/integrations/betterrx/](https://www.axxess.com/help/axxesshospice/integrations/betterrx/)

**Note:** Axxess has a *separate* help article for Hospice Pharmacy Solutions (HPS) medication dispensing UI (dispense date, days supply, quantity, delivery cancellation). That article names HPS, not BetterRX. Do not treat those UI fields as BetterRX-documented. Source of the HPS article: [https://www.axxess.com/help/axxesshospice/software-updates/medication-dispensing-management/](https://www.axxess.com/help/axxesshospice/software-updates/medication-dispensing-management/)

### 2.3 Homecare Homebase (BetterRX-claimed; no field list)

- St. Joseph case study: "BetterRX connected directly with HCHB, eliminating redundant data entry and ensuring instant, error-free order transmission." Pre-BetterRX problem: "Orders from HomeCare HomeBase (HCHB) didn’t flow seamlessly to their PBM." Source: [https://www.betterrx.com/st-joseph-success-story](https://www.betterrx.com/st-joseph-success-story)
- Blog case study: BetterRX "integrate with their current EHR Homecare Homebase, one of the many EHR partners with which we seamlessly integrate." Source: [https://www.betterrx.com/en/blog/transforming-hospice-care-with-efficient-med-ordering](https://www.betterrx.com/en/blog/transforming-hospice-care-with-efficient-med-ordering)
- Partners page displays a Homecare Homebase logo under "EMR Partners." Source: [https://www.betterrx.com/partners](https://www.betterrx.com/partners) (`Homecare-Homebase-Partners-BetterRX.png`)
- Historical dedicated URL `https://www.betterrx.com/emr-new` now **301s to `/partners`**. `https://www.betterrx.com/hchb` **301s to `/hchb-landingpage`, which 404s**. So BetterRX no longer publishes a live HCHB field-level landing page.
- Homecare Homebase's own partner directory (`https://hchb.com/partners/`) did **not** return a BetterRX match in this pass. HCHB **does** advertise a Business Connect **Pharmacy** connector ("Electronically transfers pertinent information to pharmacy") and a separate **Supplies/DME** connector. Source: [https://hchb.com/partners/business-connect/](https://hchb.com/partners/business-connect/)

### 2.4 Generic "good integration" data BetterRX says should sync

From BetterRX's ePrescribe-buying-guide posts (marketing, not a partner spec):

- Prescribing inside the chart; allergies, diagnoses, med lists stay synced; pharmacy updates (received / filled / flagged) return; one shared med list. Source: [https://www.betterrx.com/en/blog/choosing-eprescribe-software-that-works-with-your-ehr](https://www.betterrx.com/en/blog/choosing-eprescribe-software-that-works-with-your-ehr)
- "Patient demographics auto-populate; Medication histories stay synchronized; Documentation flows back into the record." Source: [https://www.betterrx.com/en/blog/is-your-eprescribe-software-costing-you-time](https://www.betterrx.com/en/blog/is-your-eprescribe-software-costing-you-time)
- Status visibility: whether a prescription was received, filled, when it will be delivered. Source: same URL
- Complaint about third-party eRx: nurses sometimes must enter **NDC codes**; orders may never arrive at the pharmacy; no notifications of received/status. Source: [https://www.betterrx.com/en/blog/top-3-problems-with-third-party-eprescribes](https://www.betterrx.com/en/blog/top-3-problems-with-third-party-eprescribes)

Technology page order attributes (not EMR-specific): ready-to-fill order to pharmacy; real-time notifications for **approvals & signatures**; cost alerts; off-formulary approvals; refill without re-entry. Source: [https://www.betterrx.com/technology](https://www.betterrx.com/technology)

### 2.5 Composite data object (facts only, union of named fields)

From the sources above, BetterRX's public surface already talks about moving:

**Patient:** demographics; pending/referral admit; admission; discharge; death; location; allergies; diagnoses.  
**Medication order:** create; update; discontinue/remove; refill; cancel delivery; dosage; PRN/standing; formulary vs off-formulary; hospice-covered vs non-hospice-covered billing type; quantity (Dynamix PLOS).  
**Status:** approval; signature; pharmacy received; processed; filled; fulfillment/delivery tracking.  
**Claims/cost:** revenue code, description, units, total charges on Axxess CMS claims; invoices; PPD; pass-through pharmacy cost.  
**Safety:** interaction warnings; medication history.

No public page names FHIR Patient/MedicationRequest, HL7 ADT/ORM, or NCPDP SCRIPT message types.

---

## 3. Facts: EMR integrations BetterRX advertises

### 3.1 Logo wall on BetterRX Partners (live)

[https://www.betterrx.com/partners](https://www.betterrx.com/partners) heading: "We happily integrate with major EMR/EHR technologies." Identifiable EMR logos on that page (filename/alt):

| Logo as published | Notes |
|---|---|
| MatrixCare | Dedicated landing page with field-level claims |
| Homecare Homebase | Case studies; dedicated page retired |
| Careficient | Dedicated landing page (templated copy; see caveat) |
| KanTime | Logo only; `/kantime` 301s to `/partners` |
| Netsmart Homecare | Logo; BetterRX `/netsmart` 301s to `/partners` |
| Netsmart MyUnity | Logo only |
| WellSky | Logo (`large-WellSky®_Color_RGB`); **no** BetterRX slug, sitemap entry, or field-level page found |
| Optima | Dedicated landing page (same template as Careficient) |

Other logos on the same page are industry/tools (Firenote, Hospice Tools, QAPI+, etc.), not hospice EMRs.

Netsmart marketplace lists **BetterRx** with BetterRX homepage copy ("first hospice pharmacy technology that connects the entire care team"). Source: [https://ntst.com/marketplace](https://ntst.com/marketplace)

WorldView partner catalog lists BetterRX under "Pharmacy Benefits Manager, e-Prescribing" and names **Connected RX** as "ePrescribe and medication tracking software." Source: [https://worldviewltd.com/betterrx](https://worldviewltd.com/betterrx)

### 3.2 Named integrations with prose (not just a logo)

| EMR | BetterRX says | Partner says | Field-level public spec? |
|---|---|---|---|
| **MatrixCare / Brightree** | Yes, 1-way or 2-way med workflow | Yes (MatrixCare LP) | Closest thing: the bullet lists in §2.1 |
| **Axxess** | **Not** in BetterRX sitemap; **not** a named logo alt on `/partners` | Yes, full help article | **Best public event list** (§2.2) |
| **HCHB** | Yes (case studies + logo) | Not found on hchb.com/partners this pass | No |
| **Netsmart** (Homecare / MyUnity) | Logo + marketplace listing | Marketplace blurb only | No |
| **Careficient** | "BetterRX is now integrated with Careficient. Patient demographics and medication data flows seamlessly without the need for correction." | Not fetched | Weak: body copy still talks about Homecare Homebase (template reuse) |
| **Optima** | Same headline pattern as Careficient | Not fetched | Same template-reuse problem |
| **Net Health** | Case study: "our integration with Net Health allowed them to transition" | Not fetched | No field list. Source: [https://www.betterrx.com/en/blog/q2-23-case-study](https://www.betterrx.com/en/blog/q2-23-case-study) |
| **WellSky** | Logo on partners page | No wellsky.com hit for BetterRX this pass | No |
| **KanTime** | Logo | Not fetched | No |

**Careficient/Optima caveat (fact):** both pages title the named EMR, then reuse HCHB paragraphs ("By fully integrating with both Homecare Homebase and local pharmacies..."). Sources: [https://www.betterrx.com/careficient](https://www.betterrx.com/careficient), [https://www.betterrx.com/optima](https://www.betterrx.com/optima). Treat the **headline** as an advertised integration; do not treat the HCHB sentences as Optima/Careficient field specs.

### 3.3 Bounty EMR four vs BetterRX public surface

| Bounty EMR | BetterRX public surface |
|---|---|
| HCHB | Advertised (logo + case studies). No live field spec. HCHB Business Connect has parallel Pharmacy and Supplies/DME vendor slots. |
| Axxess | Documented on **Axxess**, not on BetterRX.com. Richest data-shape. Partner-activated "secure interface." |
| WellSky | Logo only. No BetterRX or WellSky page describing what syncs. |
| MatrixCare | Strongest two-sided documentation (BetterRX + MatrixCare). Best analog for "order + status round-trip inside the EMR." |

---

## 4. Facts: is there a public BetterRX API?

**No public developer surface was found.** Negative evidence, collected 2026-08-14:

- `https://www.betterrx.com/api` → 404  
- `https://www.betterrx.com/developers` → 404  
- Sitemap (`https://www.betterrx.com/sitemap.xml`) has no developer, swagger, FHIR, or API doc URLs  
- `robots.txt` does not point at an API  
- Partner copy uses "secure interface," "digitally integrated with EMRs & local pharmacies," "bi-directional EMR integration," never "REST API," "FHIR," "HL7," or "developer portal"  
- Axxess: activate via Axxess sales, not self-serve keys. Source: [https://www.axxess.com/help/axxesshospice/integrations/betterrx/](https://www.axxess.com/help/axxesshospice/integrations/betterrx/)

**This does not prove BetterRX lacks a private partner API.** It does prove a weekend demo cannot cite a public BetterRX contract to code against.

---

## 5. How DME-next-to-meds would sit beside BetterRX eRx

**Bounty ask (judging, not product spec):** sketch a data-sharing integration so DME and medication data sit side by side for a patient; not a shared transaction standard. Source: `docs/briefs/dme-hackathon-bounty-brief.html` Integration tab.

**What BetterRX's own surface implies (facts, then inference):**

Facts:

- BetterRX already sits **beside the EMR** as the pharmacy/eRx layer: patient/clinical context in, medication orders and status out, claims/cost alongside. MatrixCare and Axxess pages above.
- BetterRX already sits **beside pharmacies** as Order Hub: ready-to-fill medication orders in, accept/status out. Source: [https://www.betterrx.com/reliable-pharmacy-fulfillment](https://www.betterrx.com/reliable-pharmacy-fulfillment)
- BetterRX's eRx story is **drug** workflow (formulary, EPCS, NDC complaint about competitors, hospice-covered vs not). Nothing on BetterRX.com describes DME, HCPCS E-codes, or equipment orders.
- HCHB (EMR vendor, not BetterRX) already splits **Pharmacy** and **Supplies/DME** as two Business Connect categories. Source: [https://hchb.com/partners/business-connect/](https://hchb.com/partners/business-connect/)

Inferences (not facts):

- A credible sketch is **the same patient identity BetterRX already syncs**, plus a **second order type** (DME) that reuses status semantics (requested / approved / sent / received / delivered / cancelled) without pretending DME rides NCPDP SCRIPT or Better ePrescribe.
- The Axxess event list is the best public template for "what a patient or order record looks like as it moves": admission/discharge/death/location as shared patient facts; medication events stay on the eRx pipe; DME would be a parallel event family (create / update / discontinue / refill analog / cancel delivery).
- The MatrixCare pattern is the best template for "clinician never leaves the EMR": demographics/allergies in one direction, order status and discontinuations back.
- Order Hub is the best template for the **vendor** side of visibility (preview, accept, status), which is closer to a DME dispatcher than ePrescribe is.
- Do not sketch "call BetterRX's public API." Sketch "partner interface / event share," matching how BetterRX actually connects today.
- WellSky is the weakest BetterRX-cited EMR for a field-level sketch; if the demo needs WellSky, lean on EMR-side DME bundling from other research, not on BetterRX's logo wall.

---

## 6. Inferences a later decision may use (keep separate)

1. **Weekend-safe integration story:** fake a BetterRX-shaped JSON patient + med-order + status feed using Axxess event names and MatrixCare round-trip, then attach DME orders to `patient_id`. That matches judging ("diagram / data shape, no live connection") and BetterRX's real pattern (partner interface, not open API).
2. **Do not build a Surescripts/eRx simulator for DME.** BetterRX's eRx is the meds path; DME has no equivalent on their site.
3. **Prefer MatrixCare or Axxess as the EMR in the sketch.** Those are the only two with partner-authored field lists. HCHB is advertised but unspecified. WellSky is a logo.
4. **Pharmacy-side analog exists (Order Hub).** If the demo has a DME vendor inbox, it can honestly say "this is the DME counterpart to Order Hub," not "this is ePrescribe."
5. **Covered vs non-covered billing types on CRX** are a possible analog for hospice-covered DME vs patient-pay equipment, but BetterRX only documents that split for medications.
6. **PLOS/quantity (Hospice Dynamix)** is evidence BetterRX already accepts **third-party clinical data into ordering** without making that third party an EMR. That is a precedent for a DME service sharing patient-level facts into BetterRX, if BetterRX ever wanted it, but it is a 2024 press-release partnership, not a public API.

---

## 7. Gaps (still unknown from public sources)

- Wire format (JSON, HL7 v2, FHIR, X12, proprietary XML).
- Auth model, environments, rate limits.
- Whether BetterRX or the EMR hosts the interface.
- NDC / SIG / days-supply / DEA schedule fields on the BetterRX order object.
- Whether HCHB Business Connect Pharmacy is the actual pipe BetterRX uses.
- What the WellSky logo on `/partners` corresponds to (myUnity is branded Netsmart on the same page; WellSky may be a different product).
- Whether Order Hub is a distinct product login or a view inside the pharmacy portal.
- Live behavior of `login.betterrx.com`.

---

## What this unlocks

- **Which BetterRX surface to name in the integration diagram:** Connected RX / Better ePrescribe for meds, Order Hub for pharmacy-side status; not a public API.
- **Which EMR to sketch first:** MatrixCare (two-sided, bi-directional) or Axxess (best event list), not WellSky-from-BetterRX-docs.
- **What patient/order fields a synthetic feed can honestly include** without inventing a BetterRX schema.
- **Where DME attaches:** same patient key, parallel order object and status stream; not inside ePrescribe/EPCS.
- **What not to promise judges:** live BetterRX credentials, SCRIPT/NCPDP for equipment, or an undocumented HCHB/WellSky field map.
- **Whether "data-sharing not transaction standard" is consistent with BetterRX's real integrations:** yes; their published hops are partner interfaces and status sync, not an industry DME/eRx standard.
- **Whether a pharmacy-vendor UX is in-scope as an analog:** yes, Order Hub is the public precedent for preview/accept/track.
