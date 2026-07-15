---
title: "Compare changes locally with your dbt platform account"
id: "vs-compare-changes"
description: "Compare how code edits will change your data while you develop your dbt platform project locally with the dbt VS Code extension."
sidebar_label: "Compare changes"
image: /img/docs/extension/vs-compare-changes-tab.png
---

# Compare changes during development <Lifecycle status="beta" />

:::info
This feature is in beta. All dbt VS Code extension users can use compare changes during the 14-day trial. After the trial, [sign in or register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using it.
:::

The dbt VS Code extension previews and compares how your local edits affect your data in your <Constant name="dbt_platform"/> account &mdash;  including added/removed rows and join verification &mdash;  without waiting on CI.

Use compare changes to check impact early and validate changes before you open a PR or run a [CI job](/docs/deploy/ci-jobs):
- Validate outputs are correct when refactoring logic, adding or removing columns, or implementing join modifications. 
- It compares your current working copy against your `manifest.json` (for example, your last production state) and shows changes to primary keys, rows, and columns in the **Compare** tab. 

The dbt VS Code extension's compare changes feature is different from the [Advanced CI compare changes feature](#how-this-differs-from-advanced-ci), which runs at the PR stage in deployment rather than locally during development.

:::info
Compare changes in development is available for models only. Support for seeds, snapshots, ephemeral models, and Python models is coming soon.
:::

<Lightbox src="/img/docs/extension/vs-compare-changes.png" width="100%" title="Make changes to a model and see the changes in the Compare tab" />

## Prerequisites

To use the dbt VS Code extension compare changes feature, you need:

- A <Constant name="fusion" /> [supported data platform](/docs/fusion/supported-features?version=2.0#requirements) (BigQuery, Databricks, Redshift, or Snowflake)
- The [dbt VS Code extension](/docs/install-dbt-extension) installed with a self-hosted installation of the [<Constant name="fusion_engine" />](/docs/fusion/get-started-fusion)
- A baseline state to compare your changes against &mdash; refer to [How it works](#how-it-works) to choose between [automatic deferral](/docs/platform/about-defer) or [`manifest.json`](/reference/artifacts/manifest-json?version=2.0) manual setup.

**Sign-in and authentication**

Compare changes is available to all dbt VS Code extension users during the 14-day trial. After the trial:

- **If you use <Constant name="dbt_platform" /> deferral (recommended):** [Sign in or register](/docs/sign-in-dbt-extension) for a free <Constant name="dbt_platform" /> account. You'll also need a [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file in your local `.dbt` directory (`~/.dbt/dbt_cloud.yml` on macOS/Linux) so the extension can fetch the deferred manifest from your environment.
- **If you set the baseline manually with a `manifest.json`:** No <Constant name="dbt_platform" /> account is required. Point the extension at a local `manifest.json` and compare changes runs against it.

## How it works

Compare changes in development works by comparing two materialized models in your warehouse. Specifically, it compares the model built in your dev schema (determined by your active profile) against the model referenced in your `manifest.json` (for example, your last production state). Both sides of the comparison are always warehouse tables; it does not compare SQL file contents.

The path you choose determines whether you need a <Constant name="dbt_platform" /> account:

  - **<Constant name="dbt_platform" /> deferral (recommended):** Requires a <Constant name="dbt_platform" /> account and at least one successful job run in the environment you're deferring to (usually staging or production). <Constant name="fusion" /> auto-downloads the deferred manifest and uses it as your baseline state.
  - **Manual `state` directory:** Point the extension at a local `manifest.json` (for example, copied from another environment). No <Constant name="dbt_platform" /> account is required; no job run is required. <br />

## Use compare changes

To use compare changes in development, follow these steps:

1. Open a SQL model file in your editor.
2. Make some changes to the model, like adding a new column or modifying an existing one (for example, `left_join_customers` to `right_join_customers`).
3. Run compare changes in the [VS Code interface](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette):
   - Command palette: Open the VS Code command palette (Shift + Command + P (Mac) / Ctrl + Shift + P (Windows/Linux)) and search for the [**dbt: Compare changes**](vscode://dbtLabsInc/dbt.compareModel) 
   - Bottom panel: Click the **Compare** tab and then click the **Compare** button.
  
    <Lightbox src="/img/docs/extension/vs-compare-changes-options.png" width="90%" title="Compare changes in development" />
4. Once you click the **Compare** button, the extension will execute a `dbt build` command to build the model you're working on and then runs the comparison. The [**Compare** tab](#compare-tab) displays the changes to the data's primary keys, rows, and columns. Clicking the tabs will display more details about the changes, like specific columns that were added or modified.
5. Once you've compared changes and see the changes in the **Compare** tab, you can then decide to commit your changes or continue editing.

## Compare tab results
The **Compare** tab displays the changes to the data's primary keys, rows, and columns. Clicking the tabs will display more details about the changes, like specific columns that were added or modified.

<Lightbox src="/img/docs/extension/vs-compare-changes-tab.png" width="100%" title="Example of the Compare tab" />

- **Overview tab**: High-level summary about the changes to the models, such as the number of primary keys that were added or removed, rows modified, and so on. It will also include the relation between models that were added or modified.
- **Primary keys tab**: Details about the changes to the records.
- **Modified rows tab**: Details about the modified rows.
- **Columns tab**: Details about the changes to the columns.

## FAQs

<Expandable alt_header="Are queries run on behalf of the developer?"> 

  Yes. All comparison queries in development run using your development credentials or platform-based user credentials, directly from the dbt VS Code extension. If you authenticated with a [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file, these are the credentials configured in your **Account settings**; otherwise it uses the credentials from your active dbt profile. The <Constant name="fusion_engine" /> uses your credentials to execute comparison queries in your warehouse. The results are stored in memory, so that we can keep them populated into the Compare tab for that file until you re-run.
</Expandable>
<Expandable alt_header="Is this using my warehouse credits?"> 
  Yes. Because the comparison runs in your development environment using your dev credentials, it will use your warehouse’s compute.
</Expandable>
<Expandable alt_header="Do I need to run dbt build every time I make a change?">

  No. When you click **Compare**, the extension builds the model into your development schema automatically, so you don’t need to run `dbt build` yourself. It then compares that development build against the version in your deferred environment (usually staging or production).

  If the model hasn’t been built yet in your deferred environment, the comparison can’t run. For more details, see [Defer to production](/docs/platform/about-defer).

</Expandable>


<Expandable alt_header="How is this different from Advanced CI compare changes?">

The dbt VS Code extension's compare changes feature applies only to your self-hosted dbt development environment. If you're looking to compare changes between your production environment and the pull request's latest commit, check out [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes).

import CompareChangesTable from '/snippets/_compare-changes-table.md';

<CompareChangesTable />

</Expandable>
## Related docs
- [Advanced CI compare changes](/docs/deploy/advanced-ci#compare-changes)
