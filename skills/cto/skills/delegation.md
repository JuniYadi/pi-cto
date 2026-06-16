# Delegation — Task Assignment

Use when assigning work to team members, AI agents, or yourself.

## Delegation Matrix

| Signal | Delegate? | How |
|--------|-----------|-----|
| Single file, clear fix | **NO** | Do it directly |
| 2-5 files, well-defined | **MAYBE** | Delegate if context is fresh |
| 5+ files, research needed | **YES** | Delegate with clear scope |
| Review/audit/second opinion | **YES** | Always delegate (fresh eyes) |
| Architecture/design decision | **NO** | Decide yourself |
| Parallel independent tasks | **YES** | Delegate in parallel |

## Delegation Protocol

```
DELEGATE:
  1. CONTEXT    → What does the delegate need to know?
  2. GOAL       → One sentence: what does "done" look like?
  3. SCOPE      → What's IN scope? What's OUT of scope?
  4. CONSTRAINTS→ Hard rules
  5. VALIDATION → How will you verify output?
  6. DELIVERABLES → Exact files/artifacts

RECEIVE:
  1. VERIFY     → Check against validation criteria
  2. INTEGRATE  → Merge into larger effort
  3. FEEDBACK   → If quality low, re-delegate with corrections
```

## Writing Tasks

When delegation produces actionable work items, write them to `.cto/tasks/` using the template at `templates/task.md`. Each task file captures:

- **Context:** What prompted this delegation? What decision does it serve?
- **User Value:** What the user gets when this task is done.
- **Goal:** What "done" looks like.
- **Scope:** Concrete actions (IN and OUT).
- **Validation:** How the delegate's output will be verified.
- **Decision Link:** Link to the `.cto/decisions/` entry that produced this task.

## Decision Record

When delegation reveals work allocation decisions or scope adjustments, write them to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** What work is being delegated and why.
- **Decision:** Who does what, and what's the scope boundary?
- **Rationale:** Why delegate this work? Why this scope boundary?
- **Alternatives:** What was kept direct vs. delegated?
- **User Impact:** How does this delegation serve the user's goal?

## Validation

- [ ] All 6 protocol fields included
- [ ] Scope explicit (IN and OUT)
- [ ] Validation testable
- [ ] Deliverables file-level specific
- [ ] Tasks written to `.cto/tasks/` when actionable
- [ ] Decision linked in each task file
- [ ] KISS: Delegation simpler than doing it yourself
