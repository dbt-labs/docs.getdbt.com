---
title: "Access dbt Explorer from dbt Cloud features"
sidebar_label: "Access from dbt Cloud"
description: "Learn where and how to directly access and interact with dbt Explorer from dbt Cloud features and products."
---

Access dbt Explorer from other features and products inside dbt Cloud, ensuring you have a seamless experience navigating between resources and lineage in your project. 

This page explains how to access dbt Explorer from various dbt Cloud features, including the dbt Cloud IDE and jobs. While the primary way to navigate to dbt Explorer is through the **Explore** link in the navigation, you can also access it from other dbt Cloud features.

### dbt Cloud IDE 
You can enhance your project navigation and editing experience by directly accessing resources from the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to dbt Explorer for model, seed, or snapshot files. This workflow offers a seamless transition between the IDE and Explorer, allowing you to quickly navigate between viewing project metadata and making updates to your models or other resources without switching contexts.

#### Access dbt Explorer from the IDE
- In your model, seed, or snapshot file, click the **View in Explorer** icon to the right of your file breadcrumb (under the file name tab). 
- This opens the model, seed, or snapshot file in a new tab, allowing you to view resources/lineage directly in Explorer. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-ide.jpg" title="Access dbt Explorer from the IDE by clicking on the 'View in Explorer' icon next to the file breadcrumbs. " />

### Lineage tab in jobs
The **Lineage tab** in dbt Cloud jobs displays the lineage associated with the [job run](/docs/deploy/jobs). Access dbt Explorer directly from this tab, allowing you understand dependencies/relationships of resources in your project.

#### Access dbt Explorer from the lineage tab
- From a job, select the **Lineage tab**. 
- Double-click the node in the lineage to open a new tab and view its metadata directly in dbt Explorer.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" title="Access dbt Explorer from the lineage tab by double-clicking on the lineage node." />

### Model timing tab in jobs <Lifecycle status="enterprise,team"/>
The [model timing tab](/docs/deploy/run-visibility#model-timing) in dbt Cloud jobs displays the composition, order, and time taken by each model in a job run. 

Access dbt Explorer directly from the **modeling timing tab**, which helps you investigate resources, diagnose performance bottlenecks, understand dependencies/relationships of slow-running models, and potentially make changes to improve their performance.

#### Access dbt Explorer from the model timing tab
- From a job, select the **model timing tab**.
- Hover over a resource and click on **View on Explorer** to view the resource metadata directly in dbt Explorer. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-model-timing.jpg" title="Access dbt Explorer from the model timing tab by hovering over the resource and clicking 'View in Explorer'." />
