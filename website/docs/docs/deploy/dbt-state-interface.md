---
title: "Monitoring dbt State activity in dbt platform"
sidebar_label: "Monitor dbt State activity"
description: "Learn how to monitor dbt State activity in dbt platform for better visibility into model builds and cost savings."
id: "dbt-state-interface"
tags: ['dbt State']
---
# Monitor dbt State activity <Lifecycle status="preview" />

<IntroText>
Learn how to monitor dbt State activity in <Constant name="dbt_platform" /> for better visibility into model builds and cost savings.
</IntroText>

dbt State monitoring helps you:

- **Track effectiveness of dbt State** &mdash; See how dbt State reduces unnecessary model rebuilds by only building models when there are changes to the data or code. dbt State provides transparency into how the optimization works across your projects.
- **Analyze build patterns** &mdash; Gain insights into your project's build frequency and identify opportunities for further optimization.

## dbt State metrics

When you go to **Account settings** > **State**, the **dbt State** page shows how many days remain in your trial period. Once dbt State is enabled, it also displays the following for the current month:

- **Number of models reused**: How many model builds dbt State skipped or cloned instead of rebuilding from scratch.
- **Total % build reduction**: The overall reduction in model builds across your account.
- **Total query run time reduction**: The total time dbt State saved by not executing unnecessary model builds.

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

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
