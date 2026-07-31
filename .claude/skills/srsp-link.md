---
name: srsp-link
description: Link the active spec to an external issue tracker ticket and record the URL.
tags:
  - srsp
  - granular
  - link
---

# /srsp-link — Link Spec to Ticket

Record an external issue tracker ticket URL in the active spec's metadata and Decision Log. This is optional; use it when the spec is driven by or tracked in a separate issue tracker.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.

2. **Read `.srsp-config.md` for ticket base URL.**
   - Read `.srsp-config.md` at the project root and `.claude/specs/<spec-name>/.srsp-config.md`.
   - If `ticket-base-url` is set, offer to build a full URL from a ticket ID.
   - If no base URL is set, ask the engineer for the full ticket URL.

3. **Ask for ticket details.**
   - Ticket URL (e.g., GitHub issue, Jira ticket).
   - Optional ticket ID/title.
   - Optional note.

4. **Update `spec.md` metadata.**
   - `ticket-url: <url>`
   - `updated: <ISO timestamp>`

5. **Append to `## Decision Log`.**
   - Use the format from `docs/state-machine.md`:
     - `<timestamp> [<stage>] ticket linked: <ticket-id-or-url> — <note>`

6. **Confirm to the engineer.**
   - Show the recorded ticket URL.

## Rules

- This skill is optional; specs do not require a ticket link.
- Do not modify other artifacts.
- Decision Log format must follow `docs/state-machine.md`.
