# Cleanup Mode

Reduce technical debt while preserving behavior. Cleanup is not a rewrite license.

## Use When

- The user asks to clean up, refactor, tidy, remove dead code, or reduce debt.
- A review, inspection, task, or context guide identifies safe cleanup work.
- The goal is maintainability with behavior preserved unless explicitly changed.

## Protocol

1. **Define the safety boundary** — what behavior must remain unchanged, and what files/areas are in scope?
2. **Identify evidence before editing** — tests, snapshots, typechecks, lint, or manual checks that can prove preservation.
3. **Prefer deletion/simplification** — remove dead paths, duplicate logic, stale docs, or unnecessary abstraction before adding structure.
4. **Keep changes reviewable** — small batches, clear rationale, no opportunistic feature work.
5. **Validate behavior** — run the selected evidence checks and report limitations.
6. **Record debt movement** — update `.cto/tech-debt/`, `.cto/reviews/`, `.cto/tasks/`, or the active context guide when cleanup changes tracked debt.

## Artifact-Aware Validation

Use the artifact that explains why cleanup is needed:

- Inspection/review report for findings and severity.
- Tech-debt entry for expected remediation.
- Task or context guide for accepted cleanup scope.
- Existing tests/logs for behavior preservation evidence.

If cleanup scope is broad or evidence is weak, split into a planning/task-splitter step first.

## Validation Checklist

- [ ] Behavior preservation boundary is explicit.
- [ ] Cleanup removes or simplifies more than it adds.
- [ ] No feature work was mixed into cleanup.
- [ ] Fresh validation evidence is reported.
- [ ] Remaining debt or risks are captured as follow-ups.
