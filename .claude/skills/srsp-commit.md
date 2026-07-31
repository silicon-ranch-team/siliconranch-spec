---
name: srsp-commit
description: Commit approved changes for the active spec with confirmation.
---

# /srsp-commit — Commit Changes Only

Commit the approved changes for the active spec. This is an engineer-triggered action and requires explicit confirmation.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/tasks.md`.
- Verify the working directory is a git repository and there are changes to commit.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the current stage is earlier than `review-approved`, recommend `/srsp-apply` and stop.

2. **Show git status.**
   - Files modified, added, deleted.

3. **Generate commit message draft.**
   - Read `.srsp-config.md` for `commit-prefix` and use it if set (non-empty).
   - Otherwise infer the appropriate prefix from the changes.

   Format:
   ```
   <prefix>(<spec-name>): <short summary from spec title>

   - <task summary>
   - <task summary>

   Closes spec: <spec-name>
   ```

   Default prefix is `feat`; other common prefixes: `fix`, `refactor`, `docs`, `test`, `chore`.

4. **Present to the engineer.**
   - Files and message.
   - Ask:
     - `Commit` — stage and commit.
     - `Edit message` — let engineer edit, then commit.
     - `Stage only` — stage files but do not commit.
     - `Cancel` — stop.

5. **Perform commit if approved.**
   - Stage relevant changes.
   - Run `git commit` with approved message.
   - Capture commit hash.

6. **Update `spec.md` metadata and Decision Log:**
   - `commit-hash: <short hash>`
   - `updated: <ISO timestamp>`
   - Append: `<timestamp> [committed] commit created: <short hash>`

7. **Confirm to the engineer.**

## Rules

- Never commit without explicit engineer approval.
- If no changes exist, warn and stop.
- If not in a git repo, explain and stop.
- Decision Log format must follow `docs/state-machine.md`.
