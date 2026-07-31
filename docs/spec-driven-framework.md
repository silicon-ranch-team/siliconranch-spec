# Silicon Ranch Spec Driven Development Framework

A customizable, end-to-end development workflow for Claude Code projects, operated through a small set of OpenSpec-style commands.

## Goal

Guide every software spec through its full lifecycle:

```text
Spec → Explore → Propose → Apply → Archive/Done
```

Expanded view:

```text
submitted
   -> exploring
        -> proposal-draft
             -> proposal-approved
                  -> implementing
                       -> verified
                            -> review-approved
                                 -> committed
                                      -> pr-created
                                           -> applied
                                                -> done / archived / cancelled
```

At every stage, Claude presents the artifact and asks for explicit user approval. If the output is not good enough, the user can refine it in a loop until it meets the acceptance criteria.

## Primary Commands

| Command | Purpose |
|---------|---------|
| `/srsp-start`    | Create a new spec |
| `/srsp-explore`  | Clarify the spec and draft an initial proposal |
| `/srsp-propose`  | Finalize proposal, design, and tasks |
| `/srsp-apply`    | Implement, verify, review, commit, and open PR |
| `/srsp-archive`  | Mark done, archive, or cancel a spec |
| `/srsp-reopen`   | Reopen a done, archived, or cancelled spec |
| `/srsp-status`   | Show active spec and all specs |
| `/srsp-switch`   | Switch the active spec to another existing spec |
| `/srsp-resume`   | Resume the active spec from its current stage |
| `/srsp-doctor`   | Validate spec metadata, stage, and artifact coverage |
| `/srsp-delete`   | Permanently delete a spec after typed confirmation |

## Optional Granular Commands

| Command | Purpose |
|---------|---------|
| `/srsp-proposal` | Refine only `proposal.md` |
| `/srsp-design`   | Refine only `design.md` |
| `/srsp-tasks`    | Refine only `tasks.md` |
| `/srsp-sync`     | Detect drift between requirements, design TODOs, and tasks |
| `/srsp-coverage` | Trace requirements → TODOs → tasks → code → tests |
| `/srsp-verify`   | Run tests only |
| `/srsp-commit`   | Commit approved changes only |
| `/srsp-pr`       | Create pull request only |
| `/srsp-report`   | Generate a health and traceability report for all specs |

## Per-Spec Files (4 files)

```text
.claude/specs/<spec-name>/
  spec.md      # Original spec + SpecKit-style metadata + Decision Log
  proposal.md  # Refined requirements + acceptance criteria + proposal summary
  design.md    # Technical architecture + implementation TODOs
  tasks.md     # Executable, checkable task plan
```

### Why only 4 files?

- **`spec.md`** — keeps the original prompt plus metadata and the Decision Log. This is the single source of truth for spec state.
- **`proposal.md`** — consolidates requirements and acceptance criteria.
- **`design.md`** — holds only technical design and implementation TODOs.
- **`tasks.md`** — holds the executable plan.

What was removed and why:

| Old file | Removed because |
|---|---|
| `requirements.md` | Merged into `proposal.md` |
| `plan.md` | Merged into `tasks.md` |
| `implementation-notes.md` | Git history owns this |
| `test-results.md` | Ephemeral; shown live, summary stored in `spec.md` |
| `review.md` | Approval recorded in `spec.md` Decision Log |
| `status.md` | State lives in `spec.md` metadata |

## Spec Metadata (`spec.md` frontmatter)

```yaml
---
spec: example-todo-api
title: Todo List REST API
author: engineer@example.com
status: active
stage: review-approved
explored: 2026-07-28T10:00:00Z
proposed: 2026-07-28T11:00:00Z
applied: ""
archived: ""
last-reopened: ""
reopened-count: 0
reopened-reason: ""
reopened-ticket-url: ""
created-at: 2026-07-28T00:00:00Z
stage-changed-at: 2026-07-29T09:00:00Z
created: 2026-07-28
updated: 2026-07-29T09:00:00Z
last-run: 2026-07-28T13:50:00Z
test-result: passed (10/10)
commit-hash: ""
pr-url: ""
base-branch: ""
ticket-url: ""
trace:
  FR1: TODO-3,Task-3,src/routes/todos.ts,tests/todos.test.ts
  FR2: TODO-4,Task-4,src/routes/todos.ts,tests/todos.test.ts
  FR3: TODO-5,Task-5,src/routes/todos.ts,tests/todos.test.ts
  FR4: TODO-6,Task-6,src/routes/todos.ts,tests/todos.test.ts
  FR5: TODO-7,Task-7,src/routes/todos.ts,tests/todos.test.ts
  FR6: TODO-2,Task-2,src/store.ts,tests/todos.test.ts
---
```

