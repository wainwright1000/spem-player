# Contributing to Spem Player

## Getting Started

See `BUILD.md` for development setup, prerequisites, and build commands.

## Workflow

The project uses a GitHub Project board as the canonical register of work. See `WORKFLOW.md` for the full schema and lifecycle.

### Board Statuses

- **Todo** — new item. Exit when Type, Area, and Difficulty are defined and the Description is clear enough to act on.
- **Specified** — assessed; recommended fix or test plan exists. Exit when a developer claims it.
- **In Progress** — coding started, branch created. Exit when code is complete, tests pass, and work is committed to `dev`.
- **Ready for Main** — committed to `dev`; awaiting final check. Exit when merged to `main`.
- **Done** — on `main`; running in production.

### Branching

- `main` — production branch.
- `dev` — integration branch.
- Feature branches are created from `upstream/dev`.

Pull requests from this fork target `upstream/dev`.

### Ticket Lifecycle

1. Create a GitHub issue and add it to the board with Status **Todo**.
2. Assess: set Type, Area, and Difficulty. Write a clear Description.
3. Specify: write Recommended fix, Test plan, and Dependencies. Move to **Specified**.
4. Develop: claim the ticket, create a feature branch, implement, and test.
5. Open a PR against `upstream/dev`. Move Status to **In Progress**.
6. When merged to `dev`, move to **Ready for Main**.
7. When `dev` is merged to `main`, move to **Done**.

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

## Pull Request Process

1. Create a feature branch from `main`.
2. Make your changes, add tests, and update documentation.
3. Ensure tests pass: `npm test`.
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

## Testing

See `TESTING.md` for test framework details, running tests, and coverage.

## Best Practices

- Incremental changes over monolithic refactors.
- Tests for new behaviour.
- Do not break the build pipeline.
- Preserve existing user-facing behaviour unless the change is the point.
- Run diagnostics after file writes and fix errors before proceeding.
- Scratch files go in `temp/` and should be deleted before the session ends.
- Report scope creep immediately rather than silently upgrading difficulty.

## Questions

Open an issue for discussion or refer to `AGENTS.md` and `AGENTS-LOCAL.md` for project conventions.
