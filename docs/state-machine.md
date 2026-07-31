# SRSP State Machine

This document is the single source of truth for the Silicon Ranch Spec Driven Development (SRSP) workflow stages, transitions, required artifacts, and entry commands. Every SRSP skill should behave according to the rules defined here.

## Status vs Stage

- **`status`** — lifecycle classification of the spec:
  - `active` — currently being worked on.
  - `done` — completed and accepted.
  - `archived` — moved to `.claude/specs/archive/`.
  - `cancelled` — abandoned.
- **`stage`** — current point in the workflow state machine. A spec can be `cancelled` while at any stage, and `done`/`archived` are terminal stages.

## Stages

| Stage | Meaning |
|-------|---------|
| `submitted` | Spec has been created; no exploration yet. |
| `exploring` | `/srsp-explore` is clarifying the spec; initial `proposal.md` may be drafted but is not approved. |
| `proposal-draft` | `/srsp-propose` has begun generating or refining proposal, design, and tasks. |
| `proposal-approved` | Proposal, design, and tasks accepted by the engineer; ready to implement. |
| `implementing` | Implementation is in progress. |
| `verified` | Implementation complete; tests passed. |
| `review-approved` | Engineer review approved; ready to commit. |
| `committed` | Changes committed; ready to create PR. |
| `pr-created` | PR created; ready to finalize. |
| `applied` | Implementation, verification, review, commit, and PR are complete (PR may have been skipped). |
| `done` | Spec marked done without archiving. |
| `archived` | Spec moved to archive. |
| `cancelled` | Spec abandoned at any point. |
| `reopened` | Spec was finalized and is now active again for a new iteration. Created by `/srsp-reopen`. |

## Allowed Transitions

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

exploring -> cancelled
proposal-draft -> cancelled
proposal-approved -> cancelled
implementing -> verified
implementing -> cancelled
verified -> review-approved
verified -> implementing (on review-requested changes)
verified -> cancelled
review-approved -> committed
review-approved -> cancelled
committed -> pr-created
committed -> cancelled
pr-created -> applied
pr-created -> cancelled
applied -> done
applied -> archived
applied -> cancelled

# Final stages can be reopened (via /srsp-reopen)
done -> reopened
archived -> reopened
cancelled -> reopened

# Reopened specs re-enter the workflow
reopened -> submitted
reopened -> exploring
```

## Required Artifacts Per Stage

| Stage | Required artifacts |
|-------|-------------------|
| `submitted` | `spec.md` |
| `exploring` | `spec.md`, `proposal.md` |
| `proposal-draft` | `spec.md`, `proposal.md` |
| `proposal-approved` | `spec.md`, `proposal.md`, `design.md`, `tasks.md` |
| `implementing` and beyond | `spec.md`, `proposal.md`, `design.md`, `tasks.md` |
| `done`, `archived`, `cancelled` | `spec.md` (plus prior artifacts for reference) |
| `reopened` | `spec.md`, `tasks.md` |

## Entry Commands Per Stage

When `/srsp-resume` or a skill boundary check needs to recommend the next command:

| Stage | Recommended command |
|-------|---------------------|
| `submitted` | `/srsp-explore` |
| `exploring` | `/srsp-propose` |
| `proposal-draft` | `/srsp-propose` |
| `proposal-approved` | `/srsp-apply` |
| `implementing` | `/srsp-apply` |
| `verified` | `/srsp-apply` |
| `review-approved` | `/srsp-apply` |
| `committed` | `/srsp-apply` |
| `pr-created` | `/srsp-apply` |
| `applied` | `/srsp-archive` |
| `done` | `/srsp-reopen` or `/srsp-status` or `/srsp-start` |
| `archived` | `/srsp-reopen` or `/srsp-status` or `/srsp-start` |
| `cancelled` | `/srsp-reopen` or `/srsp-status` or `/srsp-start` |
| `reopened` | `/srsp-explore` or `/srsp-propose` |

## Stage-Change Rules

1. `/srsp-explore` must keep `stage: exploring` while running. It must not set `proposal-draft` or `proposal-approved`.
2. `/srsp-propose` must set `stage: proposal-draft` as soon as it begins generating or refining artifacts. It is the formal approval gate.
3. `/srsp-apply` advances through sub-stages: `implementing`, `verified`, `review-approved`, `committed`, `pr-created`, `applied`.
4. `/srsp-archive` moves a spec to `done`, `archived`, or `cancelled`.
5. `/srsp-reopen` moves a spec from `done`, `archived`, or `cancelled` to `reopened`, then to `submitted` or `exploring`.
6. `/srsp-delete` permanently removes a spec; it does not change `stage`.

## Decision Log Format

Every stage change, refinement, test run, review action, commit, PR, and finalization must be recorded in `spec.md` under `## Decision Log` using the format:

```text
<ISO timestamp> [<stage>] <decision>: <note>
```

Examples:

```text
- 2026-07-28T10:00:00Z [submitted] spec submitted: initial draft created
- 2026-07-28T10:30:00Z [exploring] exploration: clarified persistence and response codes
- 2026-07-28T11:00:00Z [proposal-draft] proposal approved: ready for /srsp-apply
- 2026-07-28T11:30:00Z [implementing] task completed: implemented CRUD endpoints
- 2026-07-28T13:00:00Z [verified] tests passed: 10/10
- 2026-07-28T13:15:00Z [review-approved] engineer review approved
- 2026-07-28T14:00:00Z [committed] commit created: abc1234
- 2026-07-28T14:15:00Z [pr-created] PR opened: https://github.com/...
```

## Engineer-Owned Transitions

The following transitions require explicit engineer approval and are never automatic:

- `review-approved` -> `committed`
- `committed` -> `pr-created`
- `applied` -> `done` / `archived`
- Any stage -> `cancelled`
- Any final stage -> `active` (reopen)
- Permanent deletion (`/srsp-delete`)
