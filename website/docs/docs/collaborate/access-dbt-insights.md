---
title: "Access the dbt Insights interface"
description: "Learn how to access the dbt Insights interface and run queries"
sidebar_label: "Access and run queries"
tags: [dbt Insights]
image: /img/docs/dbt-insights/qp-chart.jpg
---

# Access the dbt Insights interface <Lifecycle status="beta,enterprise" />

<IntroText>
Learn how to access the dbt Insights interface and run queries.
</IntroText>

:::tip
dbt Insights is available in private beta to Enterprise accounts. To join, please reach out to your account manager. 
:::

The dbt Insights interface provides a rich console experience with editor navigation. You can expect the dbt Insights interface to:
- Enable you to write SQL queries, with the option to open multiple tabs 
- Have SQL + dbt autocomplete suggestions and syntax highlighting
- Bookmark SQL queries
- View the results of the query and its details using the **Results** or **Details** tabs
- Create a visualization of your query results using the **Chart** tab
- View the history of queries and their statuses (like Success, Error, Pending) using the **Query history** icon
- Use dbt Copilot to generate or edit SQL queries using natural language prompts
- Integrate with [dbt Copilot](/docs/cloud/dbt-copilot), [dbt Explorer](/docs/collaborate/explore-projects), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), and [Visual Editor](/docs/cloud/visual-editor) to provide a seamless experience for data exploration, AI-assisted writing, and collaboration

## Access the dbt Insights interface