Fields:
- `spec` — machine-readable identifier.
- `title` — human-readable name.
- `author` — engineer who owns the spec.
- `status` — `active`, `done`, `archived`, `cancelled`.
- `stage` — current workflow stage.
- `explored`, `proposed`, `applied`, `archived`, `last-reopened` — timestamps for each major phase.
- `reopened-count` — number of times the spec has been reopened.
- `reopened-reason` — reason the spec was last reopened.
- `reopened-ticket-url` — optional ticket URL from the last reopen.
- `created-at` — ISO timestamp of spec creation; used by `/srsp-report`.
- `stage-changed-at` — ISO timestamp of the last stage change; used by `/srsp-report` for staleness.
- `created`, `updated` — creation and last-modified dates (backward compatible).
- `last-run`, `test-result` — most recent test summary.
- `commit-hash`, `pr-url` — commit and PR tracking.
- `base-branch` — optional override for the PR target / feature branch base. If empty, the framework auto-detects `development`/`develop`/`main`/`master`.
- `ticket-url` — optional link to an external issue tracker ticket.
- `trace` — optional lightweight traceability map from requirement IDs to TODO, task, implementation file pattern, and test pattern. Used by `/srsp-coverage` and validated by `/srsp-doctor`.

## Configuration

SRSP behavior can be customized at the project level and per spec through `.srsp-config.md` files.

- **Project-level config:** `.srsp-config.md` at the repository root.
- **Per-spec config:** `.claude/specs/<spec-name>/.srsp-config.md`.
- Per-spec values override project-level values. Empty values mean "use framework defaults."

Allowed keys:

| Key | Used by | Purpose |
|-----|---------|---------|
| `test-command` | `/srsp-verify`, `/srsp-apply` | Command to run tests |
| `commit-prefix` | `/srsp-apply` | Prefix for generated commit messages |
| `branch-prefix` | `/srsp-apply` | Prefix for suggested feature branches |
| `pr-target` | `/srsp-apply`, `/srsp-pr` | Default PR target branch |
| `coverage-command` | `/srsp-coverage` | Command to collect test coverage |
| `stale-days` | `/srsp-report`, `srsp report` | Days before a spec is flagged stale (default: 14) |
| `ticket-base-url` | `/srsp-link` | Base URL for ticket validation |

Unknown keys are ignored but warned about by `/srsp-doctor`.

## Decision Log

The `spec.md` body includes a `## Decision Log` section where every approval, refinement, test run, and finalization is recorded. Entries use a standard format:

```text
<ISO timestamp> [<stage>] <decision>: <note>
```

Example:

```markdown
## Decision Log
- 2026-07-28T10:00:00Z [submitted] spec submitted: initial draft created
- 2026-07-28T10:30:00Z [exploring] exploration: clarified persistence and response codes
- 2026-07-28T11:00:00Z [proposal-approved] proposal approved: requirements and acceptance criteria accepted
- 2026-07-28T11:30:00Z [proposal-approved] design approved: architecture and TODOs accepted
- 2026-07-28T12:00:00Z [proposal-approved] tasks approved: task plan accepted
- 2026-07-28T13:00:00Z [implementing] implementation complete: all tasks done
- 2026-07-28T13:10:00Z [verified] tests run: passed (10/10)
- 2026-07-28T13:15:00Z [review-approved] engineer review approved
- 2026-07-28T14:00:00Z [review-approved] apply paused: implementation and tests complete; commit and PR pending engineer action
```

See `docs/state-machine.md` for the full set of stages, transitions, and entry commands.

## Decision Loop

At every stage, Claude asks:

- **Accept** — advance to the next stage.
- **Refine** — ask what is missing or wrong, append notes, and regenerate.
- **Skip** — record the reason and advance.
- **Cancel** — record the reason and stop.

## Engineer-Owned Actions

The following actions are never automatic and always require explicit engineer approval:

- Final review approval
- Committing changes
- Creating a pull request
- Archiving, deleting, or cancelling a spec

