# BetterRX at AI Builder Day Part 2

Event: [Luma](https://luma.com/aibuilderday2?tk=u66mnl) · [aibuilderday.com](https://www.aibuilderday.com/)
Dates: Friday Aug 14 (learn) and Saturday Aug 15 (build), 2026
Venues: Friday at Pelion Venture Partners, 14761 Future Way #500, Draper. Saturday at Reference Club, 13707 S 200 W.
Purse: $20K+ in prizes (Luma copy). BetterRX award: **$10,000**.
This track's files: [Google Drive](https://drive.google.com/drive/folders/1vuhQuangDH_Hn6Mz7aPXJnLrdE-O-j6a)
All-track briefs: [Drive parent](https://drive.google.com/drive/folders/1uLiMaeiLHLrmtQM70e08NH0XhGoXnBza)

Friday 1:00 PM is bounty presentations (BetterRX deep dive 15-20 min). Competitive build clock: Friday 1:30 PM to Saturday 2:00 PM (about 24 hours). Judging starts 2:00 PM Saturday. Awards 4:00 PM.

This repo is the BetterRX submission. Do not reuse May Part 1 tracks from aibuilderday.com/bounties.

## Official files (local)

| File | What it is |
|---|---|
| [`docs/briefs/dme-hackathon-bounty-brief.html`](briefs/dme-hackathon-bounty-brief.html) | Full bounty brief (tabs: overview through judging) |
| [`docs/briefs/dme-market-landscape.html`](briefs/dme-market-landscape.html) | Competitive and market landscape |
| [`docs/briefs/dme-sample-orders.html`](briefs/dme-sample-orders.html) | Synthetic sample orders across the lifecycle |
| [`docs/briefs/betterrx-bounty-faq.md`](briefs/betterrx-bounty-faq.md) | Pre-build FAQ (survey answers). Weekend-scope overlay on the brief. |
| [`docs/briefs/erx-sample-payloads.json`](briefs/erx-sample-payloads.json) | Representative BetterRX eRx patient + medication payloads |
| [`docs/briefs/sample-orders.json`](briefs/sample-orders.json) | Same six sample orders, machine-readable |
| [`docs/briefing-qa.md`](briefing-qa.md) | Craig's Friday presentation Q&A notes |
| [`docs/prd.md`](prd.md) | Weekend PRD synthesized from the above |

Filenames of the three HTML briefs match the official Drive zip so the brief's local links work.

**Read order:** FAQ + Q&A notes first for weekend scope, then the HTML brief for problem quotes and rubric. Where they collide (vendor recruitment, pickup trigger, judging weight), FAQ + Q&A win.

---

## BetterRX — DME Ordering and Visibility ($10,000)

Close the coordination gap between hospices and durable medical equipment vendors, from admission to pickup. AI is welcome, not required.

**Pain:** A new patient needs a bed/oxygen in place before discharge home. After a death, equipment must be picked up quickly and respectfully. Hospices do not control the vendor, but they take the blame (and CAHPS hit) when either moment fails. Today this is phone, fax, and vendor portals.

**BetterRX's own bet to pressure-test:** delivery visibility, not DME ownership, is the higher-leverage problem. They have **no vendor network**. The FAQ then scoped the weekend: treat vendor *participation* as given, do not build the network, judge mainly on hospice UX, vendor baseline is SMS/email with no login.

**Lifecycle to cover:** Ordered → Vendor confirmed → Dispatched → In Transit / At Risk → Delivered → Pickup Triggered → Pickup Delayed.

**Required surfaces:**

- Hospice: patient + equipment need, discharge-readiness, post-death pickup trigger, multi-vendor, DME spend next to meds, bedside mobile/tablet.
- Vendor (brief still calls this the hard/original side; FAQ says bonus only this weekend): SMS/email confirm without an account. Capacity, inventory API, recruitment, and a portal are out of weekend scope or stretch.
- Shared: real-time status both sides can see, at-risk scoring **before** something is late, escalation, explainable "why flagged."

**AI bar:** if you use AI, name the rules-based alternative and why AI beats it. Defend safety (no hallucinated status/patient facts, low-confidence flagged, human confirm on high-stakes). Honest "rules are better here" is scored as judgment, not a penalty.

**Integration:** sketch only. Credible path to BetterRX eRx plus one of HCHB, Axxess, WellSky, MatrixCare. HCPCS E-codes for equipment. No live EMR required.

**Data:** synthetic only. Sample orders are in `docs/briefs/dme-sample-orders.html`. CMS PUFs for distributions, not as fake orders.

**Deliverables:** working app with real order state (Figma, Framer, and other visual prototypes will not count; restated in the room), AI rationale or skip rationale with rough cost, differentiation snapshot, integration diagram, 2-3 scenarios (discharge-ready, post-death pickup, prevent a miss). Supplies on the same patient is stretch, not a substitute for DME.

**Scoring:** 30% differentiation vs today's DME, 25% real user problems, 15% architecture/integration, 15% AI ROI, 15% UX.

**Logistics:** open eligibility, any team size (1-3 recommended), max 8 teams in their room, 15-20 min deep dive Fri 1:00 PM, 5 min pitch + Q&A, 3 BetterRX judges. Discovery exercise, not a recruiting filter.

## Ground rules that will fail a demo

- Figma, Framer, static mock, or other visual prototype instead of running code.
- Building a vendor marketplace / recruitment story instead of a hospice order the FAQ told us to judge.
- Hallucinated order status, inventory, or patient facts.
- AI with no named rules baseline.
- Real patient or hospice data.
