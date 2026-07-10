---
title: "Stateful behavior and --full-refresh"
sidebar_label: "Stateful behavior and --full-refresh"
description: "Learn how Confluent Cloud Flink SQL tables handle state and when to use --full-refresh to recreate them."
---

Confluent Cloud Flink SQL tables are stateful, long-running resources. The `streaming_table` and `streaming_source` materializations behave differently from traditional batch-oriented dbt materializations:

- **First run**: The table is created and (for `streaming_table`) a continuously running `INSERT INTO` statement begins populating it.
- **Subsequent runs without `--full-refresh`**: If the table already exists, the adapter compares the existing column names, data types, and `WITH` options against the model. If nothing has drifted, the run skips the model to avoid dropping a table that has accumulated state or has downstream consumers. If drift is detected, the run fails with a compilation error. Drift detection can be disabled per model with `config(on_schema_drift='ignore')`.
- **Runs with `--full-refresh`**: The existing table is dropped and recreated from scratch, reprocessing all data.

Use `--full-refresh` when you need to change a table's schema, modify `WITH` options, or reprocess data from the beginning:

```bash
dbt run --full-refresh --select my_streaming_model
```
