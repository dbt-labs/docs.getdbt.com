---
id: view
title: View
description: Read this guide to understand how views work in dbt.
displayText: view  
hoverSnippet: A view (as opposed to a table) is a defined passthrough SQL query that can be run against a database (or data warehouse).
---
:::important This page could use some love
This term would benefit from additional depth and examples. Have knowledge to contribute? [Create an issue in the docs.getdbt.com repository](https://github.com/dbt-labs/docs.getdbt.com/issues/new/choose) to begin the process of becoming a glossary contributor!
:::

A view (as opposed to a <Term id="table" />) is a defined passthrough SQL query that can be run against a database (or <Term id="data-warehouse" />). A view doesn’t store data, like a table does, but it defines the logic that you need to fetch the underlying data.

For example, you might define a SQL view to count new users in a day:

```sql
  select
    created_date,
    count(distinct(user_id)) as new_users
  from users
  group by created_date
```

But this SQL might get tedious to write over and over again, so instead you could define it as a view called `new_users`, and instead query `select * from new_users`.

When that `new_users` query runs, the underlying view compiles and runs against the database.  

## Tips on using views

A healthy relationship with views is built on expectations. 

You shouldn’t expect a view in itself to be your final destination in terms of data modeling (they’re slow + often more costly to query than tables, not great for connecting to a downstream process like reporting), but you should trust them to get you from point A to point B. 

## Further reading 

- [Best practices guide on choosing table vs view materializations](/guides/best-practices)
