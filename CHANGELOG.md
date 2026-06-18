# Changelog

All notable changes to `@juniyadi/pi-cto` are documented here.

This changelog was reconstructed from git history and release tags.

## [Unreleased]

## [1.8.0] - 2026-06-19

### Added
- Added workflow preset routing for `prd-first`, `fast-fix`, `architecture`, `audit`, `planning-only`, `continue`, and `cleanup-flow`.
- Added scoped `implementation` and behavior-preserving `cleanup` modes to the CTO skill set.
- Added validator and smoke-test npm scripts for continuation gates, mode detection, workflow presets, and pipeline checks.

### Changed
- Updated CTO routing and continuation behavior so workflow presets hand off to the right stage without loading unrelated context.
- Strengthened continuation safety with slug, path, and `.cto` markdown scope checks.
- Updated package contents to include scripts alongside prompts, skills, docs, and license files.

## [1.7.0] - 2026-06-17

### Changed
- Added slash command argument wrapping with explicit prompt tags so `/cto`, `/cto-status`, and `/cto-continue` receive the user's full command arguments reliably.
- Preserved continuation slug handling while making argument forwarding explicit for status and continuation prompts.

## [1.6.0] - 2026-06-17

### Changed
- Updated `/cto` to treat arguments as natural language so README-promised auto-detection works for commands like `/cto planner plan the migration` and `/cto doing this work for feature whatsapp`.
- Made `/cto-continue [slug]` the continuation lifecycle gate: it now checks/scaffolds missing context index and guide files, then resumes the selected context while preserving lazy loading.
- Updated `/cto-status`, `/cto-init`, CTO core rules, skill router, templates, and README to align with the new continuation gate behavior.

## [1.5.0] - 2026-06-17

### Added
- Added `/cto-continue {slug}` for lazy continuation of one feature/context guide.
- Added `/cto-status [slug]` for index-only continuation status checks.
- Added `.cto/context/index.md` and `.cto/context/{slug}.md` continuation context protocol.
- Added continuation context templates:
  - `skills/cto/templates/context-index.md`
  - `skills/cto/templates/context-guide.md`

### Changed
- Updated `/cto` and CTO skill rules to avoid eagerly loading unrelated `.cto/context/*.md` files.
- Updated `/cto-init` to scaffold continuation context files.
- Updated README and artifact docs with token-efficient continuation workflow.
- Updated `.gitignore` to ignore pi-crew runtime state directories.

## [1.4.0] - 2026-06-16

### Changed
- Bumped package version to `1.4.0`.

## [1.3.0] - 2026-06-16

### Added
- Added `.cto/reviews/` for cross-session review persistence.
- Added `skills/cto/templates/review.md` for reviewer, inspector, final-review, design-lead, and basic CTO reports.
- Added `.cto/tasks/` for actionable work units.
- Added `skills/cto/templates/task.md` for task records.
- Added full-context decision recording rules to `skills/cto/core.md`.
- Added review report writing guidance to review-adjacent skill modes.
- Added task writing guidance to task-splitter and delegation modes.

### Changed
- Updated `/cto-init` to scaffold reviews and tasks directories.
- Updated all CTO skill files with decision record sections covering context, rationale, alternatives, and user impact.
- Updated CTO router, `/cto` prompt, and artifact README for the new persistence directories.

## [1.2.0] - 2026-06-16

### Added
- Added lazy-load CTO skill architecture.
- Added document generation modes:
  - PRD
  - Design Spec
  - RFC
  - Tech Spec
  - Post-Mortem
- Added templates for the new document generation modes.
- Added dedicated skill files under `skills/cto/skills/` for mode-specific protocols.
- Added `skills/cto/core.md` for shared gates and enforcement rules.

### Changed
- Restructured CTO mode so the router loads `core.md` plus one relevant skill file instead of loading the full framework.
- Reduced prompt/context load by avoiding unnecessary skill files for each request.
- Updated `.cto/` scaffold structure for document storage.
- Updated README and `/cto-init` documentation for the expanded document workflow.

## [1.1.0] - 2026-06-16

### Added
- Added Design Lead capability for frontend, UX, accessibility, and performance review.

### Changed
- Updated CTO router/framework references to include Design Lead mode.
- Fixed README pi.dev link.
- Bumped package version to `1.1.0`.

## [1.0.0] - 2026-06-16

### Added
- Initial `@juniyadi/pi-cto` package.
- Added `/cto` command for CTO-mode engineering leadership.
- Added `/cto-init` command for project artifact scaffolding.
- Added CTO skill router and legacy framework reference.
- Added CTO artifact templates:
  - `.cto/README.md`
  - decision records
  - architecture docs
  - tech-debt records
- Added package metadata, README, and MIT license.

[Unreleased]: https://github.com/juniyadi/pi-cto/compare/1.8.0...HEAD
[1.8.0]: https://github.com/juniyadi/pi-cto/compare/1.7.0...1.8.0
[1.7.0]: https://github.com/juniyadi/pi-cto/compare/b5f31ac...1.7.0
[1.6.0]: https://github.com/juniyadi/pi-cto/compare/1.5.0...b5f31ac
[1.5.0]: https://github.com/juniyadi/pi-cto/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/juniyadi/pi-cto/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/juniyadi/pi-cto/compare/99b00e5...1.3.0
[1.2.0]: https://github.com/juniyadi/pi-cto/compare/7b0be68...99b00e5
[1.1.0]: https://github.com/juniyadi/pi-cto/compare/cac0c66...7b0be68
[1.0.0]: https://github.com/juniyadi/pi-cto/commit/cac0c66
