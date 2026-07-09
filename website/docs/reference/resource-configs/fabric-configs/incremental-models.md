---
title: "Incremental models"
sidebar_label: "Incremental models"
description: "dbt-fabric supports incremental models with merge as the default strategy, plus append, delete+insert, and microbatch."
---

Incremental materializations are supported with multiple strategies. In **dbt-fabric**, the **default strategy is `merge`**, introduced in v1.9.7. Other supported strategies include `append`, `delete+insert`, and `microbatch`.

### Merge (default)
The `merge` strategy automatically updates existing records and inserts new ones based on the configured `unique_key`.

```sql
{{
  config(
    materialized='incremental',
    unique_key='id'
  )
}}
select * from source_table
{% if is_incremental() %}
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}
```

### Append
Appends new records to the existing dataset.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='append'
  )
}}
select * from new_data
```
### Delete+Insert
Deletes and re-inserts based on `unique_key`.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='delete+insert',
    unique_key='id'
  )
}}
select * from updated_data
```

### Microbatch
The `microbatch` strategy processes data in bounded time intervals using an event timestamp column.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='event_timestamp',
    batch_size='1 day'
  )
}}

select * from raw_events
```
#### Notes
- [`event_time`](/reference/resource-configs/event-time) must be a valid timestamp column.
- dbt processes each batch independently, allowing efficient incremental refresh of large time-series datasets.
- If you don't specify a `unique_key`, dbt-fabric defaults to `append`.

For more details, see [Incremental models](/docs/build/incremental-models).
