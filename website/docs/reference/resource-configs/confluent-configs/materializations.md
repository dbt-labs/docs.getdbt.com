---
title: "Materializations"
sidebar_label: "Materializations"
description: "Review the Flink SQL materializations the Confluent adapter supports and which materializations are unsupported."
---

| Materialization | Description |
|---|---|
| `view` | Drop-and-recreate Flink SQL view. |
| `streaming_table` | Creates a Flink SQL table and a separate long-running `INSERT INTO` statement that continuously writes query results to the table. If the table already exists, the adapter checks for schema drift and skips creation; use `--full-refresh` to drop and recreate. |
| `streaming_source` | Creates a Flink SQL table backed by a connector (for example, `faker` for mock data generation). Requires the `connector` config. The model SQL defines the column definitions. If the table already exists, the adapter checks for schema drift and skips creation; use `--full-refresh` to drop and recreate. |
| `ephemeral` | Standard dbt CTE-based query fragment, not materialized in Flink. |

### Unsupported materializations

- **`table`**: Not officially supported. Coming soon.
- **`materialized_view`**: Not supported. Use `streaming_table` instead.
- **`incremental`**: Not supported. dbt's batch-incremental semantics do not map to Flink's continuous processing model. Use `streaming_table` instead.
- **`snapshot`**: Not supported. Flink SQL lacks the batch operations (`MERGE`, `UPDATE`) required by dbt snapshots.
