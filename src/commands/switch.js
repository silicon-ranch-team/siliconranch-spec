const fs = require('fs');
const path = require('path');

function switchSpec(args, { cwd }) {
  const name = args[0];
  const specsDir = path.join(cwd, '.claude', 'specs');

  if (!name) {
    console.error('Usage: srsp switch <spec-name>');
    process.exit(1);
  }

  const targetDir = path.join(specsDir, name);
  if (!fs.existsSync(targetDir)) {
    console.error(`Spec not found: ${name}`);
    process.exit(1);
  }

  fs.writeFileSync(path.join(specsDir, 'active-spec.txt'), name);
  console.log(`Active spec switched to: ${name}`);
  console.log('Run `/srsp-resume` in Claude Code to continue.');
}

module.exports = { switchSpec };
