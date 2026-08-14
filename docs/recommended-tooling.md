# Recommended third-party tooling

Skill packs this project actually uses, plus optional ones worth knowing. Matt Pocock's skills
and pstack are **in this repo** so cloud agents get them. Impeccable and gstack stay user-level
until we need them.

## Matt Pocock's skills - engineering discipline

Installed **in this repo** (not only user-level) so every harness and every cloud agent sees
the same files. Canonical bodies: `.claude/skills/`. Pin: `skills-lock.json`. Source:
https://github.com/mattpocock/skills

```bash
npx skills@latest add mattpocock/skills
# refresh later:
npx skills update
```

His `tdd` skill is **not** installed. This repo's TDD authority is `docs/methodology/tdd.md`
(`.claude/commands/tdd.md`). `/implement` still drives that `/tdd` command.

Preferred flow: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`. `/ask-matt`
routes if you are unsure. `/write-a-prd` and `/prd-to-issues` remain as the older Trellis path.

## pstack - Cursor execution style (poteto)

Vendored at `vendor/pstack` from https://github.com/cursor/plugins/tree/main/pstack (MIT,
Lauren Tan). Wrappers: `/poteto-mode`, `/setup-pstack`. Model map:
`.cursor/rules/pstack-models.mdc`.

```bash
# desktop Cursor (optional; vendor copy already works)
# type in chat: /add-plugin pstack

# cloud / this machine
bash bin/install-pstack-local.sh
```

Do not copy pstack skill bodies into `.cursor/skills/` — hooks CI requires those files to be
routers that name a `.claude/` target. Refresh the vendor tree using `vendor/pstack/UPSTREAM.md`.

pstack also has a `/tdd` playbook inside the vendor tree. When it runs, still follow
`docs/methodology/tdd.md`.


## Impeccable - frontend design quality

Builds on Anthropic's frontend-design skill: 23 commands (`polish`, `audit`, `critique`,
`animate`, ...), 45 deterministic anti-"AI slop" detector rules, curated styles/palettes/font
pairings, 8 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind).
Harness-agnostic: works with Claude Code, Cursor, Copilot, Gemini CLI, Codex.

```bash
# from the project root
npx impeccable install
# then inside your coding agent:
/impeccable init
```

Note: unlike the others, this installs per-project state - which fits, since design context
(audience, brand personality) is per-project.

Source: https://impeccable.style/ (pbakaus/impeccable)

## gstack - virtual engineering team

Opinionated persona commands (CEO product rethink, eng-manager architecture lock, design
critique, security audit, QA in a real browser, release engineer). Heavy install (~GBs: bundled
browser + node_modules) - machine-level, clone once:

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Source: https://github.com/garrytan/gstack

---

# Services & integrations

The service stack that earned its keep in the production setup this template was extracted
from. Rules of this list: one pick per category (not a directory), each entry says when it
*earns its place*, and the default is always free/built-in until you feel the pain it solves.
Most of these can wait - the entries marked "day 1" (a password manager above all) are the
exceptions.

| Category | Pick | When it earns its place |
|---|---|---|
| Issue tracking | GitHub Issues to start; **Linear** when the backlog outgrows it | Day 1 for Issues (free, zero setup, agents read/write via `gh`). Move to Linear when you're juggling priorities across many issues and need cycles/projects - it has an MCP server, so agents work the backlog directly. |
| Automated PR review | **CodeRabbit** | As soon as you're merging AI-written code you can't fully review yourself - an automated second reader catches real bugs. Free for public repos. Caveat: treat it as a reviewer, not a gate; question its premise before applying a remedy, and never merge on its check status alone - read the actual comments. |
| Error tracking | **Sentry** | The day real users touch the product. Before that, local logs are enough. Free tier is generous for a small app; agents can triage straight from its MCP server. |
| Uptime monitoring | **UptimeRobot** | The day something is deployed that users depend on. Free tier covers a small site. |
| Product analytics | **PostHog** | When you start making product decisions and need evidence instead of vibes. Free tier is generous. |
| CI | **GitHub Actions** | First time a broken push costs you an evening. Start with lint + test on PR; it's free for public repos and cheap for private ones. |
| Secrets | A password manager (**Bitwarden**, 1Password) | Day 1, non-negotiable. Real values live there; repos get `.example` files only. The template's hooks enforce the repo side. |
| Backend | **Supabase** (if you need a database + auth) | Day 1 if your product stores user data and you don't have strong stack opinions: Postgres, auth, storage, and functions in one, generous free tier, and an MCP server so agents can manage the schema. If you do have stack opinions, use them - this row is a default, not a mandate. |
| Web hosting | **Vercel** | The day you have a web app or site to put in front of anyone. Free hobby tier, git-push deploys, and MCP/CLI so agents can ship and inspect deployments. |
| Dependency security | **OSV.dev** to start; **Socket** for supply-chain depth | OSV is day 1 - free, no signup, already wired into this template's `/review-dependency-updates` skill. Add Socket when you want supply-chain risk scoring (maintainer changes, install scripts) beyond known CVEs. |
| Docs & knowledge | Markdown in the repo to start; **Notion** at company stage | This template's whole philosophy: docs live in git where agents read them for free. Notion earns its place when non-code collaborators and business ops appear (see `growing-into-a-workspace.md`). |
| Codebase audits | **AuditBuffet** | Pre-launch, or whenever you suspect the AI has quietly accumulated slop. Audit prompts run locally inside your coding agent (your code never leaves your machine); free basic scan, ~$9/mo for the full catalog at time of writing. |
| Design & visuals | Your coding agent + a design skill to start; **Claude Design** for visuals beyond the app; **Figma** when a designer joins | Most solo founders need less design tooling than they think - the Impeccable skill above covers in-app UI. Claude Design (Anthropic, research preview) earns its place for decks, one-pagers, and landing mockups. Figma when you collaborate with an actual designer. |

Product offerings, pricing, and free-tier limits change regularly. Treat this list as
exemplary, not definitive: it shows what one real setup uses and why, but do your own research
and pick the tool that fits your needs before committing - especially to a paid plan.

## Adding to this list

Criteria for a skill-pack entry: actively maintained, installable from source with one command,
and worth recommending to a teammate on day 1. Note any collisions with this template's
commands/skills.

Criteria for a service entry: it earned its keep in a real project, has a usable free tier or
clear pricing, and ideally has an MCP server or CLI so agents can operate it, not just humans.
