# Workflow Transition Plan: Removing the `dev` Branch

## Objective

Eliminate the `dev` integration branch. All pull requests merge directly to `main`, which triggers Netlify production deploys. The `main` branch must be protected while allowing the repository owner to bypass restrictions when necessary.

## Critical Constraints

- **Zero downtime.** A choir is using the production site until 9 May. No change may destabilise `main` or interrupt the Netlify deploy.
- **Andrew's contributions require review; Mark's do not necessarily.** The branch protection model must accommodate this asymmetry.
- **e2e tests must not block rapid fixes.** The full Playwright suite is too slow to act as a hard gate on every PR.

## e2e Scheduling Strategy

GitHub Actions supports a `schedule` trigger using cron syntax. Instead of requiring Playwright e2e tests to pass before every PR merges, the proposal is:

- **PR gate:** Require only the fast `test` job (format, lint, tsc, build, Vitest unit tests).
- **Scheduled gate:** Run the full e2e suite nightly against `main` via a cron schedule.

Example configuration:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 02:00 UTC daily
  workflow_dispatch:      # allow manual trigger
```

If the scheduled run fails, GitHub sends a notification and the run log is retained. This catches regressions within 24 hours without adding friction to the PR workflow. The existing `e2e` job can be moved to a separate `nightly.yml` workflow, or the `CI.yml` can be split into two workflows: `ci.yml` (PR gate) and `e2e.yml` (scheduled + manual).

## Access Control Strategy

GitHub's legacy branch protection applies uniformly to all users with write access. To enforce PRs for Andrew while allowing Mark to push or merge directly:

- **Use GitHub Rulesets** (not legacy branch protection). Rulesets support a **bypass list**.
- Add Mark as a bypass actor on the ruleset for `main`. This allows him to push directly or merge without a PR when he chooses.
- Andrew, as a regular collaborator, is subject to the ruleset: he must open a PR, and the required status checks must pass.

Recommended ruleset for `main`:

| Rule | Setting |
|------|---------|
| Target branch | `main` |
| Require pull request | Yes |
| Require status checks | `test` (format, lint, tsc, build, Vitest) |
| Up-to-date before merging | Yes |
| Bypass list | Mark (repository admin) |

Mark retains the option to open PRs for his own work (which aligns with board tracking) but is not forced to.

## Kanban Board Changes

Current columns: Todo, In Progress, Ready for Dev, Ready for Main, Done.

Proposed columns after removing `dev`:

| Column | Purpose |
|--------|---------|
| **Todo** | Assessed and specified, awaiting development. |
| **In Progress** | Coding started, branch created. |
| **Review** | PR opened against `main`, awaiting review or merge. |
| **Done** | Merged to `main`; deployed or deploy pending. |

"Ready for Dev" and "Ready for Main" are removed. Items currently in those columns move to **Review** or **Done** depending on merge state.

## Pre-Transition State

- Default branch: `dev`
- `dev` ahead of `main` by 12 commits
- 5 open PRs target `dev`
- No branch protection or rulesets on either branch
- CI runs `test` and `e2e` on push/PR to `dev` and `main`
- Netlify deploys from `main` on every merge

## Execution Plan

### Prerequisite (Mark handles this)

1. **Resolve the 5 open PRs targeting `dev`.** Merge them into `dev` or close them. Do not begin the transition until the PR queue is empty.

### Phase 1: Safety Preparation (can begin immediately, low risk)

2. **Verify CI reliability.** Run the full suite locally on `dev` to confirm green:
   ```bash
   npm ci && npm run build && npx vitest run && npx playwright test
   ```
3. **Split the CI workflow.**
   - Create `.github/workflows/ci.yml` triggered on `pull_request` and `push` to `main`, running only the `test` job.
   - Create `.github/workflows/e2e.yml` triggered on `schedule` (nightly cron) and `workflow_dispatch`, running the `e2e` job.
   - Commit this to `dev` first so it is included in the final merge.
4. **Draft the ruleset for `main` in GitHub** but do **not** enable it yet. Verify the bypass list includes Mark.

### Phase 2: Merge `dev` to `main` (coordinate for safety)

5. **Open a PR from `dev` to `main`.** This carries all 12 commits plus the CI split. Verify that:
   - The `test` job passes.
   - Netlify builds a deploy preview (if enabled) or at least confirms the build succeeds.
6. **Schedule the merge for a low-traffic window** (e.g., early morning) when the choir is unlikely to be rehearsing.
7. **Merge the PR.** Use a merge commit to preserve history.
8. **Monitor Netlify.** Confirm the production deploy succeeds and the site loads.
9. **Enable the `main` ruleset** immediately after the merge is verified.

### Phase 3: Switch Defaults (after merge is stable)

10. **Change the default branch to `main`** in GitHub repository settings.
11. **Update Dependabot.** Add `target-branch: "main"` explicitly to `.github/dependabot.yml`.
12. **Update documentation:**
    - `doc/CONTRIBUTING.md`: remove all `dev` branch references; update branching instructions; update board schema.
    - `AGENTS.md`: verify no stale branch references.
13. **Delete the remote `dev` branch.**
    ```bash
    git push origin --delete dev
    ```
14. **Clean up local branches.**
    ```bash
    git checkout main && git branch -d dev && git remote prune origin
    ```

### Phase 4: Board Migration (after branch deletion)

15. **Reconfigure the GitHub Project board.**
    - Delete "Ready for Dev" and "Ready for Main".
    - Add "Review" between "In Progress" and "Done".
    - Migrate open items to the correct new column.

### Phase 5: Verification (after transition)

16. **Test the new workflow.** Mark opens a trivial PR (or pushes directly via bypass) to confirm the ruleset behaves as expected. Andrew opens a test PR to confirm he is blocked until checks pass.

## Rollback Plan

If the `dev -> main` merge breaks production:

1. **Revert the merge commit on `main`:**
   ```bash
   git revert -m 1 <merge-commit-hash>
   git push origin main
   ```
2. **Netlify will auto-deploy the revert.** Monitor the deploy log.
3. **If the ruleset blocks the revert push**, Mark uses his bypass privilege.
4. **Recreate `dev` from the pre-merge state** if necessary:
   ```bash
   git branch dev <last-good-commit-on-dev>
   git push origin dev
   ```

## Decision Log

| Decision | Rationale |
|----------|-----------|
| e2e tests moved to nightly schedule | Avoids slow gate on PRs; catches regressions within 24 hours. |
| Rulesets with bypass list instead of legacy branch protection | Allows Mark direct-push flexibility while enforcing PR discipline for Andrew. |
| Merge `dev` to `main` in one PR | Preserves history; simpler than cherry-picking 12 commits. |
| Enable ruleset only after merge is verified | Prevents the ruleset from interfering with the merge itself if something goes wrong. |
| Default branch switch deferred until after merge | Avoids open PRs defaulting to `main` before the branch is ready. |

## Post-May-9 Follow-Up

After 9 May, consider:

- Enabling Netlify deploy previews for PRs so UI changes can be inspected before merge.
- Adding a `CODEOWNERS` file to automatically request Mark's review on Andrew's PRs.
- Reviewing whether the nightly e2e schedule is sufficient or if it should run on every PR after all.
