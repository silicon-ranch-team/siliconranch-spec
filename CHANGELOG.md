# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-07-30

### Added
- `.gitignore` to exclude local SRSP state, planning artifacts, dependencies, and OS/editor clutter.
- Tutorial and quick-start documentation plus a GitHub pull request template.

### Fixed
- `README.md` now recommends global install on Windows and explains the Git Bash `npx` limitation.

## [0.1.0] - 2026-07-29

### Added
- Initial release of the Silicon Ranch Spec Driven Development framework.
- Initial SRSP CLI package (`silicon-ranch-spec`) with commands: `init`, `start`, `status`, `switch`, `doctor`, `help`.
- Markdown-based skill workflow for Claude Code.
- Primary commands: `/srsp-start`, `/srsp-explore`, `/srsp-propose`, `/srsp-apply`, `/srsp-archive`, `/srsp-status`, `/srsp-switch`, `/srsp-resume`, `/srsp-doctor`, `/srsp-delete`.
- Granular commands: `/srsp-proposal`, `/srsp-design`, `/srsp-tasks`, `/srsp-verify`, `/srsp-commit`, `/srsp-pr`.
- Per-spec `base-branch` override and GitFlow branch detection.
- Active spec confirmation, spec name validation, drift warnings, and delete protection.
- Framework documentation in `docs/state-machine.md` defining canonical stages and transitions.
- Standardized Decision Log format across all skills.
