---
id: comments
title: SQL Comments
description: Inline SQL comments will begin with two dashes (--) in front of them in a query or dbt model; any text following these dashes is therefore what you’d call “commented out.” For longer, multi-line comments, you’ll typically see this syntax `/* your multi-line comment here */` used.
slug: /sql-reference/comments
---

<head>
    <title>Working with the SQL Comments</title>
</head>

SQL comments…a two-folded thing: Are we talking about comments *inline* in SQL? Or comments on a table or view in the database?

Why not both!?

In this page, we’ll unpack how to create both inline and database object-level comments, general best practices around SQL comments, and how dbt can help you improve (and version-control) your comments.

## How to create SQL comments

Inline SQL comments will begin with two dashes (--) in front of them in a query or dbt model; any text following these dashes is therefore what you’d call “commented out.” For longer, multi-line comments, you’ll typically see this syntax `/* your multi-line comment here */` used.

### SQL comment example

```sql
/* these lines form a multi-line SQL comment; if it’s uncommented, 
it will make this query error out */
select
	customer_id,
	-- order_id, this row is commented out
	order_date
from {{ ref ('orders') }}
```

In practice, you’ll likely see SQL comments at the beginning of complex code logic, to help future developers or even advanced business users understand what specific blocks of code are accomplishing. Other times, you’ll see comments like the code above, that are commenting out lines no longer needed (or in existence) for that query or model. We’ll dive more into best practices around inline comments later on this page.

For comments *on* database objects, such as views and tables, there’s a different syntax to add these explicit comments:

```sql
comment on [database object type] <database object name> is 'comment text here';
```

These database object-level comments are more useful for adding additional context or metadata to these objects versus inline comments being useful for explaining code functionality. Alternatively, these table and view-level comments can be easily abstracted out and version-controlled using [model descriptions in dbt](https://docs.getdbt.com/reference/resource-properties/description) and persisted in the objects using the [persist_docs config](/reference/resource-configs/persist_docs) in dbt.

## SQL comments in Snowflake, Databricks, BigQuery, and Redshift

Google BigQuery, Amazon Redshift, Snowflake, and Databricks all support the ability to add inline SQL comments. With the exception of BigQuery, these data warehouses also support native database object-level comments; BigQuery does, however, support native field-level descriptions.

## SQL commenting best practices

In general, inline SQL comments should be used thoughtfully; another analytics engineer should be able to pair your comments with your code to clearly understand model functionality. 

We recommend leveraging inline comments in the following situations:

- Explain complex code logic that if you had to scratch your head at, someone else will have to scratch their head at
- Explain niche, unique-to-your-business logic
- Separate out field types (ex. Ids, booleans, strings, dates, numerics, and timestamps) in [staging models](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging) to create more readable, organized, and formulaic models
- Clearly label tech debt (`-- [TODO]: TECH DEBT`) in queries or models


If you find your inline SQL comments are getting out of control, less scannable and readable, that’s a sign to lean more heavily on dbt Docs and markdown files in your dbt project. dbt supports [descriptions](https://docs.getdbt.com/reference/resource-properties/description), which allow you to add robust model (or macro, source, snapshot, seed, and source) and column descriptions that will populate in hosted dbt Docs. For models or columns that need more thorough or customizable documentation, leverage [doc blocks in markdown and YAML files](https://docs.getdbt.com/reference/resource-properties/description#use-a-docs-block-in-a-description) to create more detailed explanations and comments.

