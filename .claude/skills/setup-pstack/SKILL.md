---
name: setup-pstack
description: Configure which models pstack uses per role. Detects your available models and writes an always-applied rule that overrides the skill defaults. Use for /setup-pstack, "configure pstack models", or changing pstack's model choices.
---

# Setup pstack (repo wrapper)

Read `vendor/pstack/skills/setup-pstack/SKILL.md` and follow it.

In this repo, write the mapping in **both** places so desktop and cloud agents agree:

- `.cursor/rules/pstack-models.mdc` (committed, cloud agents read this)
- `~/.cursor/rules/pstack-models.mdc` (user-level, what upstream pstack looks for)

Never write a model slug that is not in the current session's Task `model` enum. `inherit-parent` and `auto` are always valid.
