---
title: "Monitoring dbt State activity in dbt platform"
sidebar_label: "Monitor dbt State activity"
description: "Learn how to monitor dbt State activity in dbt platform for better visibility into model builds and cost savings."
id: "dbt-state-interface"
tags: ['dbt State']
availability: everywhere_usage
---

import DbtStateExplainTab from '/snippets/_dbt-state-explain-tab.md';

# Monitor dbt State activity <Lifecycle status="preview" />

<IntroText>
Learn how to monitor dbt State activity in <Constant name="dbt_platform" /> for better visibility into model builds and cost savings.
</IntroText>

dbt State monitoring helps you:

- **Track effectiveness of dbt State** &mdash; See how dbt State reduces unnecessary model rebuilds by only building models when there are changes to the data or code. dbt State provides transparency into how the optimization works across your projects.
- **Analyze build patterns** &mdash; Gain insights into your project's build frequency and identify opportunities for further optimization.

## dbt State metrics

When you go to **Account settings** > **Billing & Usage** > **Usage-based features**, the **State** tab shows how many days remain in your trial period. Once dbt State is enabled, it displays the following for the current month:

- **Models reused this month**: How many model builds dbt State skipped or cloned instead of rebuilding from scratch.
- **Total % build reduction**: The overall reduction in model builds across your account.
- **Total query run time reduction**: The total time dbt State saved by not executing unnecessary model builds.

The **State** tab also displays the following charts:

- **DATT** &mdash; Shows the target tables processed by dbt State, split into **Billable** and **Free**. Daily active target tables (DATTs) are the [billable units](/docs/platform/billing/dbt-state-usage#daily-active-target-tables) for dbt State. During a trial, all DATTs are counted as free.
- **Asset builds** &mdash; Shows all model builds for the month, including models reused and cloned.

## Lag tolerance recommendations

The **dbt State** page includes a **Lag tolerance recommendations** section that identifies models that could safely tolerate more lag, letting dbt State skip more runs and save additional compute.

The recommendations table displays the following columns:

<SimpleTable>
| Column | Description |
|--------|-------------|
| **Model name** | The name of the model that could benefit from a higher `lag_tolerance` value. |
| **Project** | The dbt project the model belongs to, as set by `name:` in `dbt_project.yml`. This may differ from the project name in the <Constant name="dbt_platform" />. |
| **Current lag** | The model's current `lag_tolerance` setting. |
| **Recommended lag** | The `lag_tolerance` value dbt State recommends based on observed upstream data refresh patterns. |
| **% time saved** | The estimated percentage of build time you'd save by applying the recommended `lag_tolerance`. |
| **Projected 30d time savings** | The estimated build time you could save over the next 30 days by applying the recommended `lag_tolerance`, based on redundant builds in the previous 30 days. This estimate includes only this model, so actual savings may be higher if downstream models also do not rebuild.|
</SimpleTable>

You can search for a specific model using the search bar, or filter recommendations by project using the **Project** dropdown menu.

To apply a recommendation, update the model's `lag_tolerance` config. For configuration syntax and examples, refer to the [`lag_tolerance` config page](/reference/resource-configs/lag-tolerance).

### How dbt State calculates recommendations

dbt State analyzes each model’s build history from the previous 30 days. Models with fewer than 10 recorded builds are excluded because there isn't enough history to make a reliable recommendation.

For each eligible model, dbt State:

1. Identifies builds where the model’s definition and inputs had not changed since the previous build.
2. Estimates the build time that different `lag_tolerance` values would have saved.
3. Recommends the smallest value that would have saved more than 30 minutes, helping reduce redundant builds while keeping data as fresh as possible.

A model doesn’t appear in the table if it’s a view or its current `lag_tolerance` value is already equal to or greater than the recommended value. Each account displays 20 models with the highest projected savings.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/lag-tolerance-recommendations.png" width="80%" title="Lag tolerance recommendations" />

## Models built and reused chart

When you go to your **Account home**, you'll see a chart showing the number of models built and reused, giving you visibility into how dbt State is optimizing your data builds. You can also view the number of reused models per project on **Account home**.

## Logs view of built models

When you run a job, or when you run `dbt run` or `dbt build` locally, a structured logs view shows which models were built, skipped, or reused.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/sao-logs-view.png" title="Logs view of built models" />

1. Each model has an icon indicating its status.
2. The **Reused** tab indicates the total number of reused models.
3. You can use the search bar or filter the logs to show **All**, **Success**, **Warning**, **Failed**, **Running**, **Skipped**, **Reused**, or **Debugged** messages.
4. Detailed log messages provide context on why models were built, reused, or skipped. These messages are highlighted in the logs.

## Reused tag in the Latest status lens

Lineage lenses are interactive visual filters in [dbt <Constant name="catalog" />](/docs/explore/explore-projects#lenses) that show additional context on your lineage graph to understand how resources are defined or performing. When you apply a lens, tags become visible on the nodes in the lineage graph, indicating the layer value along with coloration based on that value. If you're significantly zoomed out, only the tags and their colors are visible in the graph.

The **Latest status** lens shows the status from the latest execution of the resource in the current environment. When you use this lens to view your lineage, dbt State tags reused models with **Reused**.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/sao-latest-status-lens.png" width="90%" title="Latest status lens showing reused models" />

To view your lineage with the **Latest status** lens:

1. From the main menu, go to **Orchestration** > **Runs**.
2. Select your run.
3. Go to the **Lineage** tab. You'll see your project's lineage.
4. In the **Lenses** field, select **Latest status**.

## Explain tab

To see why dbt State rebuilt, reused, or cloned a specific resource, go to **Orchestration** > **Runs**. Select a run and go to the **Explain** tab.

<DbtStateExplainTab />

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State trial and billing](/docs/deploy/dbt-state-trial)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [`lag_tolerance` config reference](/reference/resource-configs/lag-tolerance)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
