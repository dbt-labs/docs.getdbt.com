---
title: "Discover data with Catalog"
sidebar_label: "Discover data with Catalog"
description: "Learn about Catalog and how to interact with it to understand, improve, and leverage your dbt projects."
image: /img/docs/collaborate/dbt-explorer/example-project-lineage-graph.png
pagination_next: "docs/explore/data-health-signals"
pagination_prev: null
---
 

# Discover data with Catalog <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>

With <Constant name="catalog" />, you can view your project's [resources](/docs/build/projects) (such as models, tests, and metrics), their <Term id="data-lineage">lineage</Term>, and [model consumption](/docs/explore/view-downstream-exposures) to gain a better understanding of its latest production state.

</IntroText>

Use <Constant name="catalog" /> to navigate and manage your projects within <Constant name="dbt" /> to help you and other data developers, analysts, and consumers discover and leverage your dbt resources. <Constant name="catalog" /> integrates with the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), [dbt <Constant name="insights" />](/docs/explore/dbt-insights), [<Constant name="orchestrator" />](/docs/deploy/deployments), and [<Constant name="canvas" />](/docs/platform/canvas) to help you develop or view your dbt resources.

## Prerequisites

- You have a <Constant name="dbt" /> account on the [Starter, Enterprise, or Enterprise+ plan](https://www.getdbt.com/pricing/).
- You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) or [staging](/docs/deploy/deploy-environments#create-a-staging-environment) deployment environment for each project you want to explore.
- You have at least one successful job run in the deployment environment. Note that [CI jobs](/docs/deploy/ci-jobs) do not update <Constant name="catalog" />. 
- You are on the <Constant name="catalog" /> page. To do this, select **Catalog** from the top-level navigation in <Constant name="dbt" />.

import Generatemetadata from '/snippets/_generate-metadata.md';

<Generatemetadata /> 

:::tip
If your organization works in both dbt Core and Cloud, you can unify these workflows by automatically uploading dbt Core artifacts into dbt Cloud and viewing them in <Constant name="catalog" /> for a more connected dbt experience. To learn more, visit [hybrid projects](/docs/deploy/hybrid-projects).
:::

### External metadata ingestion <Lifecycle status="preview" />

Connect directly to your data warehouse with [external metadata ingestion](/docs/explore/external-metadata-ingestion), giving you visibility into tables, views, and other resources that aren't defined in dbt with <Constant name="catalog" />.

We create dbt metadata and pull external metadata. <Constant name="catalog" /> uses the metadata provided by the [Discovery API](/docs/dbt-apis/discovery-api) to display details about the state of your project. The available metadata depends on which [deployment environment](/docs/deploy/deploy-environments) you’ve designated as production or staging in your dbt project.

## Catalog overview 

:::info [Global navigation](/docs/explore/global-navigation) <Lifecycle status='self_service,managed,managed_plus' />

<Constant name="catalog" /> introduces the ability to widen your search by including dbt resources (models, seeds, snapshots, sources, exposures, and more) across your entire account. This broadens the results returned and gives you greater insight into all the assets across your dbt projects. Learn more in [Global navigation](/docs/explore/global-navigation) or in our [video overview](https://www.loom.com/share/ae93b3d241cd439fbe5f98f5e6872113?).

:::

Navigate the <Constant name="catalog" /> overview page to access your project's resources and metadata. The page includes the following sections:

- **Search bar** &mdash; [Search](#search-resources) for resources in your project by keyword. You can also use filters to refine your search results.
- **Sidebar** &mdash; Use the left sidebar to browse your project's [resources, file tree, and database](#browse-with-the-sidebar) in the lower section of the sidebar. You can also browse model [performance](/docs/explore/model-performance) and [project recommendations](/docs/explore/project-recommendations) depending on your plan. Refer to [Availability by plan](#availability-by-plan) for more info.
    - Find your project recommendations within your project's landing page.*
- **Lineage graph** &mdash; Explore your project's or account's [lineage graph](#project-lineage) to visualize the relationships between resources.
- **ERD view** &mdash; Explore structural relationships between models to understand potential join paths and connecting keys for analysis. <Lifecycle status="Alpha" />
- **Latest updates** &mdash; View the latest changes or issues related to your project's resources, including the most recent job runs, changed properties, lineage, and issues.
- **Marts and public models** &mdash; View the [marts](/best-practices/how-we-structure/1-guide-overview#guide-structure-overview) and [public models](/docs/mesh/govern/model-access#access-modifiers) in your project. You can also navigate to all public models in your account through this view.
- **Model query history** &mdash; Use [model query history](/docs/explore/model-query-history) to track consumption queries on your models for deeper insights.
- **Visualize downstream exposures** &mdash; [Set up](/docs/platform-integrations/downstream-exposures-tableau) and [visualize downstream exposures](/docs/explore/view-downstream-exposures) to automatically expose relevant data models from Tableau to enhance visibility.
- **Data health signals** &mdash; View the [data-health-signals](/docs/explore/data-health-signals) for each resource to understand its health and performance.

### Catalog permissions

When using global navigation and searching across your projects, the following permissions apply.

- Your project access permissions determine which dbt projects appear in the left-hand menu of the global navigation.
- In <Constant name="catalog" /> searches, we use soft access controls, you'll see all matching resources in search results, with clear indicators for items you don't have access to.
- For external metadata, the global platform credential controls which resources metadata users can discover. See [External metadata ingestion](/docs/explore/external-metadata-ingestion) for more details.

### Availability by plan

<Constant name="catalog" /> is available on all Starter, Enterprise, and Enterprise+ plans. However, certain features are only available on Enterprise and Enterprise+ plans:

| Feature | Starter | Enterprise | Enterprise+ |
|---------|:-------:|:----------:|:-----------:|
| Core lineage & resource browsing | ✅ | ✅ | ✅ |
| [Global navigation](/docs/explore/global-navigation) | ✅ | ✅ | ✅ |
| [Data health signals](/docs/explore/data-health-signals) | ✅ | ✅ | ✅ |
| [ERD view](#explore-your-projects-erd-view) <Lifecycle status="Alpha" /> | ✅ | ✅ | ✅ |
| [Model performance](/docs/explore/model-performance) | ❌ | ✅ | ✅ |
| [Project recommendations](/docs/explore/project-recommendations) | ❌ | ✅ | ✅ |
| [Column-level lineage](/docs/explore/column-level-lineage) | ❌ | ✅ | ✅ |
| [Multi-project lineage](/docs/explore/explore-multiple-projects) | ❌ | ✅ | ✅ |
| [Model query history](/docs/explore/model-query-history) | ❌ | ✅ | ✅ |
| [Downstream exposures](/docs/explore/view-downstream-exposures) | ❌ | ✅ | ✅ |
| [Data health tile](/docs/explore/data-tile) | ❌ | ✅ | ✅ |
| [External metadata ingestion](/docs/explore/external-metadata-ingestion) | ❌ | ✅ | ✅ |

import ExplorerCourse from '/snippets/_explorer-course-link.md';

<ExplorerCourse />

## Explore your project's lineage graph {#project-lineage}

<Constant name="catalog" /> provides a visualization of your project's <Term id="dag">DAG</Term> that you can interact with. To access the project's full lineage graph, select **Overview** in the left sidebar and click the **Explore Lineage** button on the main (center) section of the page.

If you don't see the project lineage graph immediately, click **Render Lineage**. It can take some time for the graph to render depending on the size of your project and your computer's available memory. The graph of very large projects might not render so you can select a subset of nodes by using selectors, instead.

The nodes in the lineage graph represent the project's resources and the edges represent the relationships between the nodes. Nodes are color-coded and include iconography according to their resource type.

By default, <Constant name="catalog" /> shows the project's [applied state](/docs/dbt-apis/project-state#definition-logical-vs-applied-state-of-dbt-nodes) lineage. That is, it shows models that have been successfully built and are available to query, not just the models defined in the project.

To explore the lineage graphs of tests and macros, view [their resource details pages](#view-resource-details). By default, <Constant name="catalog" /> excludes these resources from the full lineage graph unless a search query returns them as results.

<Expandable alt_header="How can I interact with the full lineage graph?">

- Hover over any item in the graph to display the resource's name and type.
- Zoom in and out on the graph by mouse-scrolling.
- Grab and move the graph and the nodes.
- Right-click on a node (context menu) to:
    - Refocus on the node, including its upstream and downstream nodes
    - Refocus on the node and its downstream nodes only
    - Refocus on the node and it upstream nodes only
    - View the node's [resource details](#view-resource-details) page
- Select a resource to highlight its relationship with other resources in your project. A panel opens on the graph's right-hand side that displays a high-level summary of the resource's details. The side panel includes a **General** tab for information like description, materialized type, and other details. In the side panel's upper right corner:
    - Click the View Resource icon to [view the resource details](#view-resource-details).
    - Click the [Open in IDE](#open-in-ide) icon to examine the resource using the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).
    - Click the Copy Link to Page icon to copy the page's link to your clipboard.
- Use [selectors](/reference/node-selection/methods) (in the search bar) to select specific resources or a subset of the DAG. This can help narrow the focus on the resources that interest you. All selectors are available for use, except those requiring a state comparison (result, source status, and state). You can also use the `--exclude` and the `--select` flag (which is optional). Examples:
    - `resource_type:model [RESOURCE_NAME]` &mdash; Returns all models matching the name search
    - `resource_type:metric,tag:nightly` &mdash; Returns metrics with the tag `nightly`
- Use [graph operators](/reference/node-selection/graph-operators) (in the search bar) to select specific resources or a subset of the DAG. This can help narrow the focus on the resources that interest you. Examples:
    - `+orders` &mdash; Returns all the upstream nodes of `orders`
    - `+dim_customers,resource_type:source` &mdash; Returns all sources that are upstream of `dim_customers`
- Use [set operators](/reference/node-selection/set-operators) (in the search bar) to select specific resources or a subset of the DAG. This can help narrow the focus on the resources that interest you. For example:
    - `+snowplow_sessions +fct_orders` &mdash; Use space-delineated arguments for a union operation. Returns resources that are upstream nodes of either `snowplow_sessions` or `fct_orders`.

- [View resource details](#view-resource-details) by selecting a node (double-clicking) in the graph.
- Click **Lenses** (lower right corner of the graph) to use <Constant name="catalog" /> [lenses](#lenses) feature.

</Expandable>

### Example of full lineage graph

Example of exploring a model in the project's lineage graph:

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-project-lineage-graph.png" width="100%" title="Example of full lineage graph" />

## Explore your project's ERD view <Lifecycle status="Alpha" />

[Entity relationship diagrams (ERD)](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model) in <Constant name="catalog" /> help you understand how models relate structurally. This includes which models can be joined and which keys connect them. ERD complements lineage by showing relationship paths for analysis, not only transformation dependencies.

:::info
ERD is currently in alpha and is enabled for selected customer accounts. To request access for your account, contact your account manager.
:::

To access ERD in <Constant name="catalog" />:

1. Navigate to **<Constant name="catalog"/>** in the top-level navigation.
2. Select a model.
3. Open the **Relationships** tab (marked **alpha**) on the model's resource details page to access ERD.

<Lightbox src="/img/docs/collaborate/dbt-explorer/erd-in-catalog.png" width="100%" title="Open the Relationships tab in Catalog to access ERD." />

### Why ERD is useful

When you explore an unfamiliar part of your business data (for example, `orders`, `customers`, or `subscriptions`), you often need to answer questions like which dimensions you can access when you join models.

Without ERD, you may need to inspect schema files manually, run local tooling, or ask teammates. ERD brings this context into <Constant name="catalog" /> so you can investigate faster in <Constant name="dbt_platform" />.

### ERD versus lineage

ERD and lineage answer different questions:

- **Lineage (DAG)** shows how data is built, that is, the transformation dependencies between resources.
- **ERD** shows how data is related for analysis, that is, which models can be joined and which keys connect them.

Use lineage to understand build flow. Use ERD to understand join paths.

### How ERD determines relationships

In <Constant name="catalog" />, ERD builds model connections using metadata from your dbt project. This includes relationship tests, model contracts, and <Constant name="semantic_layer" /> entities.

If ERD cannot find enough explicit relationship metadata, it can also suggest likely model connections based on available dbt context.

Because ERD relies on dbt metadata, relationships defined only in your warehouse might not appear unless that relationship metadata is also represented in data that <Constant name="catalog" /> uses.

ERD supports multiple overlays so you can compare explicit and suggested connections:

- **Relationship tests**: Relationships defined in `schema.yml` tests.
- **<Constant name="semantic_layer" /> entities**: Relationships inferred from MetricFlow entity definitions, such as primary and foreign entity matches.
- **Foreign key (FK) constraints**: Relationships derived from foreign key constraints in model contracts.
- **Heuristic inferred**: Candidate relationships inferred from `_id` naming patterns and scored by confidence.

### Understanding summary and overlay state

Each overlay uses a distinct visual style and color in the ERD canvas so you can quickly identify relationship sources.

The relationships summary panel shows relationship totals, model count, and a per-type breakdown for the current graph scope.

Overlay controls reflect availability:

- If a relationship type exists in the current scope, you can toggle it on or off.
- If no connections of that type exist, the toggle is disabled and marked as unavailable in the current view.

<Lightbox src="/img/docs/collaborate/dbt-explorer/erd-overlay-toggle.png" width="100%" title="Toggle ERD relationship types based on availability in the current scope." />

### Confidence and review for inferred relationships

Relationship tests and FK constraints are stronger signals because they are defined directly in your project.

When explicit relationship metadata is limited, ERD suggests additional relationships to support discovery. For heuristic suggestions, you can:

- Inspect confidence and supporting evidence.
- Review a generated YAML snippet.
- Approve or dismiss individual suggestions.
- Approve all high-confidence suggestions in bulk.

### What you can do in ERD

In an ERD, you can:

- Navigate with zoom, pan, and minimap.
- Filter by schema or domain scope.
- Search and highlight matching models.
- Click any edge type to inspect relationship details.
- Open a model details panel for metadata, columns, and relationships.
- Set a model as focus to recenter the graph on that model and its one-hop neighbors.

### Consideration

Use ERD for testing and exploration only. Because the feature is still maturing, behavior and interfaces may change, including potentially breaking changes.

## Lenses

The **Lenses** feature is available from your [project's lineage graph](#project-lineage) (lower right corner). Lenses are like map layers for your DAG. Lenses make it easier to understand your project's contextual metadata at scale, especially to distinguish a particular model or a subset of models.

When you apply a lens, tags become visible on the nodes in the lineage graph, indicating the layer value along with coloration based on that value. If you're significantly zoomed out, only the tags and their colors are visible in the graph.

Lenses are helpful to analyze a subset of the DAG if you're zoomed in, or to find models/issues from a larger vantage point.

<Expandable alt_header="List of available lenses">

A resource in your project is characterized by resource type, materialization type, or model layer, as well as its latest run or latest test status. Lenses are available for the following metadata:

- **Resource type**: Organizes resources by resource type, such as models, tests, seeds, saved query, and [more](/docs/build/projects). Resource type uses the `resource_type` selector.
- **Materialization type**: Identifies the strategy for building the dbt models in your data platform.
- **Latest status**: The status from the latest execution of the resource in the current environment. For example, diagnosing a failed DAG region.
- **Model layer**: The modeling layer that the model belongs to according to [best practices guide](/best-practices/how-we-structure/1-guide-overview#guide-structure-overview). For example, discovering marts models to analyze.
    - **Marts** &mdash; A model with the prefix `fct_` or `dim_` or a model that lives in the `/marts/` subdirectory.
    - **Intermediate** &mdash; A model with the prefix `int_`. Or, a model that lives in the `/int/` or `/intermediate/` subdirectory.
    - **Staging** &mdash; A model with the prefix `stg_`. Or, a model that lives in the `/staging/` subdirectory.
- **Test status**: The status from the latest execution of the tests that ran again this resource. In the case that a model has multiple tests with different results, the lens reflects the 'worst case' status.
- **Consumption query history**: The number of queries against this resource over a given time period.

</Expandable>

### Example of lenses

Example of applying the **Materialization type** _lens_ with the lineage graph zoomed out. In this view, each model name has a color according to the materialization type legend at the bottom, which specifies the materialization type. This color-coding helps to quickly identify the materialization types of different models.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-materialization-type.jpg" width="100%" title="Example of the Materialization type lens" />

Example of applying the **Tests Status** _lens_, where each model name displays the tests status according to the legend at the bottom, which specifies the test status.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-test-status.jpg" width="100%" title="Example of the Test Status lens" />

## Keyword search {#search-resources}

With <Constant name="catalog" />, global navigation provides a search experience allowing you to find dbt resources across all your projects, as well as non-dbt resources in Snowflake.

You can locate resources in your project by performing a keyword search in the search bar. All resource names, column names, resource descriptions, warehouse relations, and code matching your search criteria will be displayed as a list on the main (center) section of the page. When searching for an exact column name, the results show all relational nodes containing that column in their schemas. If there's a match, a notice in the search result indicates the resource contains the specified column. Also, you can apply filters to further refine your search results.

<Expandable alt_header="Search features">

- **Partial keyword search** &mdash; Also referred to as fuzzy search. <Constant name="catalog" /> uses a "contains" logic to improve your search results. This means you can search for partial terms without knowing the exact root word of your search term.
- **Exclude keywords** &mdash; Prepend a minus sign (-) to the keyword you want to exclude from search results. For example, `-user` will exclude all matches of that keyword from search results.
- **Boolean operators** &mdash; Use Boolean operators to enhance your keyword search. For example, the search results for `users OR github` will include matches for either keyword.
- **Phrase search** &mdash; Surround a string of keywords with double quotation marks to search for that exact phrase (for example, `"stg users"`). To learn more, refer to [Phrase search](https://en.wikipedia.org/wiki/Phrase_search) on Wikipedia.
- **SQL keyword search** &mdash; Use SQL keywords in your search. For example, the search results `int github users joined` will include matches that contain that specific string of keywords (similar to phrase searching).

</Expandable>

<Expandable alt_header="Filters side panel">

The **Filters** side panel becomes available after you perform a keyword search. Use this panel to further refine the results from your keyword search. By default, <Constant name="catalog" /> searches across all resources in the project. You can filter on:

- [Resource type](/docs/build/projects) (like models, sources, and so on)
- [Model access](/docs/mesh/govern/model-access) (like public, private)
- [Model layer](/best-practices/how-we-structure/1-guide-overview) (like marts, staging)
- [Model materialization](/docs/build/materializations) (like view, table)
- [Tags](/reference/resource-configs/tags) (supports multi-select)

Under the **Models** option, you can filter on model properties (access or materialization type). Also available are **Advanced** options, where you can limit the search results to column name, model code, and more.

</Expandable>

<Expandable alt_header="Global navigation">

<Constant name="catalog" /> builds on the functionality of the old navigation and introduces exciting new capabilities to enhance your experience. For more information, refer to [Global navigation](/docs/explore/global-navigation).

</Expandable>

### Example of keyword search

Example of results from searching on the keyword `customers` and applying the filters models, description, and code. [Data health signals](/docs/explore/data-health-signals) are visible to the right of the model name in the search results.

## Browse with the sidebar

From the sidebar, you can browse your project's resources, its file tree, and the database.

- **Resources** tab &mdash; All resources in the project organized by type. Select any resource type in the list and all those resources in the project will display as a table in the main section of the page. For a description on the different resource types (like models, metrics, and so on), refer to [About dbt projects](/docs/build/projects).
  - [Data health signals](/docs/explore/data-health-signals) are visible to the right of the resource name under the **Health** column.
- **File Tree** tab &mdash; All resources in the project organized by the file in which they are defined. This mirrors the file tree in your dbt project repository.
- **Database** tab &mdash; All resources in the project organized by the database and schema in which they are built. This mirrors your data platform's structure that represents the [applied state](/docs/dbt-apis/project-state) of your project.

## Integrated tool access

Users with a [developer license](/docs/platform/manage-access/about-user-access#license-based-access-control) or an analyst seat\* can open a resource directly from the <Constant name="catalog" /> in the <Constant name="studio_ide" /> to view its model files, in <Constant name="insights" /> to query it, or in <Constant name="canvas" /> for visual editing.

\* The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.

## View model versions

If models in the project are versioned, you can see which [version of the model](/docs/mesh/govern/model-versions) is being applied &mdash; `prerelease`, `latest`, and `old` &mdash; in the title of the model's details page and in the model list from the sidebar.

## View resource details {#view-resource-details}
You can view the definition and latest run results of any resource in your project. To find a resource and view its details, you can interact with the lineage graph, use search, or browse the <Constant name="catalog" />.

The details (metadata) available to you depends on the resource's type, its definition, and the [commands](/docs/deploy/job-commands) that run within jobs in the production environment.

In the upper right corner of the resource details page, you can:
- Click the [Open in <Constant name="studio_ide" />](#open-in-ide) icon to examine the resource using the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).
- Click the Share icon to copy the page's link to your clipboard.

<Expandable alt_header="What details are available for a model?">

- **Data health signals** &mdash; [Data health signals](/docs/explore/data-health-signals) offer a quick, at-a-glance view of data health. These icons indicate whether a model is Healthy, Caution, Degraded, or Unknown. Hover over an icon to view detailed information about the model's health.
- **Status bar** (below the page title) &mdash; Information on the last time the model ran, whether the run was successful, how the data is materialized, number of rows, and the size of the model.
- **General** tab includes:
    - **Lineage** graph &mdash; The model's lineage graph that you can interact with. The graph includes one upstream node and one downstream node from the model. Click the Expand icon in the graph's upper right corner to view the model in full lineage graph mode.
    - **Description** section &mdash; A [description of the model](/docs/build/documentation#adding-descriptions-to-your-project).
    - **Recent** section &mdash; Information on the last time the model ran, how long it ran for, whether the run was successful, the job ID, and the run ID.
    - **Tests** section &mdash; [Data tests](/docs/build/data-tests) for the model, including a status indicator for the latest test status. A :white_check_mark: denotes a passing test.
    - **Details** section &mdash; Key properties like the model's relation name (for example, how it's represented and how you can query it in the data platform: `database.schema.identifier`); model governance attributes like access, group, and if contracted; and more.
    - **Relationships** section &mdash; The nodes the model **Depends On**, is **Referenced by**, and (if applicable) is **Used by** for projects that have declared the models' project as a dependency.
- **Code** tab &mdash; The source code and compiled code for the model.
- **Columns** tab &mdash; The available columns in the model. This tab also shows tests results (if any) that you can select to view the test's details page. A :white_check_mark: denotes a passing test. To filter the columns in the resource, you can use the search bar that's located at the top of the columns view.

</Expandable>

<Expandable alt_header="What details are available for an exposure?">

- **Status bar** (below the page title) &mdash; Information on the last time the exposure was updated.
- **Data health signals** &mdash; [Data health signals](/docs/explore/data-health-signals) offer a quick, at-a-glance view of data health. These icons indicate whether a resource is Healthy, Caution, or Degraded. Hover over an icon to view detailed information about the exposure's health.
- **General** tab includes:
    - **Data health** &mdash; The status on data freshness and data quality.
    - **Status** section &mdash; The status on data freshness and data quality.
    - **Lineage** graph &mdash; The exposure's lineage graph. Click the **Expand** icon in the graph's upper right corner to view the exposure in full lineage graph mode. Integrates natively with Tableau and auto-generates downstream lineage.
    - **Description** section &mdash; A description of the exposure.
    - **Details** section &mdash; Details like exposure type, maturity, owner information, and more.
    - **Relationships** section &mdash; The nodes the exposure **Depends On**.

</Expandable>

<Expandable alt_header="What details are available for a test?">

- **Status bar** (below the page title) &mdash; Information on the last time the test ran, whether the test passed, test name, test target, and column name. Defaults to all if not specified.
- **Test Type** (next to the Status bar) &mdash; Information on the different test types available: Unit test or Data test. Defaults to all if not specified.

When you select a test, the following details are available:
- **General** tab includes:
    - **Lineage** graph &mdash; The test's lineage graph that you can interact with. The graph includes one upstream node and one downstream node from the test resource. Click the Expand icon in the graph's upper right corner to view the test in full lineage graph mode.
    - **Description** section &mdash; A description of the test.
    - **Recent** section &mdash; Information on the last time the test ran, how long it ran for, whether the test passed, the job ID, and the run ID.
    - **Details** section &mdash; Details like schema, severity, package, and more.
    - **Relationships** section &mdash; The nodes the test **Depends On**.
- **Code** tab &mdash; The source code and compiled code for the test.

Example of the Tests view:

</Expandable>

<Expandable alt_header="What details are available for each source table within a source collection?">

- **Status bar** (below the page title) &mdash; Information on the last time the source was updated and the number of tables the source uses.
- **Data health signals** &mdash; [Data health signals](/docs/explore/data-health-signals) offer a quick, at-a-glance view of data health. These icons indicate whether a resource is Healthy, Caution, or Degraded. Hover over an icon to view detailed information about the source's health.
- **General** tab includes:
    - **Lineage** graph &mdash; The source's lineage graph that you can interact with. The graph includes one upstream node and one downstream node from the source. Click the Expand icon in the graph's upper right corner to view the source in full lineage graph mode.
    - **Description** section &mdash; A description of the source.
    - **Source freshness** section &mdash; Information on whether refreshing the data was successful, the last time the source was loaded, the timestamp of when a run generated data, and the run ID.
    - **Details** section &mdash; Details like database, schema, and more.
    - **Relationships** section &mdash; A table that lists all the sources used with their freshness status, the timestamp of when freshness was last checked, and the timestamp of when the source was last loaded.
- **Columns** tab &mdash; The available columns in the source. This tab also shows tests results (if any) that you can select to view the test's details page. A :white_check_mark: denotes a passing test.

</Expandable>

### Example of model details

<DocCarousel slidesPerView={1}>

Example of the details view for the model `customers`:<br /> <Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="95%" title="Example of resource details" />

<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="Example of downstream exposure details for Tableau."/>

</DocCarousel>


## Staging environment

<Constant name="catalog" /> supports views for [staging deployment environments](/docs/deploy/deploy-environments#staging-environment), in addition to the production environment. This gives you a unique view into your pre-production data workflows, with the same tools available in production, while providing an extra layer of scrutiny.

You can explore the metadata from your production or staging environment to inform your data development lifecycle. Just [set a single environment](/docs/deploy/deploy-environments) per <Constant name="dbt" /> project as "production" or "staging," and ensure the proper metadata has been generated then you'll be able to view it in <Constant name="catalog" />. Refer to [Generating metadata](/docs/explore/explore-projects#generate-metadata) for more details.

## Related content
- [Enterprise permissions](/docs/platform/manage-access/enterprise-permissions)
- [About model governance](/docs/mesh/govern/about-model-governance)
- Blog on [What is data mesh?](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh)
