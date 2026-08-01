const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOTS = ['.claude', 'docs'];

function findMdFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdFiles(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function* mdFiles() {
  for (const root of ROOTS) {
    yield* findMdFiles(root);
  }
}

describe('YAML frontmatter', () => {
  for (const file of mdFiles()) {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;

    it(`${rel} parses as valid YAML`, () => {
      let data;
      try {
        data = yaml.load(match[1], { filename: file });
      } catch (err) {
        assert.fail(`${rel}: ${err.message}`);
      }

      if (rel.startsWith('.claude/skills/')) {
        assert.ok(data && data.name, `${rel}: missing required field "name"`);
        assert.ok(data && data.description, `${rel}: missing required field "description"`);
      }

      if (rel.startsWith('.claude/specs/') && rel.endsWith('/spec.md')) {
        for (const field of ['spec', 'title', 'author', 'status', 'stage', 'created', 'updated']) {
          assert.ok(data && data[field], `${rel}: missing required field "${field}"`);
        }
      }
    });
  }
});
