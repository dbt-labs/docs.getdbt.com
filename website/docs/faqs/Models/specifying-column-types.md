---
title: How do I specify column types?
description: "Specify column types in models"
sidebar_label: 'Specify column types in models'
id: specifying-column-types

---
Simply cast the column to the correct type in your model:

```sql
select
    id,
    created::timestamp as created
from some_other_table
```

You might have this question if you're used to running statements like this:

```sql
create table dbt_alice.my_table
  id integer,
  created timestamp;

insert into dbt_alice.my_table (
  select id, created from some_other_table
)
```

In comparison, dbt would build this <Term id="table" /> using a `create table as` statement:

```sql
create table dbt_alice.my_table as (
  select id, created from some_other_table
)
```

So long as your model queries return the correct column type, the table you create will also have the correct column type.

To define additional column options:

* Rather than enforcing uniqueness and not-null constraints on your column, use dbt's [testing](/docs/build/data-tests) functionality to check that your assertions about your model hold true.
* Rather than creating default values for a column, use SQL to express defaults (e.g. `coalesce(updated_at, current_timestamp()) as updated_at`)
* In edge-cases where you _do_ need to alter a column (e.g. column-level encoding on Redshift), consider implementing this via a [post-hook](/reference/resource-configs/pre-hook-post-hook).
