# Releasing docs

There are two long-lived branches of this repo:
  - `current` is the version of dbt released at [docs.getdbt.com](docs.getdbt.com)
  - `next` reflects the next version of dbt to be releases. It is accessible at [docs-next.getdbt.com](docs-next.getdbt.com), and a warning banner is displayed on the site.

- Any fixes or revisions to existing docs should be merged into `current`
- Any pre-release docs should be merged into `next`
- The `next` branch should be rebased from `current` somewhat regularly

When new versions of dbt are released:
1. Rebase `next` on top of `current`. The workflow might look something like this:
```
(current) $ git fetch
(current) $ git pull
(current) $ git checkout next
(next) $ git pull
(next) $ git rebase current -i
```
2. Make a PR from `next` onto `current`
3. Merge the PR once the deploy preview builds successfully