Claude may prepare drafts (commit messages, PR descriptions), but the engineer must trigger the action.

## Using the Framework

The framework is designed to be used sequentially. Each command produces or refines an artifact and asks for explicit approval before advancing.

### Primary workflow

1. **`/srsp-start`** — Create a new spec.
   - Asks for spec name, title, author, and spec text.
   - Creates `spec.md` with SpecKit-style metadata and a Decision Log.
   - Creates empty `proposal.md`, `design.md`, and `tasks.md` stubs.
   - Sets the active spec.

2. **`/srsp-explore`** — Clarify the spec.
   - Reads `spec.md`.
   - Asks focused clarification questions.
   - Drafts an initial `proposal.md`.
   - Updates `spec.md` metadata and Decision Log.

3. **`/srsp-propose`** — Finalize proposal, design, and tasks.
   - Generates/refines `proposal.md`, `design.md`, and `tasks.md`.
   - Ensures every functional requirement has a testable acceptance criterion.
   - Requires a non-empty `## Testing Strategy` section in `design.md` and verification tasks in `tasks.md` covering every functional requirement before approval.
   - Presents a summary and asks: **Accept / Refine proposal / Refine design / Refine tasks / Skip / Cancel**.
   - Records every decision in `spec.md`.

4. **`/srsp-apply`** — Implement, verify, review, commit, and open a PR.
   - Resumes from the current sub-stage (`proposal-approved`, `implementing`, `verified`, `review-approved`, `committed`, or `pr-created`).
   - Implements tasks from `tasks.md` and checks them off.
   - Runs tests live and records a short summary in `spec.md` only.
   - Presents changes for explicit engineer review approval.
   - Commits and creates a PR **only after** engineer confirmation.
   - Records commit hash and PR URL in `spec.md`.
   - Updates `spec.md` stage after each sub-step.

5. **`/srsp-archive`** — Finalize the spec.
   - Options: **Done / Archive / Cancel**.
   - Updates `spec.md` metadata and Decision Log.
   - To permanently delete, use `/srsp-delete`.
   - To reopen a finalized spec later, use `/srsp-reopen`.

6. **`/srsp-reopen`** — Reopen a finalized spec.
   - Accepts a reason (bug, feature-request, regression, other) and optional ticket URL.
   - Moves a `done`, `archived`, or `cancelled` spec back to `submitted` or `exploring`.
   - Creates a `## Reopen Tasks` section in `tasks.md`.
   - Preserves the original Decision Log and records the reopen event.

7. **`/srsp-status`** — Show all specs.
   - Lists specs, active spec, current stage, and recommended next command.
   - Confirms the active spec before switching.

8. **`/srsp-switch`** — Switch the active spec.
   - Lists all non-archived specs.
   - Updates `.claude/specs/active-spec.txt` to the selected spec.

9. **`/srsp-resume`** — Resume the active spec.
   - Reads the active spec stage and recommends or invokes the next command.

10. **`/srsp-doctor`** — Validate the active spec.
   - Checks `spec.md` frontmatter, allowed stage/status values, required artifacts for the current stage, and FR→TODO→Task coverage.
   - For `proposal-approved` and later stages, checks that `design.md` has a `## Testing Strategy` section and that `tasks.md` has verification tasks for every functional requirement.
   - Reports findings in a table and recommends a fix path.

11. **`/srsp-delete`** — Permanently delete the active spec.
   - Requires typing the exact spec name to confirm.
   - Updates `active-spec.txt` if the deleted spec was active.

### Optional granular commands

| Command | When to use |
|---------|-------------|
| `/srsp-proposal` | Refine only `proposal.md`. |
| `/srsp-design`   | Refine only `design.md`. |
| `/srsp-tasks`    | Edit or regenerate only `tasks.md`. |
| `/srsp-sync`     | Detect drift between requirements, design TODOs, and tasks. |
| `/srsp-coverage` | Trace requirements → TODOs → tasks → code → tests. |
| `/srsp-verify`    | Run tests only. |
| `/srsp-commit`    | Commit approved changes only. |
| `/srsp-pr`        | Create a pull request only. |
| `/srsp-report`    | Generate a health and traceability report for all specs. |
| `/srsp-link`      | Link the active spec to an external issue tracker ticket. |

### Safety & Guardrails

