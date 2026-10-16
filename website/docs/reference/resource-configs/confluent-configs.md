---
title: "Confluent Cloud configurations"
id: "confluent-configs"
description: "Reference for Confluent Cloud-specific dbt model configurations for Apache Flink."
---

The `dbt-confluent` adapter supports the following materializations and configurations for building models on [Confluent Cloud for Apache Flink](https://docs.confluent.io/cloud/current/flink/overview.html). For more detailed documentation of how to get started, visit the [dbt documentation on Confluent Cloud](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/deploy-flink-dbt.html).

## Materializations

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

## Materialization-specific configurations

### `streaming_table`

The `streaming_table` materialization creates a Kafka-topic-backed table and a continuously running `INSERT INTO` statement.

<File name='models/my_streaming_model.sql'>

```sql
{{
  config(
    materialized='streaming_table',
    with={
      'changelog.mode': 'upsert',
      'kafka.retention.time': '7 d'
    }
  )
}}

SELECT
  order_id,
  customer_id,
  total_amount
FROM {{ ref('raw_orders') }}
WHERE status = 'completed'
```

</File>

#### `with` config

| Config | Type | Description |
|---|---|---|
| `with` | `dict` | A dictionary of Confluent Cloud Flink SQL table options passed to the `WITH` clause of the `CREATE TABLE` statement. Common options include `changelog.mode` (`append`, `upsert`, `retract`), `kafka.retention.time`, `key.format`, `value.format`, `scan.startup.mode`, and others. See the [CREATE TABLE WITH options](https://docs.confluent.io/cloud/current/flink/reference/statements/create-table.html#with-options) reference for the full list. |

### `streaming_source`

The `streaming_source` materialization creates a table backed by a connector. The `connector` config is **required**. The model SQL defines the column definitions (rather than a `SELECT` query). In Confluent Cloud, valid connector values include `faker` (mock data generation) and external table connectors for AI search. See the [Confluent connector catalog](https://docs.confluent.io/cloud/current/connectors/index.html) and [Flink CREATE TABLE documentation](https://docs.confluent.io/cloud/current/flink/reference/statements/create-table.html) for available connectors and options.

<File name='models/my_fake_orders.sql'>

```sql
{{
  config(
    materialized='streaming_source',
    connector='faker',
    with={
      'rows-per-second': '1',
      'number-of-rows': '100',
      'changelog.mode': 'append',
    }
  )
}}

order_id BIGINT,
price DECIMAL(10, 2),
order_time TIMESTAMP(3),
WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND,
PRIMARY KEY(order_id) NOT ENFORCED
```

</File>

#### `connector` config

| Config | Type | Required | Description |
|---|---|---|---|
| `connector` | `string` | Yes | The connector type for the source table. Valid values in Confluent Cloud include `faker` (mock data) and external AI search connectors. |
| `with` | `dict` | No | Additional table options passed to the `WITH` clause, alongside the connector. Valid options depend on the connector type. |

## Stateful behavior and `--full-refresh`

Confluent Cloud Flink SQL tables are stateful, long-running resources. The `streaming_table` and `streaming_source` materializations behave differently from traditional batch-oriented dbt materializations:

- **First run**: The table is created and (for `streaming_table`) a continuously running `INSERT INTO` statement begins populating it.
- **Subsequent runs without `--full-refresh`**: If the table already exists, the adapter compares the existing column names, data types, and `WITH` options against the model. If nothing has drifted, the run skips the model to avoid dropping a table that has accumulated state or has downstream consumers. If drift is detected, the run fails with a compilation error. Drift detection can be disabled per model with `config(on_schema_drift='ignore')`.
- **Runs with `--full-refresh`**: The existing table is dropped and recreated from scratch, reprocessing all data.

Use `--full-refresh` when you need to change a table's schema, modify `WITH` options, or reprocess data from the beginning:

```bash
dbt run --full-refresh --select my_streaming_model
```

## Known limitations

- **No schema management**: The adapter cannot create or drop schemas (Kafka clusters) or databases (environments). These must be managed in Confluent Cloud.
- **No table renames**: `ALTER TABLE RENAME` is not supported in Flink SQL.
- **Non-transactional**: Confluent Cloud Flink SQL does not support transactions. `BEGIN` and `COMMIT` are no-ops.
- **Seeds require `full_refresh`**: The adapter sets `full_refresh: true` for seeds by default.
