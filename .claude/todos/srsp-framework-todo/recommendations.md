# SRSP Framework Recommendations

**Date:** 2026-07-28

Concrete recommendations mapped to every issue from `evaluation.md`.

---

## High-Impact Recommendations

### Issue 1: `/srsp-apply` is too large
**Recommendation:** Make `/srsp-apply` a resumable coordinator, not a single long chain.

**Specific changes:**
- At the start of `/srsp-apply`, detect the current stage and ask:
  - "Resume from `implement`, `verify`, `review`, `commit`, or `pr`?"
- Add explicit stage updates after each sub-step:
  - After implementation: `stage: implementing`
  - After tests pass: `stage: verified`
  - After engineer approval: `stage: review-approved`
  - After commit: `stage: committed`
  - After PR: `stage: pr-created`
  - After finalization: `stage: applied`
- Allow the engineer to stop after any sub-step and resume later.

**Alternative:** Split `/srsp-apply` into `/srsp-implement`, `/srsp-verify`, `/srsp-review`, `/srsp-commit`, `/srsp-pr` and keep `/srsp-apply` only as an optional convenience wrapper.

---

### Issue 2: Ambiguous stage transitions
**Recommendation:** Adopt and enforce a smaller canonical stage set.

**Proposed canonical stages:**
```text
submitted
   -> exploring
        -> proposal-approved
             -> implementing
                  -> verified
                       -> review-approved
                            -> committed
                                 -> pr-created
                                      -> applied
                                           -> done / archived / cancelled
```

**Changes:**
- Remove `proposal-draft` as a formal stage; exploration ends at `exploring`, and `/srsp-propose` advances to `proposal-approved`.
- Inside `/srsp-propose`, do not expose `design-approved` or `tasks-approved` as separate metadata stages; instead record them in the Decision Log.
- Update every skill to set exactly one of the canonical stages after each decision.

---

### Issue 3: Granular skills cause artifact drift
**Recommendation:** Add consistency guards and a sync/check skill.

**Specific changes:**
- In `/srsp-proposal`: after updating requirements, check if any requirement lacks a TODO in `design.md` or a task in `tasks.md`. If so, warn the engineer and recommend `/srsp-propose` or `/srsp-tasks`.
- In `/srsp-design`: after updating TODOs, check if any new TODO lacks a task in `tasks.md`. If so, warn and recommend `/srsp-tasks`.
- In `/srsp-tasks`: after updating tasks, check if any task maps to a non-existent TODO. If so, warn and recommend `/srsp-design`.
- Add a new skill `/srsp-check` (or `/srsp-sync`) that validates:
  - Every FR in `proposal.md` has at least one TODO in `design.md` and at least one task in `tasks.md`.
  - Every TODO in `design.md` has at least one task in `tasks.md`.
  - No orphan tasks exist in `tasks.md`.

---

### Issue 4: No recovery path for interrupted workflows
**Recommendation:** Make `/srsp-apply` read progress from `tasks.md` and `spec.md` metadata.

**Specific changes:**
- On entry, read `tasks.md` to find the first unchecked implementation task.
- If `stage` is `implementing`, ask: "Resume from Task-N or restart implementation?"
- If `stage` is `verified` and `commit-hash` is empty, skip implementation/tests and go straight to review.
- If `stage` is `review-approved` and `commit-hash` is empty, skip to commit.
- If `stage` is `committed` and `pr-url` is empty, skip to PR.
- Record every sub-step in the Decision Log so state is reconstructible.

---

### Issue 5: `active-spec.txt` single point of failure
**Recommendation:** Make every skill defensive and explicit about the active spec.

**Specific changes:**
- Every skill should display: "Active spec: `<name>` (`<stage>`). Continue or switch?"
- If a command is invoked against a spec in the wrong stage, warn and recommend the correct next command.
- In `/srsp-status`, clearly distinguish the active spec from the list.
- Consider adding a `--spec` argument support in skill instructions so engineers can override the active spec per command.

---

## Medium-Impact Recommendations

### Issue 6: `/srsp-explore` overlaps with `/srsp-propose`
**Recommendation:** Clarify the split between exploration and formalization.

**Specific changes:**
- `/srsp-explore` should be **clarification only**.
  - It asks questions and appends answers to `spec.md` notes.
  - It may produce a *rough draft* `proposal.md` for the engineer's reference.
  - It does **not** ask for formal approval.
  - It sets `stage: exploring`, not `proposal-draft`.
- `/srsp-propose` is **formal approval**.
  - It finalizes `proposal.md`, `design.md`, `tasks.md`.
  - It asks for Accept/Refine/Skip/Cancel.
  - It sets `stage: proposal-approved`.

---

### Issue 7: Example spec Decision Log is misleading
**Recommendation:** Fix the example to be internally consistent.

