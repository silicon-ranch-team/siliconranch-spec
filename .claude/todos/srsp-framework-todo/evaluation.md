# SRSP Framework Evaluation

**Date:** 2026-07-28

This document contains the complete evaluation of the Silicon Ranch Spec Driven Development Framework (SRSP), organized by impact. Nothing has been omitted from the original review.

---

## High-Impact Issues

### 1. `/srsp-apply` is too large and violates single-responsibility
**Problem:** `/srsp-apply` bundles implementation, testing, review, commit, and PR into one skill. This makes it hard to:
- Restart from a specific point after interruption.
- Re-run tests after a fix without re-implementing.
- Commit without re-running tests.
- Create a PR without re-implementing.

**Current stage flow inside `/srsp-apply`:**
1. Implement tasks.
2. Run tests.
3. Engineer review.
4. Commit.
5. Open PR.

**Why it matters:** A crash or session end mid-apply leaves the engineer uncertain about what happened and what is safe to rerun.

---

### 2. Stage transitions are ambiguous
**Problem:** The framework uses many stages but the skills do not consistently update them.

**Current documented stages:**
```text
submitted → exploring → proposal-draft → proposal-approved → implementing → verified → review-approved → committed → pr-created → applied → done/archived/cancelled
```

**Specific gaps:**
- `/srsp-propose` sets `proposal-approved` but never sets separate `design-approved` or `tasks-approved` stages, even though design and tasks are approved inside it.
- `/srsp-apply` jumps from `proposal-approved` directly to `implementing`, then `verified`, etc., but there are no clear internal checkpoints.
- `proposal-draft` is used both as an "exploration complete" state and as a "proposal being refined" state.

---

### 3. Granular skills can leave artifacts inconsistent
**Problem:** `/srsp-proposal`, `/srsp-design`, and `/srsp-tasks` each modify only one file. If the engineer changes requirements in `/srsp-proposal` without updating design/tasks, the artifacts drift apart.

**Example drift scenario:**
1. Engineer runs `/srsp-propose` and accepts all three artifacts.
2. Later, engineer runs `/srsp-proposal` and adds a new functional requirement.
3. `design.md` no longer has a TODO mapping to the new requirement.
4. `tasks.md` no longer has a task for it.
5. `/srsp-apply` will miss the requirement entirely unless someone notices.

---

### 4. No recovery path for interrupted workflows
**Problem:** If Claude crashes or the session ends mid-`/srsp-apply`, the next `/srsp-apply` does not know exactly where it left off beyond the `stage` field. While `tasks.md` and `design.md` checkboxes encode progress, `/srsp-apply` does not explicitly read them to resume.

**Specific scenarios:**
- Stage is `implementing` but some tasks are already checked.
- Stage is `verified` but `commit-hash` is empty.
- Stage is `review-approved` but `commit-hash` is empty.

---

### 5. `active-spec.txt` is a global single point of failure
**Problem:** There is one global active spec. Running the wrong command on the wrong spec is easy.

**Example risk:**
- Engineer switches to Spec A in `/srsp-status`.
- In another conversation thread, `/srsp-apply` runs against Spec A by default without the engineer realizing it.
- Changes are made to the wrong spec.

---

## Medium-Impact Issues

### 6. `/srsp-explore` overlaps with `/srsp-propose`
**Problem:** Both can generate a `proposal.md`. The boundary between exploration and formalization is unclear.

**Current behavior:**
- `/srsp-explore` drafts a `proposal.md` and can set stage to `proposal-draft`.
- `/srsp-propose` also generates/refines `proposal.md` and asks for formal approval.

**Why it matters:** Engineers may try to approve requirements in `/srsp-explore` or over-clarify in `/srsp-propose`.

---

### 7. Example spec Decision Log is misleading
**Problem:** The example `spec.md` Decision Log says "apply complete" and `stage: applied`, but `tasks.md` shows commit/PR as unchecked and `commit-hash`/`pr-url` are empty. This is internally inconsistent.

**Specific contradictions:**
- `stage: applied` implies commit/PR happened.
- `commit-hash: ""` and `pr-url: ""` show they did not.
- Decision Log says "commit/PR pending engineer action" but also "apply complete."

---

### 8. No validation of required fields
**Problem:** `spec.md` metadata has no schema enforcement. A malformed spec could break `/srsp-status` or other skills.

**Risk examples:**
- Missing `spec:` or `stage:` field.
- Invalid stage value.
- Missing `Decision Log` section.
- `proposal.md`, `design.md`, or `tasks.md` missing when stage implies they should exist.

---

### 9. `/srsp-start` creates empty stub files
**Problem:** `/srsp-start` creates empty `proposal.md`, `design.md`, `tasks.md` files. While `/srsp-status` only reads `spec.md`, other skills may try to parse empty frontmatter.

**Current behavior:**
- Empty files have no YAML frontmatter.
- Skills that read them must handle the empty case.

---

### 10. No branch management guidance
**Problem:** `/srsp-apply` and `/srsp-pr` mention creating a feature branch, but there is no skill or clear instruction for branch creation.

**Current behavior:**
- `/srsp-pr` warns if on the default branch.
- `/srsp-apply` does not check branch state before implementing.
- No skill creates a feature branch.

---

## Low-Impact / Polish Issues

### 11. Skill descriptions are too long for Claude Code UI
**Problem:** Claude Code's skill list may truncate long descriptions. Some descriptions exceed 150 characters.

**Affected skills:**
- `/srsp-start` — 199 characters.
- `/srsp-explore` — ~150 characters.
- `/srsp-apply` — ~180 characters.
- `/srsp-propose` — ~155 characters.

---

### 12. Tags are not normalized
**Problem:** Tags vary across skills.

**Current tags:**
- Primary skills: `srsp`, `workflow` (only old `/spec-driven`, now gone), `spec`, `explore`, `propose`, `apply`, `archive`, `status`.
- Granular skills: `srsp`, `granular`, `proposal`, `design`, `tasks`, `verify`, `commit`, `pr`.

**Why it matters:** Filtering by `primary` or `granular` is harder because the taxonomy is mixed.

---

### 13. No mention of how to handle multiple specs in parallel
**Problem:** The framework is built around one active spec, but real projects have many specs.

**Current behavior:**
- `.claude/specs/active-spec.txt` tracks one active spec.
- `/srsp-status` can switch specs.
- Docs do not discuss parallel spec workflows.

---

### 14. `/srsp-archive` "Delete" option is risky
**Problem:** Delete is offered alongside safer options. A misclick could remove work.

**Current behavior:**
- Options include `Done`, `Archive`, `Cancel`, `Reopen`, `Delete`.
- Delete requires explicit confirmation, but it is still in the same menu as safe actions.

---

### 15. Missing guidance on spec naming conventions
**Problem:** Spec names are mentioned as kebab-case or snake_case, but no validation exists.

**Current behavior:**
- `/srsp-start` suggests kebab-case or snake_case.
- No enforcement or normalization.

---

## Summary by Impact

| Impact | Count | Issues |
|--------|-------|--------|
| High | 5 | 1–5 |
| Medium | 5 | 6–10 |
| Low | 5 | 11–15 |

## Cross-Cutting Themes

1. **Resumability and state machine clarity** — Issues 1, 2, 4.
2. **Artifact consistency** — Issues 3, 6, 9.
3. **Safety and guardrails** — Issues 5, 8, 10, 14.
4. **Developer experience and polish** — Issues 7, 11, 12, 13, 15.
