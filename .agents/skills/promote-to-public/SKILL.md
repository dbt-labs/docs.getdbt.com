---
name: promote-to-public
description: |
  Use this skill to promote a branch from docs-internal (private repo) to docs.getdbt.com (public repo) and open a PR. Triggers when the user says things like "promote my branch to public", "push to public repo", "make my private docs public", "open a PR on the public repo", or "promote to docs.getdbt.com". Always use this skill for any request to move work from docs-internal to the public docs repo.
---

# Promote to public skill

This skill promotes your current branch from `dbt-labs/docs-internal` to `dbt-labs/docs.getdbt.com` and opens a pull request. You'll be asked whether to carry commit history or squash everything into a single clean commit.

---

## Step 1: Verify prerequisites

Before doing anything, check:

1. Run `git status` — the working tree must be clean (no uncommitted changes). If it isn't, tell the user to commit or stash before proceeding.
2. Run `git remote -v` — confirm both remotes exist:
   - `origin` → `https://github.com/dbt-labs/docs.getdbt.com.git`
   - `private_docs` → `https://github.com/dbt-labs/docs-internal.git`

   If `origin` points to `docs-internal`, tell the user to fix it:
   ```bash
   git remote set-url origin https://github.com/dbt-labs/docs.getdbt.com.git
   ```

   If the `private_docs` remote is missing, tell the user to add it (one-time setup):
   ```bash
   git remote add private_docs https://github.com/dbt-labs/docs-internal.git
   ```

3. Capture the current branch name: `git branch --show-current`. This is `PRIVATE_BRANCH`.

---

## Step 2: Ask about commit history

Ask the user:

> Do you want the public PR to include your full commit history, or a single clean commit (no history)?
>
> - **Single clean commit** (recommended) — squashes everything into one commit. Keeps the public history tidy.
> - **Full commit history** — preserves every commit from your private branch.

Wait for the user's answer before continuing.

---

## Step 3: Placeholder reference

Before running any commands, substitute the placeholders below with real branch names. Never pass the literal strings to git.

| Placeholder | Replace with |
|-------------|--------------|
| `PRIVATE_BRANCH` | The actual branch name captured in Step 1 (for example, `st-release-notes-2026-06-24`) |
| `PUBLIC_BRANCH` | A new branch name for `docs.getdbt.com` — must differ from `PRIVATE_BRANCH` (for example, `st-release-notes-2026-06-24-public`) |

---

## Step 3a: Promote with no commit history (single clean commit)

Use this path when the user chose "single clean commit."

Suggest a public branch name that's different from the private branch — for example, append `-public` or use a fresh descriptive name. Ask the user to confirm or provide one. Call it `PUBLIC_BRANCH`.

Run these commands in order:

```bash
# 1. Fetch the latest from both remotes
git fetch origin
git fetch private_docs

# 2. Create a new branch from origin/current
git checkout -b PUBLIC_BRANCH origin/current

# 3. Apply the diff from the private branch (files only — no history)
git diff origin/current...private_docs/PRIVATE_BRANCH | git apply

# 4. Stage and commit
git add -A
git commit -m "<commit message>"

# 5. Push to origin (public repo)
git push origin PUBLIC_BRANCH
```

For the commit message, ask the user what they'd like it to say, or suggest a short description of the change.

> **Important:** Step 3 applies only the diff between `origin/current` and the private branch. It does NOT use `-- .` (which would overwrite everything). If `git apply` fails, show the user the error and suggest they run:
> ```bash
> git fetch private_docs
> git reset --hard origin/current
> git diff origin/current...private_docs/PRIVATE_BRANCH | git apply
> git add -A
> git commit -m "<commit message>"
> git push origin PUBLIC_BRANCH --force
> ```

---

## Step 3b: Promote with full commit history

Use this path when the user chose "full commit history."

Run these commands in order:

```bash
# 1. Fetch latest from both remotes
git fetch origin
git fetch private_docs

# 2. Check out the private branch locally (if not already on it)
git checkout PRIVATE_BRANCH

# 3. Merge origin/current to make sure you're up to date
git merge origin/current

# 4. Push to origin (public repo)
git push origin PRIVATE_BRANCH
```

The public branch name will be the same as `PRIVATE_BRANCH`.

---

## Step 4: Open a pull request

After pushing, open a PR on the public repo. Try `gh` first; fall back to a compare URL if it's not available.

**With `gh`:**
```bash
gh pr create \
  --repo dbt-labs/docs.getdbt.com \
  --base current \
  --head PUBLIC_BRANCH \
  --title "<PR title>" \
  --draft \
  --body "<brief description of the change>"
```

Ask the user for a PR title and description if they haven't provided one. Keep the title sentence-case and action-oriented.

**Without `gh` (fallback):** Print this URL for the user to open in their browser:
```
https://github.com/dbt-labs/docs.getdbt.com/compare/current...PUBLIC_BRANCH
```

---

## Step 5: Clean up docs-internal

Remind the user to close (not merge) their private branch PR in `docs-internal` once the public PR is merged:

> Once your public PR merges, go back to your `docs-internal` PR, add a comment with a link to the public PR, and click **Close with comment**. Don't merge it — the `current` branch in `docs-internal` stays in sync automatically.

---

## Error handling

| Problem | What to do |
|---------|------------|
| `git apply` fails | Show the error; suggest the `--force` recovery commands from Step 3a |
| Remote not found | Walk the user through the one-time remote setup |
| Merge conflict during `git merge origin/current` | Tell the user to resolve conflicts, then re-run from Step 3b step 3 |
| `gh` not installed | Fall back to the compare URL |
| Push rejected | Check if the branch already exists on `origin`; suggest `--force` only if the user confirms it's their own branch |
