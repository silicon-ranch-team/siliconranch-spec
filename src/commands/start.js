const fs = require('fs');
const path = require('path');

const NAME_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

function isoDate() {
  return new Date().toISOString().split('T')[0];
}

function isoTimestamp() {
  return new Date().toISOString();
}

function start(args, { cwd }) {
  const name = args[0];
  const templateIdx = args.findIndex((a) => a === '--template' || a === '-t');
  const template = templateIdx >= 0 ? args[templateIdx + 1] : null;

  if (!name || name.startsWith('-')) {
    console.error('Usage: srsp start <spec-name> [--template <template-name>]');
    process.exit(1);
  }

  if (!NAME_RE.test(name)) {
    console.error(`Invalid spec name: ${name}. Use kebab-case or snake_case.`);
    process.exit(1);
  }

  const specsDir = path.join(cwd, '.claude', 'specs');
  const specDir = path.join(specsDir, name);
  const templatesDir = path.join(specsDir, 'templates', template || '');

  if (fs.existsSync(specDir)) {
    console.error(`Spec already exists: ${specDir}`);
    process.exit(1);
  }

  if (template && !fs.existsSync(templatesDir)) {
    console.error(`Template not found: ${template}`);
    process.exit(1);
  }

  fs.mkdirSync(specDir, { recursive: true });

  const title = name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const today = isoDate();
  const now = isoTimestamp();

  const specMd = `---
spec: ${name}
title: ${title}
author: engineer
status: active
stage: submitted
explored: ""
proposed: ""
applied: ""
archived: ""
created: ${today}
updated: ${now}
last-run: ""
test-result: ""
commit-hash: ""
pr-url: ""
base-branch: ""
ticket-url: ""
---

# Spec: ${title}

## Context

## Goal

## Requirements (user-provided)

## Acceptance Criteria (user-provided, if any)

## Notes

## Decision Log
- ${now} [submitted] spec submitted: initial draft created
`;

  const stub = (stage, heading) => `---
spec: ${name}
stage: ${stage}
generated: ${today}
---

# ${heading}: ${title}
`;

  const configMd = `---
spec: ${name}
---

# SRSP Config Overrides

Uncomment and edit any override you need. Empty values mean "use framework defaults".

- test-command: ""
- commit-prefix: ""
- branch-prefix: ""
- pr-target: ""
`;

  function writeFile(fileName, defaultContent) {
    const destPath = path.join(specDir, fileName);
    if (template && fs.existsSync(path.join(templatesDir, fileName))) {
      let content = fs.readFileSync(path.join(templatesDir, fileName), 'utf-8');
      content = content
        .replace(/spec: [^\n]+/, `spec: ${name}`)
        .replace(/title: [^\n]+/, `title: ${title}`)
        .replace(/author: [^\n]+/, `author: engineer`)
        .replace(/created: [^\n]+/, `created: ${today}`)
        .replace(/updated: [^\n]+/, `updated: ${now}`)
        .replace(/generated: [^\n]+/g, `generated: ${today}`)
        .replace(/2026-07-29T00:00:00Z/, now);
      fs.writeFileSync(destPath, content);
    } else {
      fs.writeFileSync(destPath, defaultContent);
    }
  }

  writeFile('spec.md', specMd);
  writeFile('proposal.md', stub('proposal', 'Proposal'));
  writeFile('design.md', stub('design', 'Design'));
  writeFile('tasks.md', stub('tasks', 'Tasks'));
  writeFile('.srsp-config.md', configMd);

  fs.writeFileSync(path.join(specsDir, 'active-spec.txt'), name);

  console.log(`Created spec at ${specDir}` + (template ? ` from template "${template}"` : ''));
  console.log(`Active spec set to: ${name}`);
  console.log('Next step: run `/srsp-explore` in Claude Code.');
}

module.exports = { start };
