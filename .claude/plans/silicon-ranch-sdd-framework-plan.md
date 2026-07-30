# Plan: Silicon Ranch Spec Driven Development Framework

## Framework Name
**Silicon Ranch Spec Driven Development Framework** (short: SRSP).

## Goal
Combine the OpenSpec-style command surface (`/srsp-explore`, `/srsp-propose`, `/srsp-apply`, `/srsp-archive`) with the full Spec Driven Development lifecycle, while consolidating per-spec artifacts into 4 files and removing engineer-owned/ephemeral records from the spec workspace.

## Per-Spec Artifact Layout (4 files)

```text
.claude/specs/<spec-name>/
  spec.md      # Original prompt + SpecKit-style metadata + Decision Log
  proposal.md  # Refined requirements + acceptance criteria + proposal summary
  design.md    # Technical architecture + implementation TODOs
  tasks.md     # Executable, checkable task plan
```

Removed:
- `requirements.md` → merged into `proposal.md`.
- `plan.md` → merged into `tasks.md`.
- `implementation-notes.md` → discarded; git history owns this.
- `test-results.md` → discarded; verification shows results live and records only a short summary in `spec.md` metadata.
- `review.md` → discarded; engineer approval is recorded in `spec.md` Decision Log.
- `status.md` → merged into `spec.md` metadata and Decision Log.

## `spec.md` Format

Frontmatter (SpecKit-style):

```yaml
---
spec: example-todo-api
title: Todo List REST API
author: engineer@example.com
status: active
stage: proposed
explored: 2026-07-28T10:00:00Z
proposed: 2026-07-28T11:00:00Z
applied: 2026-07-28T14:00:00Z
archived: ""
created: 2026-07-28
updated: 2026-07-28T14:00:00Z
last-run: 2026-07-28T13:50:00Z
test-result: passed (10/10)
commit-hash: ""
pr-url: ""
---
```

Body:

```markdown
# Spec: Todo List REST API

## Context
...

## Goal
...

## Requirements (user-provided)
...

## Acceptance Criteria (user-provided, if any)
...

## Notes
...

## Decision Log
- 2026-07-28 10:00: spec submitted — initial draft created
- 2026-07-28 10:30: explore complete — clarified persistence and response codes
- 2026-07-28 11:00: proposal approved — requirements and acceptance criteria accepted
- 2026-07-28 11:30: design approved — architecture and TODOs accepted
- 2026-07-28 12:00: tasks approved — task plan accepted
- 2026-07-28 13:00: implementation complete — all tasks done
- 2026-07-28 13:10: tests passed (10/10)
- 2026-07-28 13:15: engineer review approved
- 2026-07-28 14:00: archived — PR merged / work complete
```

## Primary Skills (OpenSpec-style commands)

### `/srsp-start`
- **Purpose:** Create a new spec.
- **Creates:** `spec.md` with rich metadata, and optionally the empty `proposal.md`, `design.md`, `tasks.md` files.
- **Updates:** `.claude/specs/active-spec.txt`.
- **Flow:**
  1. Ask for spec name (kebab-case) and title.
  2. Ask for author (default to current git user or "engineer").
  3. Ask for the spec text (context, goal, requirements, acceptance criteria, notes).
  4. Write `spec.md` with `stage: submitted`, `status: active`.
  5. Confirm and recommend next step: `/srsp-explore`.

### `/srsp-explore`
- **Purpose:** Understand and clarify the spec; produce or refine the initial proposal.
- **Reads:** `spec.md`.
- **Writes/Updates:** `proposal.md` (initial draft), `spec.md` metadata + Decision Log.
- **Stage progression:** `submitted` → `exploring` → `proposal-draft`.
- **Flow:**
  1. Read `spec.md`. If none active, offer to run `/srsp-start`.
  2. Identify ambiguities and ask the engineer clarifying questions.
  3. Draft an initial `proposal.md` with:
     - Summary
     - Functional Requirements (derived from spec)
     - Acceptance Criteria
     - Non-Functional Requirements (inferred)
     - Constraints & Assumptions
     - Open Questions
  4. Present the draft summary.
  5. Ask: `Looks good / Propose now / Needs more exploration / Cancel`.
  6. Update `spec.md` metadata and Decision Log.

### `/srsp-propose`
- **Purpose:** Finalize the proposal, design, and task plan before implementation.
- **Reads:** `spec.md`, current `proposal.md`, `design.md`, `tasks.md`.
- **Writes/Updates:** `proposal.md`, `design.md`, `tasks.md`, `spec.md` metadata + Decision Log.
- **Stage progression:** `proposal-draft` → `proposed` → `proposal-approved`.
- **Flow:**
  1. Read `spec.md` and existing artifacts.
  2. Generate/refine `proposal.md` (requirements + acceptance criteria).
  3. Generate/refine `design.md` (architecture, file changes, API definitions, implementation TODOs, testing strategy, risks).
  4. Generate/refine `tasks.md` (ordered checkable tasks mapped to design TODOs).
  5. Present a concise summary of all three artifacts.
  6. Run the approval/refinement loop:
     - `Accept` — advance to apply.
     - `Refine proposal` — update `proposal.md` and present again.
     - `Refine design` — update `design.md` and present again.
     - `Refine tasks` — update `tasks.md` and present again.
     - `Skip` — record reason, advance to apply.
     - `Cancel` — record reason, set status to `cancelled`, stop.
  7. Update `spec.md` metadata (`stage: proposal-approved`) and append to Decision Log.

