const fs = require('fs');
const path = require('path');

const ALLOWED_KEYS = new Set([
  'test-command',
  'commit-prefix',
  'branch-prefix',
  'pr-target',
  'coverage-command',
  'stale-days',
  'ticket-base-url',
]);

function parseFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const lines = match[1].split(/\r?\n/);
  const data = {};
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  }
  return data;
}

function validateConfig(filePath) {
  const fm = parseFrontmatter(filePath);
  if (!fm) {
    if (fs.readFileSync(filePath, 'utf8').trim().startsWith('#')) {
      return { ok: true }; // documentation-only config file
    }
    return { ok: false, errors: [`${filePath}: missing YAML frontmatter`] };
  }

  const errors = [];
  const warnings = [];
  for (const key of Object.keys(fm)) {
    if (!ALLOWED_KEYS.has(key)) {
      warnings.push(`${filePath}: unknown key '${key}' (allowed: ${Array.from(ALLOWED_KEYS).join(', ')})`);
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}

function main() {
  const files = [];
  const rootConfig = path.join(process.cwd(), '.srsp-config.md');
  if (fs.existsSync(rootConfig)) files.push(rootConfig);

  const specsDir = path.join(process.cwd(), '.claude', 'specs');
  if (fs.existsSync(specsDir)) {
    for (const entry of fs.readdirSync(specsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const specConfig = path.join(specsDir, entry.name, '.srsp-config.md');
      if (fs.existsSync(specConfig)) files.push(specConfig);
    }
  }

  let errors = 0;
  let warnings = 0;
  for (const file of files) {
    const result = validateConfig(file);
    if (result.errors && result.errors.length) {
      for (const err of result.errors) {
        console.error(`✗ ${err}`);
        errors++;
      }
    }
    if (result.warnings && result.warnings.length) {
      for (const warn of result.warnings) {
        console.warn(`⚠ ${warn}`);
        warnings++;
      }
    }
    if (result.ok && (!result.warnings || result.warnings.length === 0)) {
      console.log(`✓ ${file}`);
    }
  }

  if (errors > 0) process.exit(1);
}

main();
