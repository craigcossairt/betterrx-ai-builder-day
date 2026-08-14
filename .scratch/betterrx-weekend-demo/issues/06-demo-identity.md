# How do hospice and vendor share one demo without real identity?

Type: grilling
Status: resolved
Blocked by: none

## Question

Judges need to click both sides and see the same order. There is no real hospice SSO, no vendor IAM, and no time for Clerk. How do two people (or one person with two browsers) act as hospice and vendor in the demo?

Options to stress:

1. **Role switcher** on one URL: Hospice | Vendor. Same session, different chrome. Fastest. Risk: feels like one app with a costume change, not two sides.
2. **Two routes, one store:** `/hospice` and `/vendor` (or two subdomains). Open both. Shared Realtime row. Still no login.
3. **Fixture logins** (case.manager@ / dispatcher@) with a magic-link or password. Looks more "real." Costs an hour and the Supabase SSR cookie path.
4. **Invite link as the vendor identity.** Hospice is a role switcher; vendor arrives on a per-order claim link. Makes cold-start visible. Awkward if the judge starts on the vendor side.

Recommended starting point: (2), plus a visible role control so a single laptop can still flip. Pitch line: production is hospice SSO and vendor invite; Saturday is two doors on one store.

## Answer

`docs/prd.md`: hospice role switcher (admissions nurse / case manager / DON). No real auth. Vendor does not need a portal login; confirm via a simulated SMS / magic-link inbox in the demo. A `/vendor` door is stretch.
