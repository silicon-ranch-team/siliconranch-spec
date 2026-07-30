# SRSP CLI

The `silicon-ranch-spec` package provides a command-line interface for scaffolding and inspecting SRSP specs. The reasoning-heavy workflow steps are still intended to run as Claude Code skills.

## Install

```bash
npm install -g silicon-ranch-spec
```

Or run without installing:

```bash
npx silicon-ranch-spec <command>
```

## Commands

### `srsp init`

Copies the SRSP skills and documentation into the current project so that Claude Code can use them.

### `srsp start <spec-name>`

Creates a new spec workspace under `.claude/specs/<spec-name>/` with `spec.md`, `proposal.md`, `design.md`, and `tasks.md` stubs, then sets it as the active spec.

### `srsp status`

Shows the active spec and lists all specs with their current stage and status.

### `srsp switch <spec-name>`

Changes the active spec to the named spec.

### `srsp doctor`

Validates the active spec's metadata, stage value, and required artifacts.

### `srsp help`

Displays command help.

## Publishing

1. Bump the version in `package.json`.
2. Update `CHANGELOG.md`.
3. Tag the release: `git tag vX.Y.Z`.
4. Publish: `npm publish`.
