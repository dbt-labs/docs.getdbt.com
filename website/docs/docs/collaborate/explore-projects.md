---
title: "Explore your dbt projects"
sidebar_label: "Explore dbt projects"
description: "Learn about dbt Explorer and how to interact with it to understand, improve, and leverage your data pipelines."
pagination_next: "docs/collaborate/explore-multiple-projects"
pagination_prev: null
---

With dbt Explorer, you can view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their <Term id="data-lineage">lineage</Term> to gain a better understanding of its latest production state. Navigate and manage your projects within dbt Cloud to help you and other data developers, analysts, and consumers discover and leverage your dbt resources.

:::tip Public preview 

Try dbt Explorer! It's available in [Public Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud) as of October 17, 2023 for dbt Cloud customers. More updates coming soon.
 
:::

## Prerequisites

- You have a [multi-tenant](/docs/cloud/about-cloud/tenancy#multi-tenant) or AWS single-tenant dbt Cloud account on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).
- You have set up a [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment) for each project you want to explore.
    - There has been at least one successful job run in the production deployment environment.
- You are on the dbt Explorer page. To do this, select **Explore** from the top navigation bar in dbt Cloud.


## Generate metadata 

dbt Explorer uses the metadata provided by the [Discovery API](/docs/dbt-cloud-apis/discovery-api) to display the details about [the state of your project](/docs/dbt-cloud-apis/project-state). The metadata that's available depends on the [deployment environment](/docs/deploy/deploy-environments) you've designated as _production_ in your dbt Cloud project. dbt Explorer automatically retrieves the metadata updates after each job run in the production deployment environment so it always has the latest results for your project. 

To view a resource and its metadata, you must define the resource in your project and run a job in the production environment. The resulting metadata depends on the [commands executed by the jobs](/docs/deploy/job-commands). 

For a richer experience with dbt Explorer, you must:

- Run [dbt run](/reference/commands/run) or [dbt build](/reference/commands/build) on a given model within a job in the environment to update model details or results.
- Run [dbt docs generate](/reference/commands/cmd-docs) within a job in the environment to view catalog statistics and columns for models, sources, and snapshots.
- Run [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment to view test results.
- Run [dbt source freshness](/reference/commands/source#dbt-source-freshness) within a job in the environment to view source freshness data.
- Run [dbt snapshot](/reference/commands/snapshot) or [dbt build](/reference/commands/build) within a job in the environment to view snapshot details.

Richer and more timely metadata will become available as dbt, the Discovery API, and the underlying dbt Cloud platform evolves.

## Explore your project's lineage graph {#project-lineage}

dbt Explorer provides a visualization of your project’s <Term id="dag">DAG</Term> that you can interact with. To access the project's full lineage graph, select **Overview** in the left sidebar and click the **Explore Lineage** button on the main (center) section of the page. 

If you don't see the project lineage graph immediately, click **Render Lineage**. It can take some time for the graph to render depending on the size of your project and your computer’s available memory. The graph of very large projects might not render so you can select a subset of nodes by using selectors, instead.

The nodes in the lineage graph represent the project’s resources and the edges represent the relationships between the nodes. Nodes are color-coded and include iconography according to their resource type.

To explore the lineage graphs of tests and macros, view [their resource details pages](#view-resource-details). By default, dbt Explorer excludes these resources from the full lineage graph unless a search query returns them as results.

To interact with the full lineage graph, you can:

- Hover over any item in the graph to display the resource’s name and type.
- Zoom in and out on the graph by mouse-scrolling.
- Grab and move the graph and the nodes.
- Right click on a node (context menu) to:
    - Refocus on the node, including its parent and child nodes
    - Refocus on the node and its children only
    - Refocus on the node and it parents only
    - View the node's [resource details](#view-resource-details) page

- Select a resource to highlight its relationship with other resources in your project. A panel opens on the graph’s right-hand side that displays a high-level summary of the resource’s details. The side panel includes a **General** tab for information like description, materialized type, and other details.
    - Click the Share icon in the side panel to copy the graph’s link to your clipboard.
    - Click the View Resource icon in the side panel to [view the resource details](#view-resource-details). 
- [Search and select specific resources](#search-resources) or a subset of the DAG using [selectors](/reference/node-selection/methods) and [graph operators](/reference/node-selection/graph-operators). This can help you narrow the focus on the resources that interest you. For example:
    - `+[RESOURCE_NAME]` &mdash; Displays all parent nodes of the resource
    - `resource_type:model [RESOURCE_NAME]` &mdash; Displays all models matching the name search

- [View resource details](#view-resource-details) by selecting a node (double-clicking) in the graph.
- Click the List view icon in the graph's upper right corner to return to the main **Explore** page. 

<LoomVideo id='4f85654b5cc443478299d2bb1e9211f6?t=0' />


## Search for resources {#search-resources}
With the search bar (on the upper left corner of the page or in a lineage graph), you can search with keywords or by using [node selection syntax](/reference/node-selection/syntax). The resources that match your search criteria will display as a lineage graph and a table in the main section of the page. 

Select a node (single-click) in the lineage graph to highlight its relationship with your other search results and to display which project contains the resource's definition. When you choose a node (double-click) in the lineage graph or when you select a resource in the table, dbt Explorer displays the [resource's details page](#view-resource-details).

### Search with keywords
When searching with keywords, dbt Explorer searches through your resource metadata (such as resource type, resource name, column name, source name, tags, schema, database, version, alias/identifier, and package name) and returns any matches.

With keyword search, there is a side panel (to the right of the main section) that you can use to additionally filter the search results by resource type. You can filter by resource tags for all resources or model access levels within the **Models** option. As an example, when searching for “sale”, the results will include all resources with the keyword “sale” in their metadata. And, choosing **Models** and **Sources** in the side panel will filter those search results to contain only models or sources.   

For a search on an exact column name, the results will include all relational nodes with that specific column in their schemas. If there is a match, the search result will include a notice indicating that the resource contains the specified column.

### Search with selectors 

You can search with [selectors](/reference/node-selection/methods). Below are the selectors currently available in dbt Explorer:   

- `fqn:` &mdash; Find resources by [file or fully qualified name](/reference/node-selection/methods#the-fqn-method). This selector is the search bar's default. If you want to use the default, it's unnecessary to add `fqn:` before the search term.
- `source:` &mdash; Find resources by a specified [source](/reference/node-selection/methods#the-source-method).
- `resource_type:` &mdash; Find resources by their [type](/reference/node-selection/methods#the-resource_type-method).
- `package:` &mdash; Find resources by the [dbt package](/reference/node-selection/methods#the-package-method) that defines them.
- `tag:` &mdash; Find resources by a specified [tag](/reference/node-selection/methods#the-tag-method).

<VersionBlock firstVersion="1.5">

- `group:` &mdash; Find models defined within a specified [group](/reference/node-selection/methods#the-group-method).
- `access:` &mdash; Find models based on their [access](/reference/node-selection/methods#the-access-method) property.

</VersionBlock>

Because the results of selectors are immutable, the filter side panel is not available with this search method. 

When searching with selector methods, you can also use [graph operators](/reference/node-selection/graph-operators). For example, `+orders` returns all the parents of `orders`. This functionality is not available for keyword search.

You can use multiple selector methods in your search query with [set operators](/reference/node-selection/set-operators). A space implies a union set operator and a comma for an intersection. For example:
- `resource_type:metric,tag:nightly` &mdash; Returns metrics with the tag `nightly`
- `+snowplow_sessions +fct_orders` &mdash; Returns resources that are parent nodes of either `snowplow_sessions` or `fct_orders`

<LoomVideo id='712c8b74a6e242699ad2d32e2b0693a5' />

## Browse with the sidebar

By default, the catalog sidebar lists all your project’s resources. Select any resource type in the list and all those resources in the project will display as a table in the main section of the page. For a description on the different resource types (like models, metrics, and so on), refer to [About dbt projects](/docs/build/projects). 

To browse using a different view, you can choose one of these options from the **View by** dropdown:

- **Resources** (default) &mdash; All resources in the project organized by type.
- **Packages** &mdash; All resources in the project organized by the dbt package in which they are defined.
- **File Tree** &mdash; All resources in the project organized by the file in which they are defined. This mirrors the file tree in your dbt project repository.
- **Database** &mdash; All resources in the project organized by the database and schema in which they are built. This mirrors your data platform's structure that represents the [applied state](/docs/dbt-cloud-apis/project-state) of your project. 

<LoomVideo id='3bd3b16b22ab49ea809c9a863be06d05' />

## View model versions

If models in the project are versioned, you can see which [version of the model](/docs/collaborate/govern/model-versions) is being applied &mdash; `prerelease`, `latest`, and `old` &mdash; in the title of the model’s details page and in the model list from the sidebar.

## View resource details {#view-resource-details}
You can view the definition and latest run results of any resource in your project. To find a resource and view its details, you can interact with the lineage graph, use search, or browse the catalog. 

The details (metadata) available to you depends on the resource’s type, its definition, and the [commands](/docs/deploy/job-commands) that run within jobs in the production environment. 


<LoomVideo id='cefbb113427e45fd8106607476ec0676' />

### Example of model details

An example of the details you might get for a model:

- Status bar (below the page title) &mdash; Information on the last time the model ran, whether the run was successful, how the data is materialized, number of rows, and the size of the model. 
- **General** tab includes:
    - **Lineage** graph &mdash; The model’s lineage graph that you can interact with. The graph includes one parent node and one child node from the model. Click the Expand icon in the graph's upper right corner to view the model in full lineage graph mode.
    - **Description** section &mdash; A [description of the model](/docs/collaborate/documentation#adding-descriptions-to-your-project).
    - **Recent** section &mdash; Information on the last time the model ran, how long it ran for, whether the run was successful, the job ID, and the run ID.
    - **Tests** section &mdash; [Tests](/docs/build/tests) for the model, including a status indicator for the latest test status. A :white_check_mark: denotes a passing test. 
    - **Details** section &mdash; Key properties like the model’s relation name (for example, how it’s represented and how you can query it in the data platform: `database.schema.identifier`); model governance attributes like access, group, and if contracted; and more.
    - **Relationships** section &mdash; The nodes the model **Depends On**, is **Referenced by**, and (if applicable) is **Used by** for projects that have declared the models' project as a dependency.
- **Code** tab &mdash; The source code and compiled code for the model.
- **Columns** tab &mdash; The available columns in the model. This tab also shows tests results (if any) that you can select to view the test's details page. A :white_check_mark: denotes a passing test. To filter the columns in the resource, you can use the search bar that's located at the top of the columns view. 


### Example of exposure details

An example of the details you might get for an exposure:

- Status bar (below the page title) &mdash; Information on the last time the exposure was updated. 
- **General** tab includes:
    - **Status** section &mdash; The status on data freshness and data quality.
    - **Lineage** graph &mdash; The exposure’s lineage graph. Click the Expand icon in the graph's upper right corner to view the exposure in full lineage graph mode.
    - **Description** section &mdash; A description of the exposure.
    - **Details** section &mdash; Details like exposure type, maturity, owner information, and more.
    - **Relationships** section &mdash; The nodes the exposure **Depends On**.

### Example of test details

An example of the details you might get for a test:

- Status bar (below the page title) &mdash; Information on the last time the test ran, whether the test passed, test name, test target, and column name. 
- **General** tab includes:
    - **Lineage** graph &mdash; The test’s lineage graph that you can interact with. The graph includes one parent node and one child node from the test resource. Click the Expand icon in the graph's upper right corner to view the test in full lineage graph mode.
    - **Description** section &mdash; A description of the test.
    - **Recent** section &mdash; Information on the last time the test ran, how long it ran for, whether the test passed, the job ID, and the run ID.
    - **Details** section &mdash; Details like schema, severity, package, and more.
    - **Relationships** section &mdash; The nodes the test **Depends On**.
- **Code** tab &mdash; The source code and compiled code for the test.


### Example of source details

An example of the details you might get for each source table within a source collection:

- Status bar (below the page title) &mdash; Information on the last time the source was updated and the number of tables the source uses. 
- **General** tab includes:
    - **Lineage** graph &mdash; The source’s lineage graph that you can interact with. The graph includes one parent node and one child node from the source. Click the Expand icon in the graph's upper right corner to view the source in full lineage graph mode.
    - **Description** section &mdash; A description of the source.
    - **Source freshness** section &mdash; Information on whether refreshing the data was successful, the last time the source was loaded, the timestamp of when a run generated data, and the run ID.
    - **Details** section &mdash; Details like database, schema, and more.
    - **Relationships** section &mdash; A table that lists all the sources used with their freshness status, the timestamp of when freshness was last checked, and the timestamp of when the source was last loaded.
- **Columns** tab &mdash; The available columns in the source. This tab also shows tests results (if any) that you can select to view the test's details page. A :white_check_mark: denotes a passing test.

## Related content
- [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions) 
- [About model governance](/docs/collaborate/govern/about-model-governance)
- [What is data mesh?](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh) blog
