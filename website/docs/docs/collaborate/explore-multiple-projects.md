---
title: "Explore multiple projects"
sidebar_label: "Explore multiple projects"
description: "Learn about project-level lineage in dbt Explorer and its uses."
---

View all the projects and public models in your account (where public models are defined) and gain a better understanding of your cross-project resources and how they're used.

The resource-level lineage graph for a project displays the cross-project relationships in the DAG, with a **PRJ** icon indicating whether or not it's a project resource. That icon is located to the left side of the node name.

To view the project-level lineage graph, click the **View lineage** icon in the upper right corner from the main overview page:
- This view displays all the projects in your account and their relationships.
- Viewing an upstream (parent) project displays the downstream (child) projects that depend on it.
- Selecting a model reveals its dependent projects in the lineage.
- Click on an upstream (parent) project to view the other projects that reference it in the **Relationships** tab, showing the number of downstream (child) projects that depend on them. 
  - This includes all projects listing the upstream one as a dependency in its `dependencies.yml` file, even without a direct `{{ ref() }}`.
  - Selecting a project node from a public model opens its detailed lineage graph, subject to your [permission](/docs/cloud/manage-access/enterprise-permissions).

<Lightbox src="/img/docs/collaborate/dbt-explorer/cross-project-lineage-parent.png" width="100%" height="100" title="View your cross-project lineage in a parent project and the other projects that reference it by clicking the 'Relationships' tab."/>

When viewing a downstream (child) project that imports and refs public models from upstream (parent) projects:
- Public models will show up in the lineage graph and you can click on them to view the model details.
- Clicking on a model opens a side panel containing general information about the model, such as the specific dbt Cloud project that produces that model, description, package, and more.
- Double-clicking on a model from another project opens the resource-level lineage graph of the parent project, which is subject to your permissions.

<Lightbox src="/img/docs/collaborate/dbt-explorer/cross-project-child.png" width="100%" height="100" title="View a downstream 'child' project that importants and refs public models from the upstream 'parent' project."/>

## Explore the project-level lineage graph

For cross-project collaboration, you can interact with the DAG in all the same ways as described in [Explore your project's lineage](/docs/collaborate/explore-projects#project-lineage) but you can also interact with it at the project level and view the details. 

To get a list view of all the projects in your account:
- Navigate to the top left section of the **Explore** page, near the navigation bar.
- Hover over the project name and select the account name.
- This will return a project view page, allowing you to see all the projects in the account. It returns a public model list, project list, and a search bar for project searches.
- You can also view the project-level lineage graph by clicking the **Lineage view** icon in the page's upper right corner.

:::info
If you have permissions for a project in the account, you can view all public models used across the entire account. However, you can only view full public model details and private models if you have permissions for a project where the models are defined.
:::

<Lightbox src="/img/docs/collaborate/dbt-explorer/account-level-lineage.gif" width="100%" title="View a downstream (child) project, which imports and refs public models from upstream (parent) projects."/>

From the project-level lineage graph, you can:

- Click the **Lineage view** icon (in the graph’s upper right corner) to view the cross-project lineage graph.
- Click the **List view** icon (in the graph’s upper right corner) to view the project list.
    - Select a project from the **Projects** tab to switch to that project’s main **Explore** page.
    - Select a model from the **Public Models** tab to view the [model’s details page](/docs/collaborate/explore-projects#view-resource-details).
    - Perform searches on your projects with the search bar.
- Select a project node in the graph (double-clicking) to switch to that particular project’s lineage graph.

When you select a project node in the graph, a project details panel opens on the graph’s right-hand side where you can:

- View counts of the resources defined in the project.
- View a list of its public models, if any.
- View a list of other projects that uses the project, if any.
- Click **Open Project Lineage** to switch to the project’s lineage graph.
- Click the **Share** icon to copy the project panel link to your clipboard so you can share the graph with someone.

<Lightbox src="/img/docs/collaborate/dbt-explorer/multi-project-overview.gif" width="95%" title="Select a downstream (child) project to open the project details panel for resource counts, public models associated, and more. "/>
