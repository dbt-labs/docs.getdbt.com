---
title: "Access Catalog from dbt platform features"
sidebar_label: "Access from dbt platform"
description: "Learn where and how to directly access and interact with Catalog from dbt platform features and products."
---

Access <Constant name="catalog" /> from jobs, <Constant name="insights" />, and other areas of <Constant name="dbt" /> to move quickly between run context, lineage, and resource metadata in your project.

This page describes how to open <Constant name="catalog" /> from orchestration and exploration workflows in <Constant name="dbt" />. The primary way to open <Constant name="catalog" /> is **Catalog** in the navigation; you can also open it from jobs and <Constant name="insights" /> as described in the sections below.

### Lineage tab in jobs

The **Lineage tab** in <Constant name="dbt" /> jobs displays the lineage associated with the [job run](/docs/deploy/jobs). You can open <Constant name="catalog" /> directly from this tab to understand the dependencies and relationships of resources in your project.

#### Access Catalog from the lineage tab

- From a job, select the **Lineage tab**.
- Double-click a node in the lineage graph to open a new tab and view its metadata in <Constant name="catalog" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" title="Access dbt Catalog from the lineage tab by double-clicking on the lineage node." />

### Model timing tab in jobs <Lifecycle status="self_service,managed,managed_plus"/>

The [model timing tab](/docs/deploy/run-visibility#model-timing) in <Constant name="dbt" /> jobs displays the composition, order, and time taken by each model in a job run.

You can open <Constant name="catalog" /> from the **model timing tab** to investigate resources, diagnose performance bottlenecks, understand dependencies and relationships of slow-running models, and make changes to improve their performance.

#### Access Catalog from the model timing tab

- From a job, select the **model timing tab**.
- Hover over a resource and select **View in <Constant name="catalog" />** to open its metadata in <Constant name="catalog" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-model-timing.png" title="Access dbt Catalog from the model timing tab by hovering over the resource and clicking 'View in Explorer'." />

### dbt Insights <Lifecycle status="managed,managed_plus" />

Open <Constant name="catalog" /> from [<Constant name="insights" />](/docs/explore/access-dbt-insights) to view project lineage and resources such as tables, columns, metrics, dimensions, and more.

To open <Constant name="catalog" /> from <Constant name="insights" />, select the **<Constant name="catalog" />** icon in the Query console sidebar menu, then search for the resource you want.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights integrated with dbt Catalog" />
