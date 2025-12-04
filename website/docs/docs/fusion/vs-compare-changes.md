---
title: "Compare changes in local development"
id: "vs-compare-changes"
description: "Compare how code edits will change your data while you develop in locally with the dbt VS Code extension — without waiting on CI."
sidebar_label: "Compare changes"
---

# Compare changes in development <Lifecycle status="beta,managed,managed_plus" />

:::info
Compare changes in local development, powered by <Constant name="fusion_engine" />, is available in beta for the VS Code extension.
:::

The dbt VS Code extension, powered by the <Constant name="fusion_engine"/>, can preview and compare changes to your data caused by your local edits (like added/removed rows and so on) &mdash; directly in your editor and without waiting on CI.




Compare changes in development is [different to Advanced CI compare changes](#how-this-differs-from-advanced-ci) in that it allows you to:
- Check impact early on amd catch changes before you open a PR or run a [CI job](/docs/deploy/ci-jobs) in deployment.
- Compare your current working copy against your `manifest.json` (for example, your last production state) &mdash; directly in your editor. 
- See the changes to the data's primary keys, rows, and columns in the **Compare** tab.

Compare changes in development is available for models only, support for seeds, snapshots, ephemeral models, and Python models is coming soon.

## Prerequisites

- You have a dbt Enterprise or Enterprise+ account.
- You have a developer seat license.
- Installed the [dbt VS Code extension](/docs/install-dbt-extension) and the [<Constant name="fusion_engine" />](/docs/fusion/install-fusion) in your editor.
- Enabled [Advanced CI features](/docs/cloud/account-settings#enabling-advanced-ci-features) in your <Constant name="dbt_platform" /> account.
- Use a <Constant name="fusion" /> supported data platform: BigQuery, Databricks, Redshift, or Snowflake. Support for additional data platforms coming soon.
- If you've configured [automatic deferral](/docs/cloud/about-cloud-develop-defer), you need a successful job run. To use compare changes manually without a successful job run, you can manually copy a `manifest.json` and specify the state directory.

#### How this differs from Advanced CI

This compare changes feature applies to development only. If you're looking to compare changes between your production environment and the pull request’s latest commit, check out [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes).

import CompareChangesTable from '/snippets/_compare-changes-table.md';

<CompareChangesTable />

## Use compare changes

To use compare changes in development, follow these steps:

1. Open a SQL model file in your editor.
2. Make sure to successfully build the model at least once with `dbt build`. This gives dbt a baseline for comparison and allows you to compare your changes against the last successful build of the model. If you don't have a successful build, compare changes won't work effectively.
3. Make some changes to the model, like adding a new column or modifying an existing one (for example, `left_join_customers` to `right_join_customers`).
4. Use the command palette and search for the [**dbt: Compare changes**](vscode://dbtLabsInc/dbt.compareModel) _or_ click the **Compare** tab in the editor toolbar.
5. This runs the comparison and the [**Compare** tab](#compare-tab) displays the changes to the data's primary keys, rows, and columns. Clicking the tabs will display more details about the changes, like specific columns that were added or modified.
6. Once you've compared changes and see the changes in the **Compare** tab, you can then decide to commit your changes or continue editing.

<Lightbox src="/img/docs/extension/vs-compare-changes.gif" width="100%" title="Make changes to a model and see the changes in the Compare tab" />


## Compare tab
The **Compare** tab displays the changes to the data's primary keys, rows, and columns. Clicking the tabs will display more details about the changes, like specific columns that were added or modified.

<Lightbox src="/img/docs/extension/compare-changes-dev-tab.jpg" width="100%" title="Example of the Compare tab" />

- **Overview tab**: High-level summary about the changes to the models, such as the number of primary keys that were added or removed, rows modified, and so on. It will also include the relation between models that were added or modified.
- **Primary keys tab**: Details about the changes to the records.
- **Modified rows tab**: Details about the modified rows.
- **Columns tab**: Details about the changes to the columns.

## How it works

Compare changes in development works by comparing your current working copy against your `manifest.json` (for example, your last production state) — directly in your editor. It uses the same credentials as the CI job, as defined in the CI job’s environment.

  - If you're using <Constant name="dbt_platform" />'s deferral (recommended): Yes. You need at least one successful job run in the environment you are deferring to (usually production). This allows Fusion to auto-download the deferred manifest and use that as your baseline state.
  - If you're manually setting a state directory: No. You can manually point the extension to a manifest.json (for example, copied from another environment) without needing a job run.run.

## FAQs


<Expandable alt_header="Are queries run on behalf of the developer?"> 
  Yes. All comparison queries in development are run using your local development credentials, directly from the dbt VS Code extension. The <Constant name="fusion_engine" /> uses your credentials to execute comparison queries in your warehouse. The results are stored locally by the extension for caching and faster repeated comparisons.
</Expandable>
<Expandable alt_header="Is this using my warehouse credits?"> 
  Yes. Because the comparison runs in your development environment using your dev credentials, it will use your warehouse’s compute.
</Expandable>
<Expandable alt_header="Do I need to run `dbt build` every time I make a change?"> 
  You don’t need to run `dbt build` after every change, but you do need at least one successful build per model to establish the baseline.
  - You need one successful `build` of the model to create a baseline table for comparison.
  - After that, you can edit your model and run **Compare** without rebuilding every time.
  - If your model becomes invalid (for example, errors or breaking schema changes), you’ll need to rebuild to create a new valid baseline before comparing again.
</Expandable>
<Expandable alt_header="Does compare changes work with Python models?"> 
  Not yet, but Python models are expected to work once Fusion support is available because compare changes only relies on the resulting table in the warehouse.
</Expandable>

## Related docs
- [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes)
