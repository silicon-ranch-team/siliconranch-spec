# Plan: Consolidate SDD Artifacts into 4 Files

## Goal
Reduce the per-spec footprint from 8 files to 4 files, inspired by SpecKit:

```text
.claude/specs/<spec-name>/
  spec.md      # Original user prompt + rich metadata (SpecKit-style)
  proposal.md  # Consolidated requirements + acceptance criteria + high-level proposal
  design.md    # Technical architecture + implementation TODOs
  tasks.md     # Executable, checkable task plan derived from design TODOs
```

This removes ephemeral/duplicated files and keeps engineer-owned actions (commit, PR, review approval) out of the artifact surface.

## User Direction
- Keep `spec.md`.
- Add SpecKit-style metadata to the spec file: created date, author, and other relevant fields.
- Merge/discard/consolidate the 8 existing files into `design`, `proposal`, and `tasks`.
- Do not remove anything essential.
- Modify skills and impacted docs accordingly.

## Evaluation of Current Files

| Current file | Verdict | New home |
|---|---|---|
| `spec.md` | Keep | Enrich frontmatter with metadata; keep body |
| `requirements.md` | Merge | Into `proposal.md` as "Requirements" and "Acceptance Criteria" |
| `design.md` | Keep, narrow | Remove requirements section; keep architecture + TODOs |
| `plan.md` | Merge | Into `tasks.md` as the executable checklist |
| `implementation-notes.md` | Discard | Engineer responsibility; git history/diff is the source of truth |
| `test-results.md` | Discard | Ephemeral; show live during `/spec-verify`, record only a summary line in `spec.md` metadata |
| `review.md` | Discard | Approval recorded in `spec.md` decision log; commit/PR remain engineer-triggered |
| `status.md` | Merge into `spec.md` | Stage, status, updated date, and decision log move to `spec.md` frontmatter + appendix |

## Proposed Spec File Format (`spec.md`)

```markdown
---
spec: example-todo-api
title: Todo List REST API
author: engineer@example.com
status: active
stage: review-approved
created: 2026-07-28
updated: 2026-07-28
last-run: 2026-07-28T10:00:00Z
test-result: passed (10/10)
pr-url: ""
---

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
- 2026-07-28 10:00: requirements approved
- 2026-07-28 10:15: design approved
- 2026-07-28 11:00: tasks approved
- 2026-07-28 12:00: implementation completed
- 2026-07-28 12:10: tests passed (10/10)
- 2026-07-28 12:15: review approved by engineer
```

Metadata fields:
- `spec` — machine-readable identifier.
- `title` — human-readable name.
- `author` — engineer who submitted/owns the spec.
- `status` — `active`, `paused`, `cancelled`, `done`.
- `stage` — current workflow stage.
- `created` — ISO date.
- `updated` — ISO date/time, touched on every update.
- `last-run` — ISO date/time of last verification run.
- `test-result` — short summary like `passed (10/10)` or `failed (2/10)`.
- `pr-url` — link after `/spec-pr` succeeds.

## Proposed `proposal.md`

Contains the refined, engineer-facing proposal:

```markdown
---
spec: example-todo-api
stage: proposal
generated: 2026-07-28
---

# Proposal: Todo List REST API

## Summary
One-paragraph synthesis of the spec goal.

## Functional Requirements
1. FR1: ... — Acceptance: ...
2. FR2: ... — Acceptance: ...

## Non-Functional Requirements
1. NFR1: ...

## Constraints & Assumptions
- ...

## Open Questions
- ...

## Refinement Notes
...
```

## Proposed `design.md`

Contains only technical design and implementation TODOs:

```markdown
---
spec: example-todo-api
stage: design
generated: 2026-07-28
---

# Design: Todo List REST API

## Overview
...

## Architecture / Approach
...

## File Changes
...

## API / Interface Definitions
...

## Implementation TODOs
- [ ] TODO-1: ...
- [ ] TODO-2: ...

## Testing Strategy
...

## Risks & Mitigations
...

## Refinement Notes
...
```

## Proposed `tasks.md`

Contains the executable plan:

```markdown
---
spec: example-todo-api
stage: tasks
generated: 2026-07-28
---

# Tasks: Todo List REST API

## Implementation Tasks
- [x] Task-1: ... ← TODO-1
- [x] Task-2: ... ← TODO-2
- [ ] Task-3: ... ← TODO-3

## Verification Tasks
- [ ] Verify-1: ...

## Review / Release Tasks
- [ ] Review: engineer approval
- [ ] Commit: engineer commits approved changes
- [ ] PR: engineer creates pull request (optional)
```

