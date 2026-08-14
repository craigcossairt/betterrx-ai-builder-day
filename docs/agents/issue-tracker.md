# Issue tracker: Local Markdown (weekend map)

Issues and specs for this repo are intended to live in **GitHub Issues**
(`https://github.com/craigcossairt/betterrx-ai-builder-day/issues`). This charting
session could not create GitHub issues (the cloud-agent token has no issues
permission), so the active wayfinder map lives as markdown under `.scratch/`.

When GitHub Issues is writable, migrate the map rather than running two trackers.

## Conventions

- One effort per directory: `.scratch/<effort>/`
- The spec (after `/to-spec`) is `.scratch/<effort>/spec.md`
- Wayfinder tickets are one file per ticket at `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`
- Research notes live at `.scratch/<effort>/research/NN-<slug>.md` and are linked from the ticket answer
- Comments append under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<effort>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` — Destination / Notes / Decisions-so-far / Not yet specified / Out of scope.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`. A `Type:` line records `research` / `prototype` / `grilling` / `task`. A `Status:` line records `open` / `claimed` / `resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top, or `Blocked by: none`. A ticket is unblocked when every listed file is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are `open`, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far.

Active map: `.scratch/betterrx-weekend-demo/map.md`.
