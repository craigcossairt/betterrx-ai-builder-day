# SETUP.md - Day-1 checklist

Work top to bottom. Delete this file when done (or keep it until the project has real shape).

> **Shortcut:** open your AI coding tool and say *"walk me through SETUP.md"* - it will ask you
> the fill-in questions conversationally and make the edits for you. Recommended if you're not
> used to editing config files by hand.

## 1. Identity (5 min)

- [x] `AGENTS.md` - fill every `<!-- FILL IN -->` slot: project name, owner, stage, tech stack
      table, getting-started commands. Stack left TBD until the app is scaffolded.
- [x] `AGENTS.md` § Delegation - fill in the current model names for each tier (they turn over
      every few months; the tier structure is the stable part).
- [x] Decide the em-dash rule (keep or delete the optional content rule).
- [x] `docs/about-me.md` - fill in your background, technical level, and working style. Five
      minutes here upgrades every piece of advice agents give you.

## 2. Tracker + docs (2 min)

- [x] Point the "Active issues + priorities" line in AGENTS.md at your issue tracker (Linear
      project, GitHub Issues, etc.).
- [x] `docs/decision-log.md` - add your first entry: the decision to start this project.
- [x] Matt Pocock `/setup-matt-pocock-skills`: GitHub Issues, default triage labels, single-context
      `CONTEXT.md` + `docs/adr/`. Config lives in `docs/agents/`.
- [ ] On a laptop with `gh` write access, run `bash bin/ensure-github-labels.sh` so `/triage` and
      `/wayfinder` labels exist. Cloud-agent tokens often cannot create labels. `wontfix` is already
      on the repo.

## 3. Secrets (3 min)

- [x] `cp .env.example .env` and fill values from your password manager. `.env` is gitignored.
      Empty stub only until a stack exists.
- [ ] If using MCP servers: `cp .mcp.json.example .mcp.json` and fill in. Also gitignored -
      commit a scrubbed version only if the whole team should share server config.
      Google Drive is already attached at the Cursor account level for the bounty folder; it
      still needs a one-time MCP auth in desktop/cloud (`needsAuth` until you sign in).

## 4. Hooks (3 min)

- [x] `.claude/hooks/format-on-edit.sh` - JS/TS/JSON/CSS/MD prettier branches are already there
      for the likely Next.js stack. Add/remove languages when the stack is chosen. The hook
      silently no-ops for missing formatters.
- [x] `.claude/hooks/block-sensitive-files.sh` - no extra generated-file patterns yet (no
      protobuf/Flutter codegen). Add them when the stack produces them.
- [x] Hooks run through `.claude/settings.json` with `$CLAUDE_PROJECT_DIR` paths - nothing to
      edit there unless you add hooks.
- [ ] Optional push gate: fill in `GREEN_COMMANDS` in `bin/verify-green.sh` (your lint/test
      commands). Once non-empty, `git push` refuses any commit whose checks were never seen
      passing - run `bash bin/verify-green.sh` before pushing to record the proof. The wiring
      (`core.hooksPath=.githooks`) self-installs at session start; bypass with
      `PROJECT_SKIP_VERIFY=1` for docs-only pushes. Leave the array empty to keep the gate off
      until there is an app.

## 5. Prune (2 min)

Everything is optional. Delete what this project won't use:

- [x] Skills kept: Trellis set plus Matt Pocock engineering/productivity skills. His `tdd` was
      skipped on purpose. pstack is vendored, not copied into `.cursor/skills/`. `launch-check`
      stays for the Saturday demo. Matching Cursor routers exist for every `.claude/` skill and
      command.
- [x] Harness adapters kept (Cursor, Grok, Gemini, Copilot) - this weekend uses more than one.
- [x] Push gate kept, still inert (`GREEN_COMMANDS` empty).
- [x] `brain/` kept, not ingested (nothing to search yet).
- [x] `examples/` once you've filled in your own AGENTS.md (it's a reference sample, nothing
      points to it).

## 6. Third-party tooling

- [x] Matt Pocock skills installed in-repo (`npx skills add mattpocock/skills`, pin in
      `skills-lock.json`). Refresh with `npx skills update`.
- [x] pstack vendored at `vendor/pstack`. Desktop: `/add-plugin pstack` still works. Cloud:
      `bin/cloud-agent-install.sh` copies it to `~/.cursor/plugins/local/pstack`.
- [x] pstack models: `.cursor/rules/pstack-models.mdc` (slugs confirmed on this cloud agent).
- [ ] Optional later: Impeccable (`npx impeccable install`) once there is a UI to polish.

## 7. Brain (optional, 10 min)

Only if you want prompt-time context injection from a local corpus. Follow `brain/README.md`:
install QMD, configure `brain/config.sh` sources, run the ingest, wire the hook. Skip on day 1.
Rule of thumb: enable it once the project has roughly 15-20 real docs/decisions or a few weeks
of commit history - before that there's nothing worth searching.

## 8. Sanity check

- [ ] Start an agent session in the repo root and ask: *"What are the working methodology rules
      for this project?"* - it should answer from AGENTS.md.
- [ ] Edit any source file and confirm the formatter hook ran.
- [ ] Try to edit `.env` via the agent and confirm the block hook refuses. A guardrail that
      no-ops looks identical to one that passes - only a deliberate violation proves it's alive.
- [ ] If you configured the push gate: commit a trivial change and `git push` WITHOUT running
      `bin/verify-green.sh` first - confirm the push is blocked, then verify and push for real.
