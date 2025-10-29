---
title: "Compare changes in development"
id: "vs-compare-changes"
description: "See how code edits will change your data while you develop in VS Code—without waiting on CI."
sidebar_label: "Compare changes"
---

# Compare changes in development <Lifecycle status="beta"/>

:::info
Compare changes in development, powered by <Constant name="fusion_engine" />, is available in beta for the VS Code extension.
:::

The dbt VS Code extension, powered by the <Constant name="fusion_engine"/>, can compare changes you make during development by comparing your current working copy against your `manifest.json` (for example, your last production state) — directly in your editor. 

Compare changes in development allows you to:
- Check impact early on, before even opening a PR or running a [CI job](/docs/deploy/ci-jobs) in deployment.
- Preview data changes caused by your local edits (like added/removed rows, column changes, primary-key changes, and so on).
- Use it alongside other [dbt VS Code extension features](/docs/dbt-extension-features), like live CTE previews.
- How does it complement state aware?

## Prerequisites

- You have a dbt Enterprise or Enterprise+ account.
- Use a supported developer editor: VS Code or Cursor connected to a dbt project.
- Installed the [dbt VS Code extension](/docs/install-dbt-extension) and [<Constant name="fusion" />](/docs/fusion/install-fusion).
- Enabled Advanced CI features in the dbt platform. guessing here and to be confirmed
- Use a supported data platform: BigQuery, Databricks, Redshift, or Snowflake. Support for additional data platforms coming soon. do we want to say this
- If you've configured [automatic deferral](/docs/cloud/about-cloud-develop-defer), you need a successful job run. To use compare changes manually without a successful job run, you can manually copy a `manifest.json` and specify the state directory.
  
#### How this differs from Advanced CI
:::info Related (CI pipelines)
This compare changes feature applies to development only. If you're looking to compare changes between your production environment and the pull request’s latest commit, check out [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes).
:::

import CompareChangesTable from '/snippets/_compare-changes-table.md';

<CompareChangesTable />

## Compare changes in development

To use compare changes in development, follow these steps:

1. In your editor (this could be VS Code or Cursor), open a SQL model file. 
2. Make some changes to the model, like adding a new column or modifying an existing one like `left_join_customers` to `right_join_customers`.
3. Use the command palette and search for the [**dbt: Compare changes**](vscode://dbtLabsInc/dbt.compareModel) _or_ click the **Compare** tab in the editor toolbar.
4. This runs the comparison and the **Compare** tab will display the changes to the data's primary keys, rows, and columns. Clicking the tabs will display more details about the changes, like specific columns that were added or modified.
   - **Overview tab**: High-level summary about the changes to the models, such as the number of primary keys that were added or removed, rows modified, and so on. It will also include the relation between models that were added or modified.
   - **Primary keys tab**: Details about the changes to the records.
   - **Modified rows tab**: Details about the modified rows.
   - **Columns tab**: Details about the changes to the columns.
4. Once you've compared changes, you can see the changes in the **Compare** tab, you can then decide to commit your changes or continue editing.

<Lightbox src="/img/docs/extension/vs-compare-changes.gif" width="100%" title="Example of the Compare tab" />

## How it works

Fill in the blanks here.

## Related docs
- [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes)
