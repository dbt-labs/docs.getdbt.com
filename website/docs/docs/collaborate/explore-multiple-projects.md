---
title: "Explore multiple projects"
sidebar_label: "Explore multiple projects"
description: "Learn about project-level lineage in dbt Explorer and its uses."
pagination_next: null
---

You can also view all the different projects and public models in the account, where the public models are defined, and how they are used to gain a better understanding about your cross-project resources.

The resource-level lineage graph for a given project displays the cross-project relationships in the DAG. The different icons indicate whether you’re looking at an upstream producer project (parent) or a downstream consumer project (child).

When you view an upstream (parent) project, its public models display a counter icon in the upper right corner indicating how many downstream (child) projects depend on them. Selecting a model reveals the lineage indicating the projects dependent on that model. These counts include all projects listing the upstream one as a dependency in its `dependencies.yml`, even without a direct `{{ ref() }}`. Selecting a project node from a public model opens its detailed lineage graph, which is subject to your [permission](/docs/cloud/manage-access/enterprise-permissions).

<Lightbox src="/img/docs/collaborate/dbt-explorer/cross-project-lineage-parent.png" width="80%" height="100" title="Cross-project lineage in a parent project"/>

When viewing a downstream (child) project that imports and refs public models from upstream (parent) projects, public models will show up in the lineage graph and display an icon on the graph edge that indicates what the relationship is to a model from another project. Hovering over this icon indicates the specific dbt Cloud project that produces that model. Double-clicking on a model from another project opens the resource-level lineage graph of the parent project, which is subject to your permissions.


<Lightbox src="/img/docs/collaborate/dbt-explorer/cross-project-lineage-child.png" width="85%" height="100" title="Cross-project lineage in a child project"/>

## Explore the project-level lineage graph

For cross-project collaboration, you can interact with the DAG in all the same ways as described in [Explore your project's lineage](/docs/collaborate/explore-projects#project-lineage) but you can also interact with it at the project level and view the details. 

To get a list view of all the projects, select the account name at the top of the **Explore** page near the navigation bar. This view includes a public model list, project list, and a search bar for project searches. You can also view the project-level lineage graph by clicking the Lineage view icon in the page's upper right corner.

If you have permissions for a project in the account, you can view all public models used across the entire account. However, you can only view full public model details and private models if you have permissions for a project where the models are defined.

From the project-level lineage graph, you can:

- Click the Lineage view icon (in the graph’s upper right corner) to view the cross-project lineage graph.
- Click the List view icon (in the graph’s upper right corner) to view the project list.
    - Select a project from the **Projects** tab to switch to that project’s main **Explore** page.
    - Select a model from the **Public Models** tab to view the [model’s details page](/docs/collaborate/explore-projects#view-resource-details).
    - Perform searches on your projects with the search bar.
- Select a project node in the graph (double-clicking) to switch to that particular project’s lineage graph.

When you select a project node in the graph, a project details panel opens on the graph’s right-hand side where you can:

- View counts of the resources defined in the project.
- View a list of its public models, if any.
- View a list of other projects that uses the project, if any.
- Click **Open Project Lineage** to switch to the project’s lineage graph.
- Click the Share icon to copy the project panel link to your clipboard so you can share the graph with someone.

<LoomVideo id='606f02e1cce343eba7e1061d6273ff0a?t=1' />