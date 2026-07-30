const fs = require('fs');
const path = require('path');

const ALLOWED_STAGES = new Set([
  'submitted', 'exploring', 'proposal-draft', 'proposal-approved',
  'implementing', 'verified', 'review-approved', 'committed',
  'pr-created', 'applied', 'done', 'archived', 'cancelled',
]);

const ALLOWED_STATUSES = new Set(['active', 'done', 'archived', 'cancelled']);

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

function doctor(args, { cwd }) {
  const specsDir = path.join(cwd, '.claude', 'specs');
  const activeFile = path.join(specsDir, 'active-spec.txt');

  if (!fs.existsSync(activeFile)) {
    console.error('No active spec. Run `srsp status` or `srsp switch <name>`.');
    process.exit(1);
  }

  const name = fs.readFileSync(activeFile, 'utf-8').trim();
  const specDir = path.join(specsDir, name);
  const specMd = path.join(specDir, 'spec.md');

  if (!fs.existsSync(specMd)) {
    console.error(`Active spec ${name} is missing spec.md`);
    process.exit(1);
  }

  const fm = readFrontmatter(specMd);
  const findings = [];

  const requiredFields = ['spec', 'title', 'author', 'status', 'stage', 'created', 'updated'];
  for (const field of requiredFields) {
    if (!fm[field]) findings.push(`Missing required frontmatter field: ${field}`);
  }

  if (fm.status && !ALLOWED_STATUSES.has(fm.status)) {
    findings.push(`Invalid status: ${fm.status}`);
  }

  if (fm.stage && !ALLOWED_STAGES.has(fm.stage)) {
    findings.push(`Invalid stage: ${fm.stage}`);
  }

  const requiredArtifacts = [];
  if (['exploring', 'proposal-draft'].includes(fm.stage)) {
    requiredArtifacts.push('proposal.md');
  }
  if (['proposal-approved', 'implementing', 'verified', 'review-approved', 'committed', 'pr-created', 'applied'].includes(fm.stage)) {
    requiredArtifacts.push('proposal.md', 'design.md', 'tasks.md');
  }

  for (const artifact of requiredArtifacts) {
    if (!fs.existsSync(path.join(specDir, artifact))) {
      findings.push(`Missing required artifact for stage ${fm.stage}: ${artifact}`);
    }
  }

  if (findings.length === 0) {
    console.log(`Active spec: ${name}`);
    console.log(`Stage: ${fm.stage}`);
    console.log('Status: OK');
  } else {
    console.log(`Active spec: ${name}`);
    console.log(`Stage: ${fm.stage || 'unknown'}`);
    console.log('Findings:');
    for (const f of findings) {
      console.log(`  - ${f}`);
    }
    process.exit(1);
  }
}

module.exports = { doctor };
