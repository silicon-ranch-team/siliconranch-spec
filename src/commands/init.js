const fs = require('fs');
const path = require('path');

const FRAMEWORK_ASSETS = [
  { src: '.claude/skills', dest: '.claude/skills' },
  { src: '.claude/specs/templates', dest: '.claude/specs/templates' },
  { src: 'docs', dest: 'docs' },
];

function normalizeSkillStructure(skillsDir) {
  if (!fs.existsSync(skillsDir)) return;

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const oldPath = path.join(skillsDir, entry.name);
    const skillName = path.basename(entry.name, '.md');
    const newDir = path.join(skillsDir, skillName);
    const newPath = path.join(newDir, 'SKILL.md');

    fs.mkdirSync(newDir, { recursive: true });
    fs.renameSync(oldPath, newPath);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function init(args, { cwd }) {
  const packageDir = path.resolve(__dirname, '..', '..');

  for (const { src, dest } of FRAMEWORK_ASSETS) {
    const srcPath = path.join(packageDir, src);
    const destPath = path.join(cwd, dest);

    if (!fs.existsSync(srcPath)) {
      console.warn(`Skipping missing package asset: ${src}`);
      continue;
    }

    copyDir(srcPath, destPath);
    if (src === '.claude/skills') {
      normalizeSkillStructure(destPath);
    }
    console.log(`Copied ${src} -> ${dest}`);
  }

  console.log('\nSRSP framework installed. Run `/srsp-start` in Claude Code to create your first spec.');
}

module.exports = { init };
