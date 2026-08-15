# BetterRX AI Builder Day

Private hackathon repo for the [BetterRX](https://www.betterrx.com/) **DME Ordering and Visibility** bounty at [AI Builder Day Part 2](https://www.aibuilderday.com/) (Aug 14-15 2026). Scaffolded from [trellis](https://github.com/craigcossairt/trellis).

Close the coordination gap between hospices and durable medical equipment vendors, from admission to pickup. Prize: **$10,000**. Max 8 teams.

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

- Repo: private, `main`
- Stage: Next.js hospice app (BetterRX design system + first board)
- Stack: Next.js + TypeScript + Tailwind on Vercel. Supabase `orders` jsonb when env is set.
- Issues: https://github.com/craigcossairt/betterrx-ai-builder-day/issues

```bash
npm ci
npm run dev
npm test
```

## Day-1 setup

Work through [`SETUP.md`](SETUP.md). Identity, about-me, decision log, BetterRX briefs, Matt Pocock
skills, and vendored pstack are in place. Create GitHub triage labels from a laptop
(`bash bin/ensure-github-labels.sh`). Secrets, MCP auth, and the push gate wait until a stack
exists.
