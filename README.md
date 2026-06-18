# @juniyadi/pi-cto

CTO mode for [pi](https://pi.dev) — 20 years of engineering leadership codified into a reusable prompt.

## What It Does

Activates CTO thinking with 15 skills, workflow presets, 5 gates, and cross-session persistence.

### Core Skills

| Skill | Use When |
|-------|----------|
| **Basic CTO** | Decisions, recommendations, trade-off analysis |
| **Reviewer** | Bug reports, incidents, code changes |
| **Inspector** | Code audits, architecture reviews, health checks |
| **Planner** | Execution plans, migrations, strategies |
| **Task Splitter** | Breaking work into actionable tasks |
| **Delegation** | Assigning work to teams/agents |
| **Implementation** | Applying scoped changes with verification evidence |
| **Cleanup** | Refactors, dead-code removal, behavior-preserving debt reduction |
| **Final Review** | Verifying delivery before ship |
| **Design Lead** | UI/UX reviews, frontend architecture, accessibility |

### Document Generation Skills

| Skill | Use When |
|-------|----------|
| **PRD** | Product Requirements Documents |
| **Design Spec** | System architecture & API design docs |
| **RFC** | Technical proposals & ADRs |
| **Tech Spec** | Implementation specifications |
| **Post-Mortem** | Incident RCA & learning docs |

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

That's it. `/cto`, `/cto-init`, `/cto-status`, `/cto-continue`, and `/skill:cto` are now available globally.

## Usage

```
/cto                                  → Auto-detect mode or workflow preset
/cto reviewer analyze this bug        → Issue analysis
/cto inspector audit the auth module  → Code audit
/cto planner plan the migration       → Execution strategy
/cto task-splitter break this feature → Work decomposition
/cto delegation assign these tasks    → Task assignment
/cto implementation build the fix     → Scoped implementation + evidence
/cto cleanup remove dead code         → Behavior-preserving cleanup
/cto final-review verify the impl     → Delivery verification
/cto design-lead review the UI        → UI/UX + accessibility review

# Workflow Presets
/cto prd-first new user auth          → PRD → design → tech spec → plan → tasks → implementation → review
/cto fast-fix login bug               → Review → implementation → final review
/cto architecture payment flow        → Design spec → RFC → plan
/cto audit auth module                → Inspector → reviewer → planner
/cto planning-only migration          → Basic CTO → planner → task splitter
/cto continue billing-migration       → Continue one lazy-loaded context
/cto cleanup-flow old billing code    → Inspector → cleanup → final review

# Continuation Context
/cto-status                           → List indexed continuation contexts
/cto-status billing-migration         → Show index status for one slug
/cto-continue billing-migration       → Check/scaffold context, then resume one guide
/cto-continue                         → List contexts and suggest next step

# Document Generation
/cto prd create user auth feature     → Product Requirements Document
/cto design-spec for payment flow     → System architecture doc
/cto rfc propose new caching layer    → Technical RFC
/cto tech-spec implement login page   → Implementation spec
/cto post-mortem for outage on June 5 → Incident RCA
```

## Workflow Presets

Presets are routing shortcuts; explicit mode commands still work. Use a preset when the user asks for an end-to-end CTO workflow instead of one skill.

| Preset | Typical sequence |
|--------|------------------|
| `prd-first` | PRD → Design Spec → Tech Spec → Planner → Task Splitter → Delegation → Implementation → Final Review |
| `fast-fix` | Reviewer → Implementation → Final Review |
| `architecture` | Design Spec → RFC → Planner |
| `audit` | Inspector → Reviewer → Planner |
| `planning-only` | Basic CTO → Planner → Task Splitter |
| `continue` | `/cto-continue` lifecycle gate |
| `cleanup-flow` | Inspector → Cleanup → Final Review |

Before moving between stages, CTO validates the relevant artifact for that stage (PRD/spec/task/context/review/evidence) instead of loading every project file.

## Cross-Session Persistence

CTO work spans sessions. Initialize project artifacts:

```
/cto-init
```

This creates `.cto/` in your project:

```
.cto/
├── decisions/        ← architectural decisions
├── reviews/          ← review reports
├── tasks/            ← actionable work units
├── context/          ← lazy-loaded continuation context
│   ├── index.md      ← compact status index
│   └── {slug}.md     ← one feature/context guide
├── architecture/     ← system design docs
├── tech-debt/        ← tracked debt
├── prd/              ← product requirements documents
├── design-specs/     ← architecture & API design docs
├── rfcs/             ← technical proposals
├── tech-specs/       ← implementation specifications
└── post-mortems/     ← incident RCAs
```

CTO uses these artifacts to maintain consistency across sessions. Continuation context is lazy-loaded: `/cto-status [slug]` reads only `.cto/context/index.md`, while `/cto-continue [slug]` is the lifecycle gate: with a slug it checks/scaffolds missing context and reads only the requested guide; without a slug it lists contexts and guides the user.

Lifecycle phases are lightweight: discover → specify → plan → implement → verify → cleanup → continue/archive. Context statuses remain `active`, `blocked`, `paused`, `done`, or `archived`.

## Lazy-Load Architecture

Skills are loaded on demand — only the relevant skill file is read into context:

| When You Say | What Loads | Tokens |
|--------------|------------|--------|
| `/cto reviewer` | core.md + reviewer.md | ~900 |
| `/cto implementation` | core.md + implementation.md | ~900 |
| `/cto cleanup` | core.md + cleanup.md | ~900 |
| `/cto prd` | core.md + prd.md | ~1,000 |
| `/cto design-spec` | core.md + design-spec.md | ~1,100 |
| `/cto-status` | `.cto/context/index.md` only | project-sized |
| `/cto-continue [slug]` | core.md + context index + one slug guide; templates only if scaffolding | project-sized |

**Not loaded:** Other skill files or unrelated `.cto/context/*.md` guides (saves tokens per request)

## File Structure

```
@juniyadi/pi-cto/
├── skills/
│   └── cto/
│       ├── SKILL.md                    ← router (detects mode/preset, loads skill)
│       ├── core.md                     ← gates & enforcement (always loaded)
│       ├── skills/                     ← individual skill protocols
│       │   ├── basic-cto.md
│       │   ├── reviewer.md
│       │   ├── inspector.md
│       │   ├── planner.md
│       │   ├── task-splitter.md
│       │   ├── delegation.md
│       │   ├── implementation.md
│       │   ├── cleanup.md
│       │   ├── final-review.md
│       │   ├── design-lead.md
│       │   ├── prd.md
│       │   ├── design-spec.md
│       │   ├── rfc.md
│       │   ├── tech-spec.md
│       │   └── post-mortem.md
│       └── templates/                  ← document templates
│           ├── README.md
│           ├── decision.md
│           ├── review.md
│           ├── task.md
│           ├── context-index.md
│           ├── context-guide.md
│           ├── tech-debt.md
│           ├── architecture.md
│           ├── prd.md
│           ├── design-spec.md
│           ├── rfc.md
│           ├── tech-spec.md
│           └── post-mortem.md
└── prompts/
    ├── cto.md                          ← /cto command
    ├── cto-init.md                     ← /cto-init command
    ├── cto-status.md                   ← /cto-status command
    └── cto-continue.md                 ← /cto-continue command
```

## Validator Scripts

For release smoke checks or local package validation, use the bundled npm scripts:

```bash
npm run cto:detect -- "cleanup-flow old billing code"
npm run cto:mode -- cleanup
npm run cto:workflow -- cleanup-flow
npm run cto:pipeline -- <slug>
npm run cto:validate -- <slug>
```

Additional continuation helpers are available as `cto:pre`, `cto:post`, `cto:status`, and `cto:schema`; mode helpers include `cto:mode-list`.

## Updating

```bash
pi update npm:@juniyadi/pi-cto
```

## License

MIT
