# Design Spec: [Feature/System Name]

**Author:** [name]
**Date:** YYYY-MM-DD
**Status:** Draft | In Review | Approved
**Related PRD:** [link to PRD]

## Overview
[1-2 sentence summary of what this spec covers]

## Requirements (from PRD)
| Requirement | Priority | Notes |
|-------------|----------|-------|
| [requirement] | P0/P1/P2 | [context] |

## Constraints
| Constraint | Type | Impact |
|------------|------|--------|
| [constraint] | Tech/Time/Team/Budget | [impact] |

## Architecture Decision

### Options Considered
| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| A: [name] | [pros] | [cons] | [reason] |
| B: [name] | [pros] | [cons] | [reason] |

### Decision
**Chosen:** [Option X]
**Rationale:** [why this choice]

## System Components

### Component 1: [Name]
**Responsibility:** [what it does]
**Technology:** [tool/framework]
**Owns:** [data/features]

### Component 2: [Name]
**Responsibility:** [what it does]
**Technology:** [tool/framework]
**Owns:** [data/features]

## API Design

### [Endpoint Name]
```
[METHOD] /path
```
**Request:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [field] | [type] | yes/no | [description] |

**Response:**
| Field | Type | Description |
|-------|------|-------------|
| [field] | [type] | [description] |

**Errors:**
| Code | Condition | User Message |
|------|-----------|--------------|
| 400 | [condition] | [message] |

## Data Model

### [Entity Name]
| Field | Type | Index | Description |
|-------|------|-------|-------------|
| id | uuid | PK | [description] |
| [field] | [type] | [index] | [description] |

## Failure Modes
| Failure | Impact | Detection | Recovery |
|---------|--------|-----------|----------|
| [failure] | [impact] | [how detected] | [recovery] |

## Open Questions
- [ ] [question 1]
