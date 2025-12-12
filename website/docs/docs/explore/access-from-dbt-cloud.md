---
title: "Access Catalog from dbt platform features"
sidebar_label: "Access from dbt platform"
description: "Learn where and how to directly access and interact with Catalog from dbt platform features and products."
---

Access <Constant name="explorer" /> from other features and products inside <Constant name="cloud" />, ensuring you have a seamless experience navigating between resources and lineage in your project. 

This page explains how to access <Constant name="explorer" /> from various <Constant name="cloud" /> features, including the <Constant name="cloud_ide" /> and jobs. While the primary way to navigate to <Constant name="explorer" /> is through the **Explore** link in the navigation, you can also access it from other <Constant name="cloud" /> features.

### Studio IDE 
You can enhance your project navigation and editing experience by directly accessing resources from the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) to <Constant name="explorer" /> for model, seed, or snapshot files. This workflow offers a seamless transition between the <Constant name="cloud_ide" /> and <Constant name="explorer" />, allowing you to quickly navigate between viewing project metadata and making updates to your models or other resources without switching contexts.

#### Access Catalog from the IDE
- In your model, seed, or snapshot file, click the **View in <Constant name="explorer" />** icon to the right of your file breadcrumb (under the file name tab). 
- This opens the model, seed, or snapshot file in a new tab, allowing you to view resources/lineage directly in <Constant name="explorer" />. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-ide.jpg" title="Access dbt Catalog from the IDE by clicking on the 'View in Explorer' icon next to the file breadcrumbs. " />

### Canvas

Seamlessly access <Constant name="explorer" /> via <Constant name="visual_editor" /> to bring your workflow to life with visual editing.

#### Access Catalog from Canvas

Steps here
[Roxi to check with Greg and team and will add images on response]

### Lineage tab in jobs
The **Lineage tab** in <Constant name="cloud" /> jobs displays the lineage associated with the [job run](/docs/deploy/jobs). Access <Constant name="explorer" /> directly from this tab, allowing you understand dependencies/relationships of resources in your project.

#### Access Catalog from the lineage tab
- From a job, select the **Lineage tab**. 
- Double-click the node in the lineage to open a new tab and view its metadata directly in <Constant name="explorer" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" title="Access dbt Catalog from the lineage tab by double-clicking on the lineage node." />

### Model timing tab in jobs <Lifecycle status="self_service,managed,managed_plus"/>

The [model timing tab](/docs/deploy/run-visibility#model-timing) in <Constant name="cloud" /> jobs displays the composition, order, and time taken by each model in a job run. 

Access <Constant name="explorer" /> directly from the **modeling timing tab**, which helps you investigate resources, diagnose performance bottlenecks, understand dependencies/relationships of slow-running models, and potentially make changes to improve their performance.

#### Access Catalog from the model timing tab
- From a job, select the **model timing tab**.
- Hover over a resource and click on **View on <Constant name="explorer" />** to view the resource metadata directly in <Constant name="explorer" />. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-model-timing.jpg" title="Access dbt Catalog from the model timing tab by hovering over the resource and clicking 'View in Explorer'." />

### dbt Insights <Lifecycle status="managed,managed_plus" />

Access <Constant name="explorer" /> directly from [<Constant name="query_page" />](/docs/explore/access-dbt-insights) to view the project lineage and project resources with access to tables, columns, metrics, dimensions, and more.

To access <Constant name="explorer" /> from <Constant name="query_page" />, click on the **<Constant name="explorer" />** icon in the Query console sidebar menu and search for the resource you're interested in.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights integrated with dbt Catalog" />
