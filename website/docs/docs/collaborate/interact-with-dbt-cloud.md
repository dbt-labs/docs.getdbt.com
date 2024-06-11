---
title: "Access dbt Explorer from dbt Cloud features"
sidebar_label: "Access from dbt Cloud"
description: "Learn where and how to directly access and interact with dbt Explorer from dbt Cloud features and products."
---

<p style={{ color: '#808080', fontSize: '1.1em' }}>
Interact with dbt Explorer from other features and products inside dbt Cloud, ensuring you have a seamless experience navigating between resources and lineage in your project. This document guides you on how to access dbt Explorer from the dbt Cloud IDE, jobs, and other product areas.
</p>

### dbt Cloud IDE 
You can enhance your project navigation and editing experience by directly accessing resources from the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to dbt Explorer for model, seed, or snapshot files. This workflow offers a seamless transition between the IDE and the Explorer, allowing you to quickly view and interact with your project's metadata and lineage.

- **Access dbt Explorer from the IDE** &mdash; In your model, seed, or snapshot file, click the **View in Explorer** icon to the right of your file breadcrumb (under the file name tab). This opens the model, seed, or snapshot file in a new tab, allowing you to view resources/lineage directly in Explorer. 
- **Use cases** &mdash; Navigate between viewing project metadata and making updates to your models or other resources without switching contexts.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-ide.jpg" title="Access dbt Explorer from the IDE by clicking on the 'View in Explorer' icon next to the file breadcrumbs. " />

### Lineage tab in jobs
The lineage tab in dbt Cloud jobs displays the lineage associated with the [job run](/docs/deploy/jobs). Access dbt Explorer directly from this tab, allowing you to navigate between both product areas with ease.

- **Access dbt Explorer from the lineage tab** &mdash; From a job, select the lineage tab. Double-click the node in the lineage to open a new tab and view its metadata directly in dbt Explorer.
- **Use cases** &mdash; Understand dependencies/relationships of resources in your project.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" title="Access dbt Explorer from the lineage tab by double-clicking on the lineage node." />

### Model timing tab in jobs
The [model timing tab](/docs/deploy/run-visibility#model-timing) in dbt Cloud jobs displays the composition, order, and time taken by each model in a job run. Access dbt Explorer directly from the modeling timing tab, helping you investigate resources and potentially make changes to improve their performance.

- **Access dbt Explorer from the model timing tab** &mdash; From a job, select the model timing tab. Hover over a resource and click on **View on Explorer** to view the resource metadata directly in dbt Explorer. 
- **Use cases** &mdash; Diagnose performance bottlenecks and understand dependencies/relationships of slow-running models in your project.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-model-timing.jpg" title="Access dbt Explorer from the model timing tab by hovering over the resource and clicking 'View in Explorer'." />
