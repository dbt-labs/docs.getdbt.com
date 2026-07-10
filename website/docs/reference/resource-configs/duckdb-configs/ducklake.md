---
title: "DuckLake"
sidebar_label: "DuckLake"
description: "Use the DuckLake table format for ACID transactions and time travel with DuckDB, including on MotherDuck, and configure partitioning."
---

[DuckLake](https://ducklake.select) is a table format that provides <Term id="acid" /> transactions and time travel for DuckDB. You can use DuckLake with both local databases and MotherDuck.

### DuckLake on MotherDuck

In `dbt-duckdb 1.9.6` and later, you can connect to [hosted DuckLake on MotherDuck](https://motherduck.com/blog/ducklake-motherduck/) by creating a DuckLake database and setting `is_ducklake: true`.

To set up DuckLake on MotherDuck:

1. Create your DuckLake database in MotherDuck:

  ```sql
  CREATE DATABASE my_ducklake
    (TYPE ducklake, DATA_PATH 's3://...')
  ```

2. Configure your profile:

  ```yml
  default:
    outputs:
      dev:
        type: duckdb
        path: "md:my_db?motherduck_token={{ env_var('MOTHERDUCK_TOKEN') }}"
        attach:
          - path: "md:my_ducklake"
            is_ducklake: true
    target: dev
  ```

  You must identify DuckLake must with `is_ducklake: true` so that dbt applies safe DDL operations.

  For local DuckLake, use `ducklake:` in the path:

  ```yml
  attach:
    - path: "ducklake:my_ducklake.ddb"
  ```

### DuckLake table partitioning

For DuckLake-backed tables (including MotherDuck-managed DuckLake), you can configure physical partitioning for `table` or `incremental` models using `partitioned_by`:

```sql
{{ config(materialized='table', partitioned_by=['year', 'month']) }}

select
  *,
  year(event_time) as year,
  month(event_time) as month
from {{ ref('upstream_model') }}
```

`partition_by` is accepted as an alias for `partitioned_by`. This setting is only applied for DuckLake relations; on non-DuckLake targets, it is ignored with a warning.

DuckLake applies partitioning using `ALTER TABLE ... SET PARTITIONED BY (...)`, and partitioning only affects new data. For first builds or full refreshes, `dbt-duckdb` creates an empty table, sets partitioning, then inserts data so the initial load is partitioned. Refer to the [DuckLake partitioning documentation](https://ducklake.select/docs/stable/duckdb/advanced_features/partitioning) for more details.
