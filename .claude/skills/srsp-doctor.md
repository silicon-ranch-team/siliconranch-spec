---
name: srsp-doctor
description: Diagnose the active Silicon Ranch spec for metadata, stage, and coverage issues.
---

# /srsp-doctor — Diagnose the Active Spec

Validate the active spec's metadata, required artifacts, stage values, requirement→TODO→task coverage, and implementation/test traceability.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md` if it exists.
- Read `.claude/specs/<spec-name>/design.md` if it exists.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.
- Read `.srsp-config.md` at the project root if it exists.
- Read `.claude/specs/<spec-name>/.srsp-config.md` if it exists.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If no active spec exists, offer `/srsp-start`.

2. **Validate `spec.md` frontmatter.**
   - Required fields: `spec`, `title`, `author`, `status`, `stage`, `created`, `updated`.
   - Recommended fields: `created-at`, `stage-changed-at` — used by `/srsp-report` for age and staleness calculations.
   - Optional field: `base-branch` — if set, must be a non-empty branch name.
   - `status` must be one of: `active`, `done`, `archived`, `cancelled`.
   - `stage` must be one of:
     `submitted`, `exploring`, `proposal-draft`, `proposal-approved`, `implementing`, `verified`, `review-approved`, `committed`, `pr-created`, `applied`, `done`, `archived`, `cancelled`, `reopened`.

3. **Validate `.srsp-config.md` files.**
   - Read `.srsp-config.md` at the project root.
   - Read `.claude/specs/<spec-name>/.srsp-config.md` if it exists.
   - Allowed keys: `test-command`, `commit-prefix`, `branch-prefix`, `pr-target`, `coverage-command`, `ticket-base-url`.
   - Empty values mean "use framework defaults" and are valid.
   - Report unknown keys as warnings.

4. **Validate artifact existence for the current stage.**

   | Stage | Required artifacts |
   |-------|--------------------|
   | `submitted` | `spec.md` |
   | `exploring`, `proposal-draft` | `spec.md`, `proposal.md` |
   | `proposal-approved` | `spec.md`, `proposal.md`, `design.md`, `tasks.md` |
   | `implementing` and beyond | `spec.md`, `proposal.md`, `design.md`, `tasks.md` |

5. **Validate coverage across artifacts.**
   - Read `## Functional Requirements` from `proposal.md`.
   - Read `## Implementation TODOs` from `design.md`.
   - Read `## Implementation Tasks` from `tasks.md`.
   - Check that every functional requirement has at least one TODO that references it (by FR id, title, or clear context).
   - Check that every TODO has at least one task that references it (by TODO id, title, or clear context).
   - Check that every implementation task maps back to a functional requirement or TODO.
   - Read the optional `trace` field from `spec.md` frontmatter. Validate that each `trace` key maps to a known requirement ID, that referenced TODO and task IDs exist, and that file/test patterns are non-empty.
   - Report any orphan requirements, orphan TODOs, orphan tasks, or invalid trace entries.

6. **Run implementation/test coverage check (if stage is `implementing` or later).**
   - Read `.srsp-config.md` for `coverage-command` and use it if set (non-empty).
   - Otherwise inspect git diff for changed files and infer test coverage from referenced test patterns.
   - Flag implementation tasks that are marked complete but have no associated code change.
   - Flag implementation files that changed without any corresponding test file change or referenced test pattern.

7. **Build a findings table.**

   | Check | Result | Note |
   |-------|--------|------|
   | Frontmatter fields | OK / Error | Missing or invalid fields |
   | Status value | OK / Error | |
   | Stage value | OK / Error | |
   | `.srsp-config.md` keys | OK / Warning | Unknown or missing frontmatter |
   | Required artifacts | OK / Warning / Error | Which files are missing |
   | FR → TODO coverage | OK / Warning | Orphan requirements |
   | TODO → Task coverage | OK / Warning | Orphan TODOs |
   | Task → Requirement coverage | OK / Warning | Orphan tasks |
   | Trace metadata | OK / Warning / Error | Invalid or missing trace entries |
   | Code/test coverage | OK / Warning | Tasks without code changes or changes without tests |

8. **Present findings and next actions.**
   - Summarize OKs, warnings, and errors.
   - If errors exist, recommend the fix path:
     - Missing artifact or invalid metadata → `/srsp-start` or manual edit.
     - FR/TODO/task drift → `/srsp-propose` or the relevant granular skill.
     - Missing code/test coverage → `/srsp-coverage` or `/srsp-apply`.
   - Ask the engineer:
     - `Show details` — list specific missing mappings and contradictions.
     - `Fix with /srsp-propose` — invoke `/srsp-propose` to realign artifacts.
     - `Fix with /srsp-coverage` — invoke `/srsp-coverage` to trace requirements through code and tests.
     - `Fix with /srsp-proposal` — invoke `/srsp-proposal`.
     - `Fix with /srsp-design` — invoke `/srsp-design`.
     - `Fix with /srsp-tasks` — invoke `/srsp-tasks`.
     - `Switch spec` — invoke `/srsp-switch`.
     - `Cancel` — stop.

9. **Update `spec.md` metadata and Decision Log (only if changes are made).**
   - If `/srsp-doctor` itself makes no changes, do not write to `spec.md`.
   - If it invokes another skill that changes artifacts, that skill records the Decision Log entry.

## Rules

- `/srsp-doctor` is read-only unless the engineer asks it to invoke a fix skill.
- Do not auto-fix drift; always ask the engineer before modifying artifacts.
- Coverage checks are heuristic: exact FR/TODO/Task IDs are preferred, but clear textual references also count.
- Allowed stages and transitions are defined in `docs/state-machine.md`.
