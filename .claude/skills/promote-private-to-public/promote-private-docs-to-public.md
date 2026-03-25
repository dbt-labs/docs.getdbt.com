# Promoting private docs to the public repo

Use this when you have been working in [docs-internal](https://github.com/dbt-labs/docs-internal) and are ready to open a pull request on [docs.getdbt.com](https://github.com/dbt-labs/docs.getdbt.com). Refer to the [internal process docs](https://www.notion.so/dbtlabs/Private-docs-docs-internal-and-repo-sync-d5a2feded09045caa0d0d8ed8c3b95e7)

**Prerequisites (one-time setup):** your local clone must have **both remotes** (public docs + docs-internal). Names vary (`origin` + `public`, or `private_docs` + `origin`, and so on)—check `git remote -v`. See the internal onboarding guide. **GitHub CLI (`gh`) is optional:** the script uses it to open a **draft PR** after push when available; if you do not have `gh`, the script still finishes and prints a **compare URL** so you can create the PR in the browser.

---

## How to promote

From the repo root, run:

```bash
.claude/skills/promote-private-to-public/promote-private-to-public.sh
```

Set `PUBLIC_REMOTE` and `PRIVATE_REMOTE` if your remotes do not match the script defaults (`origin` = public, `private_docs` = private). The script prompts for everything else—no flags to memorise.

### What it asks

```text
  Promote docs-internal → docs.getdbt.com
  ─────────────────────────────────────────
  Current branch: my-feature-branch

  Promote type:
    1. Single clean commit  (recommended — no private history)
    2. Keep full commit history

  Choice [1]:

  Private branch (your docs-internal branch) [my-feature-branch]:
  Public branch name [public-my-feature-branch]:
  Commit message: Describe what changed
```

At the end it either creates a **draft PR** with `gh` or prints the **compare URL** (and may offer to open it in the browser on macOS / many Linux setups).

### Which option to choose

| | Option 1 — Single commit | Option 2 — Keep history |
| --- | --- | --- |
| **Use when** | Most cases (release notes, content updates) | You need reviewers to see the individual commits |
| **What happens** | All your changes land as one commit on a new public branch | Your full commit history is carried over |

---

## After the script runs

1. If you got a **draft PR** from `gh`, edit the description and request review when ready; if you got a **compare URL**, open it, set base branch to **`current`**, create the PR (use **Draft** if you like), then do the same.
2. Once merged, return to the docs-internal PR, add a comment linking to the public PR, and click **Close** (do not merge it).

---

## Troubleshooting

**"Working tree has uncommitted changes"** — commit or stash your work, then rerun.

**"No differences found"** — your private branch may already be in sync with `origin/current`. Double-check you're on the right branch.

**Merge conflicts (option 2)** — the script will tell you which files conflict. Resolve them, `git add` the resolved files, `git commit`, then run `git push -u origin YOUR_BRANCH` manually.
