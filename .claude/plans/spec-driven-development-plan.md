# Plan: Spec Driven Development Framework

## Goal
Build a reusable, customizable **Spec Driven Development (SDD)** workflow inside this repository as a set of **Claude Code skills**. The framework will let any engineer define a spec, generate/refine requirements, generate/refine a design document, implement the plan, verify the implementation, review changes, commit, and optionally open a PR — with explicit user approval/refinement loops at each stage.

## User Choices
- **Form:** Claude Code skills (`/spec-*` commands).
- **Technology:** Markdown/Claude skills only, no compiled code.
- **Example:** Include a working example spec and generated artifacts.

## Proposed File Structure

```text
.claude/
  CLAUDE.md                          # Existing framework manifest (update with skill index)
  skills/
    # Main orchestration skill
    spec-driven.md                   # /spec-driven — interactive end-to-end SDD flow

    # Granular step skills (used by the main skill and callable independently)
    spec-start.md                    # /spec-start — initialize a new spec
    spec-requirements.md             # /spec-requirements — generate/refine requirements
    spec-design.md                   # /spec-design — generate/refine design + TODOs
    spec-plan.md                     # /spec-plan — break design into tasks
    spec-implement.md                # /spec-implement — implement tasks
    spec-verify.md                   # /spec-verify — run/verify tests
    spec-review.md                   # /spec-review — user review + approval
    spec-commit.md                   # /spec-commit — commit changes
    spec-pr.md                       # /spec-pr — create pull request
    spec-status.md                   # /spec-status — show current spec state

  specs/                             # Persistent spec workspace
    README.md                        # How specs are stored and organized

    # Example spec demonstrating the full flow
    example-todo-api/
      spec.md                        # Original user prompt/spec
      requirements.md                # Generated requirements
      design.md                      # Generated design with TODOs
      plan.md                        # Task-level plan
      implementation-notes.md        # Notes from implementation
      test-results.md                # Verification results
      review.md                      # User review notes
      status.md                      # Current stage/status tracker

docs/
  spec-driven-framework.md           # Public/consumable documentation of the framework

README.md                            # Project root overview (new)
```

## Proposed Skills

1. **`/spec-driven`** (orchestrator)
   - Reads the active spec from `.claude/specs/<active>/status.md` or asks the user to pick/start one.
   - Walks through the stages in order.
   - At each stage, generates the artifact, presents a concise summary, and asks: **Accept / Refine / Cancel / Skip**.
   - On **Refine**, loops back to the same stage with the user's additional notes.
   - On **Skip**, records the reason and proceeds.
   - Persists a `status.md` with the current stage, decisions, and next action.

2. **`/spec-start`**
   - Prompts for a spec name and the spec text.
   - Creates `.claude/specs/<name>/spec.md` and `status.md` (stage: `spec-submitted`).
   - Optionally seeds an initial `requirements.md` if the spec is detailed enough.

3. **`/spec-requirements`**
   - Reads `spec.md`.
   - Generates `requirements.md` with acceptance criteria.
   - Presents summary, asks for approval/refinement.
   - Updates `status.md` to `requirements-approved` on accept or stays at `requirements-draft` on refine.

4. **`/spec-design`**
   - Reads `requirements.md`.
   - Generates `design.md` with architecture, file changes, and explicit TODOs per implementation area.
   - Presents summary, asks for approval/refinement.
   - Updates `status.md` to `design-approved` on accept.

5. **`/spec-plan`**
   - Reads `design.md`.
   - Generates `plan.md` as a checklist of concrete tasks mapped to design TODOs.
   - Allows task reordering/editing before approval.

6. **`/spec-implement`**
   - Reads `plan.md` and `design.md`.
   - Implements tasks one by one (or in batches), updating `implementation-notes.md`.
   - Checks off completed tasks.

7. **`/spec-verify`**
   - Runs unit tests (and UI tests if configured).
   - Records results in `test-results.md`.
   - On failure, offers to fix or refine.

8. **`/spec-review`**
   - Presents diff/change summary to user.
   - Records approval or required changes in `review.md`.
   - If changes requested, loops back to `/spec-implement` or `/spec-design` as appropriate.

9. **`/spec-commit`**
   - Stages changes, writes a structured commit message based on the spec name and plan.
   - Commits (after user approval).

10. **`/spec-pr`**
    - Helps create a pull request using `gh` CLI or by generating a PR description.
    - Records PR link in `status.md`.

11. **`/spec-status`**
    - Lists all specs and their current stage.
    - Shows the active spec and next recommended action.

## Conditional / Loop Behavior

Every stage skill supports the same decision menu:

- **Accept** → advance to next stage, update `status.md`.
- **Refine** → ask the user what is missing/wrong, append notes to the current artifact, regenerate the artifact, present again.
- **Skip** → record reason, advance to next stage.
- **Cancel** → record cancellation reason in `status.md`; stop.

This maps directly to the flow diagram in `CLAUDE.md`:

```text
Spec -> Requirements -> Design -> Plan -> Implement -> Verify -> Review -> Commit -> PR
            ^               ^          ^           ^          ^         ^
            |               |          |           |          |         |
          Refine loop     Refine   Edit tasks   Fix tests  Request  Amend
```

## Example Spec

I will include `example-todo-api/` with a simple REST todo API. The example will demonstrate:
- A concise user spec.
- Generated requirements with acceptance criteria.
- Generated design with explicit TODOs.
- Generated plan with checkboxes.
- Simulated implementation notes.
- Simulated test results.
- Review notes.

This gives users a concrete reference for expected output and artifact format.

## Documentation

- `docs/spec-driven-framework.md`: Full guide, skill index, workflow diagram, customization notes.
- `.claude/specs/README.md`: How the specs directory is organized.
- `.claude/CLAUDE.md`: Append a skill index and quick-start.
- `README.md`: Root project overview.

## Success Criteria

- All skills are invocable via `/` commands in Claude Code.
- Each skill has clear, self-contained instructions and knows which artifacts to read/update.
- The framework supports the full lifecycle described in `CLAUDE.md`.
- The conditional refinement loops are explicit in the main orchestrator and each step skill.
- A complete, working example exists for reference.
- No compiled code or external dependencies are introduced.

## Risks / Open Questions

1. **Claude Code skill format** — I will follow the standard markdown skill format with YAML frontmatter (`name`, `description`, `instructions`).
2. **Spec workspace collision** — Each spec lives in its own directory to avoid conflicts.
3. **Implementation scope** — I will keep the first version minimal but complete; advanced features (e.g., branching strategies, CI integration) can be added later.

## Next Step After Approval
Implement the files above in the proposed structure.
