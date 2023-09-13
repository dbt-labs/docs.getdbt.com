---
title: "Explore your dbt projects (beta)"
sidebar_label: "Explore dbt projects (beta)"
description: "Learn about dbt Explorer and how to interact with it to understand, improve, and leverage your data pipelines."
---

With dbt Explorer, you can view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their <Term id="data-lineage">lineage</Term> to gain a better understanding of its latest production state. Navigate and manage your projects within dbt Cloud to help your data consumers discover and leverage your dbt resources.

To display the details about your [project state](/docs/dbt-cloud-apis/project-state), dbt Explorer utilizes the metadata provided through the [Discovery API](/docs/dbt-cloud-apis/discovery-api). The metadata that's available on your project depends on the [deployment environment](/docs/deploy/deploy-environments) you've designated as _production_ in your dbt Cloud project. dbt Explorer automatically retrieves the metadata updates after each job run in the production deployment environment so it will always have the latest state on your project. The metadata it displays depends on the [commands executed by the jobs](/docs/deploy/job-commands). For instance:

- To update model details or results, you must run `dbt run` or `dbt build` on a given model within a job in the environment.
- To view catalog statistics and columns, you must run `dbt docs generate` within a job in the environment.
- To view test results, you must run `dbt test` or `dbt build` within a job in the environment.
- To view source freshness check results, you must run `dbt source freshness` within a job in the environment.

The need to run these commands will diminish, and richer, more timely metadata will become available as the Discovery API and its underlying platform evolve.

:::tip Join the beta

