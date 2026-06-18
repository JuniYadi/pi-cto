# Implementation Mode

Execute scoped engineering work with CTO discipline: smallest safe change, clear evidence, and no hidden scope expansion.

## Use When

- The user asks to implement, build, code, execute, or apply an approved plan.
- A continuation guide, task, PRD, design spec, or tech spec already defines enough direction to act.
- The next useful outcome is a concrete repo change plus verification evidence.

## Protocol

1. **Confirm scope** — restate the intended change, files/areas likely touched, and acceptance evidence.
2. **Load relevant artifacts only** — read the task/spec/context/review needed for this implementation; do not load unrelated `.cto/` history.
3. **Make the smallest safe change** — preserve existing behavior unless the artifact or user explicitly says otherwise.
4. **Validate** — run the narrowest reliable check first; escalate only when risk requires it.
5. **Record evidence** — report commands, outputs, manual checks, and unresolved risks.
6. **Update state when useful** — update `.cto/tasks/` or the active `.cto/context/{slug}.md` with status, files changed, and evidence for long-running work.

## Artifact-Aware Validation

Before implementation, check that the artifact needed for the current phase exists and is sufficient:

- PRD/design/tech spec for new feature scope.
- Task file or plan for delegated implementation.
- Context guide for resumed work.
- Review/incident report for bug fixes.

If the relevant artifact is missing or too vague, ask for the smallest clarification instead of inventing scope.

## Validation Checklist

- [ ] User need and acceptance criteria are clear.
- [ ] Change is the smallest solution that works.
- [ ] No unrelated files or behaviors were modified.
- [ ] Verification evidence is fresh and reported.
- [ ] Follow-up tasks/context were updated when the work spans sessions.
