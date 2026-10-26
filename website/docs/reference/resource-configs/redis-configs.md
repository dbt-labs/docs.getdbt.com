---
title: "Redis configurations"
sidebar_label: "Redis configurations"
description: "Configure Redis materializations, incremental models, contracts, and persisted documentation with dbt-redis-adbc."
id: "redis-configs"
availability:
  surface: local
  engine: v1
---

The community-maintained `dbt-redis-adbc` adapter uses the Redis ADBC driver to execute SQL against Redis. Refer to [Redis setup](/docs/local/connect-data-platform/redis-setup) for installation and connection options.

## Materializations

| Materialization | Support |
| --- | --- |
| `table` | SQL and Python models |
| `view` | SQL models |
| `ephemeral` | SQL models |
| `incremental` | SQL models, using the strategies below |
| `materialized_view` | Not supported |

Seeds use Arrow bulk ingestion. Snapshots support the `timestamp` and `check` strategies. `dbt clone` creates views; zero-copy cloning is not supported.

## Incremental models

Supported strategies are `append`, `delete+insert`, `merge`, and `microbatch`. With a `unique_key`, the default strategy is `delete+insert`. Without a `unique_key`, the default appends rows.

For example, use `merge` to update existing rows and insert new rows:

<File name="models/orders.sql">

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key='order_id'
) }}

select *
from {{ ref('stg_orders') }}
{% if is_incremental() %}
where updated_at >= (select max(updated_at) from {{ this }})
{% endif %}
```

</File>

The adapter also supports `on_schema_change` and `incremental_predicates`. For microbatch models, configure `event_time`, `begin`, and `batch_size` using the standard [microbatch configuration](/docs/build/incremental-microbatch). Each batch replaces its event-time window; batches can run in parallel.

## Model contracts and constraints

You can enforce model contracts. The driver enforces `not_null` and `check` constraints. It accepts `primary_key`, `unique`, and `foreign_key` constraints without enforcing them; dbt warns about those constraints.

## Persisted documentation

Enable `persist_docs` to store relation and column descriptions through SQL comments:

<File name="dbt_project.yml">

```yaml
models:
  PROJECT_NAME:
    +persist_docs:
      relation: true
      columns: true
```

</File>

## Python models

Python models run inside the dbt process and support the `table` materialization. `dbt.ref()` and `dbt.source()` return Arrow tables, loading each input into the process's memory. The `session` argument exposes the connection for SQL execution. Return an Arrow table or record batch reader, a pandas or polars DataFrame, or an object implementing the Arrow stream interface.

Incremental Python models are not supported.

## Relation names and access control

The driver exposes one catalog named `redis`. SQL relations render as `schema.table`, without the catalog. Schema and table names retain their case. Use dbt's `quoting` configuration when identifiers require quotes.

Redis controls access through ACL users, commands, and key patterns. The adapter skips SQL `grants` configurations with a warning. Configure permissions in Redis instead, following the [driver's ACL documentation](https://github.com/redis/redis-adbc-driver/blob/main/docs/driver-reference.md#acl-users).

## Transactions and interrupted runs

Every statement autocommits; the driver does not provide SQL transactions or rollback. A failed or cancelled materialization can leave partial writes and `__dbt_tmp` or `__dbt_backup` relations. dbt drops those relations at the start of the next run of that model. Account for this behavior when planning recovery from an interrupted run.

For package-specific macro overrides, refer to the adapter repository's [package compatibility documentation](https://github.com/redis/redis-dbt-adapter/blob/main/v1/README.md#package-compatibility).
