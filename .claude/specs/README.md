# Spec Workspace

This directory holds every active and archived **Silicon Ranch Spec Driven Development (SRSP)** spec for the project.

Each spec lives in its own subdirectory named in kebab-case or snake_case:

```text
.claude/specs/
  <spec-name>/
    spec.md      # Original spec + SpecKit-style metadata + Decision Log
    proposal.md  # Refined requirements + acceptance criteria + proposal summary
    design.md    # Technical architecture + implementation TODOs
    tasks.md     # Executable, checkable task plan

  archive/
    <spec-name>/ # Archived specs
```

## Active Spec

The file `.claude/specs/active-spec.txt` contains the name of the spec currently being worked on.

To switch active specs, edit that file or invoke `/srsp-status`.

## Stages

A spec moves through the following stages:

```text
submitted
   -> exploring
        -> proposal-draft
             -> proposal-approved
                  -> implementing
                       -> verified
                            -> review-approved
                                 -> committed
                                      -> pr-created
                                           -> applied
                                                -> done / archived / cancelled
```

See `docs/spec-driven-framework.md` for the full framework guide.

## Notes

- No ephemeral files (e.g., test results) are stored per spec.
- No implementation notes file exists; git history owns implementation details.
- Engineer approval, commit, and PR creation are recorded in `spec.md` metadata and Decision Log but are always engineer-owned actions.
