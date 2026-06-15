# Post-Mortem — Incident Root Cause Analysis

Use when documenting an incident, outage, or significant failure for learning and prevention.

## Protocol

```
INPUT:  (incident, outage, or significant failure)
  ↓
STEP 1: TIMELINE      → What happened, in what order?
STEP 2: IMPACT        → Who/what was affected? How long? How severe?
STEP 3: ROOT CAUSE    → Why did this happen? Trace to origin.
STEP 4: CONTRIBUTING  → What factors made this possible or worse?
STEP 5: DETECTION     → How did we find out? Could we have found it sooner?
STEP 6: RESPONSE      → What did we do? How long did it take?
STEP 7: REMEDIATION   → What will we change to prevent recurrence?
STEP 8: LESSONS       → What did we learn? What surprised us?
```

## Post-Mortem Structure

```markdown
# Post-Mortem: [Incident Title]

**Author:** [name]
**Date:** YYYY-MM-DD
**Incident Date:** YYYY-MM-DD HH:MM (timezone)
**Duration:** [X hours Y minutes]
**Severity:** SEV-1 | SEV-2 | SEV-3 | SEV-4
**Status:** Draft | Reviewed | Action Items Assigned

## Summary
[1-2 sentence summary of what happened and the impact]

## Impact

| Metric | Value |
|--------|-------|
| Duration | [time] |
| Users Affected | [count or %] |
| Revenue Impact | [amount or estimate] |
| Data Loss | [yes/no, details] |
| SLA Breach | [yes/no, which SLA] |

## Timeline (UTC)

| Time | Event |
|------|-------|
| HH:MM | [first indication of issue] |
| HH:MM | [what happened next] |
| HH:MM | [escalation or response] |
| HH:MM | [resolution] |
| HH:MM | [all-clear] |

## Root Cause

### What Happened
[Technical explanation of the failure]

### Why It Happened
[Root cause — not just symptom, but origin]

### Contributing Factors
| Factor | How It Contributed |
|--------|-------------------|
| [factor] | [how it made things worse or possible] |

## Detection

| Question | Answer |
|----------|--------|
| How did we detect it? | [alert/customer report/monitoring] |
| Time to detect | [duration] |
| Could we have detected sooner? | [yes/no, how] |
| What monitoring was missing? | [gaps] |

## Response

| Question | Answer |
|----------|--------|
| Who responded? | [team/individual] |
| Time to mitigate | [duration] |
| Time to resolve | [duration] |
| What worked well? | [positive aspects] |
| What was confusing? | [gaps in runbooks/alerts] |

## Remediation Action Items

### Immediate (This Week)
| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| [action] | [owner] | [date] | todo |

### Short-Term (This Month)
| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| [action] | [owner] | [date] | todo |

### Long-Term (This Quarter)
| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| [action] | [owner] | [date] | todo |

## Lessons Learned

### What Went Well
- [positive 1]
- [positive 2]

### What Went Poorly
- [negative 1]
- [negative 2]

### What Surprised Us
- [surprise 1]
- [surprise 2]

## Supporting Evidence
- [link to logs]
- [link to metrics]
- [link to alerts]
- [link to related incidents]
```

## Validation

- [ ] Timeline is chronological and complete
- [ ] Impact is quantified (not just "users affected")
- [ ] Root cause is identified (not just symptom)
- [ ] Contributing factors are listed
- [ ] Detection gap is honest
- [ ] Remediation actions are specific with owners and dates
- [ ] Lessons are actionable (not just "we need to be better")
- [ ] USER-FIRST: Impact explained in user terms
- [ ] KISS: Remediation is proportional to severity
