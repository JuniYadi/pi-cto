# Reviewer — Issue Analysis

Use when reviewing a bug report, incident, code change, or technical issue.

## Protocol

```
INPUT:  (bug report, incident, code diff, or issue description)
  ↓
STEP 1: REPRODUCE     → Can I understand the exact failure mode?
STEP 2: ROOT CAUSE    → Why did this happen? Trace to the actual origin.
STEP 3: IMPACT        → What's the blast radius? Who/what is affected?
STEP 4: EVIDENCE      → What proof supports my root cause hypothesis?
STEP 5: USER IMPACT   → How does this affect the user's job? What do they experience?
STEP 6: FIX PATH      → What's the minimal fix? What's the comprehensive fix?
STEP 7: PREVENTION    → How do we ensure this class of issue never recurs?
STEP 8: VERIFICATION  → How do we confirm the fix works?
```

## Writing Review Report

After completing the analysis, write the full review to `.cto/reviews/` using the template at `templates/review.md`. Name the file `YYYY-MM-DD-{slug}.md`. Capture:

- **Input:** The original bug report, incident, or issue description.
- **Findings:** Root cause, impact, evidence — ranked by severity.
- **Verdict:** The quality score (S/A/B/C/D).
- **Recommendations:** Fix path (minimal vs. comprehensive) and prevention steps.
- **User Impact:** How does this issue affect the user's job?

This file persists across sessions — don't leave findings only in the chat.

## Decision Record

When a significant finding, root cause, or fix decision emerges, write it to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** The original issue report, bug description, or incident input — what prompted this review.
- **Decision:** What was the root cause? What fix path was chosen (and which were rejected)?
- **Rationale:** Why this fix over alternatives? Why now?
- **User Impact:** How does this affect the user's job? What do they experience?
- **Prevention:** How do we prevent this class of issue from recurring?

## Validation

- [ ] Root cause identified (not just symptom)
- [ ] Impact quantified (users affected, data at risk, downtime)
- [ ] User impact in user terms (not "HTTP 500" — what does the user SEE?)
- [ ] Fix has minimum viable vs. ideal path
- [ ] Verification is concrete (not "manual review")
- [ ] USER-FIRST: Does the fix improve user experience?
- [ ] KISS: Is the fix proportional to the problem?

## Quality Scoring

| Score | Description |
|-------|-------------|
| **S** (Ship) | Root cause confirmed, fix minimal and safe, prevention concrete |
| **A** (Approved) | Root cause identified, fix reasonable, minor gaps |
| **B** (Needs Work) | Fix viable but over-engineered, or root cause is hypothesis only |
| **C** (Rework) | Fix misses the real issue, or introduces new risk |
| **D** (Blocked) | Cannot determine root cause, or fix makes things worse |
