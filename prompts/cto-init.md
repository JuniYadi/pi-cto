---
description: Initialize CTO artifacts in this project — creates .cto/ directory with templates for decisions, continuation context, architecture, tech debt, and document generation
---

# CTO Init — Scaffold Project Artifacts

Initialize the `.cto/` directory structure in the current project. This enables cross-session CTO persistence and document generation.

## Steps

1. Create directory structure:
```
.cto/
├── README.md
├── decisions/
│   └── _template.md
├── reviews/
│   └── _template.md
├── tasks/
│   └── _template.md
├── context/
│   ├── index.md
│   └── _guide-template.md
├── architecture/
│   └── _template.md
├── tech-debt/
│   └── _template.md
├── prd/
│   └── _template.md
├── design-specs/
│   └── _template.md
├── rfcs/
│   └── _template.md
├── tech-specs/
│   └── _template.md
└── post-mortems/
    └── _template.md
```

2. Copy templates from the CTO skill:
   - Source: `skills/cto/templates/`
   - Destination: `.cto/` in current project

3. Add `.cto/` to `.gitignore` (if not already present)

4. Report what was created

## Template Sources

| Template | Source | Destination |
|----------|--------|-------------|
| README.md | `skills/cto/templates/README.md` | `.cto/README.md` |
| Decision | `skills/cto/templates/decision.md` | `.cto/decisions/_template.md` |
| Review | `skills/cto/templates/review.md` | `.cto/reviews/_template.md` |
| Tech Debt | `skills/cto/templates/tech-debt.md` | `.cto/tech-debt/_template.md` |
| Architecture | `skills/cto/templates/architecture.md` | `.cto/architecture/_template.md` |
| PRD | `skills/cto/templates/prd.md` | `.cto/prd/_template.md` |
| Task | `skills/cto/templates/task.md` | `.cto/tasks/_template.md` |
| Context Index | `skills/cto/templates/context-index.md` | `.cto/context/index.md` |
| Context Guide | `skills/cto/templates/context-guide.md` | `.cto/context/_guide-template.md` |
| Design Spec | `skills/cto/templates/design-spec.md` | `.cto/design-specs/_template.md` |
| RFC | `skills/cto/templates/rfc.md` | `.cto/rfcs/_template.md` |
| Tech Spec | `skills/cto/templates/tech-spec.md` | `.cto/tech-specs/_template.md` |
| Post-Mortem | `skills/cto/templates/post-mortem.md` | `.cto/post-mortems/_template.md` |

## Post-Init

After creating the structure, confirm:
- [ ] All directories created
- [ ] All templates copied
- [ ] `.cto/context/index.md` exists for index-only status checks
- [ ] `.cto/context/_guide-template.md` exists for new `.cto/context/{slug}.md` guides
- [ ] .gitignore updated
- [ ] User knows how to use `/cto`, `/cto-status [slug]`, and `/cto-continue {slug}` for decisions, tasks, continuation context, and document generation
