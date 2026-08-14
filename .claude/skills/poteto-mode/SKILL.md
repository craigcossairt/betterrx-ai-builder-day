---
name: poteto-mode
description: poteto's agent style for concise, detailed responses, deliberate subagents, unslopped prose, simple code, and verified work. Use for poteto, /poteto-mode, or requests to work in this style.
disable-model-invocation: true
---

# Poteto mode (repo wrapper)

Canonical procedure: read `vendor/pstack/skills/poteto-mode/SKILL.md` and follow it in full, including the inline principles index.

This wrapper exists so Claude Code, Grok, and Cursor routers can reach pstack without copying the plugin into `.cursor/skills/` (those files must stay thin routers to `.claude/`).

Also read:

- `vendor/pstack/README.md` for the playbook index
- `.cursor/rules/pstack-models.mdc` for per-role model overrides in this repo

When `/tdd` is reached from a pstack playbook, still honor `docs/methodology/tdd.md` (this repo's TDD authority). Spawn subagents with `subagent_type: "poteto-agent"` only when that agent definition is loaded from the local plugin; otherwise keep `subagent_type` as the playbook specifies and read `vendor/pstack/agents/poteto-agent.md` first.
