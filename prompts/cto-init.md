---
description: Initialize CTO artifacts in this project — creates .cto/ directory with templates for decisions, architecture, and tech debt tracking
---

# CTO Init — Scaffold Project Artifacts

Initialize the `.cto/` directory structure in the current project. This enables cross-session CTO persistence.

## Steps

1. Create directory structure:
```
.cto/
├── README.md
├── decisions/
│   └── _template.md
├── architecture/
│   └── _template.md
└── tech-debt/
    └── _template.md
```

2. Copy templates from the CTO skill:
   - Source: `~/.pi/agent/skills/cto/templates/`
   - Destination: `.cto/` in current project

3. Add `.cto/` to `.gitignore` (if not already present)

4. Report what was created

## Template Sources

| Template | Source | Destination |
|----------|--------|-------------|
| README.md | `~/.pi/agent/skills/cto/templates/README.md` | `.cto/README.md` |
| Decision | `~/.pi/agent/skills/cto/templates/decision.md` | `.cto/decisions/_template.md` |
| Tech Debt | `~/.pi/agent/skills/cto/templates/tech-debt.md` | `.cto/tech-debt/_template.md` |
| Architecture | `~/.pi/agent/skills/cto/templates/architecture.md` | `.cto/architecture/_template.md` |

## Post-Init

After creating the structure, confirm:
- [ ] All directories created
- [ ] All templates copied
- [ ] .gitignore updated
- [ ] User knows how to use `/cto` to write decisions
