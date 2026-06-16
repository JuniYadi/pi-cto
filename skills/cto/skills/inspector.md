# Inspector — Code & System Audit

Use when asked to audit code, review architecture, inspect a module, or evaluate system health.

## Protocol

```
INPUT:  (codebase, module, architecture, or system)
  ↓
STEP 1: MAP           → Key components and responsibilities
STEP 2: BOUNDARIES    → Module/service boundaries — are they clean?
STEP 3: DEPENDENCIES  → What depends on what? Coupling risks?
STEP 4: DEBT          → Technical debt — rank by severity and impact
STEP 5: HEALTH        → What's working well? (Celebrate good engineering)
STEP 6: GAPS          → What's missing? (Tests, docs, monitoring, error handling)
STEP 7: PRIORITIES    → P0 (blocks delivery) → P3 (nice to have)
```

## Inspection Checklist

### Architecture
- [ ] Single Responsibility: ONE clear purpose per module?
- [ ] Dependency Direction: Pointing inward (toward domain core)?
- [ ] API Surface: Minimal and intentional?
- [ ] Data Flow: Traceable from entry to exit?

### Code Quality
- [ ] DRY: No duplicated logic
- [ ] KISS: No premature abstractions
- [ ] YAGNI: No unused features
- [ ] Error Handling: Every failure path explicit
- [ ] Naming: Stranger-understandable in 5 seconds?

### System Health
- [ ] Observability: Debug from logs/metrics alone?
- [ ] Resilience: Dependency failure handled? (timeout, retry, circuit break)
- [ ] Security: Input validated? Auth checked? Secrets rotated?
- [ ] Testing: Critical paths covered?

### User-First
- [ ] Data Surface: Only useful data shown? (no internal IDs, system fields)
- [ ] Job Alignment: Interface organized around user's job?
- [ ] Error Messages: Helpful message or stack trace?
- [ ] Action Clarity: Primary action obvious in 2 seconds?
- [ ] Complexity: Simpler way to achieve same user outcome?

## Writing Review Report

After completing the inspection, write the full report to `.cto/reviews/` using the template at `templates/review.md`. Name the file `YYYY-MM-DD-{slug}.md`. Capture:

- **Input:** What codebase, module, or system was inspected.
- **Findings:** Key issues discovered (architecture, code quality, system health, user-first) — ranked by severity with evidence.
- **Verdict:** Overall health assessment and priority summary.
- **Recommendations:** Remediation steps for each finding with effort estimates.
- **User Impact:** How do these issues affect the user's experience?

This file persists across sessions — don't leave findings only in the chat.

## Decision Record

When significant findings or remediation priorities emerge from an inspection, write them to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** What was inspected? What triggered this audit?
- **Findings:** Key issues discovered, ranked by severity.
- **Decision:** What remediation path was chosen? What debt is accepted vs. addressed?
- **Rationale:** Why this priority order? Why is some debt being deferred?
- **User Impact:** How do these issues affect the user? What improves after remediation?

## Validation

- [ ] Every finding has concrete remediation
- [ ] Effort estimated as S/M/L/XL
- [ ] Priorities reflect business impact
- [ ] USER-FIRST: Findings account for user experience
- [ ] KISS: Recommendations proportional to codebase
