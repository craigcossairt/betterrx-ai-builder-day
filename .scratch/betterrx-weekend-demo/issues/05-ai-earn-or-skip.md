# Where does AI earn its score versus an honest skip?

Type: grilling
Status: resolved
Blocked by: 01

## Question

The rubric is 15% AI ROI. The brief scores an honest "rules are better here" as judgment, not a penalty. Statuses and patient facts must stay grounded. High-stakes actions stay human-confirmed.

[What transaction shape do the sample orders imply?](01-sample-order-shape.md) shows both sample risk cards are clean thresholds (ETA vs discharge window; days since pickup trigger). The brief says an LLM standing in for an if/then will not score well.

Where, if anywhere, does AI beat a named rules baseline this weekend?

Options to stress:

1. **Honest skip.** At-risk is ETA vs window (and elapsed time vs pickup window). Write the comparison in the pitch. Spend the 15% on that defense.
2. **AI explains, rules decide.** Rules emit structured reasons; a model turns them into the "why flagged" sentence. Baseline: a template. Why would the model win?
3. **AI on vendor cold-start copy** (invite email, onboarding checklist). Baseline: a template. High-stakes? No. Differentiating? Weak.
4. **AI risk model** on vendor history × order type × geography. The brief's "good reasons AI wins" list. We have six synthetic rows, not a history. Unsafe to fake.

`docs/primary-bounty.md` already leans (1): rules first, AI only if it beats that baseline out loud.

## Answer

Honest skip. `docs/prd.md` and `docs/primary-bounty.md`: at-risk is `eta > deadline` (or pickup SLA elapsed). Guardrail ranking is beats-window, then price, then known stock. Do not use a model to write the "why flagged" sentence. Optional later: diagnosis to suggested equipment with human confirm. Not this weekend.
