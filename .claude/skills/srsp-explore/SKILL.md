---
name: srsp-explore
description: Explore and clarify the active spec, drafting an initial proposal.md.
---

# /srsp-explore — Explore the Spec

Understand and clarify the active spec before formalizing it into a proposal.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue or switch?"
   - Offer: `Continue`, `Switch active spec via /srsp-switch`, or `Cancel`.
   - If no active spec exists, offer `/srsp-start`.
   - If the current stage is later than `exploring`, recommend `/srsp-propose` or `/srsp-resume` and stop.

2. **Analyze `spec.md`.**
   - Identify ambiguities, missing acceptance criteria, unstated constraints, and open questions.

3. **Ask the user clarifying questions (1–3 at a time).**
   - Keep questions focused on the biggest uncertainties.
   - If the spec is already clear, state that and ask if they want to draft the proposal directly.

4. **Update `spec.md`.**
   - Append exploration notes to `## Notes` if useful.
   - Update metadata:
     - `stage: exploring`
     - `explored: <ISO timestamp>`
     - `updated: <ISO timestamp>`
     - `stage-changed-at: <ISO timestamp>` (only if stage actually changed)
   - Append to `## Decision Log`:
     - `<timestamp> [exploring] exploration: clarified <topic>`

5. **Draft `proposal.md` (initial version).**

   ```markdown
   ---
   spec: <spec-name>
   stage: proposal
   generated: <ISO date>
   ---

   # Proposal: <Spec Title>

   ## Summary
   <one-paragraph synthesis of the spec goal>

   ## Functional Requirements
   1. FR1: <requirement> — Acceptance: <criteria>
   2. FR2: ...

   ## Non-Functional Requirements
   1. NFR1: ...

   ## Constraints & Assumptions
   - ...

   ## Open Questions
   - ...

   ## Refinement Notes
   <!-- appended during refinement -->
   ```

6. **Present the initial proposal summary.**
   - Highlight the top requirements and any remaining open questions.

7. **Ask the user:**
   - `Ready to formalize in /srsp-propose` — keep `stage: exploring`, recommend `/srsp-propose`.
   - `Explore more` — ask another round of questions and update `proposal.md`.
   - `Cancel` — set `status: cancelled`, record reason, stop.

8. **Update `spec.md` metadata and Decision Log after the decision.**
   - If moving to `/srsp-propose`, do not set `proposal-draft` here; let `/srsp-propose` set it.

## Rules

- Do not implement or design at this stage.
- Do not ask for formal Accept/Refine/Skip/Cancel; exploration is not the approval point.
- Keep the spec at `stage: exploring` while in this skill.
- If the spec is already detailed, keep exploration brief.
- Preserve the user's original spec text unchanged in `spec.md`.
- Exploration is about clarification, not commitment; `/srsp-propose` is the formal approval point.
- Stage and status values must follow `docs/state-machine.md`.