**Specific changes:**
- Set `stage: review-approved` (not `applied`).
- Keep `commit-hash: ""` and `pr-url: ""`.
- Update the last Decision Log entry to:
  - `2026-07-28 14:00: review approved — waiting for engineer commit and PR`
- Update `tasks.md` Review/Release Tasks to show:
  - `[x] Engineer review and approval`
  - `[ ] Engineer commits approved changes`
  - `[ ] Engineer creates pull request (optional)`

---

### Issue 8: No validation of required fields
**Recommendation:** Add a lightweight `/srsp-doctor` skill.

**Validation rules:**
- `spec.md` frontmatter has required fields: `spec`, `title`, `author`, `status`, `stage`, `created`, `updated`.
- `stage` is one of the canonical values.
- Decision Log section exists in `spec.md`.
- If stage is `proposal-approved` or later, `proposal.md`, `design.md`, and `tasks.md` must exist and have valid frontmatter.
- Every FR in `proposal.md` maps to at least one TODO in `design.md`.
- Every TODO in `design.md` maps to at least one task in `tasks.md`.

---

### Issue 9: Empty stub files
**Recommendation:** Keep stubs but make skills robust to empty files.

**Specific changes:**
- `/srsp-status` already only reads `spec.md`; keep that.
- Other skills should check if an artifact file is empty or missing frontmatter. If so, treat it as "not yet generated" and create it.
- Optionally, seed stubs with minimal frontmatter on creation:
  ```markdown
  ---
  spec: <spec-name>
  stage: <artifact-stage>
  generated: ""
  ---
  ```

---

### Issue 10: No branch management guidance
**Recommendation:** Add explicit branch handling to `/srsp-apply` and `/srsp-pr`.

**Specific changes:**
- At the start of `/srsp-apply`, check the current branch.
- If on the default branch, ask:
  - "Create feature branch `<spec-name>`?" (Yes / No / I'll do it manually)
  - If yes, run `git checkout -b <spec-name>`.
- `/srsp-pr` should refuse to create a PR from the default branch unless explicitly confirmed.

---

## Low-Impact Recommendations

### Issue 11: Skill descriptions too long
**Recommendation:** Shorten all descriptions to one concise sentence under 120 characters.

**Suggested descriptions:**
- `/srsp-start`: "Create a new SRSP spec with metadata and artifact stubs."
- `/srsp-explore`: "Clarify the active SRSP spec and draft an initial proposal."
- `/srsp-propose`: "Finalize proposal, design, and tasks for an SRSP spec."
- `/srsp-apply`: "Implement, verify, review, commit, and PR an approved SRSP spec."
- `/srsp-archive`: "Mark an SRSP spec done, archived, cancelled, or reopened."
- `/srsp-status`: "Show the active SRSP spec and all specs."
- `/srsp-proposal`: "Refine only the proposal.md for the active SRSP spec."
- `/srsp-design`: "Refine only the design.md for the active SRSP spec."
- `/srsp-tasks`: "Refine only the tasks.md for the active SRSP spec."
- `/srsp-verify`: "Run tests for the active SRSP spec."
- `/srsp-commit`: "Commit approved SRSP spec changes."
- `/srsp-pr`: "Create a pull request for the active SRSP spec."

---

### Issue 12: Tags not normalized
**Recommendation:** Use a consistent tag taxonomy.

**Proposed tags:**
- Primary skills: `srsp`, `primary`
- Granular skills: `srsp`, `granular`
- Domain tags: `spec`, `explore`, `propose`, `apply`, `archive`, `status`, `proposal`, `design`, `tasks`, `verify`, `commit`, `pr`

**Example:** `/srsp-tasks` tags would be `srsp`, `granular`, `tasks`.

---

### Issue 13: No parallel spec guidance
**Recommendation:** Document parallel spec handling in `docs/spec-driven-framework.md`.

**Specific guidance to add:**
- Only one spec is active at a time.
- Use `/srsp-status` to switch active specs.
- In-progress specs remain in their current stage until resumed.
- Avoid running `/srsp-apply` on a spec without checking `/srsp-status` first.

---

### Issue 14: Delete option is risky
**Recommendation:** Move deletion to a separate skill or require stronger confirmation.

**Specific changes:**
- Remove `Delete` from `/srsp-archive` options.
- Add `/srsp-delete` skill that:
  - Shows the spec path.
  - Requires the engineer to type the spec name to confirm.
  - Permanently removes the directory after confirmation.
- Update docs to mention `/srsp-delete`.

---

### Issue 15: Missing spec naming validation
**Recommendation:** Enforce a spec name pattern in `/srsp-start`.

**Specific changes:**
- Validate that spec names match `^[a-z0-9]+(?:-[a-z0-9]+)*$` or `^[a-z0-9]+(?:_[a-z0-9]+)*$`.
- If invalid, explain the rule and ask for a new name.
- Suggest a kebab-case name from the title if the user provides one.
