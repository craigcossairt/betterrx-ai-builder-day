#!/usr/bin/env bash
# Create the triage + wayfinder labels /triage and /wayfinder expect.
# Safe to re-run. Needs a GitHub token with issues: write (cloud-agent tokens
# often cannot do this — run it on a laptop with `gh auth`).
set -euo pipefail

create() {
  local name="$1" color="$2" desc="$3"
  if gh label list --json name --jq '.[].name' | grep -Fxq "$name"; then
    echo "exists: $name"
    return 0
  fi
  gh label create "$name" --color "$color" --description "$desc"
}

create "needs-triage" "FBCA04" "Maintainer needs to evaluate this issue"
create "needs-info" "D93F0B" "Waiting on reporter for more information"
create "ready-for-agent" "0E8A16" "Fully specified, ready for an AFK agent"
create "ready-for-human" "1D76DB" "Requires human implementation"
create "wontfix" "ffffff" "Will not be actioned"
create "wayfinder:map" "5319E7" "Wayfinder map issue"
create "wayfinder:research" "C5DEF5" "Wayfinder research ticket"
create "wayfinder:prototype" "C5DEF5" "Wayfinder prototype ticket"
create "wayfinder:grilling" "C5DEF5" "Wayfinder grilling ticket"
create "wayfinder:task" "C5DEF5" "Wayfinder implementation ticket"
