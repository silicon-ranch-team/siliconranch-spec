---
name: srsp-report
description: Generate a health and traceability report for all Silicon Ranch specs.
---

# /srsp-report — Spec Health Report

List all specs by stage and age, flag specs stuck in the same stage longer than a configurable threshold, and show a lightweight coverage score for each spec.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read the frontmatter of every `spec.md` under `.claude/specs/` and `.claude/specs/archive/`.
- Read each spec's `proposal.md`, `design.md`, and `tasks.md` if they exist.
- Read `.srsp-config.md` at the project root if it exists.

## Configuration

`.srsp-config.md` may set a `stale-days` value. If omitted, the default is `14`.

```yaml
stale-days: 14
```

## Metadata Fields Used

The report relies on these `spec.md` frontmatter fields:

- `created` or `created-at` — when the spec was created.
- `updated` or `stage-changed-at` — when the spec last changed stage.
- `stage` — current workflow stage.
- `status` — active, done, archived, or cancelled.
- `reopened-count` — number of times the spec has been reopened.
- `trace` — optional traceability map used to compute coverage score.

If `created-at` or `stage-changed-at` are missing, fall back to `created` and `updated` respectively.

## Steps

1. **Confirm report scope.**
   - Read `.claude/specs/active-spec.txt`.
   - Ask the engineer:
     - `All specs` — include active, done, archived, and cancelled specs.
     - `Active only` — include only specs with `status: active`.
     - `This spec only` — report on the active spec.
     - `Cancel` — stop.

2. **Read all spec directories.**
   - Walk `.claude/specs/` and `.claude/specs/archive/`.
   - Skip `templates`.
   - Read the frontmatter of each `spec.md`.

3. **Compute age and staleness.**
   - For each spec, compute:
     - `age-days` — days since `created-at` (or `created`).
     - `stage-days` — days since `stage-changed-at` (or `updated`).
   - A spec is **stale** if `stage-days` exceeds `stale-days` and its `status` is `active`.

4. **Compute a lightweight coverage score.**
   - If the spec has a `trace` block, count the number of requirement IDs with non-empty TODO, task, file-pattern, and test-pattern values.
   - Score = traced requirements / total functional requirements found in `proposal.md`.
   - If no `trace` block exists, compute a heuristic score from:
     - Requirements with at least one TODO reference.
     - TODOs with at least one task reference.
     - Tasks that are checked off.
   - Display the score as a percentage and a status:
     - `≥ 80%` — Good
     - `50–79%` — Fair
     - `< 50%` — Poor
     - `N/A` — no proposal/requirements yet

5. **Build the report tables.**

   **Spec summary:**

   | Spec | Title | Status | Stage | Age (days) | Stage Age (days) | Reopened | Coverage |
   |------|-------|--------|-------|------------|------------------|----------|----------|
   | ...  | ...   | ...    | ...   | ...        | ...              | ...      | ...      |

   **Stale specs:**

   | Spec | Stage | Stage Age (days) | Recommended Action |
   |------|-------|------------------|---------------------|
   | ...  | ...   | ...              | `/srsp-resume` or `/srsp-archive` |

6. **Present findings and recommend actions.**
   - Highlight stale specs and specs with poor coverage.
   - For stale specs, recommend `/srsp-resume`, `/srsp-switch`, or `/srsp-archive`.
   - For poor coverage, recommend `/srsp-coverage` or `/srsp-propose`.

7. **Ask the engineer:**
   - `Export to file` — write the report to `.claude/reports/srsp-report-<timestamp>.md`.
   - `Run /srsp-coverage on active spec` — invoke `/srsp-coverage`.
   - `Run /srsp-resume on active spec` — invoke `/srsp-resume`.
   - `Cancel` — stop.

8. **Update `spec.md` only if changes are made.**
   - `/srsp-report` itself does not write to any `spec.md`.
   - If it exports a report file, it does not update `spec.md`.
   - If it invokes another skill, that skill records any Decision Log entry.

## Rules

- `/srsp-report` is read-only unless the engineer asks it to invoke another skill or export a report file.
- Do not modify spec metadata or artifacts during reporting.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
