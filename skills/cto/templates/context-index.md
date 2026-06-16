# CTO Continuation Context Index

Compact index for `/cto-status` and `/cto-continue`. Keep this file short so status checks do not load full feature guides.

## Contexts

| Slug | Status | Owner | Updated | Summary | Guide |
|------|--------|-------|---------|---------|-------|
| `example-feature` | active | TBD | YYYY-MM-DD | One-line current state and goal. | `.cto/context/example-feature.md` |

## Status Values

- `active` — work is currently in progress
- `blocked` — cannot proceed without external input or dependency
- `paused` — intentionally deferred
- `done` — completed; retained for history
- `archived` — no longer relevant for active work

## Protocol

- `/cto-status [slug]` reads this file only.
- `/cto-continue [slug]` is the lifecycle gate: with a slug, check/add the index row, scaffold the guide if missing, then read that guide only; without a slug, list contexts and guide the user.
- Do not paste full guide details here; keep summaries index-sized.
