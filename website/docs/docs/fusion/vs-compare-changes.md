---
title: "Compare changes in development"
id: "vscode-compare-changes"
description: "See how code edits will change your data while you develop in VS Code—without waiting on CI."
sidebar_label: "Compare changes (dev)"
---

# Compare changes in development <Lifecycle status="beta"/>

:::info
Compare changes in development, powered by <Constant name="fusion_engine" />, is available in beta for VS Code and Cursor.
:::

The dbt VS Code extension can compare changes you make during development by producing your current working copy against your manifest.json (for example, your last production state) — directly in your editor. This helps you check impact early on, before even opening a PR (or running CI in deployment).

Compare changes in development allows you to:

- Preview data changes caused by your local edits (like added/removed rows, column changes, primary-key changes, and so on).
- Use it alongside other <Constant name="fusion" /> features like live CTE previews.
- How does it complement state aware?

:::info Related (CI pipelines)
This compare changes feature applies to development only. If you're looking for differences between your production environment and the pull request’s latest commit, check out [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes).
:::

## Prerequisites

- You have a dbt Enterprise or Enterprise+ account.
- You have Advanced CI features enabled in the dbt platform. to be confirmed
- You use a supported data platform: BigQuery, Databricks, Redshift, or Snowflake. Support for additional data platforms coming soon. <- do we want to say this ->
- Use VS Code or Cursor as your editor. (should we say ide coming soon?)
- Have the VS Code extension installed and connected to your project.
- A successful job run??
  - the project’s last successful production state
  
## How this differs from Advanced CI

| Aspect | In development <small>VS Code or Cursor</small> | In Advanced CI (deployment) |
|---|---|---|
| Trigger | On-demand in editor | PR open/update and CI job |
| Scope | Your working copy and local target | Branch head versus prod state in CI |
| Output location | Compare panel in VS Code/Cursor (no PR comment) | Deployment job cpmpare tab and PR comment |
| Data caching | Editor-side | dbt platform caches limited samples (see below) |
| Governance | Local development credentials | Podcution credentials |

## How to compare

1. Open a SQL model file. 
2. Use the command palette and search for the **dbt: Compare changes)** _or_ click the **Compare** tab in the editor toolbar.
3. The **Compare** tab shows the changes to the data's primary keys, rows, and columns in the Compare tab:
	- Overview tab — High-level summary about the changes to the models, such as the number of primary keys that were added or removed, rows modified, and so on.
	- Primary keys tab — Details about the changes to the records.
	- Modified rows tab — Details about the modified rows.
	- Columns tab — Details about the changes to the columns.

-- need to flesh out and add more screenshots




## Related docs

- [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes)

