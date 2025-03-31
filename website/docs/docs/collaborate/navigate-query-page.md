---
title: "Navigate the Query page interface"
description: "Learn how to navigate the Query page interface"
sidebar_label: "Navigation interface"
tags: [Query page]
image: /img/docs/query-page/qp-results.jpg
---

# Navigate the Query page interface <Lifecycle status="beta,enterprise" />

<IntroText>
Learn how to navigate the Query page interface and use the main components.
</IntroText>

:::tip
Query page is available in private beta to Enterprise accounts. To join, please reach out to your account manager.
:::

The Query page provides an interactive interface for writing, running, and analyzing SQL queries. This section highlights the main components of the Query page. 

## Query console
The query console is the main component of the Query page. It allows you to write, run, and analyze SQL queries. The Query console supports:
- Query console editor, which allows you to write, run, and analyze SQL queries:
  - It supports syntax highlighting and autocomplete suggestions 
  - Hyperlink from SQL code `ref` to the corresponding Explorer page
- [Query console menu](#query-console-menu), which contains **Bookmark** and **Run** buttons. 
  - ✨ Coming soon: Ability to open the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [Visual Editor](/docs/cloud/visual-editor) to continue editing your SQL query.
- [Query output panel](#query-output-panel), below the query editor and displays the results of a query:
  - Has three tabs: **Results**, **Details**, and **Chart**, which allow you to analyze query execution and visualize results.
- [Query console sidebar menu](#query-console-sidebar-menu), which contains the **dbt Explorer**, **Bookmark**, **Query history**, and **dbt Copilot** icons.

<Lightbox src="/img/docs/query-page/qp-main.png" title="Query page main interface with blank query editor" />

### Query console menu
The Query console menu is located at the top right of the Query editor. It contains the **Bookmark** and **Run** buttons:
<!--- Ellipsis **(`...`)** button &mdash; Access to develop in the [IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [Visual Editor](/docs/cloud/visual-editor) -->
- **Bookmark** button &mdash; Save your frequently used SQL queries as favorites for easier access.
  - When you click **Bookmark**, a **Bookmark Query Details** modal (pop up box) will appear where you can add a **Title** and **Description**.
  - Let [dbt Copilot](/docs/cloud/dbt-copilot) do the writing for you &mdash; use the AI assistant to automatically generate a helpful description for your bookmark.
  - Access the newly created bookmark from the **Bookmark** icon in the [Query console sidebar menu](#query-console-sidebar-menu). 
- **Run** button &mdash; Run your SQL query and view the results in the **Results** tab.
- ✨ Coming soon &mdash; Ability to access the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [Visual Editor](/docs/cloud/visual-editor) from the Query console menu to develop your query and promote it to a reusable model.

<!-- replace image when new UI changes are released. might use a gif here instead of jpg img  
<Lightbox src="/img/docs/query-page/qp-ellipsis.jpg" title="Query page ellipsis button" />
-->

## Query output panel

The Query output panel is below the query editor and displays the results of a query. It displays the following tabs to analyze query execution and visualize results:
- **Results** tab &mdash; Preview your SQL results, with results paginated.
- **Details** tab &mdash; Generates succinct details of executed SQL query:
  - Query metadata &mdash; dbt Copilot's AI-generated title and description. Along with the supplied SQL and compiled SQL.
  - Connection details &mdash; Relevant data platform connection information.
  - Query details &mdash; Query duration, status, column count, row count.
- **Chart** tab &mdash; Visualizes query results with built-in charts. 
  - Use the chart icon to select the type of chart you want to visualize your results. Available chart types are **line chart, bar chart, or scatterplot**.
  - Use the **Chart settings** to customize the chart type and the columns you want to visualize. 
  - Available chart types are **line chart, bar chart, or scatterplot**.
- **Ellipsis** (`...`) button &mdash; Allows you to export the results to CSV

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/query-page/qp-results.jpg" width="95%" title="Query page Results tab" />
<Lightbox src="/img/docs/query-page/qp-details.jpg" width="95%" title="Query page Details tab" />
<Lightbox src="/img/docs/query-page/qp-chart.jpg" width="95%" title="Query page Chart tab" />
</DocCarousel>

## Query console sidebar menu
The Query console sidebar menu and icons contains the following options:
- **dbt Explorer icon** &mdash; View your project’s tables, columns, metrics, lineage, and more using the integrated Explorer view.
- **Bookmark icon** &mdash; Save and access your frequently used queries. 
  - Once you create and save a bookmark, click the ellipsis **(`...`)** button in the [Query console menu](#query-console-menu) to **Share**, **Develop in the IDE**, **Edit details**, and **Delete** a bookmark.
  - Enhance bookmarked queries with dbt Copilot's AI-generated descriptions.
- **Query history icon** &mdash; View past queries, their statuses (like Success, Error, Pending), start time, and duration. Search for past queries and filter by status. You can also re-run a query from the Query history.
- **dbt Copilot icon** &mdash; Use [dbt Copilot's AI assistant](/docs/cloud/dbt-copilot) to modify or generate queries using natural language prompts.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/query-page/qp-explorer.png" width="90%" title="Query page dbt Explorer icon" />
<Lightbox src="/img/docs/query-page/qp-ellipsis.gif" width="90%" title="Query page bookmark icon" />
<Lightbox src="/img/docs/query-page/qp-query-history.png" width="90%" title="Query page Query history icon" />
<Lightbox src="/img/docs/query-page/qp-copilot.gif" width="90%" title="Query page dbt Copilot" />
</DocCarousel>
