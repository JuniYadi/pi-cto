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
