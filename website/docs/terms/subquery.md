---
id: subquery
title: Subquery in SQL
description: "A subquery is what the name suggests: a query within another query. The true inception of SQL. Subqueries are often used when you need to process data in several steps."
displayText: subquery
hoverSnippet: A subquery is a query within another query. Subqueries are often used when you need to process data in multiple steps.
---

<head>
  <title>What is a Subquery in SQL and when are they useful? - dbt Labs</title>
</head>
A subquery is what the name suggests: a query within another query. _The true inception of SQL_. Subqueries are often used when you need to process data in several steps. For the majority of subqueries you’ll see in actual practice, the inner query will execute first and pass its result to the outer query it's nested in.

Subqueries are usually contrasted with <Term id="cte">Common Table Expressions (CTEs)</Term> as they have similar use cases. Unlike CTEs, which are usually separate `SELECT` statements within a query, subqueries are usually `SELECT` statements nested within a `JOIN`, `FROM`, or `WHERE` statement in a query.

To be honest, we rarely write subqueries here at dbt Labs since we prefer to use CTEs. We find that CTEs, in general, support better query readability, organization, and debugging. However, subqueries are a foundational concept in SQL and still widely used. We hope you can use this glossary to better understand how to use subqueries and how they differ from CTEs.

## Subquery syntax

While there are technically several types of subqueries, the general syntax to build them is the same. A subquery usually consists of the following:

- Enclosing parentheses
- A name
- An actual SELECT statement
- A main query it is nested in via a FROM, WHERE, or JOIN clause

