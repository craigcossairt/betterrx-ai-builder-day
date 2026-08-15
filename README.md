# BetterRX AI Builder Day

<<<<<<< HEAD
Hospice DME board for the [BetterRX](https://www.betterrx.com/) **DME Ordering and Visibility** bounty at [AI Builder Day Part 2](https://www.aibuilderday.com/) (Aug 14-15 2026). Scaffolded from [trellis](https://github.com/craigcossairt/trellis).
=======
Hospice DME board for the [BetterRX](https://www.betterrx.com/) **DME Ordering and Visibility** bounty at [AI Builder Day Part 2](https://www.aibuilderday.com/) (Aug 14-15 2026). Phone-first. Orders stay in memory, or in Supabase when env is set.
>>>>>>> c2232fe (Prune Day-1 leftovers and align repo surfaces with the running board)

Prize track: **$10,000**. Close the coordination gap between hospices and DME vendors from admission to pickup.

<<<<<<< HEAD
- Brief: [`docs/briefs/dme-hackathon-bounty-brief.html`](docs/briefs/dme-hackathon-bounty-brief.html)
- FAQ (weekend overlay): [`docs/briefs/betterrx-bounty-faq.md`](docs/briefs/betterrx-bounty-faq.md)
- Friday Q&A notes: [`docs/briefing-qa.md`](docs/briefing-qa.md)
- PRD: [`docs/prd.md`](docs/prd.md)
- Market landscape: [`docs/briefs/dme-market-landscape.html`](docs/briefs/dme-market-landscape.html)
- Sample orders: [`docs/briefs/dme-sample-orders.html`](docs/briefs/dme-sample-orders.html)
- Weekend slice: [`docs/primary-bounty.md`](docs/primary-bounty.md)
- Event notes: [`docs/hackathon.md`](docs/hackathon.md)
- Official files: [Google Drive](https://drive.google.com/drive/folders/1vuhQuangDH_Hn6Mz7aPXJnLrdE-O-j6a)
- Event: [Luma](https://luma.com/aibuilderday2?tk=u66mnl)

Sibling repos this weekend: [ai-builder-day-part-2](https://github.com/craigcossairt/ai-builder-day-part-2) (all-track notes) and [startup-state-2](https://github.com/craigcossairt/startup-state-2) (GOED). This repo is the BetterRX product only.

## Status

- Repo: public, `main`
- Stage: running hospice DME board. Phone-first. Orders persist in memory, or in Supabase when env is set.
- Stack: Next.js + TypeScript + Tailwind on Vercel.
- Pitch paper: `/integration` (AI skip, differentiation, HCHB sketch, three demo taps)
- Issues: https://github.com/craigcossairt/betterrx-ai-builder-day/issues
=======
## Run locally
>>>>>>> c2232fe (Prune Day-1 leftovers and align repo surfaces with the running board)

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. No `.env.local` is required. The six sample orders load from `docs/briefs/sample-orders.json`.

```bash
npm test
```

## Judge taps

Also linked from `/integration`:

1. Discharge miss: `/?role=admissions&patient=PT-88502&tab=dme` (Margaret Holt)
2. Delayed pickup: `/?role=case_manager&patient=PT-87411&tab=dme` (Ray Delgado)
3. DME PPD: `/?role=don&surface=desktop&panel=oversight`

## Status

- Private repo on `main`
- Running hospice DME board with BetterRX product chrome
- Stack: Next.js 16 + TypeScript + Tailwind 4 on Vercel
- Pitch note: `/integration` (AI skip, differentiation, HCHB sketch, three demo taps)
- Issues: https://github.com/craigcossairt/betterrx-ai-builder-day/issues

## Briefs and notes

- Brief: [`docs/briefs/dme-hackathon-bounty-brief.html`](docs/briefs/dme-hackathon-bounty-brief.html)
- FAQ: [`docs/briefs/betterrx-bounty-faq.md`](docs/briefs/betterrx-bounty-faq.md)
- Friday Q&A: [`docs/briefing-qa.md`](docs/briefing-qa.md)
- PRD: [`docs/prd.md`](docs/prd.md)
- Weekend slice: [`docs/primary-bounty.md`](docs/primary-bounty.md)
- Event notes: [`docs/hackathon.md`](docs/hackathon.md)
- Official files: [Google Drive](https://drive.google.com/drive/folders/1vuhQuangDH_Hn6Mz7aPXJnLrdE-O-j6a)

Sibling repos this weekend: [ai-builder-day-part-2](https://github.com/craigcossairt/ai-builder-day-part-2) (all-track notes) and [startup-state-2](https://github.com/craigcossairt/startup-state-2) (GOED). This repo is the BetterRX product only.

Scaffolded from [trellis](https://github.com/craigcossairt/trellis). Agent conventions live in [`AGENTS.md`](AGENTS.md).
