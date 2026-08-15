# AGENTS.md - BetterRX AI Builder Day

> Canonical instructions for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, and others).
> Keep this file **harness-agnostic**: anything specific to one tool belongs in that tool's own
> config directory (`.claude/`, `.cursor/`, etc.). CLAUDE.md imports this file, so never duplicate
> content between the two.

## Project

- **Name:** BetterRX AI Builder Day
- **What it is:** Weekend hackathon submission for the BetterRX DME Ordering and Visibility bounty ($10,000) at JustBuild AI Builder Day Part 2 (Aug 14-15 2026). Live notes: `docs/hackathon.md`, `docs/primary-bounty.md`, `docs/prd.md`. Official briefs and FAQ: `docs/briefs/`. Friday Q&A: `docs/briefing-qa.md`.
- **Owner:** Craig Cossairt - craig@bloom.date
- **Stage:** Next.js hospice app in progress (design system landed; issue #9 is the first board)
- For the owner's background and working style, see `docs/about-me.md`

## What I Need From Agents

- Research before advising - verify current facts (pricing, APIs, legal) before recommending
- When writing code, explain what you're doing and why in plain language
- If uncertain, say so explicitly - never fabricate facts or statistics
- Skip long preambles - get to the point
- Flag when professional review is needed (lawyer, accountant, security auditor)
- Default to actionable advice that can be executed this week

## Current State - Source of Truth Pointers

**This file does NOT own current priorities, active deadlines, or in-progress work.** Those change
too fast for a static config file. Read the live sources below before acting on anything that
depends on what's currently active or due:

- **Active issues + priorities** - https://github.com/craigcossairt/betterrx-ai-builder-day/issues (weekend planning notes also in `.scratch/betterrx-weekend-demo/`)
- **Decision history (what was decided, when, why)** - `docs/decision-log.md`
- **Known bug patterns** - `docs/common-gotchas.md`

**What this file owns:** stable conventions (tech stack, methodology, file structure, owner
context). The test for whether something belongs here: *"Will this still be true in 6 months?"*
If no, it goes in the issue tracker, not here.

## Tech Stack

Next.js App Router + TypeScript + Tailwind on Vercel. Fixture JSON in memory for the first clickable slice. Supabase only if a real table is needed.

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 / React 19 / TypeScript / Tailwind 4 |
| Backend | Next.js server actions + in-memory store |
| Database | Fixture JSON (`docs/briefs/sample-orders.json`) |
| Hosting | Vercel |
| Design | BetterRX tokens + ported components in `src/ui` |
| Issue Tracking | GitHub Issues |
| Error Tracking | none yet |

## Getting Started

```bash
npm ci
npm run dev
npm test
npx next build
```

## Folder Structure

<!-- FILL IN once the project takes shape. Keep this a map, not an inventory. -->

```
.
├── CONTEXT.md               # domain glossary (hospice DME coordination)
├── src/                     # Next.js app (ui, domain, parse, store)
├── public/brand/            # BetterRX logos
├── docs/
│   ├── hackathon.md         # event clock + BetterRX bounty notes
│   ├── primary-bounty.md    # why this track, weekend-sized slice
│   ├── prd.md               # weekend PRD (personas, stories, modules)
│   ├── briefing-qa.md       # Friday presentation Q&A notes
│   ├── briefs/              # official HTML briefs, FAQ, eRx payloads, sample-order JSON
│   ├── agents/              # issue tracker, triage labels, domain-doc layout
│   ├── adr/                 # architecture decision records (lazy; created when needed)
│   ├── common-gotchas.md    # symptom → root cause → fix table (append after every bug fix)
│   ├── decision-log.md      # one line per decision
│   └── methodology/         # TDD workflow, bug protocol, session habits
├── .scratch/                # local wayfinder map (weekend planning)
├── .claude/                 # Claude Code adapter (hooks, commands, skills, agents)
├── .cursor/                 # Cursor adapter (rules + hooks + skill routers + environment.json)
├── .grok/                   # Grok Build adapter (config + hooks)
├── .githooks/               # real git pre-push hook (opt-in push gate)
├── bin/                     # verify-green, git-hook installer, harness hook adapter
├── vendor/pstack/           # Lauren Tan's pstack (Cursor plugin, MIT)
└── brain/                   # optional local knowledge base (see brain/README.md)
```

If this project outgrows a single repo (second repo, non-code assets piling up), see
`docs/growing-into-a-workspace.md` for the graduation path.

## Agent skills

### Issue tracker

GitHub Issues is the tracker. Weekend planning notes also live at `.scratch/betterrx-weekend-demo/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` at the repo root, ADRs under `docs/adr/` when they exist. See `docs/agents/domain.md`.

## Harness Wiring (summary)

The knowledge in this file and `docs/` is harness-agnostic; each tool gets only a thin adapter:

| Harness | Wiring |
|---|---|
| Claude Code | `CLAUDE.md` (imports this file) + hooks via `.claude/settings.json` |
| Cursor | `.cursor/rules/project.mdc` (always-on rule) + `.cursor/hooks.json` (guardrail parity) + `.cursor/skills/*` (routers) |
| Grok Build | `.grok/config.toml` (reuses `.claude/` skills and commands) + `.grok/hooks/hooks.json` |
| Codex | reads this file natively - no adapter needed |
| Gemini CLI | `GEMINI.md` pointer |
| GitHub Copilot | `.github/copilot-instructions.md` pointer |

Claude, Cursor, and Grok all run the SAME hook scripts (via `bin/run-claude-hook.sh` for the
latter two) - guardrail logic exists once. Where a harness runs no hooks at all, agents must
still honor the rules the hooks enforce (don't edit secrets, verify before push).

Skills and command protocols work the same way: one canonical body under `.claude/`, and a thin
router for any harness that cannot load it directly. **While an adapter is present, a new skill
or command needs its router in the same commit** - a procedure the harness cannot reach looks
exactly like one that was never written. Each adapter's own directory documents its router
format; delete the adapter and the rule goes with it.

Third-party packs: Matt Pocock skills live under `.claude/skills/` like our own. pstack stays
in `vendor/pstack`; only `/poteto-mode` and `/setup-pstack` have wrappers. Do not dump pstack
bodies into `.cursor/skills/` (hooks CI treats those as routers to `.claude/`).

## Agent skills

### Issue tracker

GitHub Issues on `craigcossairt/betterrx-ai-builder-day`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
See `docs/agents/triage-labels.md`. Create missing labels with `bash bin/ensure-github-labels.sh`.

### Domain docs

Single-context: `CONTEXT.md` at the repo root plus `docs/adr/`. See `docs/agents/domain.md`.

### Which flow to use

- **Shape the work:** `/grill-with-docs` then `/to-spec` then `/to-tickets`. `/ask-matt` if lost.
- **Build it:** `/implement` (drives TDD) or `/poteto-mode` for Cursor-native playbooks.
- **TDD authority:** `docs/methodology/tdd.md` via `/tdd`. Matt Pocock's `tdd` skill is not installed. pstack's `/tdd` may wrap the same loop; do not skip red-green-refactor.
- **Older Trellis path:** `/write-a-prd` and `/prd-to-issues` still exist. Prefer the Matt Pocock flow above for new work.

## Rules

### Working Methodology

- **Plan first for non-trivial tasks** (3+ steps or architectural decisions) - write the plan,
  confirm before implementing. If something goes wrong mid-implementation, STOP and re-plan.
- **Verify before marking done** - never claim a task is complete without proving it works. Run
  tests, check logs, demonstrate correctness. Ask: "Would a staff engineer approve this?"
  If the push gate is configured (`bin/verify-green.sh`), record the proof with
  `bash bin/verify-green.sh` before pushing - unverified pushes are blocked.
- **Grade every claim on the certainty ladder, and say where it stopped.** Five levels:
  (1) *you said so* - worthless on its own; (2) *you pointed at the line* - a real `file:line`,
  or the dependency's own source; (3) *you showed the bad case can't reach* - you walked the
  failure path step by step and it doesn't get there; (4) *you ran it* - a script or test that
  calls the real code and fails loud if you're wrong; (5) *you reproduced it in the running
  app*. Get each claim as far down as is cheap and **name the level out loud**. A claim you
  can't get to 4 is reported as unproven, never written up as settled, and never rounded up.
  Two habits come with it:
  - **Find the one fact the work is safe because of.** Most alarming-looking changes are safe
    because of a single fact ("this only drops already-dead cache entries"). Proving that one
    fact kills the whole list of maybes, so spend the effort there rather than enumerating
    risks.
  - **A writeup that sounds right is worthless.** It reads as convincing whether or not it is
    true, which is exactly the trap. Prose is not evidence; a run is.

  This is the vocabulary the rest of these rules use. "Mutate the suite"
  (`docs/methodology/tdd.md`) is what makes a level-4 claim trustworthy, and the push gate
  records level 4 for a whole tree.
- **Autonomous bug fixing** - when given a bug report, follow `docs/methodology/bug-protocol.md`
  automatically. If details are missing, ask for them.
- **TDD by default** - for code work, follow `docs/methodology/tdd.md`. Write failing tests first,
  then implement. That file is the TDD authority even when `/implement` or a pstack playbook
  also mentions tests.
- **Simplicity first** - make every change as simple as possible. Minimize code impact. No
  temporary fixes - find root causes.

### AI Session Management

Context quality degrades in long sessions. Defaults for every session:

- **Prefer rewinding over mid-session correction.** When an approach flops after exploration, jump
  back to just after the research and re-prompt with what you learned, rather than stacking
  corrections on a bad chain.
- **New task = new session.** Pivoting to unrelated work means a fresh session, not a continue.
  Exception: closely related follow-ons (docs for the feature just shipped).
- **Compact with direction.** When a long session approaches its context limit, summarize with an
  explicit instruction about what to keep and what to drop.
- **Delegate big-output work to subagents.** Exhaustive searches, security review passes, bulk
  scans - route through a subagent so only the conclusion hits the main context. Mental test:
  "Do I need the tool output or just the conclusion?"
- **Summarize before ending.** When closing a session mid-stream, write a handoff summary for the
  next session.

### Delegation & Model Routing

For most tasks the right team size is 1 (yourself) or 2 (you + one reviewer agent). When you do
delegate:

- **Push work down, keep judgment up.** Spend the parent context on decisions, synthesis, and
  review; let subagents burn their own context on searches, file dumps, and mechanical edits.
- **Brief every child completely.** A subagent starts blank. Every dispatch includes the context
  (files, constraints, conventions), the why, and what done looks like. Include an explicit
  "do not delete files" clause for file-writing subagents.
- **Return work above your tier.** If a dispatched agent hits a problem harder than its tier
  (architecture call, security judgment, ambiguous requirement), it should return findings and
  stop - not grind tokens on it.
- **Don't delegate the trivial.** Single-fact lookups, one-file edits, anything faster to do than
  to brief - do it yourself.

| Tier | Best for | Delegate to it when |
|---|---|---|
| Fast (Haiku 4.5) | Bulk mechanical work: exhaustive greps, file inventories, formatting | Output is large, judgment is minimal, correctness is cheap to verify |
| Mid (Sonnet 5) | Routine implementation following an established pattern | The pattern exists in the repo and a review pass will catch mistakes |
| Strong (Opus 4.8) | Complex implementation, debugging, refactors, code review | The task needs real reasoning within known constraints |
| Frontier (Grok 4.6) | Architecture decisions, auth/security design, ambiguous tradeoffs | One-shot hard calls; the escalation target |

Refresh the model names when the model family turns over; the tier structure is the stable part.

### Content Rules

- Never fabricate statistics or market data - search first
- All externally-facing content must be original - no copying from competitors
- No em dashes (—) in externally-facing content (marketing copy, user-facing UI text, emails to
  outside parties, public posts). Use hyphens, commas, parentheses, or separate sentences. Em
  dashes are fine in internal docs, code comments, and commit messages.
- **Writing rules for prose (Orwell, 1946).** Scope: the
  externally-facing content above, plus PR descriptions and commit messages. Prose only, never
  code, identifiers, or established technical terms; swap in everyday words only where
  precision survives.
  1. Never use a metaphor or figure of speech you are used to seeing in print.
  2. Never use a long word where a short one will do.
  3. If it is possible to cut a word out, cut it out.
  4. Never use the passive where you can use the active.
  5. Never use jargon or a scientific word where everyday English will do.
  6. Break any of these rules sooner than write something clumsy.
- **Banned in that same scope**, as a mechanical check like
  the em-dash rule: *comprehensive, robust, seamless, leverage* (as a verb), *delve, utilize,
  game-changer*; the "it's not just X, it's Y" construction; rule-of-three padding ("faster,
  smarter, better"); achievement language in commits and PRs ("significantly improved",
  "greatly enhanced"), which should state what changed and why in plain words. This is a
  starter list. Extend it as new tells show up, and consider wiring it into a lint script so
  it fails rather than relying on memory.

### Autonomous Housekeeping (do these WITHOUT being asked)

**After every bug fix:**
- Append the symptom / root cause / fix to `docs/common-gotchas.md`.

**After every completed task (feature, bug fix, refactor):**
- Commit the changes with a descriptive message. Stage only the relevant files (never .env,
  secrets, or lock files unless intentional).
- Push to the remote branch. If on a feature branch, offer to create a PR.

**After making or discovering a project decision:**
- Append a one-line entry to `docs/decision-log.md`
  (format: `- **YYYY-MM-DD** - Decision description. See <issue-ref>.`)
- **Date entries in machine-local time, not the session-context date.** The "today's date" an
  agent sees in its context is often UTC-derived and rolls over during the local evening, so
  evening sessions get tomorrow's date. Run `date +%Y-%m-%d` before dating any log entry or
  dated doc. (This future-dated real log entries twice in the project this template came from.)

**After fixing a recurring issue or learning a new codebase pattern:**
- Update this file if it's a convention agents need every session
- Update `docs/common-gotchas.md` if it's a symptom-to-fix pattern

**When new knowledge contradicts recorded knowledge (write-time invalidation):**
- Update or supersede the old entry in the SAME session you write the new one - never write a
  new fact and leave the contradicted one live for retrieval or future greps to keep serving.
  Periodic lint passes are backstops, not the mechanism.
- Supersede, don't delete: memory entries with metadata support get `superseded_by: <successor>`
  and stay on disk; gotchas/docs get edited in place (git history preserves the old text).

**When context files get stale:**
- If this file drifts on stable conventions, flag it and suggest updates
- If the issue tracker is out of date based on something that just happened, flag it - do not
  change tracker priorities or close issues autonomously without permission

## Formatting Preferences

- Use bullet points for action items
- Use Markdown: sections, tables, numbered lists where appropriate
- When writing externally-facing content, align with the brand voice
  (no brand doc yet; keep copy short, specific, and human)
- When writing internal/working docs, prioritize clarity and speed

## Cursor Cloud

Durable notes for cloud agents. Update as the project grows a real stack.

- **App is Next.js at the repo root.** `npm ci`, `npm run dev`, `npm test`, `npx next build`.
  Domain tests are Vitest. Guardrail lint is still the `hooks-ci` checks.
- **Lint/test = `npm test` plus the `hooks-ci` checks.** The canonical guardrail suite lives in
  `.github/workflows/hooks-ci.yml`: CRLF scan, `bash -n`, `shellcheck -S warning -x`, exec-bit
  check on `.githooks/*` and `bin/*`, skill/command/router frontmatter validation, and JSON parse
  of the harness config files. Run those same commands locally to reproduce hooks CI.
- **`shellcheck` is the only tool not already in the base image.** `bash`, `git`, `node`, `npm`,
  `jq`, and `python3` are preinstalled; `bin/cloud-agent-install.sh` installs `shellcheck` (apt)
  and copies vendored pstack into `~/.cursor/plugins/local/pstack`. If a `shellcheck: not found`
  error appears, rerun `sudo apt-get install -y shellcheck`.
- **The tracked pre-push gate does not run in cloud agent sessions.** Cursor sets `core.hooksPath`
  to its own agent-hooks dir, so `.githooks/pre-push` (and thus `bin/verify-green.sh`) is bypassed.
  The push gate is also OFF by default (`GREEN_COMMANDS` empty in `bin/verify-green.sh`). When the
  project gains real checks, fill that array and run `bash bin/verify-green.sh` manually before
  pushing.
- **Verify guardrails with a deliberate violation, never absence of complaints.** A no-op hook
  looks identical to a passing one. Example: `echo '{"file_path":".env"}' | bash
  bin/run-claude-hook.sh cursor block-sensitive-files` must exit 2 (blocked); a normal path like
  `README.md` exits 0 (allowed).
