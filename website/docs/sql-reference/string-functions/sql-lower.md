---
id: lower
title: SQL LOWER
description: Using the LOWER function on a string value will return the input as an all-lowercase string. It’s an effective way to create consistent capitalization for string values across your data.
slug: /sql-reference/lower
---

<head>
    <title>Working with the SQL LOWER function</title>
</head>

We’ve all been there:
- In a user signup form, user A typed in their name as `Kira Furuichi`, user B typed it in as `john blust`, and user C wrote `DAvid KrevitT` (what’s up with that, David??)
- Your backend application engineers are adamant customer emails are in all caps
- All of your event tracking names are lowercase

In the real world of human imperfection, opinions, and error, string values are likely to take inconsistent capitalization across different data sources (or even within the same data source). There’s always a little lack of rhyme or reason for why some values are passed as upper or lowercase, and it’s not worth the headache to unpack that.

So how do you create uniformity for string values that you collect across all your data sources? The LOWER function!

Using the LOWER function on a string value will return the input as an all-lowercase string. It’s an effective way to create consistent capitalization for string values across your data.

## How to use the SQL LOWER function

The syntax for using the LOWER function looks like the following:

```sql
lower(<string_column>)
```

Executing this command in a SELECT statement will return the lowercase version of the input string. You may additionally use the LOWER function in WHERE clauses and on join values.

Let’s take a look at a practical example using the LOWER function.

### SQL LOWER function example

You can lower the first name and last name of the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `customers` model using the following code:

```sql
select 
	customer_id,
	lower(first_name) as first_name,
	lower(last_name) as last_name
from {{ ref('customers') }}
```

After running this query, the `customers` table will look a little something like this:

| customer_id | first_name | last_name |
|---|---|---|
| 1 | michael | p. |
| 2 | shawn | m. |
| 3 | kathleen | p. |

Now, all characters in the `first_name` and `last_name` columns are lowercase.

> Changing all string columns to lowercase to create uniformity across data sources typically happens in our [dbt project’s staging models](https://docs.getdbt.com/best-practices/how-we-structure/2-staging). There are a few reasons for that: data cleanup and standardization, such as aliasing, casting, and lowercasing, should ideally happen in staging models to create downstream uniformity and improve downstream performance.

## SQL LOWER function syntax in Snowflake, Databricks, BigQuery, and Redshift

Google BigQuery, Amazon Redshift, Snowflake, Postgres, and Databricks all support the LOWER function. In addition, the syntax to use LOWER is the same across all of them.


## LOWER function use cases

Let’s go back to our chaotic trio of users A, B, and C who all used different capitalizations to type in their names. If you don’t create consistent capitalization for string values, how would a business user know what to filter for in their BI tool? A business user could filter a name field on “John Blust” since that’s what they would expect it to look like, only to get zero results back. By creating a consistent capitalization format (upper or lowercase) for all string values in your data models, you therefore create some expectations for business users in your BI tool.

There will most likely never be 100% consistency in your data models, but doing all that you can to mitigate that chaos will make your life and the life of your business users hopefully a little easier. Use the LOWER function to create a consistent casing for all strings in your data sources.
