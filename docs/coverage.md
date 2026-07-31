# Requirement Traceability with `/srsp-coverage`

`/srsp-coverage` closes the loop between a spec and its implementation. It traces each functional requirement through design TODOs, implementation tasks, code changes, and tests, then reports any gaps.

## When to use `/srsp-coverage`

- After tests pass in `/srsp-apply`, before engineer review.
- Standalone, to audit an active spec.
- When `/srsp-doctor` reports missing code/test coverage.

## The `trace` frontmatter field

`spec.md` supports an optional `trace` block that maps each requirement to its TODO, task, implementation file, and test file:

```yaml
trace:
  FR1: TODO-3,Task-3,src/routes/todos.ts,tests/todos.test.ts
  FR2: TODO-4,Task-4,src/routes/todos.ts,tests/todos.test.ts
```

Format rules:

- The key is a requirement ID from `proposal.md`.
- The value is a comma-separated string in this order:
  1. TODO ID from `design.md`
  2. Task ID from `tasks.md`
  3. File pattern changed to implement the requirement
  4. Test pattern that verifies the requirement
- Missing or empty values mean "not yet traced."
- When `trace` is absent, `/srsp-coverage` uses textual references and git diff heuristics.

## Coverage checks

| Check | Definition | Severity |
|-------|------------|----------|
| Requirements without TODOs | Requirement has no TODO referencing it | Warning |
| TODOs without tasks | TODO has no task referencing it | Warning |
| Tasks without code changes | Completed task has no matching changed file | Warning |
| Changes without tests | Changed implementation file has no test change | Warning |
| Requirements without tests | Requirement has no test file or pattern | Warning |

## How to run it

Inside Claude Code:

```text
/srsp-coverage
```

`/srsp-apply` will also run `/srsp-coverage` automatically after tests if `.srsp-config.md` has a non-empty `coverage-command`.

## What `/srsp-coverage` does not do

`/srsp-coverage` verifies existing tests and reports gaps. It does not generate new test files automatically. Test files are created by the engineer as part of the implementation tasks recorded in `tasks.md`.

## Example output

```text
Active spec: example-todo-api

| Requirement | TODO Coverage | Task Coverage | Code Changes | Test Coverage |
|-------------|---------------|---------------|--------------|---------------|
| FR1 | TODO-3 | Task-3 | src/routes/todos.ts | tests/todos.test.ts |
| FR2 | TODO-4 | Task-4 | src/routes/todos.ts | tests/todos.test.ts |

Coverage: 2/2 requirements traced.
```

## Rules

- `/srsp-coverage` is read-only unless you ask it to update `trace` metadata or invoke a fix skill.
- Coverage checks are heuristic when `trace` is absent.
- It can be skipped at the engineer's explicit risk during `/srsp-apply`.
