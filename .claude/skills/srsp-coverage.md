---
name: srsp-coverage
description: Trace requirements, design TODOs, tasks, code changes, and tests for the active spec and report coverage gaps.
---

# /srsp-coverage — Trace Spec Coverage

Trace `proposal.md` requirements through `design.md` TODOs and `tasks.md` tasks into actual code changes and tests. Report any gaps so the engineer knows what still needs implementation or verification.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md` if it exists.
- Read `.claude/specs/<spec-name>/design.md` if it exists.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.
- Read `.srsp-config.md` at the project root if it exists.
- Read `.claude/specs/<spec-name>/.srsp-config.md` if it exists.

## Trace Format

`spec.md` frontmatter may include an optional `trace` field that maps requirement IDs to design TODOs, tasks, file patterns, and test patterns:

```yaml
trace:
  FR1: TODO-3,Task-3,src/routes/todos.ts,tests/todos.test.ts
  FR2: TODO-4,Task-4,src/routes/todos.ts,tests/todos.test.ts
```

Rules for the `trace` field:

- Each key is a requirement ID from `proposal.md` (e.g., `FR1`, `REQ-1`).
- Values are comma-separated strings in the order:
  1. TODO ID from `design.md`
  2. Task ID from `tasks.md`
  3. File pattern changed to implement the requirement
  4. Test pattern that verifies the requirement
- Multiple coverage items can share the same file or test pattern.
- Missing or empty values mean "not yet traced".
- When the `trace` field is absent, `/srsp-coverage` derives coverage from textual references and git diff heuristics.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the spec is earlier than `proposal-approved`, warn that coverage checks are limited until the proposal is approved.

2. **Read SRSP config overrides.**
   - Read `.srsp-config.md` at the project root if it exists.
   - Read `.claude/specs/<spec-name>/.srsp-config.md` if it exists.
   - Use `coverage-command` if set (non-empty) to collect coverage data.
   - Use `test-command` if `coverage-command` is not set.

3. **Parse artifacts.**
   - Read `## Functional Requirements` from `proposal.md`.
     - Extract each requirement and any explicit ID (e.g., `FR1`, `FR-1`, `REQ-1`).
   - Read `## Implementation TODOs` from `design.md`.
     - Extract each TODO, its checkbox state, and any explicit ID (e.g., `TODO-1`).
   - Read `## Implementation Tasks` from `tasks.md`.
     - Extract each task, its checkbox state, and any explicit mapping marker (e.g., `← TODO-1`, `FR1`).
   - Read `trace` metadata from `spec.md` frontmatter if present.

4. **Collect implementation evidence.**
   - Run `git diff --name-only` (or `git diff --name-only origin/<base-branch>...HEAD` if a base branch is known) to list files changed for this spec.
   - If a `coverage-command` is configured, run it and capture output.
   - Otherwise inspect the test files referenced in the design testing strategy and the `trace` test patterns.

5. **Run coverage checks.**

   | Check | Definition | Severity |
   |-------|------------|----------|
   | Requirements without TODOs | A requirement has no TODO referencing it by ID or clear context | Warning |
   | TODOs without tasks | A TODO has no task referencing it by ID or clear context | Warning |
   | Tasks without code changes | A completed task has no matching changed file or trace file pattern | Warning |
   | Changes without tests | A changed implementation file has no corresponding test file change or referenced test pattern | Warning |
   | Requirements without tests | A requirement has no test file or test pattern referencing it | Warning |

6. **Build the coverage report.**

   | Requirement | TODO Coverage | Task Coverage | Code Changes | Test Coverage |
   |-------------|---------------|---------------|--------------|---------------|
   | FR1 | TODO-3 | Task-3 | `src/routes/todos.ts` | `tests/todos.test.ts` |
   | ... | ... | ... | ... | ... |

7. **Present findings and recommend actions.**
   - If no gaps: report "Coverage looks complete" and offer to return to `/srsp-apply` or `/srsp-verify`.
   - If gaps exist:
     - List each gap with the affected requirement/TODO/task and, when possible, the file or test pattern that is missing.
     - Recommend which skill to run:
       - Missing TODOs for requirements → `/srsp-design`
       - Missing tasks for TODOs → `/srsp-tasks`
       - Missing tests or implementation files → `/srsp-apply`
       - Missing `trace` metadata → update `spec.md` frontmatter manually or with `/srsp-propose`

8. **Ask the engineer:**
   - `Show details` — expand the full coverage table.
   - `Run recommended fix skill` — invoke the suggested skill.
   - `Update trace metadata` — edit the `trace` block in `spec.md` frontmatter.
   - `Cancel` — stop.

9. **Update `spec.md` only if changes are made.**
   - `/srsp-coverage` itself does not write to `spec.md` unless the engineer asks to update `trace` metadata.
   - If a fix skill is invoked, that skill records the Decision Log entry.
   - If `trace` metadata is updated, append a Decision Log entry:
     - `<timestamp> [coverage] trace metadata updated: <summary>`

## Rules

- `/srsp-coverage` is read-only unless the engineer asks to update `trace` metadata or invoke a fix skill.
- Coverage checks are heuristic; explicit IDs in requirements, TODOs, tasks, and `trace` metadata give the most reliable results.
- If a spec is not yet at `proposal-approved`, run only the artifact-link checks (requirements → TODOs → tasks) and skip code/test diff checks.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
