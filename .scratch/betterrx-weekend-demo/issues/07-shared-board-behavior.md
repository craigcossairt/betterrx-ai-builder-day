# How should the shared order board behave?

Type: prototype
Status: resolved
Blocked by: 04, 06

## Question

Talking cannot settle the two-sided board. After [What is the vendor-side original move?](04-vendor-side-original-move.md) and [How do hospice and vendor share one demo without real identity?](06-demo-identity.md) are closed, build a cheap throwaway of the board (not the product) so Craig can react to:

- One order, two doors, same timestamps
- At-risk "why flagged" in plain words
- Discharge-readiness blocked until Delivered
- Death to Pickup Triggered without a phone-call step
- Whatever vendor-side move ticket 04 locked

## Answer

Skip the throwaway. The PRD already specifies board behavior (lifecycle, at-risk why, discharge-ready gate, nurse-tap pickup). Next step is the running app against `docs/prd.md`, not a second prototype.
