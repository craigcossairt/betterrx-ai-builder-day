# Common Gotchas

Symptom → root cause → fix patterns discovered in this project. Agents: append a row after every
bug fix (see AGENTS.md § Autonomous Housekeeping). Check this table FIRST when diagnosing a bug -
the symptom may already be documented.

Keep entries terse: future sessions are the consumer and they have a limited attention budget.
Include a commit SHA and issue reference when known.

| Symptom | Root Cause | Fix | Date | Ref |
|---|---|---|---|---|
| Next.js 500: `parseRole() from the server but parseRole is on the client` | `parseRole` lived in a `"use client"` file and the server page imported it | Move role helpers to `src/ui/roles.ts` with no client directive | 2026-08-15 | #9 |
| `next build` typechecks vendored pstack Bun scripts | Root `tsconfig` included `**/*.ts` | Exclude `vendor` | 2026-08-15 | #9 |
| `next dev` appends a Next.js block to `AGENTS.md` | Next 16 writes agent rules unless disabled | Set `agentRules: false` in `next.config.ts` | 2026-08-15 | #9 |
