---
id: cte
title: CTE in SQL
description: A CTE is a temporary result set that can be used in a SQL query. You can think of a CTE as a separate, smaller query within the larger query you’re building up.
displayText: CTE  
hoverSnippet: A Common Table Expression (CTE) is a temporary result set that can be used in a SQL query. You can use CTEs to break up complex queries into simpler blocks of code that can connect and build on each other.
---

<head>
	<title>CTE in SQL: Quite possibly the best thing to happen to SQL</title>
</head>

In a formal sense, a Common Table Expression (CTE), is a temporary result set that can be used in a SQL query. You can use CTEs to break up complex queries into simpler blocks of code that can connect and build on each other. In a less formal, more human-sense, you can think of a CTE as a separate, smaller query within the larger query you’re building up. Creating a CTE is essentially like making a temporary <Term id="view" /> that you can access throughout the rest of the query you are writing.

There are two-types of CTEs: recursive and non-recursive. This glossary focuses on non-recursive CTEs.

## Why you should care about CTEs

Have you ever read through a query and thought:

- “What does this part of the query do?” 
- “What are all the sources referenced in this query? Why did I reference this dependency?”
- “My query is not producing the results I expect and I’m not sure which part of the query is causing that.”

These thoughts often arise when we’ve written SQL queries and models that utilize complex business logic, references and joins multiple upstream dependencies, and are not outputting expected results. In a nutshell, these thoughts can occur often when you’re trying to write data models!

How can you make these complexities in your code more digestible and usable? CTEs to the rescue!

## CTE Syntax: How it works

To use CTEs, you begin by defining your first CTE using the `WITH` statement followed by a `SELECT` statement.

Let’s break down this example involving a `rename_columns` CTE below:

```sql
with rename_columns as (

    select

        id as customer_id,
        lower(first_name) as customer_first_name,
        lower(last_name) as customer_last_initial

    from {{ ref('raw_customers') }}
  
)

select * from rename_columns
```

In this query above, you first create a CTE called `rename_columns` where you conduct a 
simple `SELECT` statement that renames and lower cases some columns from a `raw_customers` <Term id="table" />/model. The final `select * from rename_columns` selects all results from the `rename_columns` CTE.

While you shouldn't always think of CTEs as having classical arguments like SQL functions, you’ve got to call the necessary inputs for CTEs something. 

- CTE_EXPRESSION_NAME: This is the name of the CTE you can reference in other CTEs or SELECT statements. In our example, `rename_columns` is the CTE_EXPRESSION_NAME. **If you are using multiple CTEs in one query, it’s important to note that each CTE_EXPRESSION_NAME must be unique.**
- CTE_QUERY: This is the `SELECT` statement whose result set is produced by the CTE. In our example above, the `select … from {{ ref('raw_customers') }}` is the CTE_QUERY. The CTE_QUERY is framed by parenthesis.

## When to use CTEs

The primary motivation to implement CTEs in your code is to simplify the complexity of your queries and increase your code’s readability. There are other great benefits to using CTEs in your queries which we’ll outline below.

### Simplification

When people talk about how CTEs can simplify your queries, they specifically mean how CTEs can help simplify the structure, readability, and debugging process of your code.

#### Establish Structure