dbt Explorer is a [beta feature](/docs/dbt-versions/product-lifecycles#dbt-cloud) and subject to change without notification. More updates to this feature coming soon.

If you’re interested in joining the beta, please contact your account team.
 
:::

## Prerequisites

- You have a [multi-tenant](/docs/cloud/about-cloud/tenancy#multi-tenant) or AWS single-tenant dbt Cloud account on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).
- You have set up a [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment-beta) for each project you want to explore.
    - There has been at least one successful job run in the production deployment environment.
- You are on the dbt Explorer page.
    - To go to the page, select **Explore (Beta)** from the top navigation bar in dbt Cloud.

## Explore the project’s lineage

dbt Explorer provides a visualization of your project’s <Term id="dag">DAG</Term> that you can interact with. To start, select **Overview** in the left sidebar and click the **Explore Lineage** button on the main (center) section of the page. 

If you don't see the lineage graph immediately, click **Render Lineage**. It can take some time for the graph to render depending on the size of your project and your computer’s available memory. The graph of very large projects might not render so, instead, you can select a subset of nodes by using selectors.

The nodes in the lineage graph represent the project’s resources and the edges represent the relationships between the nodes. Resources like tests and macros display in the lineage within their [resource details pages](#view-resource-details) but not within the overall project lineage graph. Nodes are color-coded and include iconography according to their resource type.

To interact with the lineage graph, you can:

- Hover over any item in the graph to display the resource’s name and type.
- Zoom in and out on the graph by mouse-scrolling.
- Grab and move the graph.
- Click on a resource to highlight its relationship with other resources in your project.
- [Search and select specific resources](#search-resources) or a subset of the DAG using selectors and lineage (for example, `+[YOUR_RESOURCE_NAME]` displays all nodes upstream of a particular resource).
- [View resource details](#view-resource-details) by selecting a node in the graph (double-clicking).


<Lightbox src="/img/docs/collaborate/dbt-explorer/lineage-v1.gif" title="Explore the lineage graph" />


## Search for resources {#search-resources}
With the search bar (on the upper left of the page or in a lineage graph), you can search using keywords or selectors (also known as *selector methods*). The resources that match your search criteria will display as a table in the main section of the page. When you select a resource in the table, its [resource details page](#view-resource-details) will display.

When using keyword search, dbt Explorer will search through your resources using metadata such as resource type, resource name, column name, source name, tags, schema, database, version, alias/identifier, and package name.

When using selector search, you can utilize the dbt node selection syntax including set and graph operators (like `+`). To learn more about selectors, refer to [Syntax overview](/reference/node-selection/syntax), [Graph operators](/reference/node-selection/graph-operators), and [Set operators](/reference/node-selection/set-operators). 

Below are the selection methods currently available in dbt Explorer. For more information about each of them, refer to [Methods](/reference/node-selection/methods).   

- **fqn:** &mdash; Find resources by [file or fully qualified name](/reference/node-selection/methods#the-file-or-fqn-method).
- **source:** &mdash; Find resources by a specified [source](/reference/node-selection/methods#the-source-method).
- **resource_type:** &mdash; Find resources by their [type](/reference/node-selection/methods#the-resource_type-method).
- **package:** &mdash; Find resources by the [dbt package](/reference/node-selection/methods#the-package-method) that defines them.
- **tag:** &mdash; Find resources by a specified [tag](/reference/node-selection/methods#the-tag-method).

<VersionBlock firstVersion="1.5">

- **group:** &mdash; Find models defined within a specified [group](/reference/node-selection/methods#the-group-method).
- **access:** &mdash; Find models based on their [access](/reference/node-selection/methods#the-access-method) property.

</VersionBlock>

<Lightbox src="/img/docs/collaborate/dbt-explorer/search-v1.gif" title="Explore the search bar" />

## Use the catalog sidebar

By default, the catalog sidebar lists all your project’s resources. Select any resource type in the list and all those resources in the project will display as a table in the main section of the page. For a description on the different resource types (like models, metrics, and so on), refer to [About dbt projects](https://docs.getdbt.com/docs/build/projects). 

To browse using a different view, you can choose one of these options from the **View by** dropdown:

- **Resources** (default) &mdash; All resources in the project organized by type.
- **Packages** &mdash; All resources in the project organized by the project in which they are defined.
- **File Tree** &mdash; All resources in the project organized by the file in which they are defined. This mirrors the file tree in your dbt project repository.
- **Database** &mdash; All resources in the project organized by the database and schema in which they are built. This mirrors your data platform structure.

<Lightbox src="/img/docs/collaborate/dbt-explorer/catalog-sidebar-v1.gif" title="Explore the catalog sidebar" />

## View resource details {#view-resource-details}
You can view the definition and latest run results of any resource in your project. To find a resource and view its details, you can interact with the lineage graph, use search, or browse the catalog. The details (metadata) available to you depends on the resource’s type, its definition, and the [commands](/docs/deploy/job-commands) run within jobs in the production environment. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/model-resource-details-v1.gif" title="Explore a model's resource details" />



### Example of model details

An example of the details you might get for a model:

- **General** — The model’s lineage graph that you can interact with.
- **Code** — The source code and compiled code for the model.
- **Columns** — The available columns in the model.
- **Description** — A [description of the model](/docs/collaborate/documentation#adding-descriptions-to-your-project).
- **Recent** — Information on the last time the model ran, how long it ran for, whether the run was successful, the job ID, and the run ID.
- **Tests** — [Tests](/docs/build/tests) for the model.
- **Details** — Key properties like the model’s relation name (for example, how it’s represented and how you can query it in the data platform: `database.schema.identifier`); model governance attributes like access, group, and if contracted; and more.
- **Relationships** — The nodes the model **Depends On** and is **Referenced by.**

### Example of exposure details

An example of the details you might get for an exposure:

- **Status** — The status on data freshness and data quality.
- **Lineage** — The exposure’s lineage graph.
- **Description** — A description of the exposure.
- **Details** — Details like exposure type, maturity, owner information, and more.
- **Relationships** — The nodes the exposure **Depends On**.

### Example of test details

An example of the details you might get for a test:

- **General** — The test’s lineage graph that you can interact with.
- **Code** — The source code and compiled code for the test.
- **Description** — A description of the test.
- **Recent** — Information on the last time the test ran, how long it ran for, whether the test passed, the job ID, and the run ID.
- **Details** — Details like schema, severity, package, and more.
- **Relationships** — The nodes the test **Depends On**.

### Example of source details

An example of the details you might get for each source table within a source collection:

- **General** — The source’s lineage graph that you can interact with.
- **Columns** — The available columns in the source.
- **Description** — A description of the source.
- **Source freshness** — Information on whether refreshing the data was successful, the last time the source was loaded, the timestamp of when a run generated data, and the run ID.
- **Details** — Details like database, schema, and more.
- **Relationships** — A table that lists all the sources used with their freshness status, the timestamp of when freshness was last checked, and the timestamp of when the source was last loaded.