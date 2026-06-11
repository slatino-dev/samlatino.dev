#!/usr/bin/env node
/**
 * scripts/sync-metrics.mjs
 *
 * Manifest-driven metric sync scaffold.
 *
 * USAGE
 *   node scripts/sync-metrics.mjs [--slug <slug>] [--source <path>] [--dry-run]
 *
 * WHAT IT DOES
 *   1. Reads src/data/metrics/metrics.manifest.json to find which project slugs
 *      are registered.
 *   2. For a given --slug, validates the source bench/site-metrics.json against
 *      the expected schema (see SCHEMA below).
 *   3. Stamps the payload with git sha + date.
 *   4. Writes src/data/metrics/<slug>.json.
 *
 *   In --dry-run mode it validates and prints what would be written without
 *   touching the filesystem.
 *
 * SCHEMA (bench/site-metrics.json in each project repo)
 *   {
 *     "version": "1",
 *     "generated": "<ISO date>",
 *     "tables": [
 *       {
 *         "id": "<string>",
 *         "caption": "<string>",
 *         "columns": [{ "key": "<string>", "label": "<string>", "numeric": bool, "delta": "good"|"bad"|null }],
 *         "rows": [{ "<key>": "<value>", ... }]
 *       }
 *     ]
 *   }
 *
 * BenchTable.astro renders from src/data/metrics/<slug>.json when present.
 * When no metrics file exists for a slug, BenchTable renders an honest
 * "benchmarks in progress" placeholder — never a fabricated number.
 *
 * PHASE E NOTE: This is the scaffold. The actual DGX bench runs that produce
 * bench/site-metrics.json for each repo are Phase E+ work. Run this script
 * once those files land.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const slugArg = getArg('--slug');
const sourceArg = getArg('--source');
const dryRun = hasFlag('--dry-run');

if (!slugArg) {
  console.error('Usage: node scripts/sync-metrics.mjs --slug <slug> --source <path/to/site-metrics.json> [--dry-run]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load manifest
// ---------------------------------------------------------------------------
const manifestPath = resolve(root, 'src/data/metrics/metrics.manifest.json');
if (!existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const registered = manifest.projects.find((p) => p.slug === slugArg);
if (!registered) {
  console.error(`Slug "${slugArg}" not found in manifest. Registered slugs: ${manifest.projects.map((p) => p.slug).join(', ')}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load source metrics
// ---------------------------------------------------------------------------
const sourcePath = sourceArg ?? resolve(root, '..', slugArg, registered.metricsPath);
if (!existsSync(sourcePath)) {
  console.error(`Source metrics not found: ${sourcePath}`);
  console.error(`Pass --source <path> if the file lives elsewhere.`);
  process.exit(1);
}

let raw;
try {
  raw = JSON.parse(readFileSync(sourcePath, 'utf-8'));
} catch (err) {
  console.error(`Failed to parse ${sourcePath}: ${err.message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Validate schema
// ---------------------------------------------------------------------------
const errors = [];

if (raw.version !== '1') errors.push(`version must be "1", got "${raw.version}"`);
if (!raw.generated || typeof raw.generated !== 'string') errors.push('missing "generated" (ISO date string)');
if (!Array.isArray(raw.tables) || raw.tables.length === 0) errors.push('"tables" must be a non-empty array');

for (const [i, table] of (raw.tables ?? []).entries()) {
  if (!table.id) errors.push(`tables[${i}].id is required`);
  if (!table.caption) errors.push(`tables[${i}].caption is required`);
  if (!Array.isArray(table.columns) || table.columns.length === 0) {
    errors.push(`tables[${i}].columns must be a non-empty array`);
  }
  if (!Array.isArray(table.rows) || table.rows.length === 0) {
    errors.push(`tables[${i}].rows must be a non-empty array`);
  }
  for (const [j, col] of (table.columns ?? []).entries()) {
    if (!col.key) errors.push(`tables[${i}].columns[${j}].key is required`);
    if (!col.label) errors.push(`tables[${i}].columns[${j}].label is required`);
    if (col.delta !== undefined && !['good', 'bad', null].includes(col.delta)) {
      errors.push(`tables[${i}].columns[${j}].delta must be "good", "bad", or null`);
    }
  }
}

if (errors.length > 0) {
  console.error('Validation errors:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Stamp with git sha + date
// ---------------------------------------------------------------------------
let gitSha = 'unknown';
try {
  gitSha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root }).toString().trim();
} catch {
  // Not in a git repo or git not available — continue.
}

const output = {
  ...raw,
  _meta: {
    slug: slugArg,
    syncedAt: new Date().toISOString(),
    siteGitSha: gitSha,
    sourcePath: sourcePath,
  },
};

// ---------------------------------------------------------------------------
// Write (or dry-run)
// ---------------------------------------------------------------------------
const outPath = resolve(root, 'src/data/metrics', `${slugArg}.json`);

if (dryRun) {
  console.log(`[dry-run] Would write: ${outPath}`);
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`  tables: ${output.tables.length}`);
console.log(`  git sha: ${gitSha}`);
