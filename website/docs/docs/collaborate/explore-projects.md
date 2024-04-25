---
title: "Explore your dbt projects"
sidebar_label: "Explore dbt projects"
description: "Learn about dbt Explorer and how to interact with it to understand, improve, and leverage your data pipelines."
pagination_next: "docs/collaborate/model-performance"
pagination_prev: null
---

# Explore your dbt projects <Lifecycle status='public preview' />

With dbt Explorer, you can view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their <Term id="data-lineage">lineage</Term> to gain a better understanding of its latest production state. Navigate and manage your projects within dbt Cloud to help you and other data developers, analysts, and consumers discover and leverage your dbt resources.

## Prerequisites

- You have a [multi-tenant](/docs/cloud/about-cloud/tenancy#multi-tenant) or AWS single-tenant dbt Cloud account on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).
- You have set up a [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment) for each project you want to explore.
    - There has been at least one successful job run in the production deployment environment.
- You are on the dbt Explorer page. To do this, select **Explore** from the top navigation bar in dbt Cloud.


## Generate metadata 

dbt Explorer uses the metadata provided by the [Discovery API](/docs/dbt-cloud-apis/discovery-api) to display the details about [the state of your project](/docs/dbt-cloud-apis/project-state). The metadata that's available depends on the [deployment environment](/docs/deploy/deploy-environments) you've designated as _production_ in your dbt Cloud project. dbt Explorer automatically retrieves the metadata updates after each job run in the production deployment environment so it always has the latest results for your project. 

To view a resource and its metadata, you must define the resource in your project and run a job in the production environment. The resulting metadata depends on the [commands](/docs/deploy/job-commands) executed by the jobs.

| To view in Explorer | You must successfully run |
|---------------------|---------------------------|
| Model lineage, details, or results | [dbt run](/reference/commands/run) or [dbt build](/reference/commands/build) on a given model within a job in the environment |
| Columns and statistics for models, sources, and snapshots| [dbt docs generate](/reference/commands/cmd-docs) within a job in the environment |
| Test results | [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment | 
| Source freshness results | [dbt source freshness](/reference/commands/source#dbt-source-freshness) within a job in the environment |
| Snapshot details | [dbt snapshot](/reference/commands/snapshot) or [dbt build](/reference/commands/build) within a job in the environment |
| Seed details | [dbt seed](/reference/commands/seed) or [dbt build](/reference/commands/build) within a job in the environment |

Richer and more timely metadata will become available as dbt Core, the Discovery API, and the underlying dbt Cloud platform evolves.

## Explore your project's lineage graph {#project-lineage}

dbt Explorer provides a visualization of your project’s <Term id="dag">DAG</Term> that you can interact with. To access the project's full lineage graph, select **Overview** in the left sidebar and click the **Explore Lineage** button on the main (center) section of the page. 

If you don't see the project lineage graph immediately, click **Render Lineage**. It can take some time for the graph to render depending on the size of your project and your computer’s available memory. The graph of very large projects might not render so you can select a subset of nodes by using selectors, instead.

The nodes in the lineage graph represent the project’s resources and the edges represent the relationships between the nodes. Nodes are color-coded and include iconography according to their resource type.

By default, dbt Explorer shows the project's [applied state](/docs/dbt-cloud-apis/project-state#definition-logical-vs-applied-state-of-dbt-nodes) lineage. That is, it shows models that have been successfully built and are available to query, not just the models defined in the project.

To explore the lineage graphs of tests and macros, view [their resource details pages](#view-resource-details). By default, dbt Explorer excludes these resources from the full lineage graph unless a search query returns them as results.

<expandable alt_header="How can I interact with the full lineage graph?">

- Hover over any item in the graph to display the resource’s name and type.
- Zoom in and out on the graph by mouse-scrolling.
- Grab and move the graph and the nodes.
- Right click on a node (context menu) to:
    - Refocus on the node, including its upstream and downstream nodes
    - Refocus on the node and its downstream nodes only
    - Refocus on the node and it upstream nodes only
    - View the node's [resource details](#view-resource-details) page
- Select a resource to highlight its relationship with other resources in your project. A panel opens on the graph’s right-hand side that displays a high-level summary of the resource’s details. The side panel includes a **General** tab for information like description, materialized type, and other details.
    - Click the Share icon in the side panel to copy the graph’s link to your clipboard.
    - Click the View Resource icon in the side panel to [view the resource details](#view-resource-details). 
- Use [selectors](/reference/node-selection/methods) (in the search bar) to select specific resources or a subset of the DAG. This can help narrow the focus on the resources that interest you. All selectors are available for use, except those requiring a state comparison (result, source status, and state). You can also use the `--exclude` and the `--select` flag (which is optional). Examples:
    - `resource_type:model [RESOURCE_NAME]` &mdash; Returns all models matching the name search
    - `resource_type:metric,tag:nightly` &mdash; Returns metrics with the tag `nightly`
- Use [graph operators](/reference/node-selection/graph-operators) (in the search bar) to select specific resources or a subset of the DAG. This can help narrow the focus on the resources that interest you. Examples:
    - `+orders` &mdash; Returns all the upstream nodes of `orders`
    - `+dim_customers,resource_type:source` &mdash; Returns all sources that are upstream of `dim_customers`
- Use [set operators](/reference/node-selection/set-operators) (in the search bar) to select specific resources or a subset of the DAG. This can help narrow the focus on the resources that interest you. For example:
    - `+snowplow_sessions +fct_orders` &mdash; Use space-delineated arguments for a union operation. Returns resources that are upstream nodes of either `snowplow_sessions` or `fct_orders`.

- [View resource details](#view-resource-details) by selecting a node (double-clicking) in the graph.
- Click the List view icon in the graph's upper right corner to return to the main **Explore** page. 

</expandable>

### Example of lineage graph

Example of exploring the `order_items` model in the project's lineage graph:

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-project-lineage-graph.png" width="100%" title="Example of full lineage graph" />

## Lenses

The **Lenses** feature is available from your [project's lineage graph](#project-lineage) (lower right corner). Lenses are like map layers for your DAG. Lenses make it easier to understand your project’s contextual metadata at scale, especially to distinguish a particular model or a subset of models. 

When you apply a lens, tags become visible on the nodes in the lineage graph, indicating the layer value along with coloration based on that value. If you're significantly zoomed out, only the tags and their colors are visible in the graph.

<expandable alt_header="List of available lenses">

- **Default** (resource type)
- **Materialization Type** (for example, identifying incremental model dependencies)
- **Lastest Status** (for example, diagnosing a failed DAG region)
- **Model Layer** (for example, discovering marts models to analyze)
    - **Marts** &mdash; A model with the prefix `fct_` or `dim_` or a model that lives in the `/marts/` subdirectory.
    - **Intermediate** &mdash; A model with the prefix `int_`. Or, a model that lives in the `/int/` or `/intermediate/` subdirectory.
    - **Staging** &mdash; A model with the prefix `stg_`. Or, a model that lives in the `/staging/` subdirectory.

</expandable>

### Example of lenses

Example of applying the **Materialization Type** _lens_ with the lineage graph significantly zoomed out: 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-materialization-type-lense.png" width="100%" title="Example of the Materialization type lens" />


## Keyword search {#search-resources}

You can locate resources in your project by performing a keyword search in the search bar. All resource names, column names, resource descriptions, warehouse relations, and code matching your search criteria will be displayed as a list on the main (center) section of the page. When searching for an exact column name, the results show all relational nodes containing that column in their schemas. If there's a match, a notice in the search result indicates the resource contains the specified column. Also, you can apply filters to further refine your search results.

<expandable alt_header="Search features">

- **Partial keyword search** &mdash; This is also referred to as fuzzy search.
- **Exclude keywords** &mdash; Prepend a minus sign (-) to the keyword you want to exclude from search results. For example, `-user` will exclude all matches of that keyword from search results.
- **Boolean operators** &mdash; Use Boolean operators to enhance your keyword search. For example, the search results for `users OR github` will include matches for either keyword.
- **Phrase search** &mdash; Surround a string of keywords with double quotation marks to search for that exact phrase (for example, `"stg users"`). To learn more, refer to [Phrase search](https://en.wikipedia.org/wiki/Phrase_search) on Wikipedia.
- **SQL keyword search** &mdash; Use SQL keywords in your search. For example, the search results `int github users joined` will include matches that contain that specific string of keywords (similar to phrase searching).

</expandable>

<expandable alt_header="Filters side panel">

The **Filters** side panel becomes available after you perform a keyword search. Use this panel to further refine the results from your keyword search. By default, Explorer searches across all resources in the project. You can filter on:

- [Resource type](/docs/build/projects) (like models, sources, and so on)
- [Model access](/docs/collaborate/govern/model-access) (like public, private)
- [Model layer](/best-practices/how-we-structure/1-guide-overview) (like marts, staging)
- [Model materialization](/docs/build/materializations) (like view, table)
- [Tags](/reference/resource-configs/tags) (supports multi-select)

Under the the **Models** option, you can filter on model properties (access or materialization type). Also available are **Advanced** options, where you can limit the search results to column name, model code, and more.  

</expandable>

### Example of keyword search
Example of results from searching on the keyword `item` and applying the filters models, description, and code:

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-keyword-search.png" width="100%" title="Example of keyword search" />


## Browse with the sidebar

From the sidebar, you can browse your project's resources, its file tree, and the database. 

- **Resources** tab &mdash; All resources in the project organized by type. Select any resource type in the list and all those resources in the project will display as a table in the main section of the page. For a description on the different resource types (like models, metrics, and so on), refer to [About dbt projects](/docs/build/projects).
- **File Tree** tab &mdash; All resources in the project organized by the file in which they are defined. This mirrors the file tree in your dbt project repository.
- **Database** tab &mdash; All resources in the project organized by the database and schema in which they are built. This mirrors your data platform's structure that represents the [applied state](/docs/dbt-cloud-apis/project-state) of your project. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-search-sidebar.png" title="Example of tabs in sidebar" />

## View model versions

If models in the project are versioned, you can see which [version of the model](/docs/collaborate/govern/model-versions) is being applied &mdash; `prerelease`, `latest`, and `old` &mdash; in the title of the model’s details page and in the model list from the sidebar.

## View resource details {#view-resource-details}
You can view the definition and latest run results of any resource in your project. To find a resource and view its details, you can interact with the lineage graph, use search, or browse the catalog. 

The details (metadata) available to you depends on the resource’s type, its definition, and the [commands](/docs/deploy/job-commands) that run within jobs in the production environment. 

<expandable alt_header="What details are available for a model?">

- **Status bar** (below the page title) &mdash; Information on the last time the model ran, whether the run was successful, how the data is materialized, number of rows, and the size of the model. 
- **General** tab includes:
    - **Lineage** graph &mdash; The model’s lineage graph that you can interact with. The graph includes one upstream node and one downstream node from the model. Click the Expand icon in the graph's upper right corner to view the model in full lineage graph mode.
    - **Description** section &mdash; A [description of the model](/docs/collaborate/documentation#adding-descriptions-to-your-project).
    - **Recent** section &mdash; Information on the last time the model ran, how long it ran for, whether the run was successful, the job ID, and the run ID.
    - **Tests** section &mdash; [Tests](/docs/build/data-tests) for the model, including a status indicator for the latest test status. A :white_check_mark: denotes a passing test. 
    - **Details** section &mdash; Key properties like the model’s relation name (for example, how it’s represented and how you can query it in the data platform: `database.schema.identifier`); model governance attributes like access, group, and if contracted; and more.
    - **Relationships** section &mdash; The nodes the model **Depends On**, is **Referenced by**, and (if applicable) is **Used by** for projects that have declared the models' project as a dependency.
- **Code** tab &mdash; The source code and compiled code for the model.
- **Columns** tab &mdash; The available columns in the model. This tab also shows tests results (if any) that you can select to view the test's details page. A :white_check_mark: denotes a passing test. To filter the columns in the resource, you can use the search bar that's located at the top of the columns view. 

</expandable>

<expandable alt_header="What details are available for an exposure?">

- **Status bar** (below the page title) &mdash; Information on the last time the exposure was updated. 
- **General** tab includes:
    - **Status** section &mdash; The status on data freshness and data quality.
    - **Lineage** graph &mdash; The exposure’s lineage graph. Click the Expand icon in the graph's upper right corner to view the exposure in full lineage graph mode.
    - **Description** section &mdash; A description of the exposure.
    - **Details** section &mdash; Details like exposure type, maturity, owner information, and more.
    - **Relationships** section &mdash; The nodes the exposure **Depends On**.

</expandable>

<expandable alt_header="What details are available for a test?">

- **Status bar** (below the page title) &mdash; Information on the last time the test ran, whether the test passed, test name, test target, and column name. 
- **General** tab includes:
    - **Lineage** graph &mdash; The test’s lineage graph that you can interact with. The graph includes one upstream node and one downstream node from the test resource. Click the Expand icon in the graph's upper right corner to view the test in full lineage graph mode.
    - **Description** section &mdash; A description of the test.
    - **Recent** section &mdash; Information on the last time the test ran, how long it ran for, whether the test passed, the job ID, and the run ID.
    - **Details** section &mdash; Details like schema, severity, package, and more.
    - **Relationships** section &mdash; The nodes the test **Depends On**.
- **Code** tab &mdash; The source code and compiled code for the test.

</expandable>

<expandable alt_header="What details are available for each source table within a source collection?">

- **Status bar** (below the page title) &mdash; Information on the last time the source was updated and the number of tables the source uses. 
- **General** tab includes:
    - **Lineage** graph &mdash; The source’s lineage graph that you can interact with. The graph includes one upstream node and one downstream node from the source. Click the Expand icon in the graph's upper right corner to view the source in full lineage graph mode.
    - **Description** section &mdash; A description of the source.
    - **Source freshness** section &mdash; Information on whether refreshing the data was successful, the last time the source was loaded, the timestamp of when a run generated data, and the run ID.
    - **Details** section &mdash; Details like database, schema, and more.
    - **Relationships** section &mdash; A table that lists all the sources used with their freshness status, the timestamp of when freshness was last checked, and the timestamp of when the source was last loaded.
- **Columns** tab &mdash; The available columns in the source. This tab also shows tests results (if any) that you can select to view the test's details page. A :white_check_mark: denotes a passing test.

</expandable>

### Example of model details

Example of the details view for the model `supplies`: 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="100%" title="Example of resource details" />

## Staging environment <Lifecycle status='beta' />

dbt Explorer supports views for [Staging deployment enviornments](/docs/deploy/deploy-environments#staging-environment), in addition to the Production environment. This gives you a unique view into your pre-production data workflows with the same tools available in production. This allows you to control access to sensitive data and the added benefits of having a layer between development and production. Once the Staging environment is configured, it will be visible on the dbt Explorer landing page.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explore-staging-env.png" width="85%" title="Explore in a staging environment" />

## Related content
- [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions) 
- [About model governance](/docs/collaborate/govern/about-model-governance)
- Blog on [What is data mesh?](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh)
