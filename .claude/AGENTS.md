# Agent Instructions for SRSP

This file guides Claude Code (and other agents) when working on the **Silicon Ranch Spec Driven Development Framework** (SRSP). Read it before modifying framework code, skills, docs, or release infrastructure.

## Project Goal

SRSP is a customizable, end-to-end spec-driven development workflow for Claude Code projects. It provides:

- A CLI (`srsp`) for initializing the framework and inspecting specs.
- Claude Code skills under `.claude/skills/<name>/SKILL.md` that drive the spec lifecycle.
- Spec templates and documentation under `.claude/specs/templates/` and `docs/`.

The framework is designed to be forked and adapted by individual teams.

## Repository Layout

```text
bin/srsp.js              # CLI entry point
src/                     # CLI command implementations
  commands/init.js       # Copies skills/templates/docs into a project
  commands/start.js      # Creates a new spec workspace
  commands/status.js     # Lists specs and active spec
  commands/switch.js     # Switches active spec
  commands/doctor.js     # Validates active spec metadata/artifacts
  commands/report.js     # Generates health/traceability report
.claude/skills/<name>/SKILL.md   # Claude Code skills (per-skill directory)
.claude/specs/templates/         # Spec templates (api-endpoint, ui-component, bug-fix, refactor)
.claude/specs/example-todo-api/   # Example spec
.claude/CLAUDE.md                 # Project overview and command reference
.claude/AGENTS.md                 # This file
docs/                             # Documentation site (MkDocs)
.github/workflows/                # CI/CD: validate, release-check, release, tag-create, tag-enforce, docs
.github/scripts/                  # Shared validation scripts
```

## Key Conventions

### Skills

- Each skill lives in its own directory: `.claude/skills/<name>/SKILL.md`.
- Frontmatter must include `name:` and `description:`.
- Skill names match the slash command: `/srsp-start` → `.claude/skills/srsp-start/SKILL.md`.
- When editing a skill, keep it focused on one stage or command.

### Specs

- Specs live under `.claude/specs/<spec-name>/`.
- `spec.md` is the source of truth and must have SpecKit-style frontmatter.
- Required frontmatter fields: `spec`, `title`, `author`, `status`, `stage`, `created`, `updated`.
- The `trace:` block maps requirements to TODOs, tasks, implementation, and tests.
- Always update the Decision Log in `spec.md` when changing stage or status.

### CLI

- Keep commands small and deterministic.
- Frontmatter parsers must handle both LF and CRLF line endings.
- Use `process.exit(1)` for failures and write actionable error messages.

### Tests

- Run tests with `npm test` (uses `node --test`).
- Add tests for CLI behavior and frontmatter validation.
- All skill and spec frontmatter must remain valid YAML.

## Workflow for Code Changes

1. Branch from `development`.
2. Make changes, run `npm test`, and run `srsp doctor` if SRSP behavior changed.
3. Open a PR to `development` and use **Rebase and merge**.
4. After merge, prepare a release branch from `development`.
5. Open the release PR to `main` and use **Create a merge commit**.
6. The `Create Release Tag` workflow pushes the tag; `Release to npm` publishes it.

## Things to Avoid

- Do not add flat `.claude/skills/<name>.md` files; skills must be in per-skill directories.
- Do not let `development` and `main` diverge without syncing.
- Do not use merge commits on PRs to `development` (rebase merge instead).
- Do not create release tags manually unless the automated workflow failed.

## Useful Commands

```bash
npm test                                  # Run all tests
node bin/srsp.js init                     # Install framework assets locally
node bin/srsp.js status                   # Show specs
node bin/srsp.js doctor                   # Validate active spec
node .github/scripts/validate-release.js  # Validate release readiness
mkdocs build --strict                     # Build docs locally
```

## When You Are Unsure

- Check `docs/state-machine.md` for canonical stages and transitions.
- Check `docs/spec-driven-framework.md` for the full framework guide.
- Check existing skills under `.claude/skills/` for patterns and tone.
