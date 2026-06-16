---
description: Continue CTO work using lazy-loaded project context; scaffolds missing context for a named slug
argument-hint: "[slug]"
---

# CTO Continue — Lazy Context Gate

Continue CTO work through the single continuation context lifecycle gate without loading unrelated project history.

## Optional Argument

`/cto-continue [slug]`

<slug>$ARGUMENTS</slug>

- With `{slug}`: check the context index, scaffold missing context if needed, then continue from `.cto/context/{slug}.md`.
- Without `{slug}`: check the context index, list available contexts, and guide the user to run `/cto-continue {slug}` or choose a new slug to scaffold.

## Loading Protocol

1. Read `skills/cto/core.md` for gates and enforcement rules.
2. Ensure `.cto/context/` exists before reading or scaffolding continuation files.
3. Read `.cto/context/index.md`; if missing, scaffold it from `skills/cto/templates/context-index.md`.
4. If no slug is provided, use the index only: list available slugs, statuses, and one-line summaries, then ask which slug to continue or scaffold.
5. If a slug is provided, ensure an index row exists for `{slug}`; add a compact row when missing using status `active`, owner `TBD`, today's date, and guide `.cto/context/{slug}.md`.
6. Ensure `.cto/context/{slug}.md` exists; scaffold it from `skills/cto/templates/context-guide.md` when missing, replacing `{Feature / Context Name}`, `{slug}`, status, owner, and date placeholders where possible.
7. Read only `.cto/context/{slug}.md` for the selected slug.
8. Do **not** load other `.cto/context/*.md` files. Read templates only when scaffolding is required.

## Missing Context Handling

- If `.cto/context/index.md` is missing: create `.cto/context/` and scaffold the index from `skills/cto/templates/context-index.md`.
- If no slug is provided after checking the index: list existing contexts if any; otherwise say no contexts exist yet and ask for a slug to scaffold.
- If the slug is not in the index: add a compact `active` row for it before continuing.
- If `.cto/context/{slug}.md` is missing: scaffold it from `skills/cto/templates/context-guide.md`, replacing placeholders where possible.

## Execute

After loading the selected guide:
1. Apply the gates from `core.md`.
2. Continue from the guide's current state, open decisions, next actions, and evidence.
3. Update `.cto/context/index.md` only for summary/status/updated-at changes.
4. Update `.cto/context/{slug}.md` only with material context that will help the next session.
5. Persist significant decisions, reviews, and tasks in the usual `.cto/decisions/`, `.cto/reviews/`, and `.cto/tasks/` locations.
