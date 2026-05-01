---
title: "Access the dbt Insights interface"
description: "Learn how to access the dbt Insights interface and run queries"
sidebar_label: "Access and run queries"
tags: [dbt Insights]
image: /img/docs/dbt-insights/insights-chart.jpg
---

# Access the dbt Insights interface <Lifecycle status="managed,managed_plus" />

<IntroText>
Learn how to access <Constant name="insights" />, run queries, and view results.
</IntroText>

<Constant name="insights" /> provides a rich console experience with editor navigation. You can expect <Constant name="insights" /> to:
- Enable you to write SQL queries, with the option to open multiple tabs 
- Have SQL + dbt autocomplete suggestions and syntax highlighting
- Save SQL queries
- View the results of the query and its details using the **Data** or **Details** tabs
- Create a visualization of your query results using the **Chart** tab
- View the history of queries and their statuses (like Success, Error, Pending) using the **Query history** tab
- Use <Constant name="copilot" /> to generate or edit SQL queries using natural language prompts
- Integrate with [<Constant name="copilot" />](/docs/platform/dbt-copilot), [<Constant name="catalog" />](/docs/explore/explore-projects), [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), and [<Constant name="canvas" />](/docs/platform/canvas) to provide a seamless experience for data exploration, AI-assisted writing, and collaboration

## Access the dbt Insights interface

