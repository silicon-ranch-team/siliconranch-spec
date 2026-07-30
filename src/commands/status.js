const fs = require('fs');
const path = require('path');

function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }
  return data;
}

function status(args, { cwd }) {
  const specsDir = path.join(cwd, '.claude', 'specs');
  const activeFile = path.join(specsDir, 'active-spec.txt');

  let active = null;
  if (fs.existsSync(activeFile)) {
    active = fs.readFileSync(activeFile, 'utf-8').trim();
  }

  if (!fs.existsSync(specsDir)) {
    console.log('No specs found. Run `srsp start <name>` or `/srsp-start` in Claude Code.');
    return;
  }

  const specs = [];
  for (const entry of fs.readdirSync(specsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'archive' || entry.name === 'templates') continue;
    const specMd = path.join(specsDir, entry.name, 'spec.md');
    const fm = readFrontmatter(specMd);
    specs.push({
      name: entry.name,
      title: fm?.title || entry.name,
      stage: fm?.stage || 'unknown',
      status: fm?.status || 'unknown',
      updated: fm?.updated || '',
      active: entry.name === active,
    });
  }

  console.log(`Active spec: ${active || '(none)'}`);
  console.log();
  console.log('| Spec | Title | Stage | Status | Updated |');
  console.log('|------|-------|-------|--------|---------|');
  for (const s of specs) {
    const marker = s.active ? '* ' : '';
    console.log(`| ${marker}${s.name} | ${s.title} | ${s.stage} | ${s.status} | ${s.updated} |`);
  }
}

module.exports = { status };
