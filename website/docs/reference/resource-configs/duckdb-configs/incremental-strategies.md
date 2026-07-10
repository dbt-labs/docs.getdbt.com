---
title: "Incremental strategies"
sidebar_label: "Incremental strategies"
description: "The incremental strategies dbt-duckdb supports for table models, including append, delete+insert, merge, and microbatch."
---

`dbt-duckdb` supports the following strategies for incremental table models:

- [`append`](/reference/resource-configs/duckdb-configs/incremental-strategies#append-strategy)
- [`delete+insert`](/reference/resource-configs/duckdb-configs/incremental-strategies#deleteinsert-strategy)
- [`merge`](/reference/resource-configs/duckdb-configs/incremental-strategies#merge-strategy)
- [`microbatch`](/reference/resource-configs/duckdb-configs/incremental-strategies#microbatch-strategy)

### Append strategy

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `incremental_predicates` | `<list>` | null | SQL conditions to filter which records get appended. |

### Delete+insert strategy

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `unique_key` | `<string>`/`<list>` | — | Required. Columns used to identify records for deletion. |
| `incremental_predicates` | `<list>` | null | SQL conditions to filter the delete and insert operations. |

### Merge strategy

The `merge` strategy requires DuckDB 1.4.0 or later and provides access to DuckDB's native `MERGE` statement.

**Basic configuration**

When you specify only `unique_key`, `dbt-duckdb` uses DuckDB's `UPDATE BY NAME` and `INSERT BY NAME` operations, which automatically match columns by name:

```yml
models:
  - name: my_incremental_model
    config:
      materialized: incremental
      incremental_strategy: merge
      unique_key: id
```

**Enhanced configuration**

Additional options for finer control:

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `unique_key` | `<string/list>` | — | Required. Columns used for the MERGE join condition. |
| `incremental_predicates` | `<list>` | null | Additional SQL conditions to filter the MERGE operation. |
| `merge_update_condition` | `<string>` | null | SQL condition to control when matched records are updated. |
| `merge_insert_condition` | `<string>` | null | SQL condition to control when unmatched records are inserted. |
| `merge_update_columns` | `<list>` | null | Specific columns to update. |
| `merge_exclude_columns` | `<list>` | null | Columns to exclude from updates. |
| `merge_update_set_expressions` | `<dict>` | null | Custom expressions for column updates. |

For maximum flexibility, use `merge_clauses` to define custom `when_matched` and `when_not_matched` behaviors. When using DuckLake, MERGE statements are limited to a single UPDATE or DELETE action in `when_matched` clauses due to DuckLake's current MERGE implementation constraints.

In conditions and expressions, use `DBT_INTERNAL_SOURCE` to reference the incoming data and `DBT_INTERNAL_DEST` to reference the existing target table.

### Microbatch strategy

The `microbatch` strategy requires <Constant name="core" /> 1.9 or later and runs incremental builds in time-based batches using a configured `event_time` column.

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `event_time` | `<string>` | — | Required. Name of the timestamp column used for microbatch windowing. |
| `begin` | `<string>` | — | Required. Start time for batching (for example, `2025-01-01`). |
| `batch_size` | `<string>` | — | Required. Batch grain (for example, `day`, `hour`). |
| `incremental_predicates` | `<list>` | null | Optional additional predicates applied within each batch. |

:::tip
Microbatching might not always be the best option from a performance perspective. DuckDB operates on row groups, not physical partitions (unless you have explicitly partitioned data in a DuckLake). Be sure to test different amounts of threads to match your use case.
:::
