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
├── architecture/       ← system design documentation
│   └── {component}.md
└── tech-debt/          ← tracked technical debt
    └── TD-{NNN}-{slug}.md
```

## How It Works

1. **CTO skill writes decisions** to `.cto/decisions/`, **reviews** to `.cto/reviews/`, and **tasks** to `.cto/tasks/` during a session
2. **Next session reads here** — before making new decisions, CTO checks existing ones and pending tasks
3. **Gitignored** — these are working documents, not source code

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
