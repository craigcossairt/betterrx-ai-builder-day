# BetterRX AI Builder Day

Hospice DME board for the [BetterRX](https://www.betterrx.com/) **DME Ordering and Visibility** bounty at [AI Builder Day Part 2](https://www.aibuilderday.com/) (Aug 14-15 2026). Phone-first. Orders stay in memory, or in Supabase when env is set.

Prize track: **$10,000**. Close the coordination gap between hospices and DME vendors from admission to pickup.

## Run locally

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

- Repo: public, `main`
- Running hospice DME board with BetterRX product chrome
- Stack: Next.js 16 + TypeScript + Tailwind 4 on Vercel
- Live app: https://betterrx-ai-builder-day.vercel.app
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
