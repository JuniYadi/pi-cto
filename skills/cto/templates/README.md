# CTO Artifacts

Cross-session engineering leadership documentation. Managed by the CTO skill (`/skill:cto`).

## Structure

```
.cto/
├── README.md           ← you are here
├── decisions/          ← architectural and technical decisions
│   └── YYYY-MM-DD-{slug}.md
├── reviews/            ← review reports (reviewer, inspector, final-review, design-lead)
│   └── YYYY-MM-DD-{slug}.md
├── tasks/              ← actionable work units from decisions
│   └── T{NNN}-{slug}.md
├── context/            ← lazy-loaded continuation context
│   ├── index.md        ← compact status index
│   └── {slug}.md       ← one feature/context guide
├── architecture/       ← system design documentation
│   └── {component}.md
└── tech-debt/          ← tracked technical debt
    └── TD-{NNN}-{slug}.md
```

## How It Works

1. **CTO skill writes decisions** to `.cto/decisions/`, **reviews** to `.cto/reviews/`, and **tasks** to `.cto/tasks/` during a session
2. **Continuation context is lazy-loaded** from `.cto/context/`: status reads only the index; continuation reads one named guide
3. **Next session reads only what is needed** — use `/cto-status [slug]` for summaries and `/cto-continue {slug}` for a specific feature guide
4. **Gitignored** — these are working documents, not source code

## Continuation Context

Use continuation context for long-running features, migrations, incidents, or areas where future CTO sessions need a compact handoff.

- Index: `.cto/context/index.md` is scaffolded from the CTO package `context-index.md` template.
- Guide template: `.cto/context/_guide-template.md` is scaffolded from the CTO package `context-guide.md` template.
- Feature guide: copy `.cto/context/_guide-template.md` to `.cto/context/{slug}.md` for each long-running feature/context.
- `/cto-status` lists all indexed slugs without reading guides.
- `/cto-status {slug}` reports the indexed status for one slug without reading the guide.
- `/cto-continue {slug}` reads the index plus `.cto/context/{slug}.md` only.

Keep the index short. Keep each guide focused on current state, decisions, blockers, next actions, relevant files, and evidence.

## Decision Log

When to write a decision:
- Architectural choice (database, framework, pattern)
- Technology selection (library, service, tool)
- Process change (workflow, convention, standard)
- Security decision (auth model, data handling)
- Any choice with long-term consequences

When NOT to write:
- Minor code style choices
- Bug fixes (unless revealing a systemic issue)
- Temporary workarounds

## Tech Debt

When to create a tech debt entry:
- During code review / inspection
- When identifying shortcuts taken
- When discovering outdated dependencies
- When finding missing tests/docs/monitoring

## Review Reports

When to write a review file:
- **Reviewer mode:** After analyzing a bug, incident, or issue — capture findings, root cause, fix path
- **Inspector mode:** After auditing code or architecture — capture findings, priorities, remediation
- **Final Review mode:** After verifying implementation — capture verdict, gaps, evidence
- **Design Lead mode:** After reviewing UI/UX — capture findings, recommendations, accessibility issues
- **Basic CTO mode:** When a recommendation or analysis is significant enough to persist

Review format: `YYYY-MM-DD-{slug}.md` using the template at `templates/review.md`.

## Tasks

When to create a task entry:
- During task splitting from a plan
- When delegation produces actionable work units
- When a decision has concrete follow-up steps
- When post-mortem, inspection, or review reveals remediation work

Task format: `T{NNN}-{slug}.md` using the template at `templates/task.md`.

## Architecture Docs

When to update:
- New major component added
- System boundaries change
- Data flow changes
- Integration points added/removed