Let’s take this to an example, using the [sample jaffle_shop dataset](https://github.com/dbt-labs/jaffle_shop).

```sql
select customer_id, count(order_id) as cnt_orders
  from (
        select * from {{ ref('orders') }}
       ) all_orders
group by 1
```

Given the elements of subqueries laid out in the beginning, let’s break down this example into its respective parts.

| Subquery elements | Example |
|---|---|
| Enclosing parentheses | :white_check_mark: |
| Subquery name | `all_orders` |
| `SELECT` statement | `select * from {{ ref('orders') }}` | 
| Main query it is nested in | `select customer_id, count(order_id) as cnt_orders from all_orders group by 1` | 

When this query is actually executed, it will start by running the innermost query first. In this case, it would run `select * from {{ ref('orders') }}` first. Then, it would pass those results to the outer query, which is where you grab the count of orders by `customer_id`.

```note Note
If you want to learn more about what a `ref` is, [check out our documentation on it.](https://docs.getdbt.com/reference/dbt-jinja-functions/ref)
```

This is a relatively straightforward example, but should hopefully show you that subqueries start off like most other queries. As you nest more subqueries together, that’s when you unearth the power of subqueries, but also when you start to notice some readability tradeoffs. If you are using subqueries regularly, you'll want to leverage indenting and [strong naming conventions](https://docs.getdbt.com/blog/on-the-importance-of-naming) for your subqueries to clearly distinguish code functionality.

## Types of subqueries

In your day-to-day, you won’t normally formalize the names of the different types of subqueries you can write, but when someone uses the term “correlated subquery” at a data conference, you'll want to know what that means!

### Nested subqueries

Nested subqueries are subqueries like the one you saw in the first example: a subquery where the inner query is executed first (and once) and passes its result to the main query. The majority of subqueries you will see in the real world are likely to be a nested subquery. These are most useful when you need to process data in multiple steps.

:::tip Debugging subqueries tip 
It’s important to note that since the inner query is executed first in a nested subquery, the inner query must be able to execute by itself. If it’s unable to successfully run independently, it cannot pass results to the outer query.
:::

### Correlated subqueries

A correlated subquery is a nested subquery’s counterpart. If nested subqueries execute the inner query first and pass their result to the outer query, correlated subqueries execute the outer query first and pass their result to their inner query. For correlated subqueries, it’s useful to think about how the code is actually executed.

In a correlated subquery, the outer query will execute row-by-row. For each row, that result from the outer query will be passed to the inner query. Compare this to nested queries: in a nested query, the inner query is executed first and only once before being passed to the outer query.

These types of subqueries are most useful when you need to conduct analysis on a row-level.

### Scalar and non-scalar subqueries

Scalar subqueries are queries that only return a single value. More specifically, this means if you execute a scalar subquery, it would return one column value of one specific row. Non-scalar subqueries, however, can return single or multiple rows and may contain multiple columns.

You may want to use a scalar subquery if you’re interested in passing only a single-row value into an outer query. This type of subquery can be useful when you’re trying to remove or update a specific row’s value using a <Term id="dml">Data Manipulation Language (DML)</Term> statement.

## Subquery examples

You may often see subqueries in joins and DML statements. The following sections contain examples for each scenario.

### Subquery in a join

In this example, you want to get the lifetime value per customer using your `raw_orders` and `raw_payments` table. Let’s take a look at how you can do that with a subquery in a join:

```sql
select
 
    orders.user_id, 
    sum(payments.amount) as lifetime_value
 
from {{ ref('raw_orders') }} as orders
left join (

    select

        order_id,
        amount

    from {{ ref('raw_payments') }}

) all_payments
on orders.id = payments.order_id
group by 1
```

Similar to what you saw in the first example, let’s break down the elements of this query.

| Subquery elements | Example |
|---|---|
| Enclosing parentheses | :white_check_mark: |
| Subquery name | `all_payments` |
| `SELECT` statement | `select order_id, amount from {{ ref('raw_payments') }}` |
| Main query it is nested in | `select orders.user_id, sum(payments.amount) as lifetime_value from {{ ref('raw_orders') }} as orders...` | 

In this example, the `all_payments` subquery will execute first. you use the data from this query to join on the `raw_orders` table to calculate lifetime value per user. Unlike the first example, the subquery happens in the join statement. Subqueries can happen in `JOIN`, `FROM`, and `WHERE` clauses.

### Subquery in a DML command

You may also see subqueries used in DML commands. As a jogger, DML commands are a series of SQL statements that you can write to access and manipulate row-level data in database objects. Oftentimes, you’ll want to use a query result in a qualifying `WHERE` clause to only delete, update, or manipulate certain rows of data.

In the following example, you'll attempt to update the status of certain orders based on the payment method used in the `raw_payments` table.

```sql
UPDATE raw_orders
set status = 'returned'
where order_id in (
select order_id 
from raw_payments 
where payment_method  = 'bank_transfer')
```

## Subquery vs CTE

A subquery is a nested query that can oftentimes be used in place of a CTE. Subqueries have different syntax than CTEs, but often have similar use cases. The content won’t go too deep into CTEs here, but it’ll highlight some of the main differences between CTEs and subqueries below.

| CTE | Subquery |
|---|---|
| Typically more readable since CTEs can be used to give structure to your query | Typically less readable, especially if there are many nested queries |
| Reusable in the same query | Must declare the subquery everytime it is used in a query |
| Allows for recursiveness | Does not allow for recursiveness |
| CTEs must have unique CTE_EXPRESSION_NAMES when used in a query | Subqueries don’t always have to be explicitly named |
| CTEs cannot be used in a `WHERE` clause | Subqueries can be used in a `WHERE` clause |

### Subquery vs CTE example

The following example demonstrates the similarities and differences between subqueries and CTEs. Using the [first subquery example](#subquery-in-a-join), you can compare how you would perform that query using subquery or a CTE:

<Tabs
  defaultValue="subquery"
  values={[
    { label: 'Subquery example', value: 'subquery', },
    {label: 'CTE example', value: 'cte', },
  ]
}>
<TabItem value="subquery">

```sql Subquery example
select customer_id, count(order_id) as cnt_orders
  from (

        select * from {{ ref('orders') }}

       ) all_orders
group by 1
```
</TabItem>
<TabItem value="cte">

```sql CTE example
with all_orders as (

select * from {{ ref('orders') }}

),
aggregate_orders as (

	select

		customer_id,
		count(order_id) as cnt_orders

	from all_orders
	group by 1

)
select * from aggregate_orders
```

</TabItem>
</Tabs>

While the code for the query involving CTEs may be longer in lines, it also allows us to explicitly define code functionality using the CTE name. Unlike the subquery example that executes its inner query and then the outer query, the query using CTEs executes moving down the code.

Again, choosing to use CTEs over subqueries is a personal choice. It may help to write out the same code functionality in a subquery and with CTEs and see what is more understandable to you.

## Data warehouse support for subqueries

Subqueries are likely to be supported across most, if not all, modern <Term id="data-warehouse">data warehouses</Term>. Please use this table to see more information about using subqueries in your specific data warehouse.

| Data warehouse | Supports subqueries? |
|---|---|
| [Snowflake](https://docs.snowflake.com/en/user-guide/querying-subqueries.html) | :white_check_mark: |
| [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_Subquery_examples.html) | :white_check_mark: |
| [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/subqueries) | :white_check_mark: |
| [Databricks](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-query.html) | :white_check_mark: |
| [Postgres](https://www.postgresqltutorial.com/postgresql-subquery/) | :white_check_mark: |

## Conclusion

I’m going to be honest, I was hesitant to start writing the glossary page for SQL subqueries. As someone who has been using CTEs almost exclusively in their data career, I was intimidated by this concept. However, I am excited to say: Subqueries are not as scary as I expected them to be! 

At their core, subqueries are nested queries within a main query. They are often implemented in `FROM`, `WHERE`, and `JOIN` clauses and are used to write code that builds on itself. Despite the fact that subqueries are SQL like any other query, it is important to note that subqueries can struggle in their readability, structure, and debugging process due to their nested nature. Because of these downsides, we recommend leveraging CTEs over subqueries whenever possible.

I have not been made a subquery convert, but I’m walking away from this a little less intimidated by subqueries and I hope you are too.

## Further reading

Please check out some of our favorite readings related to subqueries!

- [Glossary: CTE](https://docs.getdbt.com/terms/cte)
- [On the importance of naming: model naming conventions (Part 1)](https://docs.getdbt.com/blog/on-the-importance-of-naming)
