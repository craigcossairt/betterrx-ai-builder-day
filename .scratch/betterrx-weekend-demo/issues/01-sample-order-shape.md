# What transaction shape do the sample orders imply?

Type: research
Status: resolved
Blocked by: none

## Question

What fields, statuses, and timestamps do the six synthetic sample orders actually carry, and what at-risk rule do the two risk cards already demonstrate in prose?

## Answer

One shared card: order id, lifecycle status, patient id, hospice, HCPCS equipment (one or many), and a plain-language note. Vendor is absent until Dispatched. At-risk on the sample is a clean threshold (ETA misses the discharge window by ~40 minutes; pickup with no retrieval for 4 days), not a multivariate score.

Full writeup: [01-sample-order-shape.md](../research/01-sample-order-shape.md)
