# Silicon Ranch Spec Driven Development Framework

A customizable, end-to-end development workflow for Claude Code projects.

## What It Does

This framework guides a software development spec through its entire lifecycle:

```text
Spec → Explore → Propose → Apply → Archive/Done
```

At every stage, Claude presents the generated artifact and asks for explicit engineer approval. If the output is not good enough, the engineer can refine it in a loop until it meets the acceptance criteria.

## Get Started

1. Install the CLI: `npm install -g silicon-ranch-spec`
2. Initialize a project: `srsp init`
3. Create a spec: `srsp start my-feature`
4. Run `/srsp-explore` in Claude Code to clarify the spec.

## Documentation

- [Framework Guide](spec-driven-framework.md)
- [State Machine](state-machine.md)
- [CLI Reference](cli.md)
