#!/usr/bin/env node

/**
 * /cto-continue Workflow Validator — Gate Script
 *
 * Validates that the AI follows the correct /cto-continue lifecycle.
 * Run with: node scripts/cto-continue-validator.mjs <command> [slug] [options]
 *
 * Commands:
 *   pre   [slug]     — Pre-condition check (before AI work)
 *   post  [slug]     — Post-execution audit (after AI work)
 *   gate  [slug]     — Full gate: pre + post
 *   check [slug]     — Alias for gate
 *   status           — Show current workflow state
 *   validate-file <path> — Validate a single .cto/ markdown file
 *   trace <subcmd>   — Workflow trace (write/verify/status)
 *
 * Exit codes:
 *   0 — All checks passed
 *   1 — One or more checks failed
 *   2 — Usage error / missing arguments
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ───────────────────────────────────────────────────────────

const CTO_DIR = '.cto';
const CONTEXT_DIR = `${CTO_DIR}/context`;
const INDEX_FILE = `${CONTEXT_DIR}/index.md`;
const DECISIONS_DIR = `${CTO_DIR}/decisions`;
const REVIEWS_DIR = `${CTO_DIR}/reviews`;
const TASKS_DIR = `${CTO_DIR}/tasks`;
const CORE_FILE = 'skills/cto/core.md';
const TEMPLATE_GUIDE = 'skills/cto/templates/context-guide.md';
const TEMPLATE_INDEX = 'skills/cto/templates/context-index.md';
const TRACE_FILE = `${CTO_DIR}/.trace.json`;

const REQUIRED_GUIDE_SECTIONS = [
  'Purpose',
  'Current State',
  'Key Decisions',
  'Relevant Files',
  'Open Questions',
  'Next Actions',
  'Verification Evidence',
  'Notes for Next Session',
];

const VALID_STATUSES = ['active', 'blocked', 'paused', 'done', 'archived'];

// Workflow step definitions for trace verification
const WORKFLOW_STEPS = [
  { id: 'load-core',          desc: 'Read skills/cto/core.md for gates',              type: 'read',   file: CORE_FILE },
  { id: 'ensure-context-dir',  desc: 'Ensure .cto/context/ directory exists',          type: 'check',  file: CONTEXT_DIR },
  { id: 'read-index',          desc: 'Read .cto/context/index.md',                     type: 'read',   file: INDEX_FILE },
  { id: 'scaffold-index',      desc: 'Scaffold index from template if missing',        type: 'write',  file: INDEX_FILE },
  { id: 'check-slug-row',      desc: 'Ensure slug exists in index table',              type: 'check',  file: INDEX_FILE },
  { id: 'add-slug-row',        desc: 'Add slug row to index if missing',               type: 'write',  file: INDEX_FILE },
  { id: 'scaffold-guide',      desc: 'Scaffold guide from template if missing',        type: 'write',  file: null },
  { id: 'read-guide',          desc: 'Read only .cto/context/{slug}.md',               type: 'read',   file: null },
  { id: 'apply-gates',         desc: 'Apply USER-FIRST, KISS, DRY, YAGNI gates',      type: 'gate',   file: null },
  { id: 'continue-work',       desc: 'Continue from guide current state + next actions',type: 'execute',file: null },
  { id: 'update-index',        desc: 'Update index summary/status/updated-at',         type: 'write',  file: INDEX_FILE },
  { id: 'update-guide',        desc: 'Update guide with material context',             type: 'write',  file: null },
  { id: 'record-decisions',    desc: 'Write significant decisions to .cto/decisions/', type: 'write',  file: DECISIONS_DIR },
];

const REQUIRED_STEPS = [
  'load-core',
  'ensure-context-dir',
  'read-index',
  'read-guide',
  'apply-gates',
  'continue-work',
  'update-index',
  'update-guide',
];

// ─── Colors ──────────────────────────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
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
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch {
    return null;
  }
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function fileMtime(p) {
  try {
    return fs.statSync(p).mtimeMs;
  } catch {
    return 0;
  }
}

function parseIndexTable(content) {
  const rows = [];
  const lines = content.split('\n');
  let inTable = false;
  let headerSeen = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!headerSeen) {
        headerSeen = true;
        inTable = true;
        continue;
      }
      if (/^\|[\s-:|]+\|$/.test(trimmed)) continue;
      if (inTable) {
        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map((s) => s.trim().replace(/^`|`$/g, ''));
        if (cells.length >= 5) {
          rows.push({
            slug: cells[0],
            status: cells[1],
            owner: cells[2],
            updated: cells[3],
            summary: cells[4],
            guide: cells[5] || '',
          });
        }
      }
    } else if (inTable && !trimmed.startsWith('|')) {
      break;
    }
  }
  return rows;
}

function checkGuideCompleteness(content) {
  const headings = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.+)/);
    if (match) {
      headings.push(match[1].replace(/[*_`]/g, '').trim());
    }
  }

  const results = [];
  for (const section of REQUIRED_GUIDE_SECTIONS) {
    const found = headings.some(
      (h) => h.toLowerCase().includes(section.toLowerCase()) || section.toLowerCase().includes(h.toLowerCase())
    );
    results.push({ section, found });
  }
  return results;
}

const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9._-]{0,127}$/i;
function assertSafeSlug(slug) {
  if (!slug || !SAFE_SLUG_RE.test(slug)) {
    throw new Error(`Unsafe slug: ${slug || '(empty)'}. Use letters, numbers, dots, underscores, or hyphens only.`);
  }
}
function guidePath(slug) {
  assertSafeSlug(slug);
  return path.join(CONTEXT_DIR, `${slug}.md`);
}
function isUnderDir(filePath, dir) {
  const root = path.resolve(dir);
  const resolved = path.resolve(filePath);
  return resolved === root || resolved.startsWith(root + path.sep);
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

  add(label, fn) {
    this.checks.push({ label, fn });
  }

  run() {
    console.log(`\n${c.bold}${c.cyan}━━━ ${this.name} ━━━${c.reset}\n`);
    for (const { label, fn } of this.checks) {
      try {
        const result = fn();
        if (result === true) {
          console.log(`  ${PASS}  ${label}`);
          this.passed++;
        } else if (result === 'skip') {
          console.log(`  ${SKIP}  ${label}`);
          this.skipped++;
        } else if (typeof result === 'string') {
          console.log(`  ${WARN}  ${label}`);
          console.log(`         ${c.yellow}${result}${c.reset}`);
          this.warned++;
        } else {
          console.log(`  ${FAIL}  ${label}`);
          if (result) console.log(`         ${c.red}${result}${c.reset}`);
          this.failed++;
        }
      } catch (err) {
        console.log(`  ${FAIL}  ${label}`);
        console.log(`         ${c.red}Error: ${err.message}${c.reset}`);
        this.failed++;
      }
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

// ─── Pre-Condition Checks ────────────────────────────────────────────────────

function runPreChecks(slug) {
  if (slug) assertSafeSlug(slug);
  const runner = new CheckRunner(`Pre-Condition Check: /cto-continue ${slug || '[no slug]'}`);

  runner.add('.cto/ directory exists', () => {
    return isDir(CTO_DIR) ? true : `Missing. Run /cto-init first.`;
  });

  runner.add('.cto/context/ directory exists', () => {
    if (!isDir(CTO_DIR)) return 'skip';
    return isDir(CONTEXT_DIR) ? true : `Missing. Run /cto-init first.`;
  });

  runner.add(`${CORE_FILE} exists (gates file)`, () => {
    return fileExists(CORE_FILE) ? true : `Missing. Cannot load gates without core.md.`;
  });

  runner.add(`${INDEX_FILE} exists and has valid table`, () => {
    if (!isDir(CONTEXT_DIR)) return 'skip';
    if (!fileExists(INDEX_FILE)) return `Missing. Will be scaffolded from template.`;
    const content = readFile(INDEX_FILE);
    const rows = parseIndexTable(content);
    if (rows.length === 0) return 'Exists but has no table rows.';
    return true;
  });

  runner.add('Template files available for scaffolding', () => {
    const guideTmpl = fileExists(TEMPLATE_GUIDE);
    const indexTmpl = fileExists(TEMPLATE_INDEX);
    if (guideTmpl && indexTmpl) return true;
    const missing = [];
    if (!guideTmpl) missing.push(TEMPLATE_GUIDE);
    if (!indexTmpl) missing.push(TEMPLATE_INDEX);
    return `Missing templates: ${missing.join(', ')}`;
  });

  if (slug) {
    runner.add(`Slug "${slug}" exists in index table`, () => {
      if (!fileExists(INDEX_FILE)) return 'skip';
      const content = readFile(INDEX_FILE);
      const rows = parseIndexTable(content);
      const found = rows.find((r) => r.slug === slug);
      if (!found) return `Slug "${slug}" not in index. Will be added.`;
      return true;
    });

    runner.add(`Slug "${slug}" has valid status`, () => {
      if (!fileExists(INDEX_FILE)) return 'skip';
      const content = readFile(INDEX_FILE);
      const rows = parseIndexTable(content);
      const found = rows.find((r) => r.slug === slug);
      if (!found) return 'skip';
      if (!VALID_STATUSES.includes(found.status)) {
        return `Invalid status "${found.status}". Must be one of: ${VALID_STATUSES.join(', ')}`;
      }
      return true;
    });

    runner.add(`Guide ${guidePath(slug)} exists`, () => {
      return fileExists(guidePath(slug)) ? true : `Missing. Will be scaffolded from template.`;
    });

    runner.add('Guide has all required sections', () => {
      if (!fileExists(guidePath(slug))) return 'skip';
      const content = readFile(guidePath(slug));
      const sections = checkGuideCompleteness(content);
      const missing = sections.filter((s) => !s.found).map((s) => s.section);
      if (missing.length === 0) return true;
      return `Missing sections: ${missing.join(', ')}`;
    });

    runner.add('Guide has real content (not just template placeholders)', () => {
      if (!fileExists(guidePath(slug))) return 'skip';
      const content = readFile(guidePath(slug));
      const placeholders = content.match(/\{[^}]+\}/g) || [];
      const templatePhrases = ['TBD', 'YYYY-MM-DD', 'One-line current state'];
      const hasTemplate = templatePhrases.some((p) => content.includes(p));
      if (placeholders.length > 3 && hasTemplate) {
        return 'Guide appears to be unmodified template. Needs real content.';
      }
      return true;
    });
  }

  runner.run();
  return runner.summary();
}

// ─── Post-Execution Audit ────────────────────────────────────────────────────

function runPostAudit(slug) {
  if (slug) assertSafeSlug(slug);
  const runner = new CheckRunner(`Post-Execution Audit: /cto-continue ${slug || '[no slug]'}`);

  if (!slug) {
    runner.add('Slug provided for post-audit', () => {
      return 'Cannot audit without a slug. Usage: cto-continue-validator post <slug>';
    });
    runner.run();
    return runner.summary();
  }

  runner.add(`Index ${INDEX_FILE} was updated (mtime check)`, () => {
    if (!fileExists(INDEX_FILE)) return 'Index file does not exist.';
    const mtime = fileMtime(INDEX_FILE);
    const age = Date.now() - mtime;
    const maxAge = 5 * 60 * 1000;
    if (age > maxAge) {
      const mins = Math.round(age / 60000);
      return `Index last modified ${mins}m ago. Expected update during this continue.`;
    }
    return true;
  });

  runner.add(`Guide ${guidePath(slug)} was updated`, () => {
    const gp = guidePath(slug);
    if (!fileExists(gp)) return 'Guide file does not exist.';
    const mtime = fileMtime(gp);
    const age = Date.now() - mtime;
    const maxAge = 5 * 60 * 1000;
    if (age > maxAge) {
      const mins = Math.round(age / 60000);
      return `Guide last modified ${mins}m ago. Expected update during this continue.`;
    }
    return true;
  });

  runner.add(`Index contains valid row for "${slug}"`, () => {
    if (!fileExists(INDEX_FILE)) return 'Index file missing.';
    const content = readFile(INDEX_FILE);
    const rows = parseIndexTable(content);
    const found = rows.find((r) => r.slug === slug);
    if (!found) return `Slug "${slug}" not found in index table.`;
    if (!VALID_STATUSES.includes(found.status)) {
      return `Invalid status "${found.status}".`;
    }
    if (!found.updated || found.updated === 'YYYY-MM-DD') {
      return 'Updated date is placeholder.';
    }
    return true;
  });

  runner.add('Guide has all required sections with content', () => {
    const gp = guidePath(slug);
    if (!fileExists(gp)) return 'Guide file missing.';
    const content = readFile(gp);
    const sections = checkGuideCompleteness(content);
    const missing = sections.filter((s) => !s.found).map((s) => s.section);
    if (missing.length > 0) return `Missing sections: ${missing.join(', ')}`;

    const nextActionsMatch = content.match(/## Next Actions\s*\n([\s\S]*?)(?=\n##|$)/i);
    if (nextActionsMatch) {
      const body = nextActionsMatch[1].trim();
      const hasItems = /^\d+\.\s+/.test(body) || /^-\s+/.test(body);
      if (!hasItems) return 'Next Actions section is empty.';
    }
    return true;
  });

  runner.add('No unrelated context files were modified', () => {
    if (!isDir(CONTEXT_DIR)) return 'skip';
    const files = fs.readdirSync(CONTEXT_DIR).filter((f) => f.endsWith('.md') && f !== 'index.md');
    const recentFiles = files.filter((f) => {
      const age = Date.now() - fileMtime(path.join(CONTEXT_DIR, f));
      return age < 5 * 60 * 1000;
    });
    const unrelated = recentFiles.filter((f) => f !== `${slug}.md`);
    if (unrelated.length > 0) {
      return `Unrelated files modified: ${unrelated.join(', ')}. Only ${slug}.md should change.`;
    }
    return true;
  });

  runner.add('Guide has substantive content (not template)', () => {
    const gp = guidePath(slug);
    if (!fileExists(gp)) return 'Guide missing.';
    const content = readFile(gp);
    const lines = content.split('\n').filter((l) => l.trim());
    if (lines.length < 15) return `Guide has only ${lines.length} lines. Too short for real context.`;
    const placeholders = (content.match(/\{[^}]+\}/g) || []).length;
    if (placeholders > 5) return `Guide has ${placeholders} unfilled placeholders.`;
    return true;
  });

  runner.add('Gates from core.md were referenced', () => {
    const gp = guidePath(slug);
    if (!fileExists(gp)) return 'skip';
    const content = readFile(gp).toLowerCase();
    const gateKeywords = ['user-first', 'kiss', 'dry', 'yagni', 'gate', 'simplicity', 'evidence'];
    const found = gateKeywords.filter((k) => content.includes(k));
    if (found.length === 0) {
      return 'No gate keywords found in output. Gates may not have been applied.';
    }
    return true;
  });

  runner.add('Decisions directory ready for recording', () => {
    return isDir(DECISIONS_DIR) ? true : `${DECISIONS_DIR}/ missing. Run /cto-init.`;
  });

  runner.run();
  return runner.summary();
}

// ─── Trace: Write + Verify ───────────────────────────────────────────────────

function runTraceWrite(slug, steps) {
  if (!slug) {
    console.error(`${c.red}Error: trace write requires a slug.${c.reset}`);
    process.exit(2);
  }
  if (!steps || steps.length === 0) {
    console.error(`${c.red}Error: trace write requires at least one step.${c.reset}`);
    console.error(`  Usage: cto-continue-validator.mjs trace write <slug> <step1> [step2] ...`);
    console.error(`  Steps: ${WORKFLOW_STEPS.map((s) => s.id).join(', ')}`);
    process.exit(2);
  }

  const validIds = WORKFLOW_STEPS.map((s) => s.id);
  assertSafeSlug(slug);

  const invalid = steps.filter((s) => !validIds.includes(s));
  if (invalid.length > 0) {
    console.error(`${c.red}Error: Unknown step(s): ${invalid.join(', ')}${c.reset}`);
    console.error(`  Valid steps: ${validIds.join(', ')}`);
    process.exit(2);
  }

  const trace = {
    slug,
    timestamp: new Date().toISOString(),
    steps: steps.map((id) => ({ id, timestamp: new Date().toISOString() })),
  };

  if (!isDir(CTO_DIR)) fs.mkdirSync(CTO_DIR, { recursive: true });

  fs.writeFileSync(TRACE_FILE, JSON.stringify(trace, null, 2));
  console.log(`${c.green}✓ Trace written${c.reset} → ${TRACE_FILE}`);
  console.log(`  Slug: ${trace.slug}`);
  console.log(`  Steps: ${trace.steps.map((s) => s.id).join(' → ')}`);
}

function runTraceVerify() {
  console.log(`${c.bold}${c.cyan}━━━ Trace Verification ━━━${c.reset}\n`);

  if (!fileExists(TRACE_FILE)) {
    console.log(`  ${FAIL}  No trace file found at ${TRACE_FILE}`);
    console.log(`         Run: cto-continue-validator.mjs trace write <slug> <steps...>`);
    process.exit(1);
  }

  const trace = JSON.parse(readFile(TRACE_FILE));
  const slug = trace.slug;
  const claimedSteps = trace.steps.map((s) => s.id);

  console.log(`  ${c.bold}Trace:${c.reset} slug=${slug}, steps=[${claimedSteps.join(', ')}]`);
  console.log(`  ${c.bold}Written:${c.reset} ${trace.timestamp}`);
  console.log('');

  const runner = new CheckRunner(`Trace Verification: ${slug}`);

  for (const stepId of claimedSteps) {
    const step = WORKFLOW_STEPS.find((s) => s.id === stepId);
    if (!step) continue;

    const targetFile = step.file
      ? step.file.replace('{slug}', slug)
      : guidePath(slug);

    switch (step.type) {
      case 'read':
        runner.add(`[${stepId}] ${step.desc}`, () => {
          return fileExists(targetFile) ? true : `File not found: ${targetFile}`;
        });
        break;

      case 'check':
        runner.add(`[${stepId}] ${step.desc}`, () => {
          if (stepId === 'ensure-context-dir') {
            return isDir(targetFile) ? true : `Directory not found: ${targetFile}`;
          }
          if (stepId === 'check-slug-row') {
            if (!fileExists(INDEX_FILE)) return 'Index missing.';
            const rows = parseIndexTable(readFile(INDEX_FILE));
            return rows.find((r) => r.slug === slug) ? true : `Slug "${slug}" not in index.`;
          }
          return fileExists(targetFile) ? true : `Not found: ${targetFile}`;
        });
        break;

      case 'write':
        runner.add(`[${stepId}] ${step.desc}`, () => {
          if (!fileExists(targetFile)) return `File not found: ${targetFile}`;
          const age = Date.now() - fileMtime(targetFile);
          if (age > 10 * 60 * 1000) {
            return `File not recently modified (${Math.round(age / 60000)}m ago). Write may not have happened.`;
          }
          return true;
        });
        break;

      case 'gate':
        runner.add(`[${stepId}] ${step.desc}`, () => {
          const gp = guidePath(slug);
          if (!fileExists(gp)) return 'skip';
          const content = readFile(gp).toLowerCase();
          const gateKeywords = ['user-first', 'kiss', 'dry', 'yagni', 'gate', 'simplicity', 'evidence'];
          const found = gateKeywords.filter((k) => content.includes(k));
          return found.length > 0 ? true : 'No gate keywords found in output.';
        });
        break;

      case 'execute':
        runner.add(`[${stepId}] ${step.desc}`, () => {
          const gp = guidePath(slug);
          if (!fileExists(gp)) return 'Guide missing.';
          const content = readFile(gp);
          const naMatch = content.match(/## Next Actions\s*\n([\s\S]*?)(?=\n##|$)/i);
          if (!naMatch) return 'No Next Actions section.';
          const body = naMatch[1].trim();
          return body.length > 10 ? true : 'Next Actions section is empty.';
        });
        break;
    }
  }

  // Check required steps were all claimed
  runner.add('All required steps were claimed', () => {
    const missing = REQUIRED_STEPS.filter((s) => !claimedSteps.includes(s));
    if (missing.length === 0) return true;
    console.log(`         ${c.red}Missing required steps: ${missing.join(', ')}${c.reset}`);
    return false;
  });

  // Check no unrelated files were modified
  runner.add('No unrelated context files modified', () => {
    if (!isDir(CONTEXT_DIR)) return 'skip';
    const files = fs.readdirSync(CONTEXT_DIR).filter((f) => f.endsWith('.md') && f !== 'index.md');
    const recentFiles = files.filter((f) => {
      const age = Date.now() - fileMtime(path.join(CONTEXT_DIR, f));
      return age < 10 * 60 * 1000;
    });
    const unrelated = recentFiles.filter((f) => f !== `${slug}.md`);
    return unrelated.length === 0 ? true : `Unrelated files modified: ${unrelated.join(', ')}`;
  });

  runner.run();
  return runner.summary();
}

function runTraceStatus() {
  console.log(`${c.bold}${c.cyan}━━━ Trace Status ━━━${c.reset}\n`);

  if (!fileExists(TRACE_FILE)) {
    console.log(`  ${c.yellow}No trace file.${c.reset}`);
    console.log(`  Run: cto-continue-validator.mjs trace write <slug> <steps...>`);
    return;
  }

  const trace = JSON.parse(readFile(TRACE_FILE));
  console.log(`  ${c.bold}Slug:${c.reset}     ${trace.slug}`);
  console.log(`  ${c.bold}Timestamp:${c.reset} ${trace.timestamp}`);
  console.log(`  ${c.bold}Steps:${c.reset}`);

  for (const step of trace.steps) {
    const def = WORKFLOW_STEPS.find((s) => s.id === step.id);
    console.log(`    ${c.green}✓${c.reset} ${step.id}  ${c.dim}${def ? def.desc : ''}${c.reset}`);
  }

  const claimed = trace.steps.map((s) => s.id);
  const missing = REQUIRED_STEPS.filter((s) => !claimed.includes(s));
  if (missing.length > 0) {
    console.log(`\n  ${c.red}Missing required steps:${c.reset} ${missing.join(', ')}`);
  }
}

// ─── Full Gate (pre + post) ──────────────────────────────────────────────────

function runGate(slug) {
  console.log(`${c.bold}${c.cyan}╔══════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   /cto-continue Workflow Validator — FULL GATE   ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════╝${c.reset}`);

  const preOk = runPreChecks(slug);
  console.log(`\n${c.dim}────────────────────────────────────────────────${c.reset}`);
  const postOk = runPostAudit(slug);

  console.log(`\n${c.bold}${c.cyan}━━━ Final Verdict ━━━${c.reset}\n`);
  if (preOk && postOk) {
    console.log(`  ${c.green}${c.bold}ALL GATES PASSED${c.reset} — /cto-continue workflow followed correctly.`);
    return true;
  } else if (preOk && !postOk) {
    console.log(`  ${c.yellow}${c.bold}PRE OK, POST FAILED${c.reset} — Pre-conditions met but execution incomplete.`);
    return false;
  } else if (!preOk && postOk) {
    console.log(`  ${c.yellow}${c.bold}PRE FAILED, POST OK${c.reset} — Execution done but pre-conditions not met.`);
    return false;
  } else {
    console.log(`  ${c.red}${c.bold}BOTH FAILED${c.reset} — Pre-conditions and execution both incomplete.`);
    return false;
  }
}

// ─── Status ──────────────────────────────────────────────────────────────────

function runStatus() {
  console.log(`${c.bold}${c.cyan}━━━ /cto-continue Status ━━━${c.reset}\n`);

  const dirs = [CTO_DIR, CONTEXT_DIR, DECISIONS_DIR, REVIEWS_DIR, TASKS_DIR];
  console.log(`  ${c.bold}Directory Structure:${c.reset}`);
  for (const d of dirs) {
    const exists = isDir(d);
    console.log(`    ${exists ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`} ${d}/`);
  }

  console.log(`\n  ${c.bold}Templates:${c.reset}`);
  const templates = [CORE_FILE, TEMPLATE_GUIDE, TEMPLATE_INDEX];
  for (const t of templates) {
    const exists = fileExists(t);
    console.log(`    ${exists ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`} ${t}`);
  }

  console.log(`\n  ${c.bold}Continuation Contexts:${c.reset}`);
  if (!fileExists(INDEX_FILE)) {
    console.log(`    ${c.red}No index file found.${c.reset}`);
    return;
  }

  const content = readFile(INDEX_FILE);
  const rows = parseIndexTable(content);
  if (rows.length === 0) {
    console.log(`    ${c.yellow}No contexts indexed.${c.reset}`);
    return;
  }

  for (const row of rows) {
    const statusColor =
      row.status === 'active' ? c.green
        : row.status === 'blocked' ? c.red
        : row.status === 'done' ? c.dim
        : c.yellow;
    const guideExists = fileExists(guidePath(row.slug));
    console.log(
      `    ${c.bold}${row.slug}${c.reset}  ${statusColor}[${row.status}]${c.reset}  ${row.updated}  ${c.dim}${row.summary}${c.reset}  ${guideExists ? `${c.green}guide✓${c.reset}` : `${c.red}guide✗${c.reset}`}`
    );
  }
}

// ─── Validate Single File ────────────────────────────────────────────────────

function runValidateFile(filePath) {
  console.log(`${c.bold}${c.cyan}━━━ Validate: ${filePath} ━━━${c.reset}\n`);

  if (!filePath.endsWith('.md') || !isUnderDir(filePath, CTO_DIR)) {
    console.log(`  ${FAIL}  Refusing to validate outside .cto markdown scope: ${filePath}`);
    process.exit(2);
  }

  if (!fileExists(filePath)) {
    console.log(`  ${FAIL}  File does not exist: ${filePath}`);
    process.exit(1);
  }

  const content = readFile(filePath);
  const runner = new CheckRunner(`File Validation: ${path.basename(filePath)}`);

  runner.add('File has content', () => {
    return content.trim().length > 0 ? true : 'File is empty.';
  });

  runner.add('File has at least one heading', () => {
    const lines = content.split('\n');
    const headings = lines.filter((l) => /^#{1,3}\s+/.test(l));
    return headings.length > 0 ? true : 'No markdown headings found.';
  });

  if (filePath.includes('/context/') && !filePath.endsWith('index.md')) {
    runner.add('Context guide has required sections', () => {
      const sections = checkGuideCompleteness(content);
      const missing = sections.filter((s) => !s.found).map((s) => s.section);
      if (missing.length === 0) return true;
      return `Missing: ${missing.join(', ')}`;
    });

    runner.add('Has Next Actions', () => {
      const match = content.match(/## Next Actions\s*\n([\s\S]*?)(?=\n##|$)/i);
      if (!match) return 'No Next Actions section.';
      const body = match[1].trim();
      return body.length > 10 ? true : 'Next Actions section is empty.';
    });

    runner.add('Has Current State', () => {
      const match = content.match(/## Current State\s*\n([\s\S]*?)(?=\n##|$)/i);
      if (!match) return 'No Current State section.';
      const body = match[1].trim();
      return body.length > 10 ? true : 'Current State section is empty.';
    });

    runner.add('Not a raw template copy', () => {
      const placeholders = (content.match(/\{[^}]+\}/g) || []).length;
      if (placeholders > 5) return `${placeholders} unfilled placeholders found.`;
      return true;
    });
  }

  if (filePath.endsWith('index.md')) {
    runner.add('Index has valid table', () => {
      const rows = parseIndexTable(content);
      return rows.length > 0 ? true : 'No table rows found.';
    });

    runner.add('Table rows have valid status values', () => {
      const rows = parseIndexTable(content);
      const invalid = rows.filter((r) => !VALID_STATUSES.includes(r.status));
      if (invalid.length === 0) return true;
      return `Invalid statuses: ${invalid.map((r) => `"${r.slug}"="${r.status}"`).join(', ')}`;
    });
  }

  runner.run();
  return runner.summary();
}

// ─── Schema ──────────────────────────────────────────────────────────────────

function runSchema() {
  console.log(`${c.bold}${c.cyan}━━━ /cto-continue Workflow Schema ━━━${c.reset}\n`);

  const steps = [
    { id: 1, name: 'load-core', desc: 'Read skills/cto/core.md for gates', type: 'read', required: true },
    { id: 2, name: 'ensure-context-dir', desc: 'Ensure .cto/context/ exists', type: 'precondition', required: true },
    { id: 3, name: 'read-index', desc: 'Read .cto/context/index.md', type: 'read', required: true },
    { id: 4, name: 'scaffold-if-missing', desc: 'Scaffold index/guide from templates if missing', type: 'conditional', required: false },
    { id: 5, name: 'check-slug-row', desc: 'Ensure slug exists in index table', type: 'validation', required: true },
    { id: 6, name: 'read-guide', desc: 'Read only .cto/context/{slug}.md', type: 'read', required: true },
    { id: 7, name: 'apply-gates', desc: 'Apply USER-FIRST, KISS, DRY, YAGNI gates', type: 'gate', required: true },
    { id: 8, name: 'continue-work', desc: 'Continue from guide current state, next actions, evidence', type: 'execute', required: true },
    { id: 9, name: 'update-index', desc: 'Update index summary/status/updated-at only', type: 'write', required: true },
    { id: 10, name: 'update-guide', desc: 'Update guide with material context only', type: 'write', required: true },
    { id: 11, name: 'record-decisions', desc: 'Write significant decisions to .cto/decisions/', type: 'write', required: false },
  ];

  for (const step of steps) {
    const req = step.required ? `${c.red}REQUIRED${c.reset}` : `${c.dim}optional${c.reset}`;
    console.log(`  ${c.bold}Step ${step.id}${c.reset}  [${step.type}]  ${req}`);
    console.log(`         ${step.name}: ${step.desc}`);
    console.log('');
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function usage() {
  console.log(`
${c.bold}cto-continue-validator${c.reset} — Gate script for /cto-continue workflow

${c.bold}Usage:${c.reset}
  node scripts/cto-continue-validator.mjs <command> [slug] [options]

${c.bold}Commands:${c.reset}
  ${c.cyan}pre${c.reset}  [slug]        Pre-condition check (before AI works)
  ${c.cyan}post${c.reset} [slug]        Post-execution audit (after AI works)
  ${c.cyan}gate${c.reset} [slug]        Full gate: pre + post
  ${c.cyan}check${c.reset} [slug]       Alias for gate
  ${c.cyan}status${c.reset}             Show .cto/ directory status
  ${c.cyan}schema${c.reset}             Print workflow step definitions
  ${c.cyan}validate-file${c.reset} <p>  Validate a single .cto/ markdown file
  ${c.cyan}trace${c.reset} <subcmd>       Workflow trace (write/verify/status)

${c.bold}Trace Subcommands:${c.reset}
  ${c.cyan}trace write${c.reset} <slug> <step1> [step2] ...  Record executed steps
  ${c.cyan}trace verify${c.reset}                             Verify trace against filesystem
  ${c.cyan}trace status${c.reset}                             Show current trace

${c.bold}Trace Steps:${c.reset}
  load-core, ensure-context-dir, read-index, scaffold-index, check-slug-row,
  add-slug-row, scaffold-guide, read-guide, apply-gates, continue-work,
  update-index, update-guide, record-decisions

${c.bold}Exit Codes:${c.reset}
  0  All checks passed
  1  One or more checks failed
  2  Usage error

${c.bold}Examples:${c.reset}
  node scripts/cto-continue-validator.mjs pre whatsapp
  node scripts/cto-continue-validator.mjs gate billing-migration
  node scripts/cto-continue-validator.mjs status
  node scripts/cto-continue-validator.mjs validate-file .cto/context/whatsapp.md
  node scripts/cto-continue-validator.mjs trace write whatsapp load-core read-index read-guide apply-gates
  node scripts/cto-continue-validator.mjs trace verify
`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  usage();
  process.exit(0);
}

let success = true;

switch (command) {
  case 'pre':
    success = runPreChecks(args[1]);
    break;
  case 'post':
    success = runPostAudit(args[1]);
    break;
  case 'gate':
  case 'check':
    success = runGate(args[1]);
    break;
  case 'status':
    runStatus();
    break;
  case 'schema':
    runSchema();
    break;
  case 'validate-file':
    if (!args[1]) {
      console.error(`${c.red}Error: validate-file requires a file path.${c.reset}`);
      process.exit(2);
    }
    success = runValidateFile(args[1]);
    break;
  case 'trace':
    switch (args[1]) {
      case 'write':
        runTraceWrite(args[2], args.slice(3));
        break;
      case 'verify':
        success = runTraceVerify();
        break;
      case 'status':
        runTraceStatus();
        break;
      default:
        console.error(`${c.red}Unknown trace subcommand: ${args[1]}${c.reset}`);
        console.error(`  Valid: write, verify, status`);
        process.exit(2);
    }
    break;
  default:
    console.error(`${c.red}Unknown command: ${command}${c.reset}`);
    usage();
    process.exit(2);
}

process.exit(success ? 0 : 1);
