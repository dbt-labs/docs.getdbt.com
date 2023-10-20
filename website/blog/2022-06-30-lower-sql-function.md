---
title: "LOWER SQL function: Why we love it"
description: "The LOWER SQL Function allows you to return a string value as an all lowercase string. It’s an effective way to create consistent capitalization for string values across your data."
slug: lower-sql-love-letter
canonical_url: https://docs.getdbt.com/sql-reference/lower

authors: [kira_furuichi]

tags: [SQL Magic]
hide_table_of_contents: false

date: 2022-05-11
is_featured: false
---

We’ve all been there:

* In a user signup form, user A typed in their name as `Kira Furuichi`, user B typed it in as `john blust`, and user C wrote `DAvid KrevitT` (what’s up with that, David??)
* Your backend application engineers are adamant customer emails are in all caps
* All of your event tracking names are lowercase

In the real world of human imperfection, opinions, and error, string values are likely to take inconsistent capitalization across different data sources (or even within the same data source). There’s always a little lack of rhyme or reason for why some values are passed as upper or lowercase, and it’s not worth the headache to unpack that.

So how do you create uniformity for string values that you collect across all your data sources? The LOWER function!

<!--truncate-->

Using the LOWER function on a string value will return the input as an all lowercase string. It’s an effective way to create consistent capitalization for string values across your data.

> **What is a SQL function?** 
> At a high level, a function takes an input (or multiple inputs) and returns a manipulation of those inputs. Some common SQL functions are [COALESCE](https://docs.getdbt.com/blog/coalesce-sql-love-letter/), [EXTRACT](https://docs.getdbt.com/blog/extract-sql-love-letter), and [DATEDIFF](https://docs.getdbt.com/blog/datediff-sql-love-letter/). For example, the COALESCE function takes a group of values and returns the first non-null value from that group.

## How to use the LOWER function

The syntax for using the LOWER function looks like the following:

```sql
lower('<string_value>')
```

Executing this command in a SELECT statement will return the lowercase version of the input string. You may additionally use the LOWER function in WHERE clauses and joins.

### Data warehouse support for the LOWER function

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions#lower), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_LOWER.html), [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/lower.html), [Postgres](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-letter-case-functions/), and [Databricks](https://docs.databricks.com/sql/language-manual/functions/lower.html) all support the LOWER function. In addition, the syntax to use LOWER is the same across all of them.

## LOWER SQL function example

Let’s take this to an actual example! Below, you’ll see the first three rows from the `customers` <Term id="table" /> in the [jaffle_shop](https://github.com/dbt-labs/jaffle_shop), a simple dataset and dbt project, that has three columns: `customer_id`, `first_name`, and `last_name`.

| **customer_id** | **first_name** | **last_name** |
| --------------- | -------------- | ------------- |
| 1               | Michael        | P.            |
| 2               | Shawn          | M.            |
| 3               | Kathleen       | P.            |

You can lower the first name and last name of the `customers` model using the following code:

```sql
select 
	customer_id,
	lower(first_name) as first_name,
	lower(last_name) as last_name
from {{ ref('customers') }}
```

After running this query, the `customers` table will look a little something like this:

| **customer_id** | **first_name** | **last_name** |
| --------------- | -------------- | ------------- |
| 1               | michael        | p.            |
| 2               | shawn          | m.            |
| 3               | kathleen       | p.            |

Now, all characters in the `first_name` and `last_name` columns are lowercase.

> **Where do you lower?**
> Changing all string columns to lowercase to create uniformity across data sources typically happens in our dbt project’s [staging models](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging). There are a few reasons for that: data cleanup and standardization, such as aliasing, casting, and lowercasing, should ideally happen in staging models to create downstream uniformity. It’s also more performant in downstream models that join on string values to join on strings that are of all the same casing versus having to join and perform lowercasing at the same time.

## Why we love it

Let’s go back to our chaotic trio of users A, B, and C who all used different capitalizations to type in their names. If you don’t create consistent capitalization for string values, how would a business user know what to exactly filter for in their BI tool? A business user could filter a name field on “John Blust” since that’s what they would expect it to look like, only to get zero results back. By creating a consistent capitalization format (upper or lowercase) for all string values in your data models, you, therefore, create some expectations for business users in your BI tool.

There will most likely never be 100% consistency in your data models, but doing all that you can to mitigate that chaos will make your life and the life of your business users hopefully a little easier. Use the LOWER function to create a consistent casing for all strings in your data sources.
