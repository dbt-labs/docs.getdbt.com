# Last updated dates: maintenance runbook

`inject-last-updated.js` sets each doc's "last updated on" date. This is the runbook for keeping it working — mainly rotating the token when it expires.

## What it does and why

Docusaurus normally reads last updated dates from git history. Vercel builds with a shallow git clone (~20 commits), so any page older than that boundary got the wrong date. Vercel won't serve deeper history to the build, so we can't fix it with git.

Instead, `scripts/inject-last-updated.js` runs during `prebuild`, fetches each doc's real last-commit date from the GitHub GraphQL API, and writes it into the `last_update` frontmatter field. Docusaurus reads frontmatter over git, so the dates come out right. The edits happen only in the build — nothing is committed.

## The token

The script needs a `GITHUB_TOKEN` env var in the Vercel project (`docs-getdbt-com`), set for **Production** and **Preview**. It only reads public data, so a read-only token is enough:

- Fine-grained token: **Contents → Read** on `dbt-labs/docs.getdbt.com`, or
- Classic token: `public_repo` scope.

Fine-grained tokens expire in up to a year. When it expires, the build does **not** fail — dates just silently fall back to git (wrong again).

## How to tell the token expired

In the Vercel build log, look for:

```
[last-updated] TOKEN REJECTED: GITHUB_TOKEN is missing scope or expired.
```

Or the symptom: doc pages start showing one recent date again instead of their real edit dates.

## How to rotate the token

1. Create a new token in GitHub (`Settings → Developer settings → Personal access tokens`) with the read-only access above. Use a service/bot account if you have one, so it doesn't break when a person leaves.
2. In Vercel → project `docs-getdbt-com` → `Settings → Environment Variables`, edit `GITHUB_TOKEN` and paste the new value. Keep it scoped to Production and Preview.
3. Redeploy (or push any commit).

## How to verify

On the deploy, open a page last edited long ago — for example `/reference/database-permissions/databricks-permissions`. It should show its real older date, not a recent one. You can also confirm `[last-updated] stamped N/… docs` appears in the build log.
