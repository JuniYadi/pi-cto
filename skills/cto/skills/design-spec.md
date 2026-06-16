# Design Spec — System & Architecture Document

Use when creating or reviewing a design specification for system architecture, API design, or technical approach.

## Protocol

```
INPUT:  (PRD, feature requirement, or technical challenge)
  ↓
STEP 1: REQUIREMENTS  → What must this system do? (from PRD)
STEP 2: CONSTRAINTS   → What limits exist? (time, tech, team, budget)
STEP 3: OPTIONS       → What are 2-3 viable architectures?
STEP 4: DECISION      → Pick ONE. Justify with trade-offs.
STEP 5: COMPONENTS    → What are the building blocks?
STEP 6: INTERFACES    → How do components talk to each other?
STEP 7: DATA          → What's the data model? Storage strategy?
STEP 8: FAILURE       → What happens when things break?
```

## Design Spec Structure

```markdown
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
...

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
```

## Decision Record

When architecture decisions are made in this design spec, write them to `.cto/decisions/` using the template at `templates/decision.md`. Capture:

- **Context:** The requirements and constraints that drove this design.
- **Decision:** The chosen architecture, components, interfaces, and data model.
- **Rationale:** Why this architecture over alternatives.
- **Alternatives:** What architectures were considered and rejected?
- **Consequences:** What trade-offs were accepted?
- **User Impact:** How does this architecture serve the user's job?

## Validation

- [ ] Requirements trace back to PRD
- [ ] Architecture decision has clear trade-offs
- [ ] Components have single responsibility
- [ ] API contracts are complete (request, response, errors)
- [ ] Data model is normalized and indexed
- [ ] Failure modes have detection and recovery
- [ ] USER-FIRST: Design serves user needs, not technical elegance
- [ ] KISS: Simplest architecture that works
- [ ] DRY: No duplicated responsibilities
