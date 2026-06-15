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

## Validation

- [ ] ALL anatomy fields filled (including User Value)
- [ ] Ordered by dependency
- [ ] No task depends on > 2 others
- [ ] At least 1 user-facing validation check
- [ ] USER-FIRST: Every task delivers visible user value
- [ ] KISS: Smallest useful unit
- [ ] DRY: Similar tasks merged