### `/srsp-apply`
- **Purpose:** Implement, verify, review, commit, and open PR for the approved proposal.
- **Reads:** `spec.md`, `proposal.md`, `design.md`, `tasks.md`.
- **Writes/Updates:** `tasks.md` checkboxes, `design.md` TODO checkboxes (optional), `spec.md` metadata + Decision Log.
- **Stage progression:** `proposal-approved` → `implementing` → `verified` → `review-approved` → `committed` → `pr-created` → `applied`.
- **Flow:**
  1. Read all artifacts.
  2. Ask implementation mode: `All at once`, `One task at a time`, `Batch by area`.
  3. Implement each pending task, checking it off in `tasks.md`.
  4. Optionally check off corresponding TODOs in `design.md`.
  5. After implementation, run tests live. Show summary only. Record in `spec.md` metadata (`last-run`, `test-result`).
  6. Present changes to engineer for review.
  7. If engineer approves, proceed to commit; otherwise, loop back to implement.
  8. `/spec-commit` equivalent: generate commit message, ask engineer confirmation, commit, record `commit-hash` in `spec.md`.
  9. `/spec-pr` equivalent: generate PR description, ask engineer confirmation, create PR with `gh` or provide manual text, record `pr-url` in `spec.md`.
  10. Update `spec.md` metadata to `stage: applied` and append to Decision Log.

### `/srsp-archive`
- **Purpose:** Mark the spec as complete/cancelled/archived and finalize the workspace.
- **Reads:** `spec.md`.
- **Writes/Updates:** `spec.md` metadata + Decision Log; optionally moves spec directory.
- **Stage progression:** `applied` → `done`/`archived`/`cancelled`.
- **Flow:**
  1. Read `spec.md` and show final status.
  2. Ask the engineer:
     - `Done` — mark `status: done`, `stage: done`.
     - `Archive` — move the spec directory to `.claude/specs/archive/<spec-name>/`, mark `status: archived`.
     - `Cancel` — mark `status: cancelled`, `stage: cancelled`.
     - `Reopen` — set `status: active` and return to last stage.
  3. Update `spec.md` metadata and append to Decision Log.

### `/srsp-status`
- **Purpose:** Show all specs and the active spec, reading only `spec.md` frontmatter.
- **Flow:**
  1. Read `.claude/specs/active-spec.txt`.
  2. List spec directories and read each `spec.md` frontmatter.
  3. Show a table: Spec | Title | Author | Stage | Status | Updated.
  4. Show active spec details and next recommended command.

## Removed / Replaced Skills

| Old skill | Disposition |
|---|---|
| `/spec-driven` | Remove; replaced by the 4 primary `/srsp-*` skills |
| `/spec-start` | Rename to `/srsp-start` and update metadata handling |
| `/spec-requirements` | Renamed to `/srsp-propose` and merged into proposal phase |
| `/spec-design` | Renamed to `/srsp-propose` (design is part of propose) |
| `/spec-plan` | Renamed to `/srsp-propose` (tasks are part of propose) |
| `/spec-implement` | Renamed to `/srsp-apply` (implement + verify + review) |
| `/spec-verify` | Removed as standalone; absorbed into `/srsp-apply` |
| `/spec-review` | Removed as standalone; absorbed into `/srsp-apply` |
| `/spec-commit` | Removed as standalone; absorbed into `/srsp-apply` |
| `/spec-pr` | Removed as standalone; absorbed into `/srsp-apply` |
| `/spec-status` | Renamed to `/srsp-status` |

## Alternative: Keep Granular Stage Skills

If the engineer wants finer control, we can also expose these optional skills:

```text
/srsp-proposal  # refine proposal.md only
/srsp-design    # refine design.md only
/srsp-tasks     # refine tasks.md only
/srsp-verify    # run tests only
/srsp-commit    # commit only
/srsp-pr        # create PR only
```

The primary 4 commands would remain the recommended path. The granular skills would be documented as optional overrides.

## Example Spec Update

`.claude/specs/example-todo-api/` will contain only:

```text
spec.md
proposal.md
design.md
tasks.md
```

All old files (`requirements.md`, `plan.md`, `implementation-notes.md`, `test-results.md`, `review.md`, `status.md`) will be deleted.

## Documentation Updates

1. `docs/spec-driven-framework.md`
   - Rename title and references to **Silicon Ranch Spec Driven Development Framework**.
   - Document the 4 primary commands.
   - Document the 4-file artifact layout.
   - Document SpecKit-style metadata.
   - Explain engineer-owned actions.

2. `.claude/CLAUDE.md`
   - Update framework name.
   - Replace skill index with `/srsp-*` commands.
   - Update quick-start.

3. `README.md`
   - Update framework name.
   - Update command list and file layout.

4. `.claude/specs/README.md`
   - Document the 4-file layout and archive directory.

## Non-Negotiable Rules

1. **Engineer owns commit and PR** — no auto-commit, no auto-PR; every action requires explicit confirmation.
2. **Engineer owns final review approval** — recorded only in `spec.md` Decision Log.
3. **No ephemeral files** — test results are shown live; only a short summary is stored in `spec.md` metadata.
4. **No duplicate git data** — implementation details live in git history, not a separate file.
5. **Every stage updates `spec.md`** — metadata + Decision Log are the single source of truth for spec state.

## Implementation Steps

1. Delete old skills and example artifact files.
2. Create new `/srsp-*.md` skills.
3. Rewrite example spec artifacts into the 4-file layout.
4. Update all documentation and indexes.
5. Verify file list and consistency.

## Open Decision for the User

Whether to keep the optional granular stage skills (`/srsp-proposal`, `/srsp-design`, `/srsp-tasks`, `/srsp-verify`, `/srsp-commit`, `/srsp-pr`) or keep only the 4 primary commands + `/srsp-start` + `/srsp-status`.
