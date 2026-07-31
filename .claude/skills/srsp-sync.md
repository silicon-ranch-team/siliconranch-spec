---
name: srsp-sync
description: Detect and report drift between proposal requirements, design TODOs, and implementation tasks for the active spec.
tags:
  - srsp
  - granular
  - sync
---

# /srsp-sync — Sync Spec Artifacts

Detect drift between `proposal.md` requirements, `design.md` TODOs, and `tasks.md` tasks. Report what is out of sync and recommend the right skill to fix it. This is a read-only diagnostic unless the engineer asks to invoke a fix skill.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md` if it exists.
- Read `.claude/specs/<spec-name>/design.md` if it exists.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the spec is earlier than `proposal-approved`, warn that sync checks are limited until the proposal is approved.

2. **Parse artifacts.**
   - Read `## Functional Requirements` from `proposal.md`.
     - Extract each requirement and any explicit ID (e.g., `FR1`, `FR-1`, `REQ-1`).
   - Read `## Implementation TODOs` from `design.md`.
     - Extract each TODO and any explicit ID (e.g., `TODO-1`, `TODO-2`).
   - Read `## Implementation Tasks` from `tasks.md`.
     - Extract each task and any explicit ID or mapping marker (e.g., `← TODO-1`, `FR1`).

3. **Run coverage checks.**

   | Check | Definition | Severity |
   |-------|------------|----------|
   | Orphan requirements | Requirement not referenced by any TODO | Warning |
   | Orphan TODOs | TODO not mapped to any task | Warning |
   | Orphan tasks | Task not mapped to any TODO or requirement | Warning |
   | Missing requirement → task path | Requirement with TODOs but no task | Warning |

4. **Build the findings table.**

   | Direction | Count | Drift Items |
   |-----------|-------|-------------|
   | Requirements → TODOs | N | List orphan requirements |
   | TODOs → Tasks | N | List orphan TODOs |
   | Tasks → TODOs/Requirements | N | List orphan tasks |

5. **Present findings and recommend actions.**
   - If no drift: report "Artifacts are in sync" and offer to run `/srsp-doctor` or return to `/srsp-apply`.
   - If drift exists:
     - List specific items with line references when possible.
     - Recommend which skill to run:
       - Missing TODOs for requirements → `/srsp-design`
       - Missing tasks for TODOs → `/srsp-tasks`
       - Missing requirements for tasks → `/srsp-propose`
       - Broad drift across all artifacts → `/srsp-propose`

6. **Ask the engineer:**
   - `Run recommended fix skill` — invoke the suggested skill.
   - `Show details` — expand the drift analysis.
   - `Cancel` — stop.

7. **Update `spec.md` only if a fix skill changes artifacts.**
   - `/srsp-sync` itself does not write to `spec.md`.
   - If a fix skill is invoked, it records the Decision Log entry.

## Rules

- `/srsp-sync` is read-only unless explicitly asked to invoke a fix skill.
- IDs and mapping markers are preferred, but textual references also count.
- Drift detection is heuristic: the goal is to flag obvious gaps, not enforce a strict schema.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
