---
title: "Navigate the dbt Insights interface"
description: "Learn how to navigate the dbt Insights interface"
sidebar_label: "Navigation interface"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
---

# Navigate the dbt Insights interface <Lifecycle status="preview,managed,managed_plus" />

<IntroText>
Learn how to navigate <Constant name="query_page" /> interface and use the main components.
</IntroText>

<Constant name="query_page" /> provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of <Constant name="query_page" />. 

## Query console
The query console is the main component of <Constant name="query_page" />. It allows you to write, run, and analyze SQL queries. The Query console supports:
- Query console editor, which allows you to write, run, and analyze SQL queries:
  - It supports syntax highlighting and autocomplete suggestions 
  - Hyperlink from SQL code `ref` to the corresponding Explorer page
- [Query console menu](#query-console-menu), which contains **Bookmark (icon)**, **Develop**, and **Run** buttons. 
- [Query output panel](#query-output-panel), below the query editor and displays the results of a query:
  - Has three tabs: **Results**, **Details**, and **Chart**, which allow you to analyze query execution and visualize results.
- [Query console sidebar menu](#query-console-sidebar-menu), which contains the **<Constant name="explorer" />**, **Bookmark**, **Query history**, and **<Constant name="copilot" />** icons.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="dbt Insights main interface with blank query editor" />

### Query console menu
The Query console menu is located at the top right of the Query editor. It contains the **Bookmark**, **Develop**, and **Run** buttons:

- **Bookmark** button &mdash; Save your frequently used SQL queries as favorites for easier access.
  - When you click **Bookmark**, a **Bookmark Query Details** modal (pop up box) will appear where you can add a **Title** and **Description**.
  - Let [<Constant name="copilot" />](/docs/cloud/dbt-copilot) do the writing for you &mdash; use the AI assistant to automatically generate a helpful description for your bookmark.
  - Access the newly created bookmark from the **Bookmark** icon in the [Query console sidebar menu](#query-console-sidebar-menu). 
 - **Develop**: Open the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="visual_editor" />](/docs/cloud/canvas) to continue editing your SQL query.
- **Run** button &mdash; Run your SQL query and view the results in the **Results** tab.

  <Lightbox src="/img/docs/dbt-insights/develop-menu.png" title="dbt Insights Develop menu." />

## Query output panel

The Query output panel is below the query editor and displays the results of a query. It displays the following tabs to analyze query execution and visualize results:
- **Results** tab &mdash; Preview your SQL results, with results paginated.
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
<Lightbox src="/img/docs/dbt-insights/insights-results.png" width="95%" title="dbt Insights Results tab" />
<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="dbt Insights Details tab" />
<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="dbt Insights Chart tab" />
</DocCarousel>

## Query console sidebar menu
The Query console sidebar menu and icons contains the following options:
- **<Constant name="explorer" /> icon** &mdash; View your project's models, columns, metrics, and more using the integrated <Constant name="explorer" /> view.
- **Bookmark icon** &mdash; Save and access your frequently used queries. 
- **Query history icon** &mdash; View past queries, their statuses (All, Success, Error, or Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.
- **<Constant name="copilot" /> icon** &mdash; Use [<Constant name="copilot" />'s AI assistant](/docs/cloud/dbt-copilot) to modify or generate queries using natural language prompts.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights dbt Explorer icon" />
<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="dbt Insights Query history icon" />
<Lightbox src="/img/docs/dbt-insights/insights-copilot.png" width="60%" title="dbt Insights dbt Copilot" />
<Lightbox src="/img/docs/dbt-insights/manage-bookmarks.png" width="60%" title="Manage your query bookmarks" />
</DocCarousel>
