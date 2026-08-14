# Which stack ships a two-sided live board fastest this weekend?

Type: research
Status: resolved
Blocked by: none

## Question

Given Bloom already runs Next.js + Supabase + Vercel, is anything clearly faster for a 24-hour two-sided live order board (same row, same status, same timestamps in two browsers)?

## Answer

No. Use Next.js App Router + hosted Supabase (Postgres + Realtime Postgres Changes) + Vercel. SQLite on Vercel is not a shared store. Neon/Turso persist rows but have no first-class live subscription. Convex `useQuery` is live with fewer lines, but it is a new backend plus extra deploy/auth surface, so it is not clearly faster for this builder. Skip Docker and full SSR Auth unless a later grilling ticket says otherwise.

Full writeup: [03-weekend-stack.md](../research/03-weekend-stack.md)

This is a fact-finding answer. Stack lock is [Which weekend stack do we lock?](08-lock-weekend-stack.md).
