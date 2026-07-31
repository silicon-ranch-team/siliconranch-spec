# Custom Spec Driven Development

**Project Goal:** generate a Framework called **Silicon Ranch Spec Driven Development Framework** (SRSP).

**Project Description:** The following framework has the only goal to create a framework that any software development could use to create their own projects, where they can modify every aspect of the framework like their own, in order to adapt their own system for their own purposes.

**Reason for the Framework:** Engineers should have control over their own development cycle, such as creating specifications, requirements, refine specifications and requirements, decide when the refinement has reached the desired approach or level of acceptance criteria, define a plan, refine the plan, design the plan, define plan tasks, implement tasks, verify implementation (unit tests, and optional UI test if desired), verify tests, User Review changes, commit changes and finally create a PR.

**Additional Information:** Engineers will be able to adapt every single step to their own needs, but have a defined foundation of how to proceed with a Spec, discard what is not needed, every single step should have a conditional procedure that Claude will have multiple options. For example:

1. Spec is submitted.
2. Claude starts interacting with the spec and generating what is needed.
3. Presents the result, then asks the user if the result of the spec meets the criteria or needs to be redefined (edited), or cancel.
4. If the user needs to refine even more, they need to add more information to the spec.
5. Cycle repeats.

For something more visual the following diagram can be used:

```text
Step A: User prompt a spec
    -> Step B: Claude generate requirements
        -> Is the user Happy with Results of StepB
        |1. NO  -> Loop to Step B to refine Requirements of User Prompt
        |2. YES -> Step C: Turn Requirements Specification into a Design document that will have
                           TODO's for each specific implementation.
            -> Is the user Happy with Design documents generated?
            |1. NO -> Loop to Step C to refine Generated Design document
            |2. YES -> Implement the Designed plan
```

The above process should work for a specific spec.

## Quick Start

1. Run `/srsp-start` to create a new spec.
2. Run `/srsp-explore` to clarify the spec.
3. Run `/srsp-propose` to finalize proposal, design, and tasks.
4. Run `/srsp-apply` to implement, verify, review, commit, and open a PR.
5. Run `/srsp-archive` to mark the spec done, archive it, or cancel it.
6. Run `/srsp-resume` at any time to resume the active spec from its current stage.
7. Run `/srsp-switch` at any time to change the active spec.

## Primary Commands

| Command | Purpose |
|---------|---------|
| `/srsp-start`    | Create a new spec |
| `/srsp-explore`  | Clarify the spec and draft an initial proposal |
| `/srsp-propose`  | Finalize proposal, design, and tasks |
| `/srsp-apply`    | Implement, verify, review, commit, and open PR |
| `/srsp-archive`  | Mark done, archive, cancel, or reopen a spec |
| `/srsp-status`   | Show active spec and all specs |
| `/srsp-switch`   | Switch the active spec to another existing spec |
| `/srsp-resume`   | Resume the active spec from its current stage |
| `/srsp-doctor`   | Validate spec metadata, stage, and artifact coverage |
| `/srsp-delete`   | Permanently delete a spec after typed confirmation |

Spec metadata supports an optional `base-branch` field for per-spec PR target overrides.

## Optional Granular Commands

| Command | Purpose |
|---------|---------|
| `/srsp-proposal` | Refine only `proposal.md` |
| `/srsp-design`   | Refine only `design.md` |
| `/srsp-tasks`    | Refine only `tasks.md` |
| `/srsp-sync`     | Detect drift between requirements, design TODOs, and tasks |
| `/srsp-coverage` | Trace requirements → TODOs → tasks → code → tests |
| `/srsp-verify`   | Run tests only |
| `/srsp-commit`   | Commit approved changes only |
| `/srsp-pr`       | Create pull request only |
| `/srsp-link`     | Link the active spec to an external issue tracker ticket |

## Per-Spec Files

```text
.claude/specs/<spec-name>/
  spec.md      # Original spec + metadata + Decision Log
  proposal.md  # Refined requirements + acceptance criteria + proposal summary
  design.md    # Technical architecture + implementation TODOs
  tasks.md     # Executable, checkable task plan
```

## Documentation

- `docs/tutorial.md` — step-by-step walkthrough.
- `docs/spec-driven-framework.md` — full framework guide.
- `docs/state-machine.md` — canonical stages, transitions, and entry commands.
- `.claude/specs/example-todo-api/` — complete example spec.
- `.claude/specs/README.md` — how specs are organized.

## Engineer-Owned Actions

The following require explicit engineer approval and are never automatic:

- Final review approval
- Committing changes
- Creating a pull request
- Archiving, deleting, or cancelling a spec
