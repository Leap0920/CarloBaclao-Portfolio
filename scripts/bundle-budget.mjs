#!/usr/bin/env node
/**
 * Bundle budget.
 *
 * Measures the JavaScript the browser actually loads for a route, by reading
 * the prerendered HTML for that route and summing every chunk it references.
 * That is the real first-load payload, unlike a whole-directory size, which
 * counts every lazily-loaded chunk too.
 *
 * Usage:
 *   node scripts/bundle-budget.mjs [distDir]
 *   NEXT_DIST_DIR=.next-build npm run bundle:budget
 *
 * CI runs `npm run build` then `npm run bundle:budget`, so the default `.next`
 * matches next.config.mjs's own default.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = process.argv[2] || process.env.NEXT_DIST_DIR || '.next';

// A ratchet, not a target. Measured against the production build on
// 2026-10-08:  /  ->  872.3 KB raw / 278.2 KB gzip  (16 chunks)
// The limits sit ~9% above that, so a genuine regression fails the build while
// ordinary content edits do not. Lower them whenever the number drops.
// Overridable for local experiments: BUDGET_RAW_KB / BUDGET_GZIP_KB.
const kbOverride = (value, fallback) => {
  const n = Number(value);
  return value !== undefined && Number.isFinite(n) && n > 0 ? n * 1024 : fallback;
};
const BUDGET = {
  raw: kbOverride(process.env.BUDGET_RAW_KB, 950 * 1024),
  gzip: kbOverride(process.env.BUDGET_GZIP_KB, 300 * 1024),
};

// Only the home route is enforced. It is the first-load payload for every
// visitor; the other routes are reachable only by direct navigation.
const ENFORCED = new Set(['/']);

const appDir = path.join(DIST, 'server', 'app');
if (!fs.existsSync(appDir)) {
  console.error(
    `bundle-budget: no build output at ${appDir}\n` +
      'Run `npm run build` first. If you build to an isolated directory, pass it:\n' +
      '  NEXT_DIST_DIR=.next-build npm run bundle:budget',
  );
  process.exit(2);
}

function measure(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const refs = [...new Set([...html.matchAll(/_next\/(static\/[^"']+?\.js)/g)].map((m) => m[1]))];

  let raw = 0;
  let gzip = 0;
  let unresolved = 0;
  for (const ref of refs) {
    const file = path.join(DIST, ref);
    if (!fs.existsSync(file)) {
      unresolved += 1;
      continue;
    }
    const bytes = fs.readFileSync(file);
    raw += bytes.length;
    gzip += zlib.gzipSync(bytes, { level: 9 }).length;
  }
  return { chunks: refs.length, unresolved, raw, gzip };
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const pct = (n, limit) => `${((n / limit) * 100).toFixed(0)}%`;

const routes = fs
  .readdirSync(appDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => ({
    route: f === 'index.html' ? '/' : `/${f.replace(/\.html$/, '')}`,
    file: path.join(appDir, f),
  }))
  .sort((a, b) => a.route.localeCompare(b.route));

console.log(`bundle budget   dist: ${DIST}`);
console.log('');
console.log('  route            chunks        raw        gzip');
console.log('  ' + '-'.repeat(52));

let failed = false;
for (const { route, file } of routes) {
  const m = measure(file);
  const enforced = ENFORCED.has(route);
  const over = m.raw > BUDGET.raw || m.gzip > BUDGET.gzip;

  let note = '';
  if (enforced) {
    note = over
      ? `  OVER (raw ${pct(m.raw, BUDGET.raw)} of ${kb(BUDGET.raw)}, gzip ${pct(m.gzip, BUDGET.gzip)} of ${kb(BUDGET.gzip)})`
      : `  ok (raw ${pct(m.raw, BUDGET.raw)}, gzip ${pct(m.gzip, BUDGET.gzip)})`;
    if (over) failed = true;
  }
  if (m.unresolved > 0) note += `  [${m.unresolved} unresolved]`;

  console.log(
    `  ${route.padEnd(16)} ${String(m.chunks).padStart(4)}   ${kb(m.raw).padStart(10)} ${kb(m.gzip).padStart(10)}${note}`,
  );
}

console.log('');
if (failed) {
  console.error(
    `bundle-budget: FAILED. The home route exceeded ${kb(BUDGET.raw)} raw / ${kb(BUDGET.gzip)} gzip.\n` +
      'Find what grew before raising the limit. `npx @next/bundle-analyzer` or the\n' +
      'chunk sizes above will point at it.',
  );
  process.exit(1);
}
console.log(`bundle-budget: PASS (enforced route: ${[...ENFORCED].join(', ')})`);
