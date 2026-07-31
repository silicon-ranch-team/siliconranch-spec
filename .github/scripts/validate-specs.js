const fs = require('fs');
const path = require('path');

const SPECS_DIR = '.claude/specs';
const REQUIRED_FIELDS = ['spec', 'title', 'author', 'status', 'stage', 'created', 'updated'];

function findMarkdownFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(filePath) {
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

function validateSpec(filePath) {
  const frontmatter = parseFrontmatter(filePath);
  if (!frontmatter) {
    throw new Error(`${filePath}: missing or invalid YAML frontmatter`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      throw new Error(`${filePath}: missing required frontmatter field '${field}'`);
    }
  }
}

const files = findMarkdownFiles(SPECS_DIR);
let errors = 0;
for (const file of files) {
  try {
    if (path.basename(file) === 'spec.md') {
      validateSpec(file);
      console.log(`✓ ${file}`);
    }
  } catch (err) {
    console.error(`✗ ${err.message}`);
    errors++;
  }
}

if (errors > 0) {
  process.exit(1);
}
