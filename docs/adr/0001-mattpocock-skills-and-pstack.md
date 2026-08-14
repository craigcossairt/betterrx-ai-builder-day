# ADR 0001: Matt Pocock skills + pstack in this repo

Status: accepted
Date: 2026-08-14

## Context

Agents on this hackathon repo need two things: a grilling/spec/ticket loop that writes to GitHub Issues, and a Cursor-native execution style that writes less code and verifies it. Those already exist as third-party packs rather than something we should reinvent.

## Decision

- Install [mattpocock/skills](https://github.com/mattpocock/skills) into `.claude/skills/` (with Cursor routers). Skip his `tdd` skill.
- Vendor [pstack](https://github.com/cursor/plugins/tree/main/pstack) at `vendor/pstack`. Expose `/poteto-mode` and `/setup-pstack` as thin wrappers. Do not copy the rest of the plugin into `.cursor/skills/`.
- TDD authority stays `docs/methodology/tdd.md`.
- Spec/ticket flow: `/grill-with-docs` → `/to-spec` → `/to-tickets`. Keep `write-a-prd` / `prd-to-issues` as the older Trellis path.
- Issue tracker: GitHub Issues. Default triage labels. Single-context `CONTEXT.md` + `docs/adr/`.

## Consequences

- `npx skills update` refreshes Matt Pocock skills; re-copy `vendor/pstack` to refresh pstack.
- Name collisions (`teach`, `prototype`) resolve to the `.claude/skills/` copy. pstack's versions are reached only when `/poteto-mode` reads `vendor/pstack`.
- Desktop Cursor can still `/add-plugin pstack`. Cloud agents use the vendor copy plus `.cursor/environment.json` install.
