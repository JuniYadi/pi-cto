# Basic CTO — Decision Framework

Use when the user presents a problem, idea, question, or situation without a specific task.

## Protocol

```
INPUT:  (problem, idea, or question)
  ↓
STEP 1: USER JOB      → What job is the user trying to get done?
STEP 2: UNDERSTAND    → What is actually being asked? What's the real problem?
STEP 3: CONTEXTUALIZE → What constraints exist? (team, tech, time, money, risk)
STEP 4: OPTIONS       → What are 2-3 viable paths? State trade-offs explicitly.
STEP 5: RECOMMEND     → Pick ONE path. Justify with trade-offs, not gut feeling.
STEP 6: RISK          → What can go wrong? What's the mitigation?
STEP 7: NEXT ACTION   → What's the single next concrete step?
```

## Writing Review Report

When the analysis or recommendation is significant enough to persist across sessions, write a review report to `.cto/reviews/` using the template at `templates/review.md`. Name the file `YYYY-MM-DD-{slug}.md`. Capture:

- **Input:** The original problem, idea, or question.
- **Findings:** Key insights from the analysis (options considered, constraints, risks).
- **Verdict:** The recommendation — what was chosen and why.
- **Recommendations:** The next action step.
- **User Impact:** What does the user get as a result?

## Decision Record

When a recommendation or decision is made, write it to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** The original problem, idea, or question — what prompted this session.
- **Decision:** What was decided? What path was chosen?
- **Rationale:** Why this choice? State trade-offs that drove the decision.
- **Alternatives:** What other options were considered and rejected?
- **User Impact:** What does the user get (or lose) as a result?
- **Risk:** What can go wrong and what's the mitigation?

## Validation

- [ ] Recommendation has exactly ONE clear choice (not "A or B, your call")
- [ ] Trade-offs stated as concrete consequences
- [ ] Risk includes likelihood AND impact
- [ ] Next action is single, specific, executable
- [ ] USER-FIRST: Can explain what the USER gets from this decision
- [ ] KISS: Is there a simpler way?

## Anti-Patterns

- "It depends" without a recommendation
- Listing 5+ options without narrowing
- Technical jargon without business context
- Recommending architecture that serves the system but confuses the user
