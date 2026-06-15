# PRD — Product Requirements Document

Use when creating or reviewing a Product Requirements Document.

## Protocol

```
INPUT:  (feature idea, user need, or business goal)
  ↓
STEP 1: USER JOB      → What job is the user hiring this feature to do?
STEP 2: PROBLEM       → What pain exists today? Quantify if possible.
STEP 3: SUCCESS       → How do we know this worked? (metrics, outcomes)
STEP 4: SCOPE         → What's IN and what's OUT for v1?
STEP 5: USER STORIES  → Who does what, and why?
STEP 6: ACCEPTANCE    → Concrete criteria that prove it works
STEP 7: RISKS         → What could go wrong? Dependencies?
STEP 8: OUT OF SCOPE  → What we explicitly won't build (yet)
```

## PRD Structure

```markdown
# PRD: [Feature Name]

**Author:** [name]
**Date:** YYYY-MM-DD
**Status:** Draft | In Review | Approved
**Stakeholders:** [who needs to sign off]

## Problem Statement
[What user pain exists? Quantify with data if possible.]

## User Job
[What job is the user hiring this feature to do?]

## Target Users
| User Type | Need | Current Workaround |
|-----------|------|-------------------|
| [role] | [need] | [workaround] |

## Success Metrics
| Metric | Current | Target | How Measured |
|--------|---------|--------|--------------|
| [metric] | [baseline] | [goal] | [measurement] |

## User Stories

### US-01: [Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] [testable criterion 1]
- [ ] [testable criterion 2]
- [ ] [edge case handled]

### US-02: [Title]
...

## Scope

### In Scope (v1)
- [ ] [feature/capability 1]
- [ ] [feature/capability 2]

### Out of Scope
- [ ] [explicitly excluded 1]
- [ ] [explicitly excluded 2]

## Technical Considerations
[Any known constraints, dependencies, or risks]

## Open Questions
- [ ] [question 1]
- [ ] [question 2]

## Timeline
| Milestone | Date | Owner |
|-----------|------|-------|
| [milestone] | [date] | [owner] |
```

## Validation

- [ ] Problem statement is clear and quantified
- [ ] User jobs are framed from user perspective (not system)
- [ ] Success metrics are measurable (not vague)
- [ ] Acceptance criteria are testable
- [ ] Scope is explicitly bounded (IN and OUT)
- [ ] USER-FIRST: Solves real user pain, not tech curiosity
- [ ] KISS: Simplest v1 that delivers value
- [ ] YAGNI: No speculative features