Before accessing <Constant name="insights" />, ensure that the [prerequisites](/docs/explore/dbt-insights#prerequisites) are met.

1. To access <Constant name="insights" />, select the **Insights** option in the navigation sidebar.
2. If your [developer credentials](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-cloud-ide) aren’t set up, <Constant name="insights" /> will prompt you to set them up. The ability to query data is subject to warehouse provider permissions according to your developer credentials.
3. Once your credentials are set up, you can write, run, and edit SQL queries in the <Constant name="insights" /> editor for existing models in your project. 

## Run queries

To run queries in <Constant name="insights" />, you can use:
- Standard SQL  
- Jinja ([`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source) functions, and other Jinja functions)
- Links from SQL code `ref` to the corresponding Explorer page
- <Term id="cte">CTEs</Term> and <Term id="subquery">subqueries</Term>  
- Basic aggregations and joins 
- <Constant name="semantic_layer" /> queries using <Constant name="semantic_layer" /> Jinja functions

## Example

Let's use an example to illustrate how to run queries in <Constant name="insights" />:

- A [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) location wants to count unique orders and unique customers to understand whether they can expand their awesome Jaffle shop business to other parts of the world.
- To express this logic in SQL, you (an analyst assigned to this project) want to understand yearly trends to help guide expansion decisions. Write the following SQL query to calculate the number of unique customers, cities, and total order revenue: <br /><br />
    ```sql
    with 

    orders as (
        select * from {{ ref('orders') }}
    ),

    customers as (
        select * from {{ ref('customers') }}
    )

    select 
        date_trunc('year', ordered_at) as order_year,
        count(distinct orders.customer_id) as unique_customers,
        count(distinct orders.location_id) as unique_cities,
        to_char(sum(orders.order_total), '999,999,999.00') as total_order_revenue
    from orders
    join customers
        on orders.customer_id = customers.customer_id
    group by 1
    order by 1
    ```

### Use dbt Copilot 
To make things easier, [use <Constant name="copilot" />](/docs/platform/use-dbt-copilot#build-queries) to save time and explore other ways to analyze the data. <Constant name="copilot" /> can help you quickly update the query or generate a new one based on your prompt.

1. Click the **<Constant name="copilot" />** icon in the Query console sidebar.
2. In the dropdown menu above the <Constant name="copilot" /> prompt box, select **Generate SQL**.
3. Enter your prompt in natural language and ask for a yearly breakdown of unique customers and total revenue.
4. Click **↑** to submit your prompt.
4. <Constant name="copilot" /> responds with:
   - A summary of the query
   - An explanation of the logic
   - The SQL it generated
   - Options to **Add** or **Replace** the existing query with the generated SQL
5. Review the output and click **Replace** to use the <Constant name="copilot" />-generated SQL in your editor.
6. Click **Run** to preview the results.

<Lightbox src="/img/docs/dbt-insights/insights-copilot.png" width="60%" title="dbt Insights with dbt Copilot" />

From here, you can:
- Continue building or modifying the query using <Constant name="copilot" />.
- Explore the [results](#view-results) in the **Data** tab.
- [View metadata and query details](#view-details) in the **Details** tab.
- [Visualize results](#chart-results) in the **Chart** tab.
- Check the [**Query history**](#query-history) for status and past runs.
- Use [**<Constant name="catalog" />**](#use-dbt-explorer) to explore model lineage and context.
- If you want to save the query, you can click **Save Insight** in the [query console menu](/docs/explore/navigate-dbt-insights#query-console-menu) to save it for future reference.

:::tip Want to turn a query into a model?
You can access the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) or [<Constant name="canvas" />](/docs/platform/canvas) from the [Query console menu](/docs/explore/navigate-dbt-insights#query-console-menu) to promote your SQL into a reusable dbt model &mdash; all within <Constant name="dbt" />!
:::

### View results

Using the same example, you can perform some exploratory data analysis by running the query and:

- Viewing results in **Data** tab &mdash; View the paginated results of the query.
- Sorting results &mdash; Click on the column header to sort the results by that column.
- Exporting to CSV &mdash; On the top right of the table, click the download button to export the dataset.
<Lightbox src="/img/docs/dbt-insights/insights-export-csv.png" width="95%" title="dbt Insights Export to CSV" />

### View details
View the details of the query by clicking on the **Details** tab:
- **Query metadata** &mdash; <Constant name="copilot" />-generated title and description, the supplied SQL, and corresponding compiled SQL.
- **Connection details** &mdash; Relevant data platform connection information.
- **Query details** &mdash; Query duration, status, column count, row count.

<Lightbox src="/img/docs/dbt-insights/insights-details.png" width="95%" title="dbt Insights Details tab" />

### Chart results

Visualize the chart results of the query by clicking on the **Chart** tab to:
- Select the chart type using the chart icon.
- Choose from **line chart, bar chart, or scatterplot**.
- Select the axis and columns to visualize using the **Chart settings** icon.

<Lightbox src="/img/docs/dbt-insights/insights-chart.png" width="95%" title="dbt Insights Chart tab" />

### Query history

View the history of queries and their statuses (All, Success, Error, or Pending) using the **Query history** icon:
- Select a query to re-run to view the results. 
- Search for past queries and filter by status.
- Hover over the query to view the SQL code or copy it.

The query history is stored indefinitely.

<Lightbox src="/img/docs/dbt-insights/insights-query-history.png" width="95%" title="dbt Insights Query history icon" />

### Use dbt Catalog

Access [<Constant name="catalog" />](/docs/explore/explore-projects) directly in <Constant name="insights" /> to view project resources such as models, columns, metrics, and dimensions, and more — all integrated in the <Constant name="insights" /> interface. 

This integrated view allows you and your users to maintain your query workflow, while getting more context on models, semantic models, metrics, macros, and more. The integrated <Constant name="catalog" /> view comes with:
- Same search capabilities as <Constant name="catalog" />
- Allows users to narrow down displayed objects by type
- Hyperlink from SQL code `ref` to the corresponding <Constant name="catalog" /> page
- View assets in more detail by opening with the full <Constant name="catalog" /> experience or open them in <Constant name="copilot" />.

To access <Constant name="catalog" />, click on the **<Constant name="catalog" />** icon in the [Query console sidebar menu](/docs/explore/navigate-dbt-insights#query-console-sidebar-menu).

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="dbt Insights integrated with dbt Catalog" />

### Set Jinja environment

Set the compilation environment to control how Jinja functions are rendered. This feature:
- Supports "typed" environments marked as `Production`, `Staging`, and/or `Development`.
- Enables you to run <Constant name="semantic_layer" />. queries against staging environments (development environments not supported).
- Still uses the individual user credentials, so users must have appropriate access to query `PROD` and `STG`. 
- Changing the environment changes context for the <Constant name="catalog" /> view in <Constant name="insights" />, as well as the environment context during the handoff to <Constant name="catalog" /> and <Constant name="canvas" />. For example, switching to `Staging` in <Constant name="insights" /> and selecting **View in Catalog** will open the `Staging` view in <Constant name="catalog" />. 

<Lightbox src="/img/docs/dbt-insights/insights-jinja-environment.png" width="90%" title="Set the environment for your Jinja context" />

## Save your Insights

Insights offers a robust save feature for quickly finding the queries you use most. There's also an option to share saved Insights with other dbt users (and have them share with you). Click the **bookmark icon** in a query to add it to your list!

- Click the **bookmark icon** on the right menu to manage your saved Insights. You can view your personal and shared queries

    <Lightbox src="/img/docs/dbt-insights/saved-insights.png" width="90%" title="Manage your saved Insights" />
    
- View saved Insight details including description and creation date in the **Overview** tab.
- View the Insight history in the **Version history** tab. Click a version to compare it the current and view changes. 


## Considerations 
- <Constant name="insights" /> uses your development credentials to query. You have the ability to query against any object in your data warehouse that is accessible using your development credentials. 
- Every Jinja function uses [`defer --favor-state`](/reference/node-selection/defer) to resolve Jinja.

<!-- this can move to another page -->

## FAQs
- What’s the difference between <Constant name="insights" /> and <Constant name="catalog" />?
  - That’s a great question! <Constant name="catalog" /> helps you understand your dbt project's structure, resources, lineage, and metrics, offering context for your data.
  - <Constant name="insights" /> builds on that context, allowing you to write, run, and iterate on SQL queries directly in <Constant name="dbt" />. It’s designed for ad-hoc or exploratory analysis and empowers business users and analysts to explore data, ask questions, and collaborate seamlessly.
  - <Constant name="catalog" /> provides the context, while <Constant name="insights" /> enables action.
