# CTO Artifacts

Cross-session engineering leadership documentation. Managed by the CTO skill (`/skill:cto`).

## Structure

```
.cto/
├── README.md           ← you are here
├── decisions/          ← architectural and technical decisions
│   └── YYYY-MM-DD-{slug}.md
├── architecture/       ← system design documentation
│   └── {component}.md
└── tech-debt/          ← tracked technical debt
    └── TD-{NNN}-{slug}.md
```

## How It Works

1. **CTO skill writes here** — when making significant decisions during a session
2. **Next session reads here** — before making new decisions, CTO checks existing ones
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

## Architecture Docs

When to update:
- New major component added
- System boundaries change
- Data flow changes
- Integration points added/removed
