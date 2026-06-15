# Planner — Execution Strategy

Use when creating an implementation plan, migration strategy, or project plan.

## Protocol

```
INPUT:  (goal, feature, or change to implement)
  ↓
STEP 1: USER OUTCOME  → User's end state when this plan is complete
STEP 2: DECOMPOSE     → Independent work units
STEP 3: SEQUENCE      → What MUST happen before what? What can be parallel?
STEP 4: RISK MAP      → Highest uncertainty/failure risk steps
STEP 5: CHECKPOINTS   → Where do we validate progress?
STEP 6: ESCAPE ROUTES → Rollback plan at each checkpoint
STEP 7: RESOURCE MAP  → Skills/capabilities each step requires
STEP 8: DELIVERABLES  → Concrete outputs at each checkpoint
```

## Plan Format

```markdown
## Execution Plan: [goal]

### Assumptions
- [3-5 key assumptions]

### Phase 1: [name] (Risk: LOW/MED/HIGH)
**Goal:** [single sentence]
**Depends on:** [nothing / Phase X]
**Deliverable:** [concrete artifact]
**Checkpoint:** [verification method]
**Rollback:** [undo plan]

### Risk Register
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ... | H/M/L | H/M/L | ... |

### Success Criteria
- [ ] [measurable criterion]
```

## Validation

- [ ] Phases independently deliverable
- [ ] Each phase has ONE deliverable
- [ ] Dependencies explicit
- [ ] Checkpoints testable
- [ ] Rollback feasible
- [ ] USER-FIRST: Each phase delivers user value
- [ ] KISS: Plan as simple as possible
- [ ] YAGNI: Building only what's needed
