---
title: "Navigate the dbt Insights interface"
description: "Learn how to navigate the dbt Insights interface"
sidebar_label: "Navigate the interface"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Navigate the dbt Insights interface

<IntroText>
Learn how to navigate <Constant name="insights" /> interface and use the main components.
</IntroText>

<Constant name="insights" /> provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of <Constant name="insights" />. 

## Query console
The query console is the main component of <Constant name="insights" />. It allows you to write, run, and analyze SQL queries. The Query console supports:
1. Query console editor, which allows you to write, run, and analyze SQL queries:
  - It supports syntax highlighting and autocomplete suggestions 
  - Hyperlink from SQL code `ref` to the corresponding Explorer page
2. [Query console menu](#query-console-menu), which contains **Bookmark (icon)**, **Develop**, and **Run** buttons. 
3. [Query output panel](#query-output-panel), below the query editor and displays the results of a query:
  - Has three tabs: **Data**, **Chart**, and **Details**, which allow you to analyze query execution and visualize results.
4. [Query console sidebar menu](#query-console-sidebar-menu), which contains the **<Constant name="catalog" />**, **Bookmark**, and **Query history** icons.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="dbt Insights main interface with blank query editor" />

### Query console menu
The Query console menu is located at the top right of the Query editor. It contains the **Bookmark**, **Develop**, and **Run** buttons:

- **Bookmark** button &mdash; Save your frequently used SQL queries as favorites for easier access.
  - When you click **Bookmark**, a **Bookmark Query Details** modal (pop up box) will appear where you can add a **Title** and **Description**.
  - Access the newly created bookmark from the **Bookmark** icon in the [Query console sidebar menu](#query-console-sidebar-menu). 
 - **Develop**: Open the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) to continue editing your SQL query.
- **Run** button &mdash; Run your SQL query and view the results in the **Data** tab.

## Semantic Layer querying

The Semantic Layer querying in dbt <Constant name="insights" /> lets you build queries against the Semantic Layer without writing SQL code. It guides you in creating queries based on available metrics, dimensions, and entities. With this feature, you can:

- Build analyses from your predefined semantic layer metrics.
- Have filters, time ranges, and aggregates tailored to the semantic model.
- View the underlying SQL code for each metric query. 

To build a query in dbt <Constant name="insights" />:

1. From the main menu, go to **<Constant name="insights" />**.
2. Click **Build a query**.
3. From the Environment dropdown, select **PROD** or **STG**. Even thought you see **DEV** as an option, queries against development environments are deferred based on deferral rules, so selecting it will not query your development environment directly.
4. Select what you want to include in your query.
    - Click **Add Metric** to select the metrics for your query. 
    - Click **Add Group by** to choose the dimensions that break down your metric, such as time grain (day, week, month), region, product, or customer.
    - Click **Add Filter** to create a filter to narrow your results.
    - Click **Add Order by** to select how you want to sort the results of your query. 
    - Click **Add Limit**, select the amount of results you want to see when you run your query. If left blank, you will get all results. 
5. Click **Run** to run your query.
    Results are available in the **Data** tab. You can see the SQL code generated in the **Details** tab.

    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-interface.png" title="Semantic Layer querying within dbt Insights" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder.png" title="Results are displayed in the Data tab" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-sql.png" title="The generated SQL code in the Details tab" />

    </DocCarousel>

## Query output panel

The Query output panel is below the query editor and displays the results of a query. It displays the following tabs to analyze query execution and visualize results:
- **Data** tab &mdash; Preview your SQL results, with results paginated.
- **Details** tab &mdash; Generates succinct details of executed SQL query:
  - Query metadata &mdash; The supplied SQL and compiled SQL.
  - Connection details &mdash; Relevant data platform connection information.
  - Query details &mdash; Query duration, status, column count, row count.
- **Chart** tab &mdash; Visualizes query results with built-in charts. 
  - Use the chart icon to select the type of chart you want to visualize your results. Available chart types are **line chart, bar chart, or scatterplot**.
  - Use the **Chart settings** to customize the chart type and the columns you want to visualize. 
  - Available chart types are **line chart, bar chart, or scatterplot**.
- **Download**  button &mdash; Allows you to export the results to CSV

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-chart-tab.png" width="95%" title="dbt Insights Data tab" />
<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="dbt Insights Chart tab" />
<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="dbt Insights Details tab" />
</DocCarousel>

## Query console sidebar menu
The Query console sidebar menu and icons contains the following options:

### dbt Catalog

**<Constant name="catalog" /> icon** &mdash; View your project's models, columns, metrics, and more using the integrated <Constant name="catalog" /> view.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights dbt Catalog icon" />

### Bookmark 

Save and access your frequently used queries from the query console sidebar.

To save and manage bookmarks:

1. Click **Bookmark** in the [Query console menu](#query-console-menu) to save the current query. In the **Bookmark Query Details** modal, add a **Title** and **Description**.
2. Select the **Bookmark** icon in the sidebar to open your list of saved queries.
3. Select a saved Insight to view its details or open it in the query editor.

For sharing saved Insights and version history, check out [Save your Insights](/docs/explore/access-dbt-insights#save-your-insights).

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-insights/save-insights-modal.png" width="95%" title="Bookmark Query Details modal" />

<Lightbox src="/img/docs/dbt-insights/manage-bookmarks.png" width="90%" title="Manage your query bookmarks" />

<Lightbox src="/img/docs/dbt-insights/view-saved-insights.png" width="95%" title="List view of saved Insights" />

</DocCarousel>

### Query history

View past queries, their statuses (All, Success, Error, or Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="dbt Insights Query history icon" />

## LSP features

The following Language Server Protocol (LSP) features are available for projects upgraded to <Constant name="fusion" />:

- **Live CTE previews:** Preview a CTE’s output for faster validation and debugging.

    <Lightbox src="/img/docs/dbt-insights/preview-cte.png" width="90%" title="Preview CTE in Insights" />

- **Real-time error detection:** Automatically validate your SQL code to detect errors and surface warnings, without hitting the warehouse. This includes both dbt errors (like invalid `ref`) and SQL errors (like invalid column name or SQL syntax).

    <Lightbox src="/img/docs/dbt-insights/sql-validation.png" width="90%" title="Live error detection" />

- **`ref` suggestions:** Autocomplete model names when using the `ref()` function to reference other models in your project.
  
    <Lightbox src="/img/docs/dbt-insights/ref-autocomplete.png" width="90%" title="ref suggestions in Insights" />

- **Hover insights:** View context on tables, columns, and functions without leaving your code. Hover over any SQL element to see details like column names and data types.

    <DocCarousel slidesPerView={1}>
    <Lightbox src="/img/docs/dbt-insights/column-info.png" width="60%" title="Sample column details" />
    <Lightbox src="/img/docs/dbt-insights/column-hover.png" width="60%" title="Sample column details" />
    </DocCarousel>

