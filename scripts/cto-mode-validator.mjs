#!/usr/bin/env node

/**
 * /cto Mode Validator — Universal Gate Script
 *
 * Validates that the AI follows the correct CTO protocol for ANY mode.
 * Works with: /cto, /cto-continue, /cto-status, and all skill modes.
 *
 * Commands:
 *   detect <input>         — Detect which mode a user input maps to
 *   validate <mode> [slug] — Validate a mode's workflow was followed
 *   trace <mode> [slug]    — Write + verify execution trace
 *   workflow <preset> [slug] — Validate a workflow preset
 *   pipeline <slug>          — Backward-compatible default workflow validation
 *   list                     — List all modes and workflow presets
 *
 * Exit codes: 0=pass, 1=fail, 2=usage error
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Mode Definitions ────────────────────────────────────────────────────────

const MODES = {
  'basic-cto': {
    label: 'Basic CTO',
    skillFile: 'skills/cto/skills/basic-cto.md',
    keywords: [], // default fallback
    steps: [
      { id: 'user-job',      desc: 'Identify the user job (what user is trying to get done)', required: true },
      { id: 'understand',    desc: 'Understand the real problem (not surface request)', required: true },
      { id: 'contextualize', desc: 'Identify constraints (team, tech, time, risk)', required: true },
      { id: 'options',       desc: 'Present 2-3 viable paths with trade-offs', required: true },
      { id: 'recommend',     desc: 'Pick ONE path with justification', required: true },
      { id: 'risk',          desc: 'Identify risks and mitigation', required: true },
      { id: 'next-action',   desc: 'Single next concrete step', required: true },
    ],
    outputs: {
      review: '.cto/reviews/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'recommendation-is-single-choice',
      'trade-offs-are-concrete',
      'risk-has-likelihood-and-impact',
      'next-action-is-executable',
      'user-first-check',
      'kiss-check',
    ],
  },

  'reviewer': {
    label: 'Issue Analysis',
    skillFile: 'skills/cto/skills/reviewer.md',
    keywords: ['review', 'bug', 'incident', 'issue'],
    steps: [
      { id: 'reproduce',    desc: 'Understand the exact failure mode', required: true },
      { id: 'root-cause',   desc: 'Trace to the actual origin (not symptom)', required: true },
      { id: 'impact',       desc: 'Quantify blast radius (users, data, downtime)', required: true },
      { id: 'evidence',     desc: 'Proof supporting root cause hypothesis', required: true },
      { id: 'user-impact',  desc: 'How it affects user job (not HTTP codes)', required: true },
      { id: 'fix-path',     desc: 'Minimal fix AND comprehensive fix', required: true },
      { id: 'prevention',   desc: 'How to prevent this class of issue', required: true },
      { id: 'verification', desc: 'Concrete way to confirm fix works', required: true },
    ],
    outputs: {
      review: '.cto/reviews/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'root-cause-not-symptom',
      'impact-quantified',
      'user-impact-in-user-terms',
      'fix-has-minimal-and-ideal',
      'verification-is-concrete',
      'user-first-check',
      'kiss-check',
    ],
  },

  'inspector': {
    label: 'Code & System Audit',
    skillFile: 'skills/cto/skills/inspector.md',
    keywords: ['audit', 'inspect', 'health check'],
    steps: [
      { id: 'map',          desc: 'Map key components and responsibilities', required: true },
      { id: 'boundaries',   desc: 'Check module/service boundaries', required: true },
      { id: 'dependencies', desc: 'Analyze dependency coupling risks', required: true },
      { id: 'debt',         desc: 'Rank technical debt by severity', required: true },
      { id: 'health',       desc: 'Identify what works well', required: true },
      { id: 'gaps',         desc: 'Identify what is missing', required: true },
      { id: 'priorities',   desc: 'Rank P0 (blocks) to P3 (nice to have)', required: true },
    ],
    outputs: {
      review: '.cto/reviews/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'findings-have-remediation',
      'effort-estimated-s-m-l-xl',
      'priorities-reflect-business',
      'user-first-check',
      'kiss-check',
    ],
  },

  'planner': {
    label: 'Execution Strategy',
    skillFile: 'skills/cto/skills/planner.md',
    keywords: ['plan', 'migration', 'strategy'],
    steps: [
      { id: 'user-outcome',  desc: 'Define user end state when complete', required: true },
      { id: 'decompose',     desc: 'Break into independent work units', required: true },
      { id: 'sequence',      desc: 'Define dependencies and parallelism', required: true },
      { id: 'risk-map',      desc: 'Identify highest uncertainty steps', required: true },
      { id: 'checkpoints',   desc: 'Define progress validation points', required: true },
      { id: 'escape-routes', desc: 'Rollback plan at each checkpoint', required: true },
      { id: 'resource-map',  desc: 'Skills/capabilities each step needs', required: true },
      { id: 'deliverables',  desc: 'Concrete outputs at each checkpoint', required: true },
    ],
    outputs: {
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'phases-independently-deliverable',
      'each-phase-has-deliverable',
      'dependencies-explicit',
      'checkpoints-testable',
      'rollback-feasible',
      'user-first-check',
      'kiss-check',
    ],
  },

  'task-splitter': {
    label: 'Work Decomposition',
    skillFile: 'skills/cto/skills/task-splitter.md',
    keywords: ['break down', 'tasks', 'split'],
    steps: [
      { id: 'anatomy',     desc: 'Fill all task anatomy fields', required: true },
      { id: 'split-rules', desc: 'Apply splitting rules (independent, estimable, testable, scoped, named)', required: true },
      { id: 'write-tasks', desc: 'Write task files to .cto/tasks/', required: true },
    ],
    outputs: {
      tasks: '.cto/tasks/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'all-anatomy-fields-filled',
      'ordered-by-dependency',
      'no-task-depends-on-more-than-2',
      'at-least-1-user-facing-check',
      'tasks-written-to-cto-tasks',
      'user-first-check',
      'kiss-check',
    ],
  },

  'delegation': {
    label: 'Task Assignment',
    skillFile: 'skills/cto/skills/delegation.md',
    keywords: ['assign', 'delegate', 'distribute'],
    steps: [
      { id: 'context',     desc: 'What delegate needs to know', required: true },
      { id: 'goal',        desc: 'One sentence: what done looks like', required: true },
      { id: 'scope',       desc: 'IN and OUT scope boundaries', required: true },
      { id: 'constraints', desc: 'Hard rules', required: true },
      { id: 'validation',  desc: 'How to verify output', required: true },
      { id: 'deliverables',desc: 'Exact files/artifacts', required: true },
    ],
    outputs: {
      tasks: '.cto/tasks/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'all-6-fields-present',
      'scope-explicit-in-and-out',
      'validation-testable',
      'deliverables-file-specific',
      'kiss-check',
    ],
  },

  'implementation': {
    label: 'Implementation Execution',
    skillFile: 'skills/cto/skills/implementation.md',
    keywords: ['implementation', 'implement', 'build', 'execute', 'code', 'fix'],
    steps: [
      { id: 'scope',        desc: 'Confirm intended change and non-goals', required: true },
      { id: 'plan',         desc: 'Choose the smallest safe implementation plan', required: true },
      { id: 'change',       desc: 'Make targeted code/config changes', required: true },
      { id: 'verify',       desc: 'Run relevant checks and capture evidence', required: true },
      { id: 'handoff',      desc: 'Report changed files, evidence, and remaining risks', required: true },
    ],
    outputs: {
      tasks: '.cto/tasks/',
      context: '.cto/context/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'scope-stays-bounded',
      'changes-are-targeted',
      'verification-evidence-present',
      'handoff-lists-files',
      'user-first-check',
      'kiss-check',
    ],
  },

  'cleanup': {
    label: 'Cleanup / Refactor',
    skillFile: 'skills/cto/skills/cleanup.md',
    keywords: ['cleanup', 'clean up', 'refactor', 'dead code', 'tidy', 'debt'],
    steps: [
      { id: 'identify',     desc: 'Identify cleanup target and why it matters', required: true },
      { id: 'safety',       desc: 'Define behavior-preservation checks', required: true },
      { id: 'change',       desc: 'Remove, simplify, or refactor targeted code', required: true },
      { id: 'verify',       desc: 'Run regression checks and capture evidence', required: true },
      { id: 'archive',      desc: 'Update debt/review/context notes when relevant', required: true },
    ],
    outputs: {
      review: '.cto/reviews/',
      decision: '.cto/decisions/',
      context: '.cto/context/',
    },
    validationChecks: [
      'behavior-preserved',
      'dead-code-removal-justified',
      'verification-evidence-present',
      'kiss-check',
    ],
  },

  'final-review': {
    label: 'Delivery Verification',
    skillFile: 'skills/cto/skills/final-review.md',
    keywords: ['verify', 'final check', 'ship it'],
    steps: [
      { id: 'intent',    desc: 'Re-read original requirement', required: true },
      { id: 'deliver',   desc: 'Document what was actually built', required: true },
      { id: 'delta',     desc: 'Gap analysis (deliver vs intent)', required: true },
      { id: 'quality',   desc: 'Run quality checklist', required: true },
      { id: 'risk',      desc: 'Identify new risks introduced', required: true },
      { id: 'evidence',  desc: 'Proof it works (tests, logs, output)', required: true },
      { id: 'verdict',   desc: 'SHIP / FIX / REWORK with justification', required: true },
    ],
    outputs: {
      review: '.cto/reviews/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'verdict-is-ship-fix-or-rework',
      'evidence-exists',
      'quality-checklist-complete',
      'user-first-check',
      'kiss-check',
    ],
  },

  'design-lead': {
    label: 'UI/UX Review',
    skillFile: 'skills/cto/skills/design-lead.md',
    keywords: ['ui', 'ux', 'design', 'frontend', 'accessibility', 'a11y'],
    steps: [
      { id: 'user-job',      desc: 'What user job on this screen', required: true },
      { id: 'layout',        desc: 'Information hierarchy and primary action', required: true },
      { id: 'interaction',   desc: 'Click count and intuitiveness', required: true },
      { id: 'state',         desc: 'Loading, error, empty, success states', required: true },
      { id: 'accessibility', desc: 'WCAG 2.1 AA compliance', required: true },
      { id: 'performance',   desc: 'Core Web Vitals and bundle size', required: true },
      { id: 'consistency',   desc: 'Match existing patterns', required: true },
    ],
    outputs: {
      review: '.cto/reviews/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'user-first-check',
      'kiss-check',
      'accessibility-wcag-aa',
      'performance-vitals',
      'states-handled',
    ],
  },

  'prd': {
    label: 'Product Requirements',
    skillFile: 'skills/cto/skills/prd.md',
    keywords: ['prd', 'requirements', 'spec'],
    steps: [
      { id: 'user-job',     desc: 'What job user hires feature for', required: true },
      { id: 'problem',      desc: 'Pain exists today (quantified)', required: true },
      { id: 'success',      desc: 'How we know it worked (metrics)', required: true },
      { id: 'scope',        desc: 'IN and OUT for v1', required: true },
      { id: 'user-stories', desc: 'Who does what and why', required: true },
      { id: 'acceptance',   desc: 'Concrete testable criteria', required: true },
      { id: 'risks',        desc: 'Dependencies and what could go wrong', required: true },
      { id: 'out-of-scope', desc: 'Explicitly not building yet', required: true },
    ],
    outputs: {
      prd: '.cto/prd/',
    },
    validationChecks: [
      'problem-quantified',
      'user-jobs-from-user-perspective',
      'success-metrics-measurable',
      'acceptance-testable',
      'scope-bounded',
      'user-first-check',
      'kiss-check',
      'yagni-check',
    ],
  },

  'design-spec': {
    label: 'Design/Architecture Spec',
    skillFile: 'skills/cto/skills/design-spec.md',
    keywords: ['design spec', 'architecture doc'],
    steps: [
      { id: 'overview',     desc: 'System overview and goals', required: true },
      { id: 'components',   desc: 'Component breakdown', required: true },
      { id: 'data-flow',    desc: 'Data flow and interfaces', required: true },
      { id: 'decisions',    desc: 'Key architectural decisions', required: true },
      { id: 'trade-offs',   desc: 'Trade-offs and alternatives', required: true },
    ],
    outputs: {
      designSpec: '.cto/design-specs/',
    },
    validationChecks: [
      'components-have-responsibilities',
      'data-flow-traceable',
      'decisions-justified',
      'user-first-check',
    ],
  },

  'rfc': {
    label: 'Technical RFC',
    skillFile: 'skills/cto/skills/rfc.md',
    keywords: ['rfc', 'proposal', 'adr'],
    steps: [
      { id: 'summary',      desc: 'One paragraph summary', required: true },
      { id: 'motivation',   desc: 'Why this change', required: true },
      { id: 'detailed',     desc: 'Detailed design', required: true },
      { id: 'alternatives', desc: 'Alternatives considered', required: true },
      { id: 'impact',       desc: 'Impact on existing systems', required: true },
    ],
    outputs: {
      rfc: '.cto/rfcs/',
    },
    validationChecks: [
      'summary-concise',
      'motivation-clear',
      'alternatives-documented',
      'impact-assessed',
    ],
  },

  'tech-spec': {
    label: 'Implementation Spec',
    skillFile: 'skills/cto/skills/tech-spec.md',
    keywords: ['tech spec', 'implementation spec'],
    steps: [
      { id: 'overview',       desc: 'Implementation overview', required: true },
      { id: 'api-changes',    desc: 'API/interface changes', required: true },
      { id: 'data-model',     desc: 'Data model changes', required: true },
      { id: 'implementation', desc: 'Implementation plan', required: true },
      { id: 'testing',        desc: 'Testing strategy', required: true },
    ],
    outputs: {
      techSpec: '.cto/tech-specs/',
    },
    validationChecks: [
      'api-changes-documented',
      'data-model-defined',
      'testing-strategy-present',
    ],
  },

  'post-mortem': {
    label: 'Incident RCA',
    skillFile: 'skills/cto/skills/post-mortem.md',
    keywords: ['post-mortem', 'rca', 'incident report'],
    steps: [
      { id: 'timeline',     desc: 'Incident timeline', required: true },
      { id: 'root-cause',   desc: 'Root cause analysis', required: true },
      { id: 'impact',       desc: 'Impact assessment', required: true },
      { id: 'resolution',   desc: 'How it was resolved', required: true },
      { id: 'action-items', desc: 'Prevention action items', required: true },
    ],
    outputs: {
      postMortem: '.cto/post-mortems/',
    },
    validationChecks: [
      'timeline-chronological',
      'root-cause-not-symptom',
      'impact-quantified',
      'action-items-assigned',
    ],
  },

  'cto-continue': {
    label: 'Continuation Context',
    skillFile: null,
    keywords: ['continue', 'resume', 'context', 'slug'],
    steps: [
      { id: 'load-core',          desc: 'Read skills/cto/core.md', required: true },
      { id: 'ensure-context-dir', desc: 'Ensure .cto/context/ exists', required: true },
      { id: 'read-index',         desc: 'Read .cto/context/index.md', required: true },
      { id: 'check-slug-row',     desc: 'Ensure slug in index table', required: true },
      { id: 'read-guide',         desc: 'Read only .cto/context/{slug}.md', required: true },
      { id: 'apply-gates',        desc: 'Apply USER-FIRST, KISS, DRY, YAGNI', required: true },
      { id: 'continue-work',      desc: 'Continue from guide state', required: true },
      { id: 'update-index',       desc: 'Update index summary/status', required: true },
      { id: 'update-guide',       desc: 'Update guide with material context', required: true },
    ],
    outputs: {
      context: '.cto/context/',
      decision: '.cto/decisions/',
    },
    validationChecks: [
      'core-md-exists',
      'context-dir-exists',
      'index-has-valid-table',
      'guide-has-required-sections',
      'guide-has-substantive-content',
      'no-unrelated-files-modified',
    ],
  },
};

// Workflow presets. Keep pipeline as a backward-compatible alias for the default workflow.
const WORKFLOWS = {
  'prd-first': {
    label: 'PRD-first full delivery',
    desc: 'Product requirements through implementation and delivery verification.',
    steps: ['prd', 'design-spec', 'tech-spec', 'planner', 'task-splitter', 'delegation', 'implementation', 'final-review'],
  },
  'fast-fix': {
    label: 'Fast fix',
    desc: 'Triage a focused issue, implement the fix, then verify delivery.',
    steps: ['reviewer', 'implementation', 'final-review'],
  },
  'architecture': {
    label: 'Architecture planning',
    desc: 'Capture architecture/design decisions and produce an execution plan.',
    steps: ['design-spec', 'rfc', 'planner'],
  },
  'audit': {
    label: 'System audit',
    desc: 'Inspect health, review findings, and plan remediation.',
    steps: ['inspector', 'reviewer', 'planner'],
  },
  'planning-only': {
    label: 'Planning only',
    desc: 'Decision framing through task decomposition without implementation.',
    steps: ['basic-cto', 'planner', 'task-splitter'],
  },
  'continue': {
    label: 'Continue context',
    desc: 'Resume from existing CTO context artifacts.',
    steps: ['cto-continue'],
  },
  'cleanup-flow': {
    label: 'Cleanup workflow',
    desc: 'Audit cleanup opportunity, make safe cleanup, then verify. Use the cleanup mode directly for single-stage cleanup.',
    steps: ['inspector', 'cleanup', 'final-review'],
  },
};

const DEFAULT_WORKFLOW = 'prd-first';
const PIPELINE_STEPS = WORKFLOWS[DEFAULT_WORKFLOW].steps;

// ─── Colors ──────────────────────────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

const PASS = `${c.green}✓ PASS${c.reset}`;
const FAIL = `${c.red}✗ FAIL${c.reset}`;
const WARN = `${c.yellow}⚠ WARN${c.reset}`;
const SKIP = `${c.dim}⊘ SKIP${c.reset}`;

process.on('uncaughtException', (err) => {
  console.error(`${c.red}Error:${c.reset} ${err.message}`);
  process.exit(2);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fileExists(p) {
  try { fs.accessSync(p, fs.constants.R_OK); return true; } catch { return false; }
}
function readFile(p) {
  try { return fs.readFileSync(p, 'utf-8'); } catch { return null; }
}
function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}
function fileMtime(p) {
  try { return fs.statSync(p).mtimeMs; } catch { return 0; }
}

function parseIndexTable(content) {
  const rows = [];
  const lines = content.split('\n');
  let inTable = false, headerSeen = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!headerSeen) { headerSeen = true; inTable = true; continue; }
      if (/^\|[\s-:|]+\|$/.test(trimmed)) continue;
      if (inTable) {
        const cells = trimmed.split('|').slice(1, -1).map(s => s.trim().replace(/^`|`$/g, ''));
        if (cells.length >= 5) {
          rows.push({ slug: cells[0], status: cells[1], owner: cells[2], updated: cells[3], summary: cells[4], guide: cells[5] || '' });
        }
      }
    } else if (inTable && !trimmed.startsWith('|')) break;
  }
  return rows;
}

const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9._-]{0,127}$/i;
function assertSafeSlug(slug) {
  if (!slug || !SAFE_SLUG_RE.test(slug)) {
    throw new Error(`Unsafe slug: ${slug || '(empty)'}. Use letters, numbers, dots, underscores, or hyphens only.`);
  }
}
function guidePath(slug) {
  assertSafeSlug(slug);
  return path.join('.cto/context', `${slug}.md`);
}

function recentMarkdownFiles(dir, maxAgeMs = 60 * 60 * 1000) {
  if (!isDir(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => path.join(dir, f))
    .filter(f => Date.now() - fileMtime(f) < maxAgeMs)
    .sort((a, b) => fileMtime(b) - fileMtime(a));
}

function modeArtifactDirs(modeData) {
  return [...new Set(Object.values(modeData.outputs || {}))];
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function phraseMatches(lower, phrase) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegex(phrase.toLowerCase())}([^a-z0-9]|$)`).test(lower);
}

function detectWorkflowPreset(input) {
  const lower = input.trim().toLowerCase();
  const firstToken = lower.split(/\s+/)[0] || '';
  if (WORKFLOWS[firstToken]) return firstToken;

  // Also support clear workflow intent such as "run fast-fix" or "use prd-first".
  // Keep this bounded to explicit workflow words so ordinary mode keywords still route to modes.
  if (/\b(run|use|workflow|preset|via)\b/.test(lower)) {
    for (const name of Object.keys(WORKFLOWS)) {
      if (phraseMatches(lower, name)) return name;
    }
  }
  return null;
}

function detectionCandidates(input) {
  const lower = input.toLowerCase();
  const candidates = [];

  for (const [mode, data] of Object.entries(MODES)) {
    if (mode === 'basic-cto') continue;

    if (phraseMatches(lower, mode)) {
      candidates.push({ mode, keyword: mode, label: data.label, score: 200 + mode.length });
    }

    for (const kw of data.keywords) {
      if (phraseMatches(lower, kw)) {
        const keywordBase = mode === 'cto-continue' ? 500 : (kw.includes(' ') ? 600 : 100);
        candidates.push({ mode, keyword: kw, label: data.label, score: keywordBase + kw.length });
      }
    }
  }

  // Backward-compatible continuation shorthand, but lower priority than explicit modes/keywords.
  if (/\b(feature|context|slug)\s+\w+/.test(lower)) {
    candidates.push({ mode: 'cto-continue', keyword: 'feature/context/slug <name>', label: MODES['cto-continue'].label, score: 10 });
  }

  return candidates.sort((a, b) => b.score - a.score || b.keyword.length - a.keyword.length || a.mode.localeCompare(b.mode));
}

function detectMode(input) {
  const candidates = detectionCandidates(input);
  return candidates[0]?.mode || 'basic-cto';
}

// ─── Check Runner ────────────────────────────────────────────────────────────

class CheckRunner {
  constructor(name) {
    this.name = name;
    this.checks = [];
    this.passed = 0;
    this.failed = 0;
    this.warned = 0;
    this.skipped = 0;
  }
  add(label, fn) { this.checks.push({ label, fn }); }
  run() {
    console.log(`\n${c.bold}${c.cyan}━━━ ${this.name} ━━━${c.reset}\n`);
    for (const { label, fn } of this.checks) {
      try {
        const result = fn();
        if (result === true) { console.log(`  ${PASS}  ${label}`); this.passed++; }
        else if (result === 'skip') { console.log(`  ${SKIP}  ${label}`); this.skipped++; }
        else if (typeof result === 'string') { console.log(`  ${WARN}  ${label}`); console.log(`         ${c.yellow}${result}${c.reset}`); this.warned++; }
        else { console.log(`  ${FAIL}  ${label}`); if (result) console.log(`         ${c.red}${result}${c.reset}`); this.failed++; }
      } catch (err) { console.log(`  ${FAIL}  ${label}`); console.log(`         ${c.red}Error: ${err.message}${c.reset}`); this.failed++; }
    }
  }
  summary() {
    console.log('');
    const total = this.passed + this.failed + this.warned + this.skipped;
    const parts = [];
    if (this.passed) parts.push(`${c.green}${this.passed} passed${c.reset}`);
    if (this.failed) parts.push(`${c.red}${this.failed} failed${c.reset}`);
    if (this.warned) parts.push(`${c.yellow}${this.warned} warnings${c.reset}`);
    if (this.skipped) parts.push(`${c.dim}${this.skipped} skipped${c.reset}`);
    console.log(`  ${c.bold}Result:${c.reset} ${parts.join(', ')} (${total} checks)`);
    return this.failed === 0;
  }
}

// ─── Detect Command ──────────────────────────────────────────────────────────

function runDetect(input) {
  if (!input) {
    console.error(`${c.red}Error: detect requires user input text.${c.reset}`);
    process.exit(2);
  }

  console.log(`${c.bold}${c.cyan}━━━ Mode Detection ━━━${c.reset}\n`);
  console.log(`  ${c.bold}Input:${c.reset}  "${input}"`);

  const preset = detectWorkflowPreset(input);
  if (preset) {
    const workflow = WORKFLOWS[preset];
    console.log(`  ${c.bold}Workflow:${c.reset} ${c.green}${preset}${c.reset} — ${workflow.label}`);
    console.log(`  ${c.bold}Steps:${c.reset}    ${workflow.steps.join(' → ')}`);
    console.log(`  ${c.dim}${workflow.desc}${c.reset}`);
    return;
  }

  const mode = detectMode(input);
  const modeData = MODES[mode];

  console.log(`  ${c.bold}Mode:${c.reset}   ${c.green}${mode}${c.reset} — ${modeData.label}`);
  console.log(`  ${c.bold}Skill:${c.reset}  ${modeData.skillFile || '(continuation context)'}`);
  console.log(`  ${c.bold}Steps:${c.reset}  ${modeData.steps.map(s => s.id).join(' → ')}`);
  console.log(`\n  ${c.bold}Required Outputs:${c.reset}`);
  for (const [type, dir] of Object.entries(modeData.outputs)) {
    console.log(`    ${type}: ${dir}`);
  }

  // Show which modes this COULD have matched
  const candidates = detectionCandidates(input);
  const uniqueModes = [...new Set(candidates.map(cand => cand.mode))];
  if (uniqueModes.length > 1) {
    console.log(`\n  ${c.yellow}⚠ Ambiguous:${c.reset} Multiple modes match:`);
    for (const cand of candidates) {
      console.log(`    - ${cand.mode} (keyword: "${cand.keyword}", score: ${cand.score}) → ${cand.label}`);
    }
    console.log(`  ${c.dim}Selected: ${mode} (highest priority, then longest/specific match)${c.reset}`);
  }
}

// ─── Validate Command ────────────────────────────────────────────────────────

function runValidate(mode, slug) {
  const modeData = MODES[mode];
  if (!modeData) {
    console.error(`${c.red}Unknown mode: ${mode}${c.reset}`);
    console.error(`  Valid modes: ${Object.keys(MODES).join(', ')}`);
    process.exit(2);
  }

  console.log(`${c.bold}${c.cyan}╔══════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   /cto Workflow Validator — ${modeData.label.padEnd(20)}  ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════╝${c.reset}`);

  const runner = new CheckRunner(`Validation: ${mode} ${slug || ''}`);

  // 1. Core infrastructure
  runner.add(`${c.dim}[infra]${c.reset} skills/cto/core.md exists`, () => {
    return fileExists('skills/cto/core.md') ? true : 'Missing. Gates cannot be loaded.';
  });

  runner.add(`${c.dim}[infra]${c.reset} Skill file exists`, () => {
    if (!modeData.skillFile) return 'skip'; // cto-continue has no skill file
    return fileExists(modeData.skillFile) ? true : `Missing: ${modeData.skillFile}`;
  });

  runner.add(`${c.dim}[infra]${c.reset} .cto/ directory exists`, () => {
    return isDir('.cto') ? true : 'Missing. Run /cto-init first.';
  });

  // 2. Output directories
  for (const [type, dir] of Object.entries(modeData.outputs)) {
    runner.add(`${c.dim}[output]${c.reset} ${dir} exists`, () => {
      if (!isDir('.cto')) return 'skip';
      return isDir(dir) ? true : `Missing. Will be created.`;
    });
  }

  // 3. Light artifact-aware validation: expected artifact dirs should contain relevant markdown.
  runner.add(`${c.dim}[artifact]${c.reset} Recent expected artifacts discoverable`, () => {
    const dirs = modeArtifactDirs(modeData);
    if (dirs.length === 0) return 'skip';
    const recent = dirs.flatMap(dir => recentMarkdownFiles(dir));
    if (recent.length === 0) return `No recent markdown artifacts in expected dirs: ${dirs.join(', ')}`;
    return true;
  });

  // 4. cto-continue specific checks
  if (mode === 'cto-continue' && slug) {
    runner.add(`${c.dim}[index]${c.reset} .cto/context/index.md has valid table`, () => {
      if (!fileExists('.cto/context/index.md')) return 'Index missing.';
      const rows = parseIndexTable(readFile('.cto/context/index.md'));
      return rows.length > 0 ? true : 'No table rows.';
    });

    runner.add(`${c.dim}[index]${c.reset} Slug "${slug}" in index`, () => {
      if (!fileExists('.cto/context/index.md')) return 'skip';
      const rows = parseIndexTable(readFile('.cto/context/index.md'));
      return rows.find(r => r.slug === slug) ? true : `Slug not in index.`;
    });

    runner.add(`${c.dim}[guide]${c.reset} Guide ${guidePath(slug)} exists`, () => {
      return fileExists(guidePath(slug)) ? true : 'Missing.';
    });

    runner.add(`${c.dim}[guide]${c.reset} Guide has required sections`, () => {
      if (!fileExists(guidePath(slug))) return 'skip';
      const content = readFile(guidePath(slug));
      const required = ['Purpose', 'Current State', 'Key Decisions', 'Next Actions', 'Verification Evidence'];
      const headings = content.split('\n').filter(l => /^#{1,3}\s+/.test(l)).map(l => l.replace(/^[#\s]+/, '').toLowerCase());
      const missing = required.filter(s => !headings.some(h => h.includes(s.toLowerCase())));
      return missing.length === 0 ? true : `Missing: ${missing.join(', ')}`;
    });

    runner.add(`${c.dim}[guide]${c.reset} Guide updated recently`, () => {
      if (!fileExists(guidePath(slug))) return 'skip';
      const age = Date.now() - fileMtime(guidePath(slug));
      return age < 5 * 60 * 1000 ? true : `Last modified ${Math.round(age / 60000)}m ago.`;
    });

    runner.add(`${c.dim}[isolation]${c.reset} No unrelated context files modified`, () => {
      if (!isDir('.cto/context')) return 'skip';
      const files = fs.readdirSync('.cto/context').filter(f => f.endsWith('.md') && f !== 'index.md');
      const recent = files.filter(f => Date.now() - fileMtime(path.join('.cto/context', f)) < 5 * 60 * 1000);
      const unrelated = recent.filter(f => f !== `${slug}.md`);
      return unrelated.length === 0 ? true : `Modified: ${unrelated.join(', ')}`;
    });
  }

  // 5. Output file checks (for non-continue modes)
  if (mode !== 'cto-continue') {
    for (const [type, dir] of Object.entries(modeData.outputs)) {
      runner.add(`${c.dim}[output]${c.reset} ${dir} has recent files`, () => {
        if (!isDir(dir)) return 'skip';
        const recent = recentMarkdownFiles(dir);
        if (recent.length === 0) return `No recent files in ${dir}.`;
        return true;
      });
    }
  }

  // 6. Gate application check
  runner.add(`${c.dim}[gate]${c.reset} Gate keywords present in output`, () => {
    // Check most recent output file
    let outputContent = '';
    for (const [type, dir] of Object.entries(modeData.outputs)) {
      if (!isDir(dir)) continue;
      const recent = recentMarkdownFiles(dir);
      if (recent.length > 0) {
        outputContent = readFile(recent[0]) || '';
        break;
      }
    }
    if (!outputContent) return 'No output files to check.';
    const lower = outputContent.toLowerCase();
    const gateKeywords = ['user-first', 'kiss', 'dry', 'yagni', 'user', 'simple', 'evidence', 'trade-off'];
    const found = gateKeywords.filter(k => lower.includes(k));
    return found.length > 0 ? true : 'No gate keywords found in output.';
  });

  runner.run();
  return runner.summary();
}

// ─── Trace Command ───────────────────────────────────────────────────────────

const TRACE_FILE = '.cto/.trace.json';

function runTraceWrite(mode, slug, steps) {
  if (slug) assertSafeSlug(slug);
  const modeData = MODES[mode];
  if (!modeData) {
    console.error(`${c.red}Unknown mode: ${mode}${c.reset}`);
    process.exit(2);
  }

  const validStepIds = modeData.steps.map(s => s.id);
  const actualSteps = steps.length > 0 ? steps : validStepIds.filter(id => {
    const step = modeData.steps.find(s => s.id === id);
    return step && step.required;
  });

  const invalid = actualSteps.filter(s => !validStepIds.includes(s));
  if (invalid.length > 0) {
    console.error(`${c.red}Unknown step(s) for mode ${mode}: ${invalid.join(', ')}${c.reset}`);
    console.error(`  Valid: ${validStepIds.join(', ')}`);
    process.exit(2);
  }

  if (!isDir('.cto')) fs.mkdirSync('.cto', { recursive: true });

  const trace = {
    mode,
    slug: slug || null,
    timestamp: new Date().toISOString(),
    steps: actualSteps.map(id => ({ id, timestamp: new Date().toISOString() })),
  };

  fs.writeFileSync(TRACE_FILE, JSON.stringify(trace, null, 2));
  console.log(`${c.green}✓ Trace written${c.reset} → ${TRACE_FILE}`);
  console.log(`  Mode: ${mode} (${modeData.label})`);
  if (slug) console.log(`  Slug: ${slug}`);
  console.log(`  Steps: ${actualSteps.join(' → ')}`);
}

function runTraceVerify() {
  console.log(`${c.bold}${c.cyan}━━━ Trace Verification ━━━${c.reset}\n`);

  if (!fileExists(TRACE_FILE)) {
    console.log(`  ${FAIL}  No trace file at ${TRACE_FILE}`);
    process.exit(1);
  }

  const trace = JSON.parse(readFile(TRACE_FILE));
  const mode = trace.mode;
  const slug = trace.slug;
  const modeData = MODES[mode];

  if (!modeData) {
    console.log(`  ${FAIL}  Unknown mode in trace: ${mode}`);
    process.exit(1);
  }

  console.log(`  ${c.bold}Mode:${c.reset}  ${mode} (${modeData.label})`);
  if (slug) console.log(`  ${c.bold}Slug:${c.reset}  ${slug}`);
  console.log(`  ${c.bold}Time:${c.reset}  ${trace.timestamp}`);
  console.log(`  ${c.bold}Steps:${c.reset} [${trace.steps.map(s => s.id).join(', ')}]`);
  console.log('');

  const runner = new CheckRunner(`Trace Verify: ${mode} ${slug || ''}`);

  // Verify infrastructure
  runner.add('[infra] core.md exists', () => fileExists('skills/cto/core.md') ? true : 'Missing.');
  runner.add('[infra] .cto/ exists', () => isDir('.cto') ? true : 'Missing.');

  if (modeData.skillFile) {
    runner.add(`[infra] ${modeData.skillFile} exists`, () => fileExists(modeData.skillFile) ? true : 'Missing.');
  }

  // Verify each claimed step
  const claimedSteps = trace.steps.map(s => s.id);

  for (const stepId of claimedSteps) {
    const stepDef = modeData.steps.find(s => s.id === stepId);
    if (!stepDef) continue;

    // For cto-continue, verify file existence/modification
    if (mode === 'cto-continue') {
      if (['load-core'].includes(stepId)) {
        runner.add(`[${stepId}] ${stepDef.desc}`, () => fileExists('skills/cto/core.md') ? true : 'File missing.');
      } else if (['ensure-context-dir'].includes(stepId)) {
        runner.add(`[${stepId}] ${stepDef.desc}`, () => isDir('.cto/context') ? true : 'Dir missing.');
      } else if (['read-index', 'check-slug-row'].includes(stepId)) {
        runner.add(`[${stepId}] ${stepDef.desc}`, () => fileExists('.cto/context/index.md') ? true : 'Index missing.');
      } else if (['read-guide', 'apply-gates', 'continue-work', 'update-guide'].includes(stepId)) {
        runner.add(`[${stepId}] ${stepDef.desc}`, () => {
          if (!slug) return 'skip';
          return fileExists(guidePath(slug)) ? true : 'Guide missing.';
        });
      } else if (['update-index'].includes(stepId)) {
        runner.add(`[${stepId}] ${stepDef.desc}`, () => {
          if (!fileExists('.cto/context/index.md')) return 'Index missing.';
          return true;
        });
      } else {
        runner.add(`[${stepId}] ${stepDef.desc}`, () => true);
      }
    } else {
      // For other modes, verify output files exist
      runner.add(`[${stepId}] ${stepDef.desc}`, () => {
        for (const [type, dir] of Object.entries(modeData.outputs)) {
          if (!isDir(dir)) continue;
          const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
          const recent = files.filter(f => Date.now() - fileMtime(path.join(dir, f)) < 60 * 60 * 1000);
          if (recent.length > 0) return true;
        }
        console.log(`         ${c.red}No recent output in ${Object.values(modeData.outputs).join(' or ')}${c.reset}`);
        return false;
      });
    }
  }

  // Check required steps
  const requiredIds = modeData.steps.filter(s => s.required).map(s => s.id);
  runner.add('All required steps claimed', () => {
    const missing = requiredIds.filter(id => !claimedSteps.includes(id));
    if (missing.length === 0) return true;
    console.log(`         ${c.red}Missing: ${missing.join(', ')}${c.reset}`);
    return false;
  });

  runner.run();
  return runner.summary();
}

// ─── List Command ────────────────────────────────────────────────────────────

function runList() {
  console.log(`${c.bold}${c.cyan}━━━ CTO Modes ━━━${c.reset}\n`);

  for (const [mode, data] of Object.entries(MODES)) {
    const requiredSteps = data.steps.filter(s => s.required).length;
    console.log(`  ${c.bold}${mode}${c.reset}  ${c.dim}${data.label}${c.reset}`);
    console.log(`    Keywords: ${data.keywords.length > 0 ? data.keywords.join(', ') : '(default fallback)'}`);
    console.log(`    Steps: ${data.steps.length} total, ${requiredSteps} required`);
    console.log(`    Outputs: ${Object.entries(data.outputs).map(([t, d]) => `${t}→${d}`).join(', ')}`);
    console.log('');
  }

  console.log(`${c.bold}${c.cyan}━━━ Workflow Presets ━━━${c.reset}\n`);
  for (const [name, workflow] of Object.entries(WORKFLOWS)) {
    console.log(`  ${c.bold}${name}${c.reset}  ${c.dim}${workflow.label}${c.reset}`);
    console.log(`    ${workflow.desc}`);
    console.log(`    Steps: ${workflow.steps.join(' → ')}`);
    console.log('');
  }

  console.log(`  ${c.bold}Pipeline alias:${c.reset} ${DEFAULT_WORKFLOW} (${PIPELINE_STEPS.join(' → ')})`);
}

// ─── Workflow / Pipeline Commands ────────────────────────────────────────────

function runWorkflow(preset = DEFAULT_WORKFLOW, slug) {
  const workflow = WORKFLOWS[preset];
  if (!workflow) {
    console.error(`${c.red}Unknown workflow preset: ${preset}${c.reset}`);
    console.error(`  Valid presets: ${Object.keys(WORKFLOWS).join(', ')}`);
    process.exit(2);
  }

  console.log(`${c.bold}${c.cyan}╔══════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   Workflow Validation — ${workflow.label.padEnd(23)}║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════╝${c.reset}`);
  console.log(`  ${c.dim}${workflow.desc}${c.reset}`);
  console.log(`  ${c.bold}Preset:${c.reset} ${preset}`);

  let allPassed = true;
  let hadWarnings = false;
  for (const mode of workflow.steps) {
    const modeData = MODES[mode];
    console.log(`\n${c.bold}${c.magenta}── Stage: ${mode} (${modeData.label}) ──${c.reset}`);

    const runner = new CheckRunner(`${mode}`);

    // Check skill file
    if (modeData.skillFile) {
      runner.add('Skill file exists', () => fileExists(modeData.skillFile) ? true : 'Missing.');
    }

    // Artifact-aware but KISS: warn on missing artifacts instead of failing every output dir.
    // A valid stage may only update the most relevant artifact (for example a fast fix may only write a review/evidence file).
    runner.add('Expected artifact evidence exists or is intentionally absent', () => {
      const dirs = modeArtifactDirs(modeData);
      if (dirs.length === 0) return 'skip';
      const existingDirs = dirs.filter(isDir);
      if (existingDirs.length === 0) return `No expected artifact directories exist yet: ${dirs.join(', ')}`;
      const files = existingDirs.flatMap(dir => recentMarkdownFiles(dir, Number.POSITIVE_INFINITY));
      return files.length > 0 ? true : `No markdown artifacts found yet in: ${existingDirs.join(', ')}`;
    });

    runner.run();
    const stagePassed = runner.summary();
    if (!stagePassed) allPassed = false;
    if (runner.warned > 0) hadWarnings = true;
  }

  console.log(`\n${c.bold}${c.cyan}━━━ Workflow Verdict ━━━${c.reset}\n`);
  if (allPassed && !hadWarnings) {
    console.log(`  ${c.green}${c.bold}WORKFLOW COMPLETE${c.reset} — All stages have expected artifacts.`);
  } else if (allPassed) {
    console.log(`  ${c.yellow}${c.bold}WORKFLOW STRUCTURE OK${c.reset} — No blocking failures; warnings show missing or optional artifacts to review.`);
  } else {
    console.log(`  ${c.red}${c.bold}WORKFLOW INCOMPLETE${c.reset} — Some stages are missing required structure.`);
  }
  return allPassed;
}

function runPipeline(slug) {
  console.log(`${c.dim}pipeline is a compatibility alias for workflow ${DEFAULT_WORKFLOW}.${c.reset}`);
  return runWorkflow(DEFAULT_WORKFLOW, slug);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function usage() {
  console.log(`
${c.bold}cto-mode-validator${c.reset} — Universal gate for ALL /cto modes

${c.bold}Usage:${c.reset}
  node scripts/cto-mode-validator.mjs <command> [args...]

${c.bold}Commands:${c.reset}
  ${c.cyan}detect${c.reset} <input>           Detect which mode user input maps to
  ${c.cyan}validate${c.reset} <mode> [slug]     Validate a mode's workflow was followed
  ${c.cyan}trace${c.reset} write <mode> [slug] [steps...]  Record executed steps
  ${c.cyan}trace${c.reset} verify               Verify trace against filesystem
  ${c.cyan}workflow${c.reset} [preset] [slug]   Validate a workflow preset
  ${c.cyan}pipeline${c.reset} [slug]            Alias for workflow ${DEFAULT_WORKFLOW}
  ${c.cyan}list${c.reset}                       List all modes, presets, and steps

${c.bold}Modes:${c.reset}
  basic-cto, reviewer, inspector, planner, task-splitter, delegation,
  implementation, cleanup, final-review, design-lead, prd, design-spec,
  rfc, tech-spec, post-mortem, cto-continue

${c.bold}Workflow presets:${c.reset}
  ${Object.keys(WORKFLOWS).join(', ')}

${c.bold}Exit Codes:${c.reset}
  0  All checks passed
  1  One or more checks failed
  2  Usage error

${c.bold}Examples:${c.reset}
  node scripts/cto-mode-validator.mjs detect "I have an issue with zod validation"
  node scripts/cto-mode-validator.mjs validate reviewer
  node scripts/cto-mode-validator.mjs validate cto-continue whatsapp
  node scripts/cto-mode-validator.mjs workflow fast-fix my-feature
  node scripts/cto-mode-validator.mjs trace write reviewer
  node scripts/cto-mode-validator.mjs trace verify
  node scripts/cto-mode-validator.mjs pipeline my-feature
`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') { usage(); process.exit(0); }

let success = true;

switch (command) {
  case 'detect':
    runDetect(args.slice(1).join(' '));
    break;
  case 'validate':
    if (!args[1]) { console.error(`${c.red}Error: validate requires a mode name.${c.reset}`); process.exit(2); }
    success = runValidate(args[1], args[2]);
    break;
  case 'trace':
    if (args[1] === 'write') {
      runTraceWrite(args[2], args[3], args.slice(4));
    } else if (args[1] === 'verify') {
      success = runTraceVerify();
    } else {
      console.error(`${c.red}Unknown trace subcommand: ${args[1]}${c.reset}`);
      console.error('  Valid: write, verify');
      process.exit(2);
    }
    break;
  case 'workflow':
    success = runWorkflow(args[1] || DEFAULT_WORKFLOW, args[2]);
    break;
  case 'pipeline':
    success = runPipeline(args[1]);
    break;
  case 'list':
    runList();
    break;
  default:
    console.error(`${c.red}Unknown command: ${command}${c.reset}`);
    usage();
    process.exit(2);
}

process.exit(success ? 0 : 1);
