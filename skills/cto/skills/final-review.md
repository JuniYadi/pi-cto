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

## Writing Review Report

After completing the final review, write the full report to `.cto/reviews/` using the template at `templates/review.md`. Name the file `YYYY-MM-DD-{slug}.md`. Capture:

- **Input:** The original implementation goal and what was delivered.
- **Findings:** Gap analysis (deliver vs. intent), quality checklist results, new risks.
- **Verdict:** SHIP / FIX / REWORK with justification.
- **Recommendations:** Required fixes or rework steps.
- **User Impact:** Does this deliver the user's intended job?
- **Evidence:** Proof that it works (tests, logs, output).

This file persists across sessions — don't leave findings only in the chat.

## Decision Record

When a verdict (SHIP / FIX / REWORK) and any associated change decisions are made, write to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** The original implementation goal and what was actually built — what triggered this review.
- **Decision:** The verdict and any required rework decisions.
- **Rationale:** What evidence drove the verdict? What gaps were found?
- **Consequences:** What happens if we ship now vs. fix first?
- **User Impact:** Does this deliver the user's intended job or not?

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
