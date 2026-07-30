---
name: srsp-verify
description: Run tests for the active spec and record a short summary.
tags:
  - srsp
  - granular
  - verify
---

# /srsp-verify — Run Tests Only

Run the test suite for the active spec, show the live results, and record only a short summary in `spec.md` metadata.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/design.md` for the testing strategy.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the current stage is earlier than `implementing`, recommend `/srsp-apply` and stop.

2. **Identify test command.**
   - Read `.srsp-config.md` for `test-command` and use it if set (non-empty).
   - Otherwise look at project conventions (package.json scripts, pytest, cargo test, go test, make test).
   - If unclear, ask the engineer.

3. **Run tests.**
   - Capture stdout, stderr, exit code.

4. **Show summary to the engineer.**
   - Total / passed / failed / skipped.
   - Any failure summaries.

5. **Update `spec.md` metadata only:**
   - `last-run: <ISO timestamp>`
   - `test-result: <passed (n/n)>` or `<failed (x/n)>`
   - `updated: <ISO timestamp>`

6. **Append to `spec.md` Decision Log:**
   - `<timestamp> [verified] tests run: <result summary>`

7. **Ask the engineer:**
   - `All good` — stop.
   - `Fix failures` — diagnose and fix, then re-run.
   - `Refine` — failures reveal missing requirements; recommend `/srsp-proposal` or `/srsp-design`.

## Rules

- Do not create a `test-results.md` file.
- Do not proceed past verification unless the user explicitly says to continue.
- Decision Log format must follow `docs/state-machine.md`.
