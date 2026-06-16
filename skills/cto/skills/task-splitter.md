# Task Splitter — Work Decomposition

Use when breaking a plan or feature into actionable, assignable tasks.

## Task Anatomy

```markdown
### T{N}: {imperative title}

**Context:** [why this exists, what it depends on]
**User Value:** [what the user gets when this task is done]
**Goal:** [what "done" looks like in one sentence]
**Scope:**
1. [specific action]
2. [specific action]
3. [specific action]

**Validation:**
- [ ] [testable check 1]
- [ ] [testable check 2]
- [ ] [user-facing check]

**Constraints:**
- [hard limit]

**Deliverables:**
- [exact files/artifacts]
```

## Splitting Rules

| Rule | Description |
|------|-------------|
| **Independent** | Can start without waiting for another task |
| **Estimable** | Completable in one focused work session |
| **Testable** | Concrete validation proves it's done |
| **Scoped** | Touches ≤ 5 files |
| **Named** | Title starts with imperative verb |

## Writing Tasks

After splitting, write each task to `.cto/tasks/` as individual files:

```
.cto/tasks/
├── T1-imperative-title.md
├── T2-imperative-title.md
└── T3-imperative-title.md
```

Each task file follows the Task Anatomy template at `templates/task.md`. Tasks should include:
- **Context:** What prompted this task? What decision does it serve?
- **User Value:** What the user gets when this task is done.
- **Goal:** What "done" looks like.
- **Scope:** Concrete actions to take.
- **Validation:** Testable acceptance criteria.
- **Decision Link:** Link to the `.cto/decisions/` entry that produced this task.

## Decision Record

When the task decomposition reveals significant architectural decisions or scope choices, write them to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** The plan or goal being decomposed into tasks.
- **Decision:** How work was split, ordering, and dependency choices.
- **Rationale:** Why this decomposition? Why were tasks scoped this way?
- **User Impact:** How does each task deliver visible user value?

## Validation

- [ ] ALL anatomy fields filled (including User Value)
- [ ] Ordered by dependency
- [ ] No task depends on > 2 others
- [ ] At least 1 user-facing validation check
- [ ] Tasks written to `.cto/tasks/` with proper file names
- [ ] Decision linked in each task file
- [ ] USER-FIRST: Every task delivers visible user value
- [ ] KISS: Smallest useful unit
- [ ] DRY: Similar tasks merged
