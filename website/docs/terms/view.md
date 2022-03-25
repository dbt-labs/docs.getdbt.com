---
id: view
title: View
displayText: view  
hoverSnippet: A view (as opposed to a table) is a defined passthrough SQL query that can be run against a database (or data warehouse).
---

### What’s a view?

A view (as opposed to a <Term id="table" />) is a defined passthrough SQL query that can be run against a database (or data warehouse). A view doesn’t store data, like a table does, but it defines the logic that you need to fetch the underlying data.

For example, we might define a SQL view to count new users in a day as:

```
  select
    created_date,
    count(distinct(user_id)) as new_users
  from users
  group by created_date
```

That’s kind of tedious to write over and over again, so instead we could define it as a view called ```new_users```, and instead query ```select * from new_users```.

When that ```new_users``` query runs, the underlying view compiles and runs against the database.  

### Yelp review on views

A healthy relationship with views is built on expectations. 

I don’t expect a view in itself to be my final destination in terms of data modeling (they’re slow + often more costly to query than tables, not great for connecting to a downstream process like reporting), but I do trust them to get me from point A to point B. 

They’re like bus stops that you pass every day, never get out at, but appreciate as landmarks.

Related reading 

[Best practices guide on choosing table vs view materializations](docs/guides/best-practices#choose-your-materializations-wisely)
