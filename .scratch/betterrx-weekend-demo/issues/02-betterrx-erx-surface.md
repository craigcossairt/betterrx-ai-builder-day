# What BetterRX eRx surface can we sketch against?

Type: research
Status: resolved
Blocked by: none

## Question

What public BetterRX pharmacy / eRx surface can a weekend demo credibly name in an integration sketch? What patient and order data do they already move, which EMRs have a field-level story, and is there a public API?

## Answer

Sketch a partner-connection data share, not a public API (none found). Name Connected RX / Better ePrescribe for meds and Order Hub as the pharmacy-side analog. Attach DME as a second order on the same patient key, not inside ePrescribe. Prefer MatrixCare (two-sided round-trip) or Axxess (best event list) as the EMR in the diagram.

Full writeup: [02-betterrx-erx-surface.md](../research/02-betterrx-erx-surface.md)
