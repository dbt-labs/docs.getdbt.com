---
title: "Merge behavior (incremental models)"
sidebar_label: "Merge behavior"
description: "Learn how the incremental_strategy config controls Snowflake incremental models, including merge, append, delete+insert, and insert_overwrite."
---

The [`incremental_strategy` config](/docs/build/incremental-strategy) controls how dbt builds incremental models. By default, dbt will use a [merge statement](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) on Snowflake to refresh incremental tables.

Snowflake supports the following incremental strategies:
- [`merge`](/docs/build/incremental-strategy#merge) (default)
- [`append`](/docs/build/incremental-strategy#append)
- [`delete+insert`](/docs/build/incremental-strategy#deleteinsert)
- [`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)
  - Note: This is not a standard dbt incremental strategy. `insert_overwrite` behaves like `truncate` + re-`insert` commands on Snowflake. It doesn't support partition-based overwrites, which means it'll overwrite the entire table intentionally. It's implemented as an incremental strategy because it aligns with dbt's workflow of not dropping existing tables. You can use [`overwrite_columns`](/reference/resource-configs/snowflake-configs/merge-behavior-incremental-models#overwrite_columns) to control which columns are included in the `INSERT OVERWRITE` statement.
- [`microbatch`](/docs/build/incremental-microbatch)

Snowflake's `merge` statement fails with a "nondeterministic merge" error if the `unique_key` specified in your model config is not actually unique. If you encounter this error, you can instruct dbt to use a two-step incremental approach by setting the `incremental_strategy` config for your model to `delete+insert`.

### `overwrite_columns`

When using `incremental_strategy='insert_overwrite'` on Snowflake, you can set `overwrite_columns` to control how dbt generates the `INSERT OVERWRITE` statement for your incremental model. For example:

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='insert_overwrite',
    overwrite_columns=['id', 'value', 'event_date']
) }}

select id, value, event_date
from {{ ref('my_source') }}
```

</File>

- If you set `overwrite_columns`, dbt generates SQL that explicitly lists the columns in both the `INSERT` target and the `SELECT` projection:

  ```sql
  insert overwrite into my_schema.my_table (id, value, event_date)
  select id, value, event_date
  from staging_table
  ```

- If you don't set `overwrite_columns`, dbt currently defaults to `SELECT *`:

  ```sql
  insert overwrite into my_schema.my_table
  select *
  from staging_table
  ```
