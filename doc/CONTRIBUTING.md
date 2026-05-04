# Contributing to Spem Player

## Getting Started

See `doc/BUILD.md` for development setup, prerequisites, and build commands.

## Workflow

The project uses a GitHub Project board as the canonical register of work.
See the board at `https://github.com/users/wainwmr/projects/2`.

### Board Schema

Mark's kanban workflow with explicit entry and exit criteria:

- **Todo**
  - Entry: New TODO/BUG/HACK reported
  - Exit: Type, Area, Difficulty defined; description is clear enough to act on

- **Specified**
  - Entry: Assessed; recommended fix exists or reproduction/test plan defined
  - Exit: Developer pulls it

- **In Progress**
  - Entry: Coding started, branch created
  - Exit: Code complete, tests pass, code in `dev` branch

- **Ready for Main**
  - Entry: Committed to `dev`; awaiting final check before main merge
  - Exit: Merged to `main`

- **Done**
  - Entry: On `main`; running in production
  - Exit: —

`dev` is the integration branch. `main` is production.

#### Type

- `bug` — defect
- `todo` — planned improvement
- `hack` — workaround or temporary fix
- `build` — build/pipeline issue

#### Area

- `UI` — user interface
- `Score` — sheet music display
- `Canvas` — overview canvas
- `Lily` — LilyPond/grammar
- `Config` — configuration and constants
- `Test` — test suite
- `Tooling` — build scripts and tooling
- `Controls` — playback controls
- `Other` — uncategorised

#### Difficulty

- `XS` — trivial
- `S` — small
- `M` — medium
- `L` — large

### Branching

- `main` — production branch.
- `dev` — integration branch.
- Feature branches are created from `upstream/dev` (fork contributors) or from `dev` (direct collaborators).

Pull requests from forks target `upstream/dev`.

### Ticket Lifecycle

1. **Create**: A new ticket is created as a GitHub issue and added to the board
   with Status **Todo**.
2. **Assess**: Set Type, Area, and Difficulty. Write a clear
   Description. Ticket remains in **Todo** until assessment is complete.
3. **Specify**: Write Recommended fix, Test plan, and Dependencies. Move Status
   to **Specified**.
4. **Assign** (optional): The ticket can be assigned to a developer.
5. **Develop**: The developer claims or is assigned the ticket, moves Status
   to **In Progress**, implements the fix on a feature branch, runs tests, and
   opens a PR against `dev`.
6. **Integrate**: When code is complete and tests pass, commits are merged to
   `dev`. Status moves to **Ready for Main**.
7. **Release**: Mark merges `dev` to `main`. Status moves to **Done**.

If a ticket is blocked by a question for Mark, add a `question` label and
@mention him, but leave Status as **Todo** until the question is resolved.

### Ticket Format

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

## Code Style

- TypeScript strict mode.
- Meaningful variable and function names.
- JSDoc comments for public APIs.
- Keep functions focused and single-purpose.
- Explicit types where helpful.
- Prefer interfaces over types for object shapes.
- Use `const` for immutable values.
- Use `let` only when reassignment is needed.
- Avoid `any`; use `unknown` if necessary.

## Lint and Type Checking

The CI pipeline runs `npm run lint` and `npx tsc --noEmit`. Pull requests must pass both.

The project uses an ESLint flat config (`eslint.config.js`) with `typescript-eslint`. Some rules are relaxed because the codebase predates them (for example, `no-var` and `@typescript-eslint/no-explicit-any` are currently off). Follow the existing patterns in the file you are editing rather than refactoring legacy code to meet stricter rules.

The project uses **Prettier** for automatic formatting. Run `npm run format` before committing, or configure your editor to format on save. The CI pipeline runs `npm run format:check` as part of the build gate.

## Component Conventions

All UI components are native custom elements extending `MusicElement`.

When creating or modifying a component:

1. Extend `MusicElement`.
2. Define `observedAttributes` static property.
3. Implement `attributeChangedCallback` for reactive updates.
4. Use `fireEvent()` to communicate state changes.
5. Register the element via a static `define(tag)` method.

## Writing Tests

Unit and integration tests use Vitest 3 with the jsdom environment. End-to-end
tests use Playwright in a real Chromium browser. See `doc/TESTING.md` for
commands and configuration.

### Testing Internal Functions

Modules export an `exportedForTesting` object containing functions and state
that are not part of the public API but require unit testing. For example,
`lily.ts` exports `setupLilypondParser`, `romanise`, and parser state via this
object.

### Custom Elements in Tests

The application defines custom HTML elements (`music-canvas`, `music-score`,
`music-controls`, etc.). Tests that instantiate these elements must ensure they
are defined in the jsdom document before assertions run. The `define(tag)`
static method on each class handles registration.

## Pull Request Process

1. Create a feature branch from `upstream/dev`.
2. Make your changes, add tests, and update documentation.
3. Ensure tests pass:

   ```console
   npm run test
   npm run test:e2e
   ```

4. Check formatting, lint, and type errors:

   ```console
   npm run format:check
   npm run lint
   npx tsc --noEmit
   ```

5. Commit with a clear message referencing the issue number.
6. Push to your fork.
7. Open a PR to `upstream/dev`.
8. Include `Fixes #NNN` in the description only if the PR fully resolves the issue.

## Commit Messages

Use conventional commit format where possible:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `test:` — tests
- `refactor:` — code restructuring
- `build:` — build system or tooling

## Best Practices

- Incremental changes over monolithic refactors.
- Tests for new behaviour.
- Do not break the build pipeline.
- Preserve existing user-facing behaviour unless the change is the point.
- Run diagnostics after file writes and fix errors before proceeding.
- Scratch files go in `temp/` and should be deleted before the session ends.
- Report scope creep immediately rather than silently upgrading difficulty.

## Questions

Open an issue for discussion or refer to `AGENTS.md` for project conventions.
