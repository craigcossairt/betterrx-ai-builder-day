# CLAUDE.md

@AGENTS.md

Claude Code specifics (everything above is harness-agnostic):

- Hooks, slash commands, skills, and agents live in `.claude/` - see SETUP.md for what's wired.
- The `/tdd`, `/bug-report`, and `/worktree` commands are thin wrappers around
  `docs/methodology/` - auto-follow them without being asked to invoke them by name.
- Engineering skill config (issue tracker, triage labels, domain docs) lives in `AGENTS.md` § Agent skills and `docs/agents/`. Do not duplicate that block here.
