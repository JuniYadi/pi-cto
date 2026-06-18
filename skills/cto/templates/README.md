# CTO Artifacts

Cross-session engineering leadership documentation. Managed by the CTO skill (`/skill:cto`).

## Structure

```
.cto/
├── README.md           ← you are here
├── decisions/          ← architectural and technical decisions
│   └── YYYY-MM-DD-{slug}.md
├── reviews/            ← review reports (reviewer, inspector, final-review, design-lead, cleanup)
│   └── YYYY-MM-DD-{slug}.md
├── tasks/              ← actionable work units from plans, delegation, implementation
│   └── T{NNN}-{slug}.md
├── context/            ← lazy-loaded continuation context
│   ├── index.md        ← compact status index
│   └── {slug}.md       ← one feature/context guide
├── architecture/       ← system design documentation
│   └── {component}.md
├── tech-debt/          ← tracked technical debt and cleanup targets
│   └── TD-{NNN}-{slug}.md
├── prd/                ← product requirements documents
│   └── {feature}.md
├── design-specs/       ← architecture & API design docs
│   └── {feature}.md
├── rfcs/               ← technical proposals
│   └── RFC-{NNN}-{slug}.md
├── tech-specs/         ← implementation specifications
│   └── {feature}.md
└── post-mortems/       ← incident RCAs
    └── YYYY-MM-DD-{slug}.md
```

## How It Works

1. **CTO skill writes decisions** to `.cto/decisions/`, **reviews** to `.cto/reviews/`, and **tasks** to `.cto/tasks/` during a session
2. **Workflow presets** route common sequences (`prd-first`, `fast-fix`, `architecture`, `audit`, `planning-only`, `continue`, `cleanup-flow`) without replacing explicit mode commands
3. **Continuation context is lazy-loaded** from `.cto/context/`: status reads only the index; continuation checks/scaffolds as needed and reads one named guide
4. **Next session reads only what is needed** — use `/cto-status [slug]` for summaries and `/cto-continue [slug]` as the continuation lifecycle gate
5. **Gitignored** — these are working documents, not source code

## Lifecycle & Artifact Validation

Use lightweight phases: discover → specify → plan → implement → verify → cleanup → continue/archive.

Before advancing a phase, validate the relevant artifact only:

- PRD, design spec, RFC, or tech spec for scope/design.
- Plan, task, or delegation artifact for execution readiness.
- Context guide for resumed work.
- Test/log/manual evidence for implementation and final review.
- Tech-debt, review, or context updates for cleanup/archive.

## Continuation Context

Use continuation context for long-running features, migrations, incidents, or areas where future CTO sessions need a compact handoff.

- Index: `.cto/context/index.md` is scaffolded from the CTO package `context-index.md` template.
- Guide template: `.cto/context/_guide-template.md` is scaffolded from the CTO package `context-guide.md` template.
- Feature guide: `/cto-continue {slug}` can scaffold `.cto/context/{slug}.md` from the guide template for each long-running feature/context.
- `/cto-status` lists all indexed slugs without reading guides.
- `/cto-status {slug}` reports the indexed status for one slug without reading the guide.
- `/cto-continue [slug]` checks the index, scaffolds missing index/guide context when needed, and with a slug reads `.cto/context/{slug}.md` only.

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

When to create or update a tech debt entry:
- During code review / inspection
- When identifying shortcuts taken
- When discovering outdated dependencies
- When finding missing tests/docs/monitoring
- When cleanup removes, reduces, or intentionally defers debt

## Review Reports

When to write a review file:
- **Reviewer mode:** After analyzing a bug, incident, or issue — capture findings, root cause, fix path
- **Inspector mode:** After auditing code or architecture — capture findings, priorities, remediation
- **Final Review mode:** After verifying implementation — capture verdict, gaps, evidence
- **Design Lead mode:** After reviewing UI/UX — capture findings, recommendations, accessibility issues
- **Cleanup mode:** When behavior-preserving cleanup needs a before/after rationale and evidence
- **Basic CTO mode:** When a recommendation or analysis is significant enough to persist

Review format: `YYYY-MM-DD-{slug}.md` using the template at `templates/review.md`.

## Tasks

When to create a task entry:
- During task splitting from a plan
- When delegation produces actionable work units
- When implementation needs tracked follow-up or evidence across sessions
- When a decision has concrete follow-up steps
- When post-mortem, inspection, or review reveals remediation work

Task format: `T{NNN}-{slug}.md` using the template at `templates/task.md`.

## Architecture Docs

When to update:
- New major component added
- System boundaries change
- Data flow changes
- Integration points added/removed
