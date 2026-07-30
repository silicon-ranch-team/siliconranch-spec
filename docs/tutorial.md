# SRSP Tutorial: From First Spec to Pull Request

This tutorial walks you through the full Silicon Ranch Spec Driven Development (SRSP) workflow using the example of adding a small feature to a project.

## Before You Start

1. Install the CLI globally (or use `npx`):
   ```bash
   npm install -g silicon-ranch-spec
   ```
2. Initialize SRSP in your project:
   ```bash
   srsp init
   ```
   This copies `.claude/skills/`, `.claude/specs/templates/`, and `docs/` into your project.
3. Open the project in Claude Code.

## Step 1: Create a Spec

Run:

```text
/srsp-start
```

Claude will ask for:
- A spec name (kebab-case or snake_case, e.g., `todo-sorting`).
- An optional template (e.g., `api-endpoint`, `ui-component`, `bug-fix`, `refactor`).
- A title.
- An author.
- The spec text: what you want to build, why, and any acceptance criteria.

This creates `.claude/specs/todo-sorting/` with four files:
- `spec.md` — original prompt + metadata + Decision Log.
- `proposal.md` — requirements stub.
- `design.md` — architecture stub.
- `tasks.md` — task plan stub.
- `.srsp-config.md` — optional overrides.

## Step 2: Explore the Spec

Run:

```text
/srsp-explore
```

Claude reads `spec.md`, asks clarification questions, and drafts an initial `proposal.md` with functional requirements, acceptance criteria, and open questions.

Options at the end:
- **Ready to formalize in `/srsp-propose`** — exploration stays at `stage: exploring`.
- **Explore more** — ask another round of questions.
- **Cancel** — abandon the spec.

## Step 3: Formalize the Proposal

Run:

```text
/srsp-propose
```

Claude generates/refines `proposal.md`, `design.md`, and `tasks.md`, then presents a summary.

This is the **formal approval gate**. Options:
- **Accept** — sets `stage: proposal-approved`, recommends `/srsp-apply`.
- **Refine proposal/design/tasks** — loop until you are happy.
- **Skip** — record reason and move forward.
- **Cancel** — set `status: cancelled`.

## Step 4: Apply the Spec

Run:

```text
/srsp-apply
```

Claude:
1. Confirms the active spec and current stage.
2. Detects the development branch and offers a feature branch (`feature/<name>` or `feat/<name>`).
3. Resumes from the right sub-stage:
   - `proposal-approved` — starts implementation.
   - `implementing` — resumes from the first unchecked task.
   - `verified` — moves to engineer review.
   - `review-approved` — commits changes.
   - `committed` — creates a PR.
   - `pr-created` — finalizes to `applied`.

You must explicitly approve:
- The feature branch choice.
- Implementation changes.
- Committing changes.
- Creating the PR.

## Step 5: Archive the Spec

Run:

```text
/srsp-archive
```

Options:
- **Done** — mark complete.
- **Archive** — move to `.claude/specs/archive/`.
- **Cancel** — abandon.
- **Reopen** — return to active work.

## Working on Multiple Specs

At any point, use `/srsp-status` to see all specs and their stages, `/srsp-switch` to change the active spec, and `/srsp-resume` to continue the active one.

## Example

See `.claude/specs/example-todo-api/` for a completed spec paused at `review-approved`. It shows what every artifact looks like after the apply phase.

## Next Steps

- Read the [Framework Guide](spec-driven-framework.md) for full details.
- Read [State Machine](state-machine.md) for allowed stage transitions.
- Read [CLI Reference](cli.md) for the npm CLI commands.
