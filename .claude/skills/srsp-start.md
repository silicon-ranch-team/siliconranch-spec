---
name: srsp-start
description: Create a new Silicon Ranch spec workspace with spec.md and artifact stubs.
---

# /srsp-start — Start a New Spec

Create a new Silicon Ranch spec workspace under `.claude/specs/<spec-name>/`.

## Steps

1. **Check current active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - If an active spec exists, display: "Current active spec: `<name>` (`<stage>`). Create a new spec or switch first?"
   - Offer: `Create new spec`, `Switch active spec`, or `Cancel`.
   - If the engineer chooses `Switch active spec`, invoke `/srsp-switch` and stop.

2. **Ask the user for a spec name.**
   - Use kebab-case or snake_case (e.g., `user-auth`, `todo-api`).
   - Suggest a name if they only provide a description.

3. **Validate the spec name.**
   - Allowed pattern: `^[a-z0-9]+(?:[-_][a-z0-9]+)*$`.
   - Reject `.`, `..`, reserved filenames, and names containing uppercase letters, spaces, or special characters other than `-` and `_`.
   - If invalid:
     - Explain the rule.
     - Suggest a normalized name from the title: lowercase, replace spaces/special characters with `-`.
     - Ask the engineer: `Use suggestion`, `Enter another name`, or `Cancel`.

4. **Ask for an optional template.**
   - List available templates from `.claude/specs/templates/` if the directory exists.
   - Options: `api-endpoint`, `ui-component`, `bug-fix`, `refactor`, or `None (blank)`.
   - If a template is selected, copy its `spec.md`, `proposal.md`, `design.md`, and `tasks.md` into the new spec directory as the starting point.
   - Replace template placeholders (`<...>`) with the engineer-provided spec name/title where obvious.
   - Keep `stage: submitted`, `status: active`, and update `created`, `updated`, and Decision Log timestamps.

5. **Ask for the spec title.**
   - A short human-readable title.

6. **Ask for the author.**
   - Try to read `git config user.email` as the default.
   - If unavailable, default to `engineer`.

7. **Ask for the spec text.**
   - Context, goal, requirements, acceptance criteria, and any notes.

8. **Create the spec directory.**
   - Path: `.claude/specs/<spec-name>/`

9. **Write `spec.md` with SpecKit-style metadata:**

   ```markdown
   ---
   spec: <spec-name>
   title: <title>
   author: <author>
   status: active
   stage: submitted
   explored: ""
   proposed: ""
   applied: ""
   archived: ""
   created: <ISO date>
   updated: <ISO date>
   last-run: ""
   test-result: ""
   commit-hash: ""
   pr-url: ""
   base-branch: ""
   ticket-url: ""
   trace:
   ---

   # Spec: <Title>

   ## Context
   <!-- Why this spec exists -->

   ## Goal
   <!-- What the implementation should achieve -->

   ## Requirements (user-provided)
   <!-- Raw user requirements -->

   ## Acceptance Criteria (user-provided, if any)
   <!-- Optional list -->

   ## Notes
   <!-- Any extra context, constraints, or open questions -->

   ## Decision Log
   - <timestamp> [submitted] spec submitted: initial draft created
   ```

10. **Create stub files for the other artifacts.**
   Each stub must contain minimal valid SpecKit-style frontmatter so that later skills can read it without failing.
   - If a template was selected in Step 4, do not overwrite template-provided files; only create any files the template did not include.

   `.claude/specs/<spec-name>/proposal.md`:
   ```markdown
   ---
   spec: <spec-name>
   stage: proposal
   generated: <ISO date>
   ---

   # Proposal: <Spec Title>
   ```

   `.claude/specs/<spec-name>/design.md`:
   ```markdown
   ---
   spec: <spec-name>
   stage: design
   generated: <ISO date>
   ---

   # Design: <Spec Title>
   ```

   `.claude/specs/<spec-name>/tasks.md`:
   ```markdown
   ---
   spec: <spec-name>
   stage: tasks
   generated: <ISO date>
   ---

   # Tasks: <Spec Title>
   ```

   `.claude/specs/<spec-name>/.srsp-config.md`:
   ```markdown
   ---
   spec: <spec-name>
   ---

   # SRSP Config Overrides

   Uncomment and edit any override you need. Empty values mean "use framework defaults".

   - `test-command`: ""        # e.g., `npm test`, `pytest`, `cargo test`
   - `commit-prefix`: ""        # e.g., `feat`, `fix`, `docs`
   - `branch-prefix`: ""         # e.g., `feature`, `feat`
   - `pr-target`: ""            # overrides `base-branch` in spec.md
   ```

11. **Set the active spec.**
   - Write the spec name to `.claude/specs/active-spec.txt`.

12. **Confirm to the user.**
   - Show the spec path and recommended next command: `/srsp-explore`.

## Rules

- Do not overwrite an existing spec directory without explicit user approval.
- Keep the spec text faithful to what the user provided.
- If the user provides very little detail, note it in `## Notes` and warn that exploration will be more exploratory.
- `updated` must match `created` on first creation.
- Stage and status values must follow `docs/state-machine.md`.
