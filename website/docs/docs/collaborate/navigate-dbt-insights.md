---
title: "Navigate the dbt Insights interface"
description: "Learn how to navigate the dbt Insights interface"
sidebar_label: "Navigation interface"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-results.jpg
---

# Navigate the dbt Insights interface <Lifecycle status="beta,enterprise" />

<IntroText>
Learn how to navigate <Constant name="query_page" /> interface and use the main components.
</IntroText>

:::tip
<Constant name="query_page" /> is available in private beta to Enterprise accounts. To join, please reach out to your account manager.
:::

<Constant name="query_page" /> provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of <Constant name="query_page" />. 

## Query console
The query console is the main component of <Constant name="query_page" />. It allows you to write, run, and analyze SQL queries. The Query console supports:
- Query console editor, which allows you to write, run, and analyze SQL queries:
  - It supports syntax highlighting and autocomplete suggestions 
  - Hyperlink from SQL code `ref` to the corresponding Explorer page
- [Query console menu](#query-console-menu), which contains **Bookmark** and **Run** buttons. 
  - ✨ Coming soon: Ability to open the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="visual_editor" />](/docs/cloud/visual-editor) to continue editing your SQL query.
- [Query output panel](#query-output-panel), below the query editor and displays the results of a query:
  - Has three tabs: **Results**, **Details**, and **Chart**, which allow you to analyze query execution and visualize results.
- [Query console sidebar menu](#query-console-sidebar-menu), which contains the **<Constant name="explorer" />**, **Bookmark**, **Query history**, and **<Constant name="copilot" />** icons.

<Lightbox src="/img/docs/dbt-insights/insights-main.png" title="dbt Insights main interface with blank query editor" />

### Query console menu
The Query console menu is located at the top right of the Query editor. It contains the **Bookmark** and **Run** buttons:
<!--- add the below once ide and canvas support is fully released. 

- Ellipsis **(`...`)** button &mdash; Access to develop in the [IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [Visual Editor](/docs/cloud/visual-editor). Note, if you're on a tab with a bookmarked query, you can also click on the ellipsis button to **Share**, **Develop in the IDE**, **Edit details**, and **Delete** a bookmark.
- -->
- **Bookmark** button &mdash; Save your frequently used SQL queries as favorites for easier access.
  - When you click **Bookmark**, a **Bookmark Query Details** modal (pop up box) will appear where you can add a **Title** and **Description**.
  - Let [<Constant name="copilot" />](/docs/cloud/dbt-copilot) do the writing for you &mdash; use the AI assistant to automatically generate a helpful description for your bookmark.
  - Access the newly created bookmark from the **Bookmark** icon in the [Query console sidebar menu](#query-console-sidebar-menu). 
- **Run** button &mdash; Run your SQL query and view the results in the **Results** tab.
- ✨ Coming soon &mdash; Ability to access the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="visual_editor" />](/docs/cloud/visual-editor) from the Query console menu to develop your query and promote it to a reusable model.

<!-- replace image when new UI changes are released. might use a gif here instead of jpg img  
<Lightbox src="/img/docs/dbt-insights/insights-ellipsis.jpg" title="dbt Insights ellipsis button" />
-->

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
- **Ellipsis** (`...`) button &mdash; Allows you to export the results to CSV

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-results.jpg" width="95%" title="dbt Insights Results tab" />
<Lightbox src="/img/docs/dbt-insights/insights-details.jpg" width="95%" title="dbt Insights Details tab" />
<Lightbox src="/img/docs/dbt-insights/insights-chart.jpg" width="95%" title="dbt Insights Chart tab" />
</DocCarousel>

## Query console sidebar menu
The Query console sidebar menu and icons contains the following options:
- **<Constant name="explorer" /> icon** &mdash; View your project’s tables, columns, metrics, lineage, and more using the integrated <Constant name="explorer" /> view.
- **Bookmark icon** &mdash; Save and access your frequently used queries. 
  - Once you create and save a bookmark, click the ellipsis **(`...`)** button in the [Query console menu](#query-console-menu) to **Share**, **Develop in the IDE**, **Edit details**, and **Delete** a bookmark.
  - Enhance bookmarked queries with <Constant name="copilot" />'s AI-generated descriptions.
- **Query history icon** &mdash; View past queries, their statuses (All, Success, Error, or Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.
- **<Constant name="copilot" /> icon** &mdash; Use [<Constant name="copilot" />'s AI assistant](/docs/cloud/dbt-copilot) to modify or generate queries using natural language prompts.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights dbt Explorer icon" />
<Lightbox src="/img/docs/dbt-insights/insights-ellipsis.gif" width="90%" title="dbt Insights bookmark icon" />
<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="90%" title="dbt Insights Query history icon" />
<Lightbox src="/img/docs/dbt-insights/insights-copilot.gif" width="90%" title="dbt Insights dbt Copilot" />
</DocCarousel>
