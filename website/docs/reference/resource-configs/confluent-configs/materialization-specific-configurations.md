---
title: "Materialization-specific configurations"
sidebar_label: "Materialization-specific configurations"
description: "Configure the Confluent streaming_table and streaming_source materializations with the with and connector options."
---

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
