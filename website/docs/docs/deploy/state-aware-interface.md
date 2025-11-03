---
title: "Navigating the state-aware interface"
sidebar_label: "Navigating the interface"
description: "Learn how to navigate the state-aware orchestration interface for better visibility into model builds and cost tracking." 
id: "state-aware-interface"
tags: ['scheduler','SAO', 'cost savings', 'models built']
---

<IntroText>

Learn how to navigate the state-aware orchestration interface for better visibility into model builds and cost tracking.

</IntroText>

## Models built and reused chart

When you go to your **Account home**, you'll see a chart showing the number of models built and reused, giving you visibility into how state-aware orchestration is optimizing your data builds. This chart helps you to:

- **Track effectiveness of state-aware orchestration** &mdash; See how state-aware orchestration reduces unnecessary model rebuilds by only building models when there are changes to the data or code⁠. This chart provides transparency into how the optimization is working across your dbt implementation.
- **Analyze build patterns** &mdash; Gain insights into your project's build frequency and identify opportunities for further optimization.

You can also view the number of reused models per project in the **Accounts home** page.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/account-home-chart.png" width="90%" title="Models built and reused chart in Account home"/>
<Lightbox src="/img/docs/deploy/sao-model-reuse.png" width="100%" title="View reused models count per project in the Accounts home page"/>
</DocCarousel>

## Model consumption view in jobs

State-aware jobs provide charts that show information about your job runs, and how many models were built and reused by your job in the past week, in the last 14 days, or in the last 30 days. In the **Overview** section of your job, the following charts are available: 

Under the **Runs** tab:
- **Recent runs**
- **Total run duration time** 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-runs-chart.png" width="90%" title="Charts for Recent runs and Total run duration time"/>

Under the **Models** tab:
- **Models built** 
- **Models reused**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-models-chart.png" width="90%" title="Charts for Models built and Models reused"/>

## Logs view of built models

When running a job, a structured logs view shows which models were built, skipped, or reused. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-logs-view.png" title="Logs view of built models"/>

1. Each model has an icon indicating its status.
2. The **Reused** tab indicates the total number of reused models.
3. You can use the search bar or filter the logs to show **All**, **Success**, **Warning**, **Failed**, **Running**, **Skipped**, **Reused**, or **Debugged** messages. 
4. Detailed log messages are provided to get more context on why models were built, reused, or skipped. These messages are highlighted in the logs.

## Reused tag in the Latest status lens

Lineage lenses are interactive visual filters in [dbt <Constant name="explorer" />](/docs/explore/explore-projects#lenses) that show additional context on your lineage graph to understand how resources are defined or performing. When you apply a lens, tags become visible on the nodes in the lineage graph, indicating the layer value along with coloration based on that value. If you're significantly zoomed out, only the tags and their colors are visible in the graph.

The **Latest status** lens shows the status from the latest execution of the resource in the current environment. When you use this lens to view your lineage, models that were reused from state-aware orchestration are tagged with **Reused**. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-latest-status-lens.png" width="90%" title="Latest status lens showing reused models"/>

To view your lineage with the **Latest status** lens:

1. From the main menu, go to **Orchestration** > **Runs**. 
2. Select your run. 
3. Go to the **Lineage** tab.
    The lineage of your project appears.
4. In the **Lenses** field, select **Latest status**.

## Clear cache button

State-aware orchestration uses a cached hash of both code and data state for each model in an environment stored in Redis. When running a job, dbt checks if there are changes in the hash for the model being built between the saved state in Redis and the current state that would be built by the job. If there is a change, dbt builds the model. If there are no changes, dbt reuses the model from the last time it was built.

- To wipe this state clean and start again, clear the cache by going to **Orchestration** > **Environments**. Select your environment and click the **Clear cache** button. 
- The **Clear cache** button is only available if you have enabled state-aware orchestration.

- After clearing the cache, the next run rebuilds every model from scratch. Subsequent runs rely on the regenerated cache.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-clear-cache.png" width="90%" title="Clear cache button"/>

