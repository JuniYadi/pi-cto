---
description: Show CTO continuation status from the context index without loading full feature guides
argument-hint: "[{slug}]"
---

# CTO Status — Index-Only Continuation Summary

Report CTO continuation status while preserving tokens.

## Loading Protocol

1. Read `.cto/context/index.md` only.
2. Do **not** read `.cto/context/{slug}.md` files by default.
3. If `.cto/context/index.md` is missing, tell the user to run `/cto-init` or create it from `skills/cto/templates/context-index.md`.

## Behavior

- `/cto-status` lists all indexed slugs with status, owner, last updated date, and one-line summary.
- `/cto-status {slug}` reports the indexed status and summary for that slug only.
- If the slug is not indexed, say it is unknown and suggest `/cto-continue {slug}` only after adding an index entry and guide.

## Escalation

Only read `.cto/context/{slug}.md` when the user explicitly asks for details that are not present in the index. State that this is a token-expanding action before doing so.
