#!/usr/bin/env node
/**
 * scripts/check-md-twins.mjs
 *
 * Verifies that every project and writing HTML page in dist/ has a
 * corresponding .md sibling. Fails with exit code 1 if any are missing.
 *
 * USAGE
 *   node scripts/check-md-twins.mjs [--dist <path>]
 *
 * Run after `npm run build`. The convention is:
 *   dist/projects/<slug>/index.html  →  dist/projects/<slug>.md  (or dist/projects/<slug>/index.md)
 *   dist/writing/<slug>/index.html   →  dist/writing/<slug>.md
 *
 * The Astro [slug].md.ts endpoints generate dist/projects/<slug>.md and
 * dist/writing/<slug>.md as flat files (Astro renders them without the
 * trailing-slash index.html pattern since they're plain .ts endpoints).
 */

import { readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const distPath = getArg('--dist') ?? resolve(root, 'dist');

if (!existsSync(distPath)) {
  console.error(`dist/ not found at ${distPath} — run npm run build first.`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Collect HTML pages for projects and writing
// ---------------------------------------------------------------------------
function listSlugDirs(section) {
  const sectionDir = join(distPath, section);
  if (!existsSync(sectionDir)) return [];
  return readdirSync(sectionDir).filter((entry) => {
    const full = join(sectionDir, entry);
    // Each slug generates a directory containing index.html.
    return (
      statSync(full).isDirectory() &&
      existsSync(join(full, 'index.html'))
    );
  });
}

const projectSlugs = listSlugDirs('projects');
const writingSlugs = listSlugDirs('writing');

// ---------------------------------------------------------------------------
// Check .md twins exist
// ---------------------------------------------------------------------------
const missing = [];

for (const slug of projectSlugs) {
  const twin = join(distPath, 'projects', `${slug}.md`);
  if (!existsSync(twin)) {
    missing.push(`projects/${slug}/ has no .md twin (expected: dist/projects/${slug}.md)`);
  }
}

for (const slug of writingSlugs) {
  const twin = join(distPath, 'writing', `${slug}.md`);
  if (!existsSync(twin)) {
    missing.push(`writing/${slug}/ has no .md twin (expected: dist/writing/${slug}.md)`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const totalChecked = projectSlugs.length + writingSlugs.length;

if (missing.length === 0) {
  console.log(`md-twins: OK — ${totalChecked} page(s) checked, all have .md siblings.`);
  console.log(`  projects: ${projectSlugs.join(', ') || '(none)'}`);
  console.log(`  writing:  ${writingSlugs.join(', ') || '(none)'}`);
  process.exit(0);
} else {
  console.error(`md-twins: FAIL — ${missing.length} missing .md twin(s):`);
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}
