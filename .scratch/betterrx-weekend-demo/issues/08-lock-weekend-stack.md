# Which weekend stack do we lock?

Type: grilling
Status: resolved
Blocked by: 03

## Question

[Which stack ships a two-sided live board fastest this weekend?](03-weekend-stack.md) found nothing clearly faster than Bloom's stack: Next.js App Router, hosted Supabase (Postgres + Realtime), Vercel. SQLite on Vercel cannot be the shared board. Convex is live with fewer lines but is a new backend.

Do we lock that, or is there a reason to pay for something else (event credits, a Convex comfort pick, no Supabase project available tonight)?

Recommended starting point: lock Next.js + hosted Supabase + Vercel. Skip Docker. Skip full Auth until [How do hospice and vendor share one demo without real identity?](06-demo-identity.md) says otherwise.

## Answer

Lock Bloom's stack as the default: Next.js + TypeScript + Tailwind on Vercel. Supabase (Postgres) only if a real table is needed; otherwise fixture JSON for the first clickable slice. Skip Docker and full Auth. See `docs/prd.md` Implementation Decisions.