- **Spec name validation** — `/srsp-start` enforces kebab-case or snake_case (`^[a-z0-9]+(?:[-_][a-z0-9]+)*$`) and suggests a normalized name from the title.
- **Active spec confirmation** — every SRSP skill confirms the active spec and its stage on entry.
- **Drift warnings** — `/srsp-proposal`, `/srsp-design`, and `/srsp-tasks` warn when requirements, TODOs, and tasks fall out of sync.
- **Spec diagnostics** — `/srsp-doctor` validates metadata, stage, required artifacts, testing strategy, verification tasks, and coverage, reporting OK / Warning / Error.
- **Delete protection** — `/srsp-delete` requires typing the exact spec name; `/srsp-archive` no longer offers Delete.
- **Branch guardrails** — `/srsp-apply` detects the development branch (`development` or `develop`, falling back to `main`/`master`) and creates feature branches from it (`feature/<spec-name>`, `feat/<spec-name>`, or custom `feature/<input>`). `/srsp-pr` targets the development branch by default and supports an explicit hotfix path to the production branch (`main` or `master`).

### Active spec confirmation

Every SRSP skill confirms the active spec on entry:

- Reads `.claude/specs/active-spec.txt`.
- Reads the active `spec.md` frontmatter for the current `stage`.
- Displays: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
- Offers `Continue` or `Cancel`.
- To switch the active spec, use `/srsp-switch`.
- `/srsp-status`, `/srsp-start`, and `/srsp-delete` still offer a `Switch active spec` option because they are natural entry points for changing context; that option invokes `/srsp-switch`.
- Recommends the correct next command if the current stage is wrong for the invoked skill.

### Typical command sequence

```text
/srsp-start
/srsp-explore
/srsp-propose
/srsp-apply
/srsp-archive
/srsp-resume   # resume from current stage at any time
/srsp-switch   # change active spec at any time
```

## Working with Multiple Specs

The framework supports many specs in parallel under `.claude/specs/`. Only one spec is active at a time, tracked by `.claude/specs/active-spec.txt`.

- **`/srsp-start`** creates a new spec and makes it the active spec. If a spec already exists, it offers to switch first.
- **`/srsp-status`** lists every spec with its stage and status, and offers to switch.
- **`/srsp-switch`** lists all non-archived specs and updates `active-spec.txt` to the selected one.
- **`/srsp-resume`** reads the active spec and recommends the next command for that spec.
- **`/srsp-archive`** can move finalized specs to `.claude/specs/archive/`, keeping the active workspace tidy.
- All other skills operate on the active spec only; they prompt you to run `/srsp-switch` if you want to change context.

### Recommended multi-spec workflow

1. Create or resume the spec you want to work on.
2. Work through `/srsp-explore` → `/srsp-propose` → `/srsp-apply` for that spec.
3. When you need to context-switch, use `/srsp-switch` instead of canceling the current skill.
4. Use `/srsp-status` for a dashboard view of all specs.

### Templates

`/srsp-start` can optionally pre-seed a spec from a template. Available templates live in `.claude/specs/templates/`:

- `api-endpoint` — backend API endpoint spec.
- `ui-component` — frontend component spec.
- `bug-fix` — bug fix and regression test spec.
- `refactor` — behavior-preserving refactor spec.

When a template is selected, the new spec starts with the template's `spec.md`, `proposal.md`, `design.md`, and `tasks.md` sections already in place.

### Quick Start

Open this project in Claude Code and run:

```text
/srsp-start    # Create a new spec
/srsp-explore  # Clarify the spec
/srsp-propose  # Finalize proposal/design/tasks
/srsp-apply    # Implement, verify, review, commit, PR
/srsp-archive  # Mark done/archive/cancel
```

## Customization

All workflow logic lives in `.claude/skills/` as markdown files. Teams can freely edit:

- Prompts and questions.
- Artifact templates.
- Stage order.
- Metadata fields.
- Which actions require explicit approval.

No compiled code or dependencies are required.

## Example

See `.claude/specs/example-todo-api/` for a complete walkthrough of the framework applied to a simple REST API.

## Best Practices

1. Keep specs small and focused.
2. Make requirements testable or verifiable.
3. Ensure every functional requirement maps to at least one design TODO.
4. Review the design before writing code.
5. Do not skip verification unless the team explicitly accepts the risk.
6. Commit and open PR only after engineer review approval.