## Skill Changes

### Rename / Refocus
- `/spec-requirements` → `/spec-proposal`
  - Reads `spec.md`.
  - Generates/updates `proposal.md`.
  - Updates `spec.md` metadata stage to `proposal`/`proposal-approved`/`proposal-skipped`/`cancelled`.
  - Appends refinement notes to `proposal.md`.

- `/spec-plan` → `/spec-tasks`
  - Reads `design.md`.
  - Generates/updates `tasks.md`.
  - Updates `spec.md` metadata stage to `tasks`/`tasks-approved`/etc.

### Keep but adjust
- `/spec-start`
  - Creates `spec.md` with rich metadata frontmatter.
  - Asks for author (defaults to "engineer" or reads git user if available).
  - No longer creates `status.md`.

- `/spec-design`
  - Generates `design.md` only (no requirements section).
  - References `proposal.md` for requirements.
  - Updates `spec.md` metadata stage.

- `/spec-implement`
  - Reads/updates `tasks.md`.
  - Optionally checks off corresponding TODOs in `design.md`.
  - Does **not** create `implementation-notes.md`.
  - Updates `spec.md` metadata stage + decision log.

- `/spec-verify`
  - Runs tests live and shows summary.
  - Does **not** create `test-results.md`.
  - Writes only a short result into `spec.md` metadata (`last-run`, `test-result`).

- `/spec-review`
  - Presents changes to the engineer.
  - Records the engineer's verdict directly in `spec.md` decision log.
  - Does **not** create `review.md`.
  - Does not auto-commit or auto-create PR.

- `/spec-commit`
  - Remains engineer-triggered, requires explicit confirmation.
  - Records commit hash in `spec.md` metadata/decision log.

- `/spec-pr`
  - Remains engineer-triggered, requires explicit confirmation.
  - Records PR URL in `spec.md` metadata.

- `/spec-status`
  - Reads `spec.md` frontmatter for stage/status.
  - Lists specs without opening 8 files per spec.

- `/spec-driven`
  - Updates stage names to: `submitted → proposal → design → tasks → implement → verify → review → commit → pr → done`.
  - References new artifact names.
  - Updates `spec.md` metadata instead of `status.md`.

## Files to Delete

```text
.claude/specs/example-todo-api/requirements.md
.claude/specs/example-todo-api/plan.md
.claude/specs/example-todo-api/implementation-notes.md
.claude/specs/example-todo-api/test-results.md
.claude/specs/example-todo-api/review.md
.claude/specs/example-todo-api/status.md
```

## Files to Create / Rewrite

```text
.claude/specs/example-todo-api/spec.md        # enriched metadata + decision log
.claude/specs/example-todo-api/proposal.md   # new
.claude/specs/example-todo-api/design.md     # narrower, no requirements
.claude/specs/example-todo-api/tasks.md      # new
.claude/specs/README.md                      # update to 4-file layout
.claude/skills/spec-driven.md                # update stage/artifact references
.claude/skills/spec-start.md                 # metadata + no status.md
.claude/skills/spec-proposal.md              # rename + refocus from spec-requirements
.claude/skills/spec-design.md                # narrower scope
.claude/skills/spec-tasks.md                 # rename + refocus from spec-plan
.claude/skills/spec-implement.md             # no implementation-notes.md
.claude/skills/spec-verify.md               # no test-results.md
.claude/skills/spec-review.md               # no review.md
.claude/skills/spec-commit.md               # record in spec.md
.claude/skills/spec-pr.md                   # record in spec.md
.claude/skills/spec-status.md               # read spec.md metadata
.claude/skills/spec-requirements.md         # DELETE (replaced by spec-proposal)
.claude/skills/spec-plan.md                 # DELETE (replaced by spec-tasks)
docs/spec-driven-framework.md               # update file layout and skill names
README.md                                   # update skill list
.claude/CLAUDE.md                           # update skill index
```

## Non-Negotiable Rules

1. No file is created for ephemeral data (test results).
2. No file duplicates data that git already captures (implementation notes).
3. No stage auto-commits or auto-creates a PR.
4. Engineer approval is recorded in `spec.md`, not a separate file.
5. Every stage updates `spec.md` metadata and appends to the decision log.

## Outcome

- Per-spec files drop from 8 to 4.
- Token usage per spec inspection drops significantly.
- Engineer responsibilities (review, commit, PR) remain explicit and human-owned.
- Framework still supports full lifecycle + refinement loops.
