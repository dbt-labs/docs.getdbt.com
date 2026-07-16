---
title: "Explore multiple projects"
sidebar_label: "Explore multiple projects"
description: "Learn about project-level lineage in dbt Catalog and its uses."
---

# Explore multiple projects <Lifecycle status="managed,managed_plus" />

View all the projects and public models in your account (where public models are defined) and gain a better understanding of your cross-project resources and how they're used.

import ExplorerCourse from '/snippets/_explorer-course-link.md';

<ExplorerCourse />

The resource-level lineage graph for a project displays cross-project relationships in the DAG. Nodes that represent another dbt project show a project icon to the left of the project name.

From a project's **Overview** page, click **View lineage** in the upper right corner to open that project's resource-level lineage graph. In that graph:
- View an upstream (parent) project to see the downstream (child) projects that depend on it.
- Select a model to reveal its dependent projects in the lineage.
- Click on an upstream (parent) project to view the other projects that reference it in the **Relationships** tab, showing the number of downstream (child) projects that depend on them.
  - This includes all projects listing the upstream one as a dependency in its `dependencies.yml` file, even without a direct `{{ ref() }}`.
- Select a project node from a public model to open its detailed lineage graph if you have the [permissions](/docs/platform/manage-access/enterprise-permissions) to do so.

:::tip Indirect dependencies
When viewing a project's lineage, <Constant name="catalog" /> shows only _directly_ [referenced](/docs/mesh/govern/project-dependencies) public models. It doesn't show [indirect dependencies](/faqs/Project_ref/indirectly-reference-upstream-model). If a referenced model in your project depends on another upstream public model, the second-level model won't appear in <Constant name="catalog" />, however it will appear in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) lineage view.
:::

<Lightbox src="/img/docs/collaborate/dbt-explorer/cross-project-lineage-parent.png" width="100%" height="100" title="View your cross-project lineage in a parent project and the other projects that reference it by clicking the 'Relationships' tab."/>

When viewing a downstream (child) project that imports and refs public models from upstream (parent) projects:
- Public models will show up in the lineage graph and you can click on them to view the model details.
- Clicking on a model opens a side panel containing general information about the model, such as the specific <Constant name="dbt" /> project that produces that model, description, package, and more.
- Double-clicking on a model from another project opens the resource-level lineage graph of the parent project, if you have the permissions to do so.

<Lightbox src="/img/docs/collaborate/dbt-explorer/cross-project-child.png" width="100%" height="100" title="View a downstream (child) project that imports and refs public models from the upstream (parent) project."/>

## Explore the project-level lineage graph

For cross-project collaboration, you can interact with the DAG in all the same ways as described in [Explore your project's lineage](/docs/explore/explore-projects#project-lineage). You can also interact with it at the project level and view the details.

If you have permissions for a project in the account, you can view all public models used across the entire account. However, you can only view full public model details and private models if you have permissions for the specific project where those models are defined.

### View account-level lineage

To view all projects in your account as a lineage graph or list:

1. In **<Constant name="catalog" />**, select your project from the sidebar.
2. Click **Account lineage** in the upper right corner.

On the account-level lineage graph, each project appears as its own node with the project name and a count of public models it exposes. Arrows between nodes show how projects depend on one another. The top toolbar includes a search bar and **List view** and lineage view toggles. Zoom controls appear in the lower right corner.

<Lightbox src="/img/docs/collaborate/dbt-explorer/account-level-lineage.gif" width="100%" title="Account-level lineage graph showing cross-project dependencies between projects."/>

From the account-level lineage graph, you can also:

- Click **List view** to switch to a table of projects and public models.
- Double-click a project node to open that project's resource-level lineage graph.

### Explore a project's resource-level lineage

From a project's **Overview** page, click **View lineage** to open the resource-level lineage graph for that project. In this view, you can see:

- Sources, seeds, and models in the current project, with connectors between them.
- Downstream projects that reference the project's public models, shown as separate project nodes connected by dashed lines.
- A search bar, **Lenses**, a **Resource type** filter, a resource-type legend, and zoom controls.

<Lightbox src="/img/docs/collaborate/dbt-explorer/multi-project-overview.gif" width="95%" title="Resource-level lineage graph with a selected model and the Relationships tab."/>

When you select a model, a details panel opens on the right:

- **General** tab: the model description and metadata fields such as **Project** and **Relation**.
- **Columns** tab: each column's name, data type, and description, plus column test results when tests are defined. A **Search for columns** field appears at the top of the tab.
- **Relationships** tab: downstream projects that reference the model, listed under **Referenced by**.
