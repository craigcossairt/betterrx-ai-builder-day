# Domain Docs

How the engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root
- **`docs/adr/`** — read ADRs that touch the area you're about to work in
- **`docs/primary-bounty.md`** and **`docs/hackathon.md`** for the weekend slice (not glossary)

If any of these files don't exist, proceed silently. `/domain-modeling` creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── docs/adr/
└── docs/
```

## Use the glossary's vocabulary

When your output names a domain concept, use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use, or there's a real gap to note for `/domain-modeling`.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding.
