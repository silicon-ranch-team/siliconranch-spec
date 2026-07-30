const fs = require('fs');
const path = require('path');

const FRAMEWORK_ASSETS = [
  { src: '.claude/skills', dest: '.claude/skills' },
  { src: '.claude/specs/templates', dest: '.claude/specs/templates' },
  { src: 'docs', dest: 'docs' },
];

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
    console.log(`Copied ${src} -> ${dest}`);
  }

  console.log('\nSRSP framework installed. Run `/srsp-start` in Claude Code to create your first spec.');
}

module.exports = { init };
