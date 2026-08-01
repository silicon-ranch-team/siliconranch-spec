const fs = require('fs');
const path = require('path');

const ALLOWED_STAGES = new Set([
  'submitted', 'exploring', 'proposal-draft', 'proposal-approved',
  'implementing', 'verified', 'review-approved', 'committed',
  'pr-created', 'applied', 'done', 'archived', 'cancelled', 'reopened',
]);

function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
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

function parseSimpleYaml(text) {
  const data = {};
  for (const line of text.split(/\r?\n/)) {
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

function readSrspConfig(cwd) {
  const configPath = path.join(cwd, '.srsp-config.md');
  if (!fs.existsSync(configPath)) return {};
  const content = fs.readFileSync(configPath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return parseSimpleYaml(match[1]);
}

function daysSince(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (isNaN(then.getTime())) return null;
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function countRequirements(proposalPath) {
  if (!fs.existsSync(proposalPath)) return 0;
  const content = fs.readFileSync(proposalPath, 'utf-8');
  const match = content.match(/## Functional Requirements([\s\S]*?)(?=\r?\n## |\r?\n---|$)/);
  if (!match) return 0;
  return (match[1].match(/^\d+\.|^-\s|^\*\s|FR\d+/gm) || []).length;
}

function countTraceEntries(trace) {
  if (!trace || typeof trace !== 'object') return 0;
  let count = 0;
  for (const value of Object.values(trace)) {
    if (typeof value === 'string' && value.split(',').every((s) => s.trim())) {
      count++;
    }
  }
  return count;
}

function collectSpecs(specsDir) {
  const specs = [];
  if (!fs.existsSync(specsDir)) return specs;

  const collectFrom = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === 'templates') continue;
      const specDir = path.join(dir, entry.name);
      const specMd = path.join(specDir, 'spec.md');
      const fm = readFrontmatter(specMd);
      if (!fm) continue;
      specs.push({ name: entry.name, dir: specDir, fm });
    }
  };

  collectFrom(specsDir);
  collectFrom(path.join(specsDir, 'archive'));
  return specs;
}

function report(args, { cwd }) {
  const specsDir = path.join(cwd, '.claude', 'specs');
  const config = readSrspConfig(cwd);
  const staleDays = parseInt(config['stale-days'], 10) || 14;
  const scope = args[0] || 'all';

  let specs = collectSpecs(specsDir);

  if (scope === 'active') {
    specs = specs.filter((s) => s.fm.status === 'active');
  }

  const rows = specs.map((s) => {
    const created = s.fm['created-at'] || s.fm.created;
    const stageChanged = s.fm['stage-changed-at'] || s.fm.updated;
    const totalRequirements = countRequirements(path.join(s.dir, 'proposal.md'));
    const traced = countTraceEntries(s.fm.trace);
    let coverage = 'N/A';
    if (totalRequirements > 0) {
      const pct = Math.round((traced / totalRequirements) * 100);
      let status = 'Poor';
      if (pct >= 80) status = 'Good';
      else if (pct >= 50) status = 'Fair';
      coverage = `${pct}% (${status})`;
    }

    return {
      name: s.name,
      title: s.fm.title || s.name,
      status: s.fm.status || 'unknown',
      stage: s.fm.stage || 'unknown',
      age: daysSince(created),
      stageAge: daysSince(stageChanged),
      reopened: parseInt(s.fm['reopened-count'], 10) || 0,
      coverage,
    };
  });

  console.log(`SRSP Spec Health Report (stale threshold: ${staleDays} days)`);
  console.log();
  console.log('| Spec | Title | Status | Stage | Age (days) | Stage Age (days) | Reopened | Coverage |');
  console.log('|------|-------|--------|-------|------------|------------------|----------|----------|');
  for (const r of rows) {
    console.log(`| ${r.name} | ${r.title} | ${r.status} | ${r.stage} | ${r.age ?? '-'} | ${r.stageAge ?? '-'} | ${r.reopened} | ${r.coverage} |`);
  }

  const stale = rows.filter((r) => r.status === 'active' && r.stageAge !== null && r.stageAge > staleDays);
  if (stale.length > 0) {
    console.log();
    console.log('Stale specs:');
    console.log('| Spec | Stage | Stage Age (days) | Recommended Action |');
    console.log('|------|-------|------------------|-------------------|');
    for (const r of stale) {
      console.log(`| ${r.name} | ${r.stage} | ${r.stageAge} | /srsp-resume or /srsp-archive |`);
    }
  }
}

module.exports = { report };
