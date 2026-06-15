# RFC — Request for Comments (Technical Proposal)

Use when proposing a technical change, architecture decision, or significant implementation approach for team review.

## Protocol

```
INPUT:  (technical proposal, architecture change, or approach)
  ↓
STEP 1: CONTEXT       → What problem are we solving? Why now?
STEP 2: OPTIONS       → What are 2-3 viable approaches?
STEP 3: DECISION      → Recommend ONE. State trade-offs explicitly.
STEP 4: CONSEQUENCES  → What changes? What's the impact?
STEP 5: ALTERNATIVES  → What did we reject and why?
STEP 6: MIGRATION     → How do we get from here to there?
STEP 7: RISKS         → What could go wrong? Mitigations?
STEP 8: OPEN QUESTIONS→ What do we still need to decide?
```

## RFC Structure

```markdown
# RFC-[NNN]: [Title]

**Author:** [name]
**Date:** YYYY-MM-DD
**Status:** Draft | Review | Accepted | Rejected | Superseded
**Reviewers:** [who should review]
**Decision Date:** [when will this be decided]

## Summary
[1-2 sentence summary of what this RFC proposes]

## Problem
[What problem exists? Why is it urgent enough to act now?]

## Motivation
[Why should we solve this? What's the cost of not solving it?]

## Proposal

### Approach A: [Name]
**How it works:** [description]
**Pros:** [benefits]
**Cons:** [drawbacks]
**Effort:** [S/M/L/XL]

### Approach B: [Name]
**How it works:** [description]
**Pros:** [benefits]
**Cons:** [drawbacks]
**Effort:** [S/M/L/XL]

### Recommended: [Approach X]
**Why:** [rationale]
**Trade-offs:** [what we're accepting]

## Consequences

### Positive
- [positive outcome 1]
- [positive outcome 2]

### Negative
- [negative outcome 1]
- [negative outcome 2]

### Neutral
- [change that's neither positive nor negative]

## Alternatives Considered
| Option | Why Rejected |
|--------|--------------|
| [alternative] | [reason] |

## Migration Plan
| Step | Action | Owner | Rollback |
|------|--------|-------|----------|
| 1 | [action] | [owner] | [rollback] |
| 2 | [action] | [owner] | [rollback] |

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [risk] | H/M/L | H/M/L | [mitigation] |

## Open Questions
- [ ] [question 1]
- [ ] [question 2]

## Timeline
| Milestone | Date |
|-----------|------|
| Review complete | [date] |
| Implementation start | [date] |
| Implementation complete | [date] |

## References
- [link to related docs, PRDs, or prior RFCs]
```

## Validation

- [ ] Problem is clear and urgent enough to warrant an RFC
- [ ] Multiple options are presented (not just one)
- [ ] Trade-offs are explicit (not hidden)
- [ ] Consequences are complete (positive, negative, neutral)
- [ ] Migration plan has rollback at each step
- [ ] Risks have mitigations
- [ ] USER-FIRST: Change serves user needs
- [ ] KISS: Simplest approach that works
- [ ] DRY: Not duplicating existing solutions
