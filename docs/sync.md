# Drift Detection with `/srsp-sync`

Specs evolve. As you refine requirements, design, and tasks, it is easy for the artifacts to fall out of alignment. `/srsp-sync` detects drift between `proposal.md`, `design.md`, and `tasks.md` and tells you how to fix it.

## When to use `/srsp-sync`

- Before `/srsp-apply`, to make sure the plan is still consistent.
- After refining one artifact in isolation (`/srsp-proposal`, `/srsp-design`, `/srsp-tasks`).
- Whenever you suspect requirements, TODOs, or tasks no longer match.

## What it checks

`/srsp-sync` parses:

- `## Functional Requirements` in `proposal.md`
- `## Implementation TODOs` in `design.md`
- `## Implementation Tasks` in `tasks.md`

It looks for explicit IDs like `FR1`, `TODO-1`, `Task-1`, or clear textual references.

## Drift types

| Drift | Meaning | Fix |
|-------|---------|-----|
| Orphan requirement | A requirement has no TODO referencing it. | Update `design.md` (`/srsp-design`). |
| Orphan TODO | A TODO has no task referencing it. | Update `tasks.md` (`/srsp-tasks`). |
| Orphan task | A task does not map back to any requirement or TODO. | Update `proposal.md` or `design.md` (`/srsp-propose`). |
| Missing requirement → task path | A requirement has TODOs but no tasks. | Update `tasks.md` (`/srsp-tasks`). |

## How to run it

Inside Claude Code:

```text
/srsp-sync
```

`/srsp-sync` is read-only unless you ask it to invoke a fix skill.

## Example output

```text
Active spec: example-todo-api (proposal-approved)

Artifacts are in sync
```

Or, when drift exists:

```text
Active spec: example-todo-api (proposal-approved)

Drift detected:

| Direction | Count | Items |
|-----------|-------|-------|
| Requirements → TODOs | 1 | FR3 has no TODO |
| TODOs → Tasks | 0 | — |
| Tasks → TODOs/Requirements | 0 | — |

Recommended action: run /srsp-design to add a TODO for FR3.
```

## Rules

- `/srsp-sync` does not modify artifacts on its own.
- It recommends the right granular skill based on the drift direction.
- It can be invoked automatically by `/srsp-apply` before implementation.
