---
description: Continue CTO work for a feature/context slug using lazy-loaded project context
argument-hint: "{slug}"
---

# CTO Continue — Lazy Context Resume

Resume CTO work for a specific continuation context without loading unrelated project history.

## Required Argument

`/cto-continue {slug}` where `{slug}` matches an entry in `.cto/context/index.md` and a guide at `.cto/context/{slug}.md`.

If no slug is provided:
1. Read only `.cto/context/index.md`.
2. List available slugs, statuses, and one-line summaries.
3. Ask the user which slug to continue.

## Loading Protocol

1. Read `skills/cto/core.md` for gates and enforcement rules.
2. Read `.cto/context/index.md`.
3. Find the requested `{slug}` entry.
4. Read only `.cto/context/{slug}.md` for the selected slug.
5. Do **not** load other `.cto/context/*.md` files unless the user explicitly asks and explains why.

## Missing Context Handling

- If `.cto/context/index.md` is missing: ask the user to run `/cto-init` or create the index from `skills/cto/templates/context-index.md`.
- If the slug is not in the index: report it as unknown using only the index, then suggest adding `.cto/context/{slug}.md` from `skills/cto/templates/context-guide.md`.
- If the slug is indexed but `.cto/context/{slug}.md` is missing: report the broken reference and ask whether to scaffold it.

## Execute

After loading the selected guide:
1. Apply the gates from `core.md`.
2. Continue from the guide's current state, open decisions, next actions, and evidence.
3. Update `.cto/context/index.md` only for summary/status/updated-at changes.
4. Update `.cto/context/{slug}.md` only with material context that will help the next session.
5. Persist significant decisions, reviews, and tasks in the usual `.cto/decisions/`, `.cto/reviews/`, and `.cto/tasks/` locations.
