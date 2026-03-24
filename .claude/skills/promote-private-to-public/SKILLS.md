# Skill: promote-to-public

## When to use this skill

Trigger this skill when the user says anything like:
- "promote my branch to public"
- "push my private branch to docs.getdbt.com"
- "open a public PR for my internal branch"
- "promote [branch-name] to public"

## What this skill does

This skill helps you take work done in this repo (docs-internal) and create a pull request on the [public docs.getdbt.com repo](https://github.com/dbt-labs/docs.getdbt.com). It runs the `promote-private-to-public/promote-private-to-public.sh` script interactively.

## Prerequisites

Your local clone must have two git remotes configured:
- `origin` → the private docs-internal repo
- `private_docs` → also configured, but the script uses `origin` as PUBLIC and requires both. Check your setup.

Actually: the script defaults are:
- `PUBLIC_REMOTE=origin` (docs.getdbt.com)
- `PRIVATE_REMOTE=private_docs` (docs-internal)

If the user's remotes are named differently, they can set environment variables:
```bash
PUBLIC_REMOTE=upstream PRIVATE_REMOTE=origin ./scripts/promote-private-to-public.sh
```

## Steps

1. **Confirm readiness**: Check that the user's working tree is clean (no uncommitted changes). If not, ask them to commit or stash first.

2. **Run the script**: Tell the user to run from the repo root:
   ```bash
   ./scripts/promote-private-to-public.sh
   ```
   The script is fully interactive — it will prompt for everything.

3. **Walk them through the prompts**:
   - **Option 1 (recommended)**: Single clean commit — squashes all private commits into one public commit. Use this for most cases.
   - **Option 2**: Keep full commit history — preserves all commits. Use when reviewers need to see the full history.
   - Private branch name (defaults to current branch)
   - Public branch name (defaults to `public-<private-branch>`)
   - Commit message (Option 1 only)

4. **After the script**: The script will print (and offer to open) the GitHub PR link. Remind the user to:
   - Set base branch to `current` on the PR
   - Fill in the PR description and request review
   - After the public PR is merged: go back to the docs-internal PR, add a comment linking to the public PR, and click **Close** (do not merge it)

## If something goes wrong

- **"Working tree has uncommitted changes"** — commit or stash, then rerun
- **"No differences found"** — the private branch may already be in sync with `origin/current`; double-check the branch name
- **Merge conflicts (Option 2)** — resolve conflicts, `git add`, `git commit`, then `git push -u origin YOUR_BRANCH` manually
- **Remote not configured** — run `git remote -v` to check; add the missing remote with `git remote add <name> <url>`
