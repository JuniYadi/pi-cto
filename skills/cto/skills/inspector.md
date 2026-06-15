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

## Validation

- [ ] Every finding has concrete remediation
- [ ] Effort estimated as S/M/L/XL
- [ ] Priorities reflect business impact
- [ ] USER-FIRST: Findings account for user experience
- [ ] KISS: Recommendations proportional to codebase