Before accessing the dbt Insights interface, ensure that the [prerequisites](/docs/collaborate/dbt-insights#prerequisites) are met.

1. To access the dbt Insights interface, select the **Insights** option in the navigation sidebar.
2. If your [developer credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide) aren’t set up, the dbt Insights interface will prompt you to set them up. The ability to query data is subject to warehouse provider permissions according to your developer credentials.
3. Once your credentials are set up, you can write, run, and edit SQL queries in the dbt Insights interface editor for existing models in your project. 

## Run queries

To run queries in the dbt Insights interface, you can use:
- Standard SQL  
- Jinja ([`ref`](/reference/dbt-jinja-functions/ref), [`source`](/reference/dbt-jinja-functions/source), [`is_incremental`](/docs/build/incremental-models#understand-the-is_incremental-macro))  
- Links from SQL code `ref` to the corresponding Explorer page
- <Term id="cte">CTEs</Term> and <Term id="subquery">subqueries</Term>  
- Basic aggregations and joins 
- Semantic Layer queries using Semantic Layer Jinja functions

## Example

Let's use an example to illustrate how to run queries in the dbt Insights interface:

- A Jaffle shop wants to count unique orders and unique customers to understand whether they can expand their awesome Jaffle shop business to other parts of the world.
- To express this logic in SQL, Kimiko (analyst assigned to this project) wants to understand yearly trends to help guide expansion decisions. She writes the following SQL query to calculate the number of unique customers, cities, and total order revenue: <br /><br />
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
To make things easier, Kimiko decides to use dbt Copilot to save time and explore other ways to analyze the data. Copilot can help her quickly update the query or generate a new one based on her prompt.

1. She clicks the **dbt Copilot** icon in the Query console sidebar to open the prompt box.  
2. She enters her prompt in natural language and asks for a yearly breakdown of unique customers and total revenue. Then clicks **Submit**.
3. dbt Copilot responds with:
   - A summary of the query
   - An explanation of the logic
   - The SQL it generated
   - Options to **Add** or **Replace** the existing query with the generated SQL
4. Kimiko then reviews the output and clicks **Replace** to use the Copilot-generated SQL in her editor.
5. Then, she clicks **Run** to preview the results.

<Lightbox src="/img/docs/dbt-insights/qp-copilot.gif" width="95%" title="dbt Insights dbt Copilot" />

From here, Kimiko can:
- Continue building or modifying the query using dbt Copilot
- Explore the [results](#view-results) in the **Results** tab
- [View metadata and query details](#view-details) in the **Details** tab
- [Visualize results](#chart-results) in the **Chart** tab
- Check the [**Query history**](#query-history) for status and past runs
- Use [**dbt Explorer**](#use-dbt-explorer) to explore model lineage and context

:::tip Want to turn a query into a model?
Coming soon &mdash; you'll be able to access the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [Visual Editor](/docs/cloud/visual-editor) from the [Query console menu](/docs/collaborate/navigate-dbt-insights#query-console-menu) to promote your SQL into a reusable dbt model &mdash; all within dbt Cloud!
:::

### View results

Using the same example, Kimiko can perform some exploratory data analysis by running the query and:

- Viewing results in **Results** tab &mdash; View the paginated results of the query.
- Sorting results &mdash; Click on the column header to sort the results by that column.
- Exporting to CSV &mdash; On the top right of the table, click the three-dot ellipsis (`...`) button and select **Export to CSV** to export the dataset.
<Lightbox src="/img/docs/dbt-insights/qp-export-csv.jpg" width="95%" title="dbt Insights Export to CSV" />

### View details
Kimiko can also view the details of the query by clicking on the **Details** tab:
- **Query metadata** &mdash; dbt Copilot AI-generated title and description, the supplied SQL, and corresponding compiled SQL.
- **Connection details** &mdash; Relevant data platform connection information.
- **Query details** &mdash; Query duration, status, column count, row count.

<Lightbox src="/img/docs/dbt-insights/qp-details.jpg" width="95%" title="dbt Insights Details tab" />

### Chart results

Kimiko can visualize the chart results of the query by clicking on the **Chart** tab to:
- Select the chart type using the chart icon.
- Choose from **line chart, bar chart, or scatterplot**.
- Select the axis and columns to visualize using the **Chart settings** icon.

<Lightbox src="/img/docs/dbt-insights/qp-chart.jpg" width="95%" title="dbt Insights Chart tab" />

### Query history

Kimiko can also view the history of queries and their statuses (like Success, Error, Pending) using the **Query history** icon:
- She can select a query to re-run to view the results. 
- She can search for past queries and filter by status.
- For each query, she can click on the ellipsis **(`...`)** button to open the query in a new tab or copy the SQL.

The query history is stored indefinitely.

<Lightbox src="/img/docs/dbt-insights/qp-query-history.png" width="95%" title="dbt Insights Query history icon" />

### Use dbt Explorer

Kimiko accesses [dbt Explorer](/docs/collaborate/explore-projects) to view the project lineage and project resources with access to tables, columns, metrics, and dimensions, and more — all integrated in the dbt Insights interface. 

This integrated view allows her and other users to maintain their query workflow, while getting more context on models, semantic models, metrics, macros, and more. The integrated Explorer view comes with:
- Same search capabilities as Explorer
- Allows users to narrow down displayed objects by type
- Hyperlink from SQL code `ref` to the corresponding Explorer page

To access dbt Explorer, click on the **Explorer** icon in the [Query console sidebar menu](/docs/collaborate/navigate-dbt-insights#query-console-sidebar-menu).

<Lightbox src="/img/docs/dbt-insights/qp-explorer.png" width="90%" title="dbt Insights integrated with dbt Explorer" />

## Considerations 
- You can save and bookmark frequently used queries for yourself.
- Coming soon: Sharing those queries with others.
- dbt Insights uses your development credentials to query. You have the ability to query against any object in any environment, subject to your warehouse provider permissions.
- Every Jinja function uses [`defer --favor-state`](/reference/node-selection/defer) to resolve Jinja.
- Coming soon: The ability to select the environment you use to resolve your `refs`.

<!-- this can move to another page -->

## FAQs
- What’s the difference between dbt Insights and dbt Explorer?
  - That’s a great question! Explorer helps you understand your dbt project's structure, resources, lineage, and metrics, offering context for your data.
  - The dbt Insights interface builds on that context, allowing you to write, run, and iterate on SQL queries directly in dbt Cloud. It’s designed for ad-hoc or exploratory analysis and empowers business users and analysts to explore data, ask questions, and collaborate seamlessly.
  - Explorer provides the context, while dbt Insights enables action.
