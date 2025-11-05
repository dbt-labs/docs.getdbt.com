---
title: "Navigate the dbt Insights interface"
description: "Learn how to navigate the dbt Insights interface"
sidebar_label: "Navigate the interface"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
---

# Navigate the dbt Insights interface <Lifecycle status="managed,managed_plus" />

<IntroText>
Learn how to navigate <Constant name="query_page" /> interface and use the main components.
</IntroText>

<Constant name="query_page" /> provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of <Constant name="query_page" />. 

## Query console
The query console is the main component of <Constant name="query_page" />. It allows you to write, run, and analyze SQL queries. The Query console supports:
1. Query console editor, which allows you to write, run, and analyze SQL queries:
  - It supports syntax highlighting and autocomplete suggestions 
  - Hyperlink from SQL code `ref` to the corresponding Explorer page
2. [Query console menu](#query-console-menu), which contains **Bookmark (icon)**, **Develop**, and **Run** buttons. 
3. [Query output panel](#query-output-panel), below the query editor and displays the results of a query:
  - Has three tabs: **Data**, **Chart**, and **Details**, which allow you to analyze query execution and visualize results.
4. [Query console sidebar menu](#query-console-sidebar-menu), which contains the **<Constant name="explorer" />**, **Bookmark**, **Query history**, and **<Constant name="copilot" />** icons.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="dbt Insights main interface with blank query editor" />

### Query console menu
The Query console menu is located at the top right of the Query editor. It contains the **Bookmark**, **Develop**, and **Run** buttons:

- **Bookmark** button &mdash; Save your frequently used SQL queries as favorites for easier access.
  - When you click **Bookmark**, a **Bookmark Query Details** modal (pop up box) will appear where you can add a **Title** and **Description**.
  - Let [<Constant name="copilot" />](/docs/cloud/dbt-copilot) do the writing for you &mdash; use the AI assistant to automatically generate a helpful description for your bookmark.
  - Access the newly created bookmark from the **Bookmark** icon in the [Query console sidebar menu](#query-console-sidebar-menu). 
 - **Develop**: Open the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="visual_editor" />](/docs/cloud/canvas) to continue editing your SQL query.
- **Run** button &mdash; Run your SQL query and view the results in the **Data** tab.

## Query Builder <Lifecycle status="beta" />

Query Builder in dbt <Constant name="query_page" /> lets you build queries against the Semantic Layer without writing SQL code. It guides you in creating queries based on available metrics, dimensions, and entities. With Query Builder, you can:

- Build analyses from your predefined semantic layer metrics.
- Have filters, time ranges, and aggregates tailored to the semantic model.
- View the underlying SQL code for each metric query. 

To create a query in Query Builder:

1. From the main menu, go to **<Constant name="query_page" />**.
2. Click **Build a query**. 
3. Select what you want to include in your query.
    - Click **Add Metric** to select the metrics for your query. 
    - Click **Add Group by** to choose the dimensions that break down your metric, such as time grain (day, week, month), region, product, or customer.
    - Click **Add Filter** to create a filter to narrow your results.
    - Click **Add Order by** to select how you want to sort the results of your query. 
    - Click **Add Limit**, select the amount of results you want to see when you run your query. If left blank, you will get all the results. 
4. Click **Run** to run your query.
    Results are available in the **Data** tab. You can see the SQL code generated in the **Details** tab.

    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-interface.png" title="Query Builder in dbt Insights" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder.png" title="Results are displayed in the Data tab" />

    <Lightbox src="/img/docs/dbt-insights/insights-query-builder-sql.png" title="The generated SQL code in the Details tab" />

    </DocCarousel>

## Query output panel

The Query output panel is below the query editor and displays the results of a query. It displays the following tabs to analyze query execution and visualize results:
- **Data** tab &mdash; Preview your SQL results, with results paginated.
- **Details** tab &mdash; Generates succinct details of executed SQL query:
  - Query metadata &mdash; <Constant name="copilot" />'s AI-generated title and description. Along with the supplied SQL and compiled SQL.
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

**<Constant name="explorer" /> icon** &mdash; View your project's models, columns, metrics, and more using the integrated <Constant name="explorer" /> view.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights dbt Catalog icon" />

### Bookmark 

Save and access your frequently used queries. 

<Lightbox src="/img/docs/dbt-insights/manage-bookmarks.png" width="90%" title="Manage your query bookmarks" /> 

### Query history

View past queries, their statuses (All, Success, Error, or Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="dbt Insights Query history icon" />

### dbt Copilot

Use [dbt <Constant name="copilot" />'s AI assistant](/docs/cloud/dbt-copilot) to modify or generate queries using natural language prompts or to chat with the Analyst agent to gather insights about your data. There are two ways you can use dbt <Constant name="copilot" /> in <Constant name="query_page" /> to interact with your data:

<Lightbox src="/img/docs/dbt-insights/insights-copilot-tabs.png" width="90%" title="dbt Copilot in Insights" />

- **Agent** tab<Lifecycle status='private_beta' /> - Ask questions to the Analyst agent to get intelligent data analysis with automated workflows, governed insights, and actionable recommendations. This is a conversational AI feature where you can ask natural language prompts and receive analysis in real-time. To request access to the Analyst agent, [join the waitlist](https://www.getdbt.com/product/dbt-agents#dbt-Agents-signup).  

  Some sample questions you can ask the agent: 

  - _What region are my sales growing the fastest?_ 
  - _What was the revenue last month?_
  - _How should I optimize my marketing spend next quarter?_
  - _How many customers do I have, broken down by customer type?_

  The Analyst agent creates an analysis plan based on your question. The agent:

  1. Gets context using your semantic models and metrics. 
  2. Generates SQL queries using your project's definitions.  
  3. Executes the SQL query and returns results with context.
  4. Reviews and summarizes the generated insights and provides a comprehensive answer.

  The agent can loop through these steps multiple times if it hasn't reached a complete answer, allowing for complex, multi-step analysis.⁠

  For more information, see [Analyze data with the Analyst agent](/docs/cloud/use-dbt-copilot#analyze-data-with-the-analyst-agent).

- **Generate SQL** tab - Build queries in <Constant name="query_page" /> with natural language prompts to explore and query data with an intuitive, context-rich interface. For more information, see [Build queries](/docs/cloud/use-dbt-copilot#build-queries).

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

