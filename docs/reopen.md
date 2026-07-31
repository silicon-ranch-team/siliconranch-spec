# Reopening Specs with `/srsp-reopen`

Specs are rarely final. Bugs, new requirements, and regressions can bring a previously completed or archived spec back into active work. `/srsp-reopen` handles this transition without losing history.

## When to use `/srsp-reopen`

- A bug is found in a feature marked `done`.
- New scope is added to an already-archived spec.
- A regression appears in a previously verified behavior.
- Any reason to continue work on a `done`, `archived`, or `cancelled` spec.

## What it does

1. Accepts a spec name, reason, and optional ticket URL.
2. Moves an archived spec back from `.claude/specs/archive/` to `.claude/specs/`.
3. Updates `spec.md` metadata:
   - `status: active`
   - `stage: submitted` or `exploring`
   - `reopened-count` incremented
   - `last-reopened`, `reopened-reason`, `reopened-ticket-url`
4. Clears `commit-hash`, `pr-url`, `applied`, and `archived` because the previous conclusion is no longer valid.
5. Appends a Decision Log entry.
6. Adds a `## Reopen Tasks` section to `tasks.md`.

## Reopen reasons

| Reason | Default reopen tasks focus |
|--------|---------------------------|
| `bug` | Reproduce and add a regression test |
| `feature-request` | Update requirements and design |
| `regression` | Identify changed code path and re-run tests |
| `other` | General investigation and artifact update |

## How to run it

Inside Claude Code:

```text
/srsp-reopen my-feature
```

Or, without a name, it uses the active spec if it is in a terminal state.

## After reopening

`/srsp-reopen` recommends the next command based on the selected re-entry stage:

- `submitted` → `/srsp-explore`
- `exploring` → `/srsp-explore`

The original Decision Log is preserved. New work is recorded as a new iteration.

## Rules

- `/srsp-reopen` requires explicit engineer confirmation.
- `/srsp-archive` no longer reopens specs; use `/srsp-reopen` instead.
- The spec must be in `done`, `archived`, or `cancelled` state.
