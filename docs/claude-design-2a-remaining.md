# Claude Design resume: 2a remaining frames

Paste this into a new Claude Design chat. Do not attach the long original brief. The running app is the clickable reference. This file only names what still needs a visual pass.

Date: 2026-08-15. Direction stays **2a The Tracker, simplified**. Do not redraw 1a, 1b, 1c, 2b, or 2c. Do not redraw the census sentences. Two loud rows only (Margaret at-risk, Ray pickup late). Quiet rows stay one line.

Brand: BetterRX product chrome. Blue 6px primary actions. Coral only on at-risk. No coral-gradient pills. No second brand.

---

## What the running app already has (do not redesign)

These screens exist and judges can tap them. Improve a frame only if it is in the remaining list below.

- Demo chrome outside the white app: persona (Admissions RN, Case Mgr, DON, Vendor) and surface (Phone, Side-by-side, Desktop). EMR death event and Reset live here, not inside the nurse app.
- Census 2a: names first, sentence status, Helen Vargas for PT-87602.
- Search-first new order: patient, then Medication / DME / Supplies, then EMR chips or catalog search. Preferred vs alternate vendor cards.
- Patient picture tabs: Patient, Medication, DME, Supplies.
- Eleanor Patient tab binds FAQ `newOrUpdatePatient` (DOB 1960-01-14, gender M, C90.00, Latex, dummy FAQ address `testStreet1`). SSN is omitted on purpose. Household contact is a hospice fixture, labeled "Not on the eRx event."
- Eleanor Medication tab binds FAQ `newMedications`: two morphine SIGs, NDC `00054051741`, NPI `1497771109`, $0.49/mL NADAC. Margaret has one fixture event in the same shape.
- DME tab: six-step trail, discharge override, Request pickup on delivered (case manager / DON).
- DON desktop with no patient: DME cost PPD report ($0.67 actual vs $1.85 fixture target, 4 idle pickup days on Ray). Compact strip in the census footer.
- Vendor persona: inbox only. Simulated SMS. No vendor account.
- `/integration` text sketch: ADT in, medication events in, DME status out, HCHB named.

Locked names: Eleanor Bishop, Margaret Holt, Ray Delgado, Sam Whitaker, June Park, Helen Vargas. Do not add Donald Tester as a seventh census patient.

---

## Draw only these frames

Six pictures. Same product, denser and calmer than the current definition lists. Phone first, then the same screen wider. At least two variations per frame if you have budget. One variation is enough if tokens are tight. Name the borrowed vertical (Linear, airline ops, hotel desk, and so on) in a caption, not on the chrome.

### 1. Patient chart

The Patient tab is a spec dump today. Design a chart a nurse can read in a car.

Must show: DOB, gender, phone, address, primary ICD-10, allergies, household contact.
Must not show: SSN.
Must label source: "From BetterRX eRx event" on Eleanor. "Hospice fixture. Same fields as the eRx patient event." on the others.
Household contact stays a fixture callout, not an emergency-contact field invented for BetterRX.

Eleanor's FAQ address is dummy (`testStreet1`). Keep it honest or show a Birmingham overlay with a fixture label. Do not invent a real street and pretend it came from the payload.

### 2. Medication events

Two SIGs, one NDC. The current cards repeat the product name twice.

Show that BetterRX pharmacy already filled this. DME is beside it, not a second pharmacy app. Keep both SIGs readable (0.25 mL moderate, 1 mL severe). Keep NDC, NPI, $0.49/mL NADAC as secondary.

### 3. Supplies tab

Still a paragraph. Design the empty and one-line states.

Wound care, incontinence, gloves. No pickup after death. No invented HCPCS A-codes. Same confirm path as DME when an item exists. Do not make this the hero.

### 4. Vendor phone (one question)

The inbox is a message list. Design the page the text opens.

One order. Confirm / yes-but with a new ETA / decline. Decline re-offers to the other vendor. Delivered with optional photo. Propose or confirm a pickup window. Mark picked up (this stops the rental clock).

1b rail language belongs on this phone only. Not on the nurse census.

### 5. DON approve + clock stop

The PPD report exists as a list. Design two missing jobs on that same surface.

- One-line approve for a held routine order, and a retro flag on STAT that already ran.
- The trail with hours between steps, including `picked_up`. One sentence: pickup the same day as death stops extra rental days.

Keep the fixture numbers. Do not invent a savings percentage. E0250 / E1390 are CMS DMEPOS-shaped (fee / 30). E1130 is synthetic. Target $1.85 is a fixture.

### 6. Place order, two lines

One send can include bed and oxygen. The form can add two lines. Design the confirm so a thumb can see both ETAs vs the discharge window before send.

STAT never waits on the $3 gate. Routine over $3 may hold.

---

## Do not spend tokens on

- Redrawing the census, the persona chrome, or the 1a / 1b / 2b / 2c directions
- Vendor marketplace, live EMR, live SMS, family app
- A second pharmacy app or eRx writing
- Invented NDCs, ICD codes, HCPCS A-codes, or PPD savings
- AI at-risk badges. At-risk is a rule (ETA vs window, or no confirm after 20 minutes on STAT)
- Rewriting Ray's 4-day pickup to hours

---

## Success

A clinician who has never seen the repo can tell, from these six frames:

- who this patient is, without an SSN
- that morphine is already BetterRX, with both SIGs
- that supplies do not get picked up
- what the vendor taps from a text
- when the rental clock stops
- whether bed and oxygen both beat discharge
