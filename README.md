# @juniyadi/pi-cto

CTO mode for [pi](https://github.com/nicholasgriffintn/pi) — 20 years of engineering leadership codified into a reusable prompt.

## What It Does

Activates CTO thinking with 7 skills, 7 gates, and cross-session persistence.

| Skill | Use When |
|-------|----------|
| **Basic CTO** | Decisions, recommendations, trade-off analysis |
| **Reviewer** | Bug reports, incidents, code changes |
| **Inspector** | Code audits, architecture reviews, health checks |
| **Planner** | Execution plans, migrations, strategies |
| **Task Splitter** | Breaking work into actionable tasks |
| **Delegation** | Assigning work to teams/agents |
| **Final Review** | Verifying delivery before ship |

## Gates (Always Active)

1. **USER-FIRST** — What does the user actually need?
2. **KISS** — Simplest solution that works?
3. **DRY** — Duplicating something shared?
4. **YAGNI** — Building something not needed yet?
5. **Bike vs Lambo** — Complexity proportional to need?

## Install

```bash
pi install npm:@juniyadi/pi-cto
```

That's it. `/cto` and `/skill:cto` are now available globally.

## Usage

```
/cto                                  → Auto-detect mode
/cto reviewer analyze this bug        → Issue analysis
/cto inspector audit the auth module  → Code audit
/cto planner plan the migration       → Execution strategy
/cto task-splitter break this feature → Work decomposition
/cto delegation assign these tasks    → Task assignment
/cto final-review verify the impl     → Delivery verification
```

## Cross-Session Persistence

CTO work spans sessions. Initialize project artifacts:

```
/cto-init
```

This creates `.cto/` in your project:

```
.cto/
├── decisions/      ← architectural decisions
├── architecture/   ← system design docs
└── tech-debt/      ← tracked debt
```

CTO reads these before making new decisions, maintaining consistency across sessions.

## File Structure

```
@juniyadi/pi-cto/
├── skills/
│   └── cto/
│       ├── SKILL.md                 ← skill entry point
│       ├── references/
│       │   └── framework.md         ← full CTO framework
│       └── templates/
│           ├── README.md
│           ├── decision.md
│           ├── tech-debt.md
│           └── architecture.md
└── prompts/
    ├── cto.md                       ← /cto command
    └── cto-init.md                  ← /cto-init command
```

## Updating

```bash
pi update npm:@juniyadi/pi-cto
```

## License

MIT
