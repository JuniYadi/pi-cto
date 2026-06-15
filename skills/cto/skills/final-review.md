# Final Review — Implementation Verification

Use before marking any implementation as complete.

## Protocol

```
INPUT:  (completed implementation)
  ↓
STEP 1: INTENT       → Original goal (re-read the requirement)
STEP 2: DELIVER      → What was actually built
STEP 3: DELTA        → Gap analysis (deliver vs. intent)
STEP 4: QUALITY      → Code quality checklist
STEP 5: RISK         → New risks introduced
STEP 6: EVIDENCE     → Proof it works (tests, logs, output)
STEP 7: VERDICT      → Ship / Fix / Rework
```

## Quality Checklist (Must pass ALL)

### User-First (Check FIRST)
- [ ] User's job is completable
- [ ] Data surface clean (only useful data, internals hidden)
- [ ] Error messages human-readable and actionable
- [ ] Primary action obvious and accessible
- [ ] No Lambo-for-a-bike (complexity proportional to need)
- [ ] New user could use without documentation

### Functional
- [ ] Original requirement satisfied (1:1 traceability)
- [ ] Edge cases handled
- [ ] Error states produce clear messages

### Technical
- [ ] No DRY violations
- [ ] No KISS violations
- [ ] No YAGNI violations
- [ ] SOLID maintained
- [ ] Types correct (no `as any`)
- [ ] No hardcoded values

### Operational
- [ ] Rollback safe
- [ ] Observability present
- [ ] No regression
- [ ] Dependencies documented

### Process
- [ ] Has tests (or explicit justification)
- [ ] Has documentation
- [ ] Follows conventions

## Verdict Matrix

| Verdict | Condition | Action |
|---------|-----------|--------|
| **SHIP** | All checks pass, evidence exists | Merge and deploy |
| **FIX** | Minor gaps (1-3 items) | Fix inline, re-verify |
| **REWORK** | Fundamental mismatch, or 4+ failures | Return to planning |
