---
title: "Confluent Cloud configurations"
id: "confluent-configs"
description: "Reference for Confluent Cloud-specific dbt model configurations for Apache Flink."
---

The `dbt-confluent` adapter supports the following materializations and configurations for building models on [Confluent Cloud for Apache Flink](https://docs.confluent.io/cloud/current/flink/overview.html).

## Materializations

| Materialization | Description |
|---|---|
| `view` | Creates a Flink SQL temporary view. Dropped and recreated on each `dbt run`. Views exist only for the duration of the Flink session and are not persisted. |
| `materialized_view` | Creates a Flink SQL materialized view. Always dropped and recreated on each `dbt run`. |
| `streaming_table` | Creates a Flink SQL table and a long-running `INSERT INTO` statement that continuously writes query results to the table. Requires `--full-refresh` to recreate if the table already exists. |
| `streaming_source` | Creates a Flink SQL table backed by an external connector (for example, a Kafka source connector). Requires the `connector` config. Requires `--full-refresh` to recreate if the table already exists. |

### Unsupported materializations

- **`incremental`**: Not supported. Confluent Cloud Flink SQL does not support the merge/upsert patterns that dbt incremental models require.
- **`snapshot`**: Not supported. Flink SQL does not provide the transaction operations (`MERGE`, `UPDATE` with CTEs) required for dbt snapshots.

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
| `with` | `dict` | A dictionary of Flink SQL table options passed to the `WITH` clause of the `CREATE TABLE` statement. Use this to set Kafka topic properties like `changelog.mode`, `kafka.retention.time`, `key.format`, `value.format`, and others. |

### `streaming_source`

The `streaming_source` materialization creates a table backed by an external connector. The `connector` config is **required**.

<File name='models/my_source.sql'>

```sql
{{
  config(
    materialized='streaming_source',
    with={
      'kafka.retention.time': '30 d',
      'scan.startup.mode': 'earliest-offset'
    }
  )
}}

order_id STRING,
customer_id STRING,
order_date TIMESTAMP(3),
total_amount DECIMAL(10, 2)
```

</File>

#### `connector` config

| Config | Type | Required | Description |
|---|---|---|---|
| `connector` | `string` | Yes | The connector type for the source table (for example, `kafka`). Passed as the `'connector'` property in the `WITH` clause. |
| `with` | `dict` | No | Additional table options passed to the `WITH` clause, alongside the connector. |

### `materialized_view`

The `materialized_view` materialization creates a Flink SQL materialized view. Unlike `streaming_table` and `table`, materialized views are **always dropped and recreated** on each `dbt run` &mdash; the `--full-refresh` flag is not required.

```sql
{{
  config(
    materialized='materialized_view'
  )
}}

SELECT
  customer_id,
  COUNT(*) AS order_count,
  SUM(total_amount) AS total_spent
FROM {{ ref('orders') }}
GROUP BY customer_id
```

## Stateful behavior and `--full-refresh`

Confluent Cloud Flink SQL tables are stateful, long-running resources. The `streaming_table`, `table`, and `streaming_source` materializations behave differently from traditional batch-oriented dbt materializations:

- **First run**: The table is created and (for `streaming_table`) a continuously running `INSERT INTO` statement begins populating it.
- **Subsequent runs without `--full-refresh`**: If the table already exists, `dbt run` raises an error. This prevents accidentally dropping a table that has accumulated state or has downstream consumers.
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
