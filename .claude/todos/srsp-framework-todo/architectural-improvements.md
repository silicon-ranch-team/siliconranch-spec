# SRSP Framework Architectural Improvements

**Date:** 2026-07-28

Bigger-picture improvements to consider. These are not bugs but structural enhancements that improve the developer experience and robustness of the framework.

---

## A. Introduce `/srsp-resume` as a convenience skill

**Purpose:** Give engineers a single "continue where I left off" command.

**Behavior:**
1. Read the active spec's `spec.md`.
2. Read the `stage` field.
3. Recommend or invoke the appropriate next skill:

   | Current stage | Recommended action |
   |---------------|-------------------|
   | `submitted` | Invoke `/srsp-explore` |
   | `exploring` | Invoke `/srsp-propose` |
   | `proposal-approved` | Invoke `/srsp-apply` from `implement` |
   | `implementing` | Invoke `/srsp-apply` from first unchecked task |
   | `verified` | Invoke `/srsp-apply` from review step |
   | `review-approved` | Invoke `/srsp-apply` from commit step |
   | `committed` | Invoke `/srsp-pr` |
   | `pr-created` | Invoke `/srsp-archive` |
   | `applied` | Invoke `/srsp-archive` |
   | `done` / `archived` / `cancelled` | Show final state and ask if reopen |

**Benefits:**
- Removes ambiguity about what to run next.
- Makes the framework feel like a true state machine.
- Reduces repeated explanations in `/srsp-status`.

---

## B. Add `/srsp-doctor` for workspace health checks

**Purpose:** Validate the integrity of a spec workspace and catch drift or corruption.

**Checks:**
1. `spec.md` frontmatter has all required fields.
2. `stage` value is canonical.
3. Required artifact files exist for the current stage.
4. Each artifact file has valid frontmatter.
5. Every functional requirement in `proposal.md` maps to at least one TODO in `design.md`.
6. Every TODO in `design.md` maps to at least one task in `tasks.md`.
7. No orphan tasks exist in `tasks.md`.
8. `active-spec.txt` points to a valid spec directory.

**Output format:**
```markdown
| Check | Result | Note |
|-------|--------|------|
| spec.md metadata | ✅ | all required fields present |
| stage value | ✅ | `proposal-approved` is valid |
| proposal.md exists | ✅ | file present |
| FR→TODO coverage | ⚠️ | FR3 has no matching TODO |
```

**Benefits:**
- Catches problems before they cause failures in other skills.
- Helps engineers self-serve debugging.

---

## C. Standardize a Decision Log entry format

**Purpose:** Make the Decision Log machine-readable and consistent.

**Current format:**
```text
- 2026-07-28 11:00: proposal approved — requirements and acceptance criteria accepted
```

**Proposed format:**
```text
- 2026-07-28T11:00:00Z [proposal-approved] accept: requirements and acceptance criteria accepted
```

**Benefits:**
- Easier to parse for `/srsp-status` or future automation.
- Timestamp is ISO 8601.
- Stage is explicit.
- Decision (`accept`, `refine`, `skip`, `cancel`) is explicit.

---

## D. Introduce `/srsp-switch` for safer active spec switching

**Purpose:** Reduce the risk of operating on the wrong spec.

**Behavior:**
1. Read `.claude/specs/active-spec.txt`.
2. Show the current active spec.
3. List all available specs.
4. Ask the engineer to pick a new active spec.
5. Confirm the switch.
6. Update `.claude/specs/active-spec.txt`.

**Benefits:**
- Centralizes the switch logic.
- Prevents accidental edits to the wrong spec.
- Can be called from `/srsp-status` and other skills.

---

## E. Add `/srsp-delete` as a separate destructive skill

**Purpose:** Isolate destructive actions from the normal archive flow.

**Behavior:**
1. Show the spec directory to be deleted.
2. Require the engineer to type the exact spec name to confirm.
3. Delete the directory.
4. If the deleted spec was active, update `active-spec.txt`.

**Benefits:**
- Removes a risky option from the common `/srsp-archive` menu.
- Follows the principle of least surprise.

---

## F. Consider a unified state machine in a single skill definition

**Purpose:** Reduce duplication and ensure consistency across all skills.

**Current state:**
- Each skill independently checks the active spec, reads `spec.md`, and updates metadata.
- Stage transition logic is duplicated across skills.

**Potential improvement:**
- Create a shared "state machine" section (in `docs/spec-driven-framework.md` or a dedicated `.claude/skills/_srsp-state-machine.md`) that every skill references.
- Define allowed transitions:
  - `submitted → exploring`
  - `exploring → proposal-approved`
  - `proposal-approved → implementing`
  - `implementing → verified`
  - `verified → review-approved`
  - `review-approved → committed`
  - `committed → pr-created`
  - `pr-created → applied`
  - `applied → done | archived`
  - any active stage → cancelled

**Benefits:**
- Makes the framework easier to maintain.
- Makes stage constraints explicit.

---

## G. Support per-spec configuration overrides

**Purpose:** Let teams customize behavior per spec without editing global skills.

**Idea:**
- Add an optional `.claude/specs/<spec-name>/.srsp-config.md` or frontmatter extensions.
- Allow overriding:
  - Test command.
  - Feature branch naming convention.
  - Commit message prefix.
  - Whether PR creation is required.

**Benefits:**
- Keeps global skills generic.
- Allows edge-case customization.

---

## H. Consider an `/srsp-list` command separate from `/srsp-status`

**Purpose:** Separate "what specs exist" from "what is the active spec state."

**Current behavior:** `/srsp-status` does both.

**Potential split:**
- `/srsp-list` — just the table of all specs.
- `/srsp-status` — active spec details + next action.

**Benefits:**
- `/srsp-list` is cheaper to run (reads only frontmatter of all specs).
- `/srsp-status` focuses on driving the next action.

---

## Summary of Architectural Improvements

| Improvement | Effort | Impact | Notes |
|-------------|--------|--------|-------|
| `/srsp-resume` | Low | High | Quick win; improves daily UX. |
| `/srsp-doctor` | Medium | High | Catches drift and corruption. |
| Standardized Decision Log | Low | Medium | Improves traceability. |
| `/srsp-switch` | Low | Medium | Safety improvement. |
| `/srsp-delete` | Low | Low | Moves risk out of archive flow. |
| Unified state machine doc | Medium | Medium | Maintainability. |
| Per-spec config overrides | Medium | Low | Future customization. |
| `/srsp-list` split | Low | Low | Cleaner separation. |
