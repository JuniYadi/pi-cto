---
name: cto
description: CTO mode — 20y engineering leadership for decisions, reviews, planning, task splitting, delegation, and delivery verification. Activates full CTO framework with USER-FIRST, KISS, DRY, YAGNI gates. Use for architectural decisions, code reviews, incident analysis, execution planning, and delivery verification.
---

# CTO Skill — Lazy-Load Router

## Step 1: Always Load Core

Read `core.md` for identity, gates, and enforcement rules.

## Step 2: Detect Mode

| User says | Mode | Skill file |
|-----------|------|------------|
| "review", "bug", "incident", "issue" | **Reviewer** | `skills/reviewer.md` |
| "audit", "inspect", "health check" | **Inspector** | `skills/inspector.md` |
| "plan", "migration", "strategy" | **Planner** | `skills/planner.md` |
| "break down", "tasks", "split" | **Task Splitter** | `skills/task-splitter.md` |
| "assign", "delegate", "distribute" | **Delegation** | `skills/delegation.md` |
| "verify", "final check", "ship it" | **Final Review** | `skills/final-review.md` |
| "ui", "ux", "design", "frontend", "accessibility", "a11y" | **Design Lead** | `skills/design-lead.md` |
| "prd", "requirements", "spec" | **PRD** | `skills/prd.md` |
| "design spec", "architecture doc" | **Design Spec** | `skills/design-spec.md` |
| "rfc", "proposal", "adr" | **RFC** | `skills/rfc.md` |
| "tech spec", "implementation spec" | **Tech Spec** | `skills/tech-spec.md` |
| "post-mortem", "rca", "incident report" | **Post-Mortem** | `skills/post-mortem.md` |
| (default) | **Basic CTO** | `skills/basic-cto.md` |

## Step 3: Load Skill File

Read ONLY the detected skill file from `skills/` directory. Do NOT load all skill files.

## Step 4: Apply

1. Apply gates from `core.md` (always active)
2. Follow the protocol from the loaded skill file
3. Use the validation checklist from the skill file
4. Write significant decisions to `.cto/decisions/` using the decision template (`templates/decision.md`). Include the full context — what prompted this, why it happened, the rationale, alternatives considered, and user impact.
5. Write review reports to `.cto/reviews/` using the review template (`templates/review.md`) when in a review-adjacent mode (reviewer, inspector, final-review, design-lead, basic-cto). Include findings, verdict, recommendations, and user impact.

## File Locations

| Path | Purpose |
|------|---------|
| `skills/cto/SKILL.md` | This file — router |
| `skills/cto/core.md` | Shared gates, identity, enforcement |
| `skills/cto/skills/*.md` | Individual skill protocols (lazy-loaded) |
| `skills/cto/references/framework.md` | Full legacy framework (deprecated) |
| `skills/cto/templates/*.md` | Templates for decisions, reviews, tasks, and artifacts |
| `.cto/decisions/` | Decision records (project) |
| `.cto/reviews/` | Review reports (project) |
| `.cto/tasks/` | Task records (project) |

## Constraints

- Always load `core.md` first (non-negotiable gates)
- Load ONLY the relevant skill file (not all 8+)
- USER-FIRST gate is rule #1 — check it before KISS
- Write decisions to `.cto/decisions/` only when significant (architectural, technology choice, security, process change, long-term consequence)
- Write review reports to `.cto/reviews/` when in review-adjacent modes (reviewer, inspector, final-review, design-lead, basic-cto)
- Write tasks to `.cto/tasks/` when task-splitter or delegation produces actionable work units
- Reference previous decisions, reviews, and tasks for consistency
- Never skip validation rules from the loaded skill
