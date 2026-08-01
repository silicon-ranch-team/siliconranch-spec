const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, filePath), 'utf8'));
}

function readFile(filePath) {
  return fs.readFileSync(path.join(REPO_ROOT, filePath), 'utf8');
}

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`✓ ${message}`);
}

function getExpectedVersion() {
  const pkg = readJson('package.json');
  if (!pkg.version || !/^\d+\.\d+\.\d+$/.test(pkg.version)) {
    fail(`package.json version "${pkg.version}" is not a valid SemVer version`);
  }
  return pkg.version;
}

function getBranchVersion() {
  const ref = process.env.GITHUB_REF_NAME || '';
  const match = ref.match(/^release\/v(\d+\.\d+\.\d+)$/);
  return match ? match[1] : null;
}

function validateBranchVersion(expectedVersion) {
  const branchVersion = getBranchVersion();
  if (!branchVersion) {
    // In a local run or non-release context, skip the branch-name check.
    ok('Skipping branch-name validation (not running on a release branch)');
    return;
  }
  if (branchVersion !== expectedVersion) {
    fail(`Branch release/v${branchVersion} does not match package.json version ${expectedVersion}`);
  }
  ok(`Branch release/v${branchVersion} matches package.json version`);
}

function validateChangelog(version) {
  const changelog = readFile('CHANGELOG.md');
  if (!changelog.includes(`## [${version}]`)) {
    fail(`CHANGELOG.md does not contain an entry for version ${version}`);
  }
  ok(`CHANGELOG.md contains entry for ${version}`);
}

function validateLockfile() {
  if (!fs.existsSync(path.join(REPO_ROOT, 'package-lock.json'))) {
    fail('package-lock.json is missing; run npm install and commit it so npm ci can be used');
  }
  ok('package-lock.json exists');
}

function runCommand(command, label) {
  try {
    execSync(command, { cwd: REPO_ROOT, stdio: 'inherit' });
    ok(label);
  } catch (error) {
    fail(`${label} failed`);
  }
}

function validateTagAvailable(version) {
  const expectedTag = `v${version}`;
  try {
    const existing = execSync(`git ls-remote --tags origin ${expectedTag}`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    if (existing.trim()) {
      fail(`Tag ${expectedTag} already exists on origin; delete or bump the version before releasing`);
    }
    ok(`Tag ${expectedTag} is available on origin`);
  } catch (error) {
    fail(`Unable to check remote tags for ${expectedTag}: ${error.message}`);
  }
}

function main() {
  const skipTagAvailable = process.argv.includes('--skip-tag-available') || process.env.SKIP_TAG_AVAILABLE === '1';

  console.log('Validating release readiness...\n');

  const version = getExpectedVersion();
  ok(`package.json version is ${version}`);

  validateBranchVersion(version);
  validateChangelog(version);
  validateLockfile();
  if (!skipTagAvailable) {
    validateTagAvailable(version);
  } else {
    ok('Skipping tag availability check (tag-push context)');
  }

  runCommand('npm ci', 'npm ci');
  runCommand('npm test', 'npm test');

  console.log('\n✅ Release validation passed');
}

main();
