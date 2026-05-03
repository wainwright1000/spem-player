# Workflow

## Overview

The **Spem Player** GitHub Project board
(`https://github.com/users/wainwmr/projects/2`) is the canonical register of
all bugs, hacks, todos, and build issues. `BUGS.md` is archived and no longer
maintained.

This document describes the board schema, the ticket lifecycle, and the
practices used to manage work. Local tooling and agent commands are
documented in `AGENTS-LOCAL.md`.

## Board Schema

### Status

Mark's kanban workflow with explicit entry and exit criteria:

| Status | Entry Criteria | Exit Criteria |
| -------- | --------------- | --------------- |
| **Todo** | New TODO/BUG/HACK reported | Type, Area, Difficulty defined. Description is clear enough to act on |
| **Specified** | Assessed; recommended fix exists or reproduction/test plan defined | Developer pulls it |
| **In Progress** | Coding started, branch created | Code complete, tests pass, code in `dev` branch |
| **Ready for Main** | Committed to `dev`; awaiting final check before main merge | Merged to `main` |
| **Done** | On `main`; running in production | — |

`dev` is the integration branch. `main` is production.

### Type

- `bug` — defect
- `todo` — planned improvement
- `hack` — workaround or temporary fix
- `build` — build/pipeline issue

### Area

- `UI` — user interface
- `Score` — sheet music display
- `Canvas` — overview canvas
- `Lily` — LilyPond/grammar
- `Config` — configuration and constants
- `Test` — test suite
- `Tooling` — build scripts and tooling
- `Controls` — playback controls
- `Other` — uncategorised

### Difficulty

- `XS` — trivial
- `S` — small
- `M` — medium
- `L` — large

## Ticket Lifecycle

1. **Create**: A new ticket is created as a GitHub issue and added to the board
   with Status **Todo**.
2. **Assess**: Set Type, Area, and Difficulty. Write a clear
   Description. Ticket remains in **Todo** until assessment is complete.
3. **Specify**: Write Recommended fix, Test plan, and Dependencies. Move Status
   to **Specified**.
4. **Assign** (optional): The ticket can be assigned to a developer.
5. **Develop**: The developer claims or is assigned the ticket, moves Status
   to **In Progress**, implements the fix on a feature branch, runs tests, and
   opens a PR against `dev` (if working in a fork) or commits directly to `dev`
   (if working in the upstream repository).

6. **Integrate**: When code is complete and tests pass, commits are merged to
   `dev`. Status moves to **Ready for Main**.
7. **Release**: Mark merges `dev` to `main`. Status moves to **Done**.

If a ticket is blocked by a question for Mark, add a `question` label and
@mention him, but leave Status as **Todo** until the question is resolved.

## Ticket Format

A well-formed ticket body contains:

- **Type**, **Area**, **Status**, **Difficulty**
- **Source**: file path and line number
- **First seen**: date and commit hash (from `git blame`)
- **Description**: clear explanation of the problem or desired improvement
- **Recommended fix**: approach, files to change, risks (populated during
  Specification)
- **Test plan**: test cases, mocking requirements (populated during
  Specification)
- **Dependencies**: other tickets that must precede or relate to this one

## Best Practices

1. **Visible output**: After every item or batch is processed, write a brief
   summary as visible text before moving on.
2. **Documentation hygiene**: Update the board immediately after finishing any
   item.
3. **Diagnostics discipline**: Run `get_all_diagnostics` after any file write.
   Fix errors before proceeding.
4. **Temporary files**: Scratch files go in `temp/` and should be deleted before
   the session ends.
5. **Devil's advocate**: Briefly challenge the approach before starting work.
   Is the scope too large? Are we missing a category of debt?
6. **No silent pivots**: If scope turns out larger than expected, report it
   immediately rather than silently upgrading difficulty.
7. **Mark's preferences**: Incremental over monolithic. Tests for new behaviour.
   No build pipeline breakage. Preserve existing user-facing behaviour unless
   the change is the point.

## Local Tooling

This project uses local scripts in `scripts/` (tracked in git) to interact with the
board. See `AGENTS-LOCAL.md` for the script catalog, session startup routine,
and agent commands.