In leveraging CTEs, you can break complex code into smaller segments, ultimately helping provide structure to your code. At dbt Labs, we often like to use the [import, logical, and final structure](/guides/refactoring-legacy-sql?step=5#implement-cte-groupings) for CTEs which creates a predictable and organized structure to your dbt models.

#### Easily identify dependencies

When you import all of your dependencies as CTEs in the beginning of your query/model, you can automatically see which models, tables, or views your model relies on.

#### Clearly label code blocks

Utilizing the CTE_EXPRESSION_NAME, you can title what your CTE is accomplishing. This provides greater insight into what each block of code is performing and can help contextualize why that code is needed. This is incredibly helpful for both the developer who writes the query and the future developer who may inherit it.

#### Test and debug more easily

When queries are long, involve multiple joins, and/or complex business logic, it can be hard to understand why your query is not outputting the result you expect. By breaking your query into CTEs, you can separately test that each CTE is working properly. Using the process of elimination of your CTEs, you can more easily identify the root cause.

### Substitution for a view

Oftentimes you want to reference data in a query that could, or may have existed at one point, as a view. Instead of worrying about the view actually existing, you can leverage CTEs to create the temporary result you would want from the view.

### Support reusability

Using CTEs, you can reference the same resulting set multiple times in one query without having to duplicate your work by referencing the CTE_EXPRESSION_NAME in your from statement.

## CTE example

Time to dive into an example using CTEs! For this example, you'll be using the data from our [jaffle_shop demo dbt](https://github.com/dbt-labs/jaffle_shop) project. In the `jaffle_shop`, you have three tables: one for customers, orders, and payments.

In this query, you're creating three CTEs to ultimately allow you to segment buyers by how many times they’ve purchased.

```sql
with import_orders as (
	
	select * from {{ ref('orders') }}

),
aggregate_orders as (

	select

		customer_id,
		count(order_id) as count_orders

	from import_orders
	where status not in ('returned', 'return pending')
	group by 1

),
segment_users as (
	
	select

		*,
		case 
            when count_orders >= 3 then 'super_buyer'
            when count_orders <3 and count_orders >= 2 then 
				'regular_buyer'
			else 'single_buyer'
		end as buyer_type
	
	from aggregate_orders

)
select * from segment_users
```

Let’s break this query down a bit:

1. In the first `import_orders` CTE, you are simply importing the `orders` table which holds the data I’m interested in creating the customer segment off of. Note that this first CTE starts with a `WITH` statement and no following CTEs begin with a `WITH` statement.
2. The second `aggregate_orders` CTE utilizes the `import_orders` CTE to get a count of orders per user with a filter applied.
3. The last `segment_users` CTE builds off of the `aggregate_orders` by selecting the `customer_id`, `count_orders`, and creating your `buyer_type` segment. Note that the final `segment_users` CTE does not have a comma after its closing parenthesis.
4. The final `select * from segment_users` statement simply selects all results from the `segment_users` CTE. 

Your results from running this query look a little like this:

| USER_ID | COUNT_ORDERS | BUYER_TYPE |
|---|---|---|
| 3 | 3 | super_buyer |
| 64 | 1 | single_buyer |
| 94 | 2 | regular_buyer |

:::tip Tip
If you are finding yourself using the same code for a certain CTE across multiple 
queries or models, that’s probably a good sign that CTE should be its own [model](https://docs.getdbt.com/docs/build/models) or view.
:::

## CTE vs Subquery

A <Term id="subquery" /> is a nested query that can oftentimes be used in place of a CTE. Subqueries have different syntax than CTEs, but often have similar use cases. This content won’t go too deep into subqueries here, but it'll highlight some of the main differences between CTEs and subqueries below.

| CTE | Subquery |
|---|---|
| Typically more readable since CTEs can be used to give structure to your query | Typically less readable, especially if there are many nested queries |
| Allows for recursiveness | Does not allow for recursiveness |
| CTEs must have unique CTE_EXPRESSION_NAMES when used in a query | Subqueries don’t always have to be explicitly named |
| CTEs cannot be used in a `WHERE` clause | Subqueries can be used in a `WHERE` clause |

## Data warehouse support for CTEs

CTEs are likely to be supported across most, if not all, [modern data warehouses](https://blog.getdbt.com/future-of-the-modern-data-stack/). Please use this table to see more information about using CTEs in your specific <Term id="data-warehouse" />.

| Data Warehouse | Support CTEs? |
|---|---|
|[Snowflake](https://docs.snowflake.com/en/user-guide/queries-cte.html) | :white_check_mark: |
|[Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_WITH_clause.html) | :white_check_mark: |
|[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax) | :white_check_mark: |
|[Databricks](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-cte.html) | :white_check_mark: |
|[Postgres](https://www.postgresqltutorial.com/postgresql-cte/) | :white_check_mark: |

## Conclusion

CTEs are essentially temporary views that can be used throughout a query. They are a great way to give your SQL more structure and readability, and offer simplified ways to debug your code. You can leverage appropriately-named CTEs to easily identify upstream dependencies and code functionality. CTEs also support recursiveness and reusability in the same query. Overall, CTEs can be an effective way to level-up your SQL to be more organized and understandable.

## Further Reading

If you’re interested in reading more about CTE best practices, check out some of our favorite content around model refactoring and style:

- [Refactoring Legacy SQL to dbt](/guides/refactoring-legacy-sql?step=5#implement-cte-groupings)
- [dbt Labs Style Guide](https://github.com/dbt-labs/corp/blob/main/dbt_style_guide.md#ctes)
- [Modular Data Modeling Technique](https://www.getdbt.com/analytics-engineering/modular-data-modeling-technique/)

Want to know why dbt Labs loves CTEs? Check out the following pieces: 

- [Why we use so many CTEs](https://discourse.getdbt.com/t/why-the-fishtown-sql-style-guide-uses-so-many-ctes/1091)
- [CTEs are Passthroughs](https://discourse.getdbt.com/t/ctes-are-passthroughs-some-research/155)

