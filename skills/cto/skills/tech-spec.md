# Tech Spec — Implementation Specification

Use when detailing the implementation approach for a specific feature, module, or component.

## Protocol

```
INPUT:  (PRD, design spec, or feature requirement)
  ↓
STEP 1: GOAL          → What are we building? What's "done"?
STEP 2: ARCHITECTURE  → How does this fit in the system?
STEP 3: COMPONENTS    → What files/modules do we create or modify?
STEP 4: INTERFACES    → What's the public API? Types? Contracts?
STEP 5: DATA          → What data flows through? State management?
STEP 6: EDGE CASES    → What can go wrong? Error handling?
STEP 7: TESTING       → How do we verify this works?
STEP 8: DEPENDENCIES  → What do we need before starting?
```

## Tech Spec Structure

```markdown
# Tech Spec: [Feature/Module Name]

**Author:** [name]
**Date:** YYYY-MM-DD
**Status:** Draft | In Progress | Complete
**Related PRD:** [link]
**Related Design Spec:** [link]

## Goal
[One sentence: what are we building and why?]

## Definition of Done
- [ ] [testable criterion 1]
- [ ] [testable criterion 2]
- [ ] [testable criterion 3]

## Architecture

### Where This Fits
[How does this component relate to existing system?]

### Data Flow
```
[Input] → [Component A] → [Component B] → [Output]
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `path/to/file.ts` | CREATE | [purpose] |
| `path/to/existing.ts` | MODIFY | [what changes] |

## Public Interface

### [Function/Component Name]
```typescript
[signature with types]
```
**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| [param] | [type] | yes/no | [description] |

**Returns:**
| Field | Type | Description |
|-------|------|-------------|
| [field] | [type] | [description] |

**Throws:**
| Error | Condition |
|-------|-----------|
| [error] | [when] |

## State Management

| State | Type | Location | Updated By |
|-------|------|----------|------------|
| [state] | [type] | [where] | [what triggers] |

## Edge Cases & Error Handling

| Case | Expected Behavior |
|------|-------------------|
| [edge case] | [what should happen] |
| [error condition] | [user sees / system does] |

## Testing Strategy

### Unit Tests
| Test | Input | Expected | Edge Case |
|------|-------|----------|-----------|
| [test name] | [input] | [output] | [yes/no] |

### Integration Tests
| Test | Scenario | Expected |
|------|----------|----------|
| [test name] | [scenario] | [outcome] |

## Dependencies
| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| [dependency] | API/Lib/Service | ready/blocked | [notes] |

## Implementation Steps
| Step | Task | Est. | Depends On |
|------|------|------|------------|
| 1 | [task] | [S/M/L] | [nothing/step X] |
| 2 | [task] | [S/M/L] | [step 1] |

## Open Questions
- [ ] [question 1]
```

## Validation

- [ ] Goal is clear and measurable
- [ ] Definition of done is testable
- [ ] Files are explicitly listed (CREATE/MODIFY)
- [ ] Public interface has types and error handling
- [ ] Edge cases are identified with expected behavior
- [ ] Testing strategy covers unit and integration
- [ ] USER-FIRST: Implementation serves user needs
- [ ] KISS: Simplest implementation that works
- [ ] YAGNI: No speculative abstractions
