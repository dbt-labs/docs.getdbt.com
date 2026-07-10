---
title: "Using table partitioning and clustering"
sidebar_label: "Partitioning and clustering"
description: "How to partition and cluster BigQuery tables to reduce query latency and cost using the partition_by and cluster_by configs."
---

### Partition clause

BigQuery supports the use of a [partition by](https://cloud.google.com/bigquery/docs/data-definition-language#specifying_table_partitioning_options) clause to easily partition a <Term id="table" /> by a column or expression. This option can help decrease latency and cost when querying large tables. Note that partition pruning [only works](https://cloud.google.com/bigquery/docs/querying-partitioned-tables#use_a_constant_filter_expression) when partitions are filtered using literal values (so selecting partitions using a <Term id="subquery" /> won't improve performance).

The `partition_by` config can be supplied as a dictionary with the following format:

```python
{
  "field": "<field name>",
  "data_type": "<timestamp | date | datetime | int64>",
  "granularity": "<hour | day | month | year>"

  # Only required if data_type is "int64"
  "range": {
    "start": <int>,
    "end": <int>,
    "interval": <int>
  }
}
```

#### Partitioning by a date or timestamp

When using a `datetime` or `timestamp` column to partition data, you can create partitions with a granularity of hour, day, month, or year. A `date` column supports granularity of day, month and year. Daily partitioning is the default for all column types.

If the `data_type` is specified as a `date` and the granularity is day, dbt will supply the field as-is
when configuring table partitioning.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Compiled code', value: 'compiled', },
  ]
}>
<TabItem value="source">

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized='table',
    partition_by={
      "field": "created_at",
      "data_type": "timestamp",
      "granularity": "day"
    }
)}}

select
  user_id,
  event_name,
  created_at

from {{ ref('events') }}
```

</File>

</TabItem>
<TabItem value="compiled">

<File name='bigquery_table.sql'>

```sql
create table `projectname`.`analytics`.`bigquery_table`
partition by timestamp_trunc(created_at, day)
as (

  select
    user_id,
    event_name,
    created_at

  from `analytics`.`events`

)
```

</File>

</TabItem>
</Tabs>

#### Partitioning by an "ingestion" date or timestamp

BigQuery supports an [older mechanism of partitioning](https://cloud.google.com/bigquery/docs/partitioned-tables#ingestion_time) based on the time when each row was ingested. While we recommend using the newer and more ergonomic approach to partitioning whenever possible, for very large datasets, there can be some performance improvements to using this older, more mechanistic approach. [Read more about the `insert_overwrite` incremental strategy below](#copying-ingestion-time-partitions).

dbt will always instruct BigQuery to partition your table by the values of the column specified in `partition_by.field`. By configuring your model with `partition_by.time_ingestion_partitioning` set to `True`, dbt will use that column as the input to a `_PARTITIONTIME` pseudocolumn. Unlike with newer column-based partitioning, you must ensure that the values of your partitioning column match exactly the time-based granularity of your partitions.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Compiled code', value: 'compiled', },
  ]
}>
<TabItem value="source">

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized="incremental",
    partition_by={
      "field": "created_date",
      "data_type": "timestamp",
      "granularity": "day",
      "time_ingestion_partitioning": true
    }
) }}

select
  user_id,
  event_name,
  created_at,
  -- values of this column must match the data type + granularity defined above
  timestamp_trunc(created_at, day) as created_date

from {{ ref('events') }}
```

</File>

</TabItem>
<TabItem value="compiled">

<File name='bigquery_table.sql'>

```sql
create table `projectname`.`analytics`.`bigquery_table` (`user_id` INT64, `event_name` STRING, `created_at` TIMESTAMP)
partition by timestamp_trunc(_PARTITIONTIME, day);

insert into `projectname`.`analytics`.`bigquery_table` (_partitiontime, `user_id`, `event_name`, `created_at`)
select created_date as _partitiontime, * EXCEPT(created_date) from (
    select
      user_id,
      event_name,
      created_at,
      -- values of this column must match granularity defined above
      timestamp_trunc(created_at, day) as created_date

    from `projectname`.`analytics`.`events`
);
```

</File>

</TabItem>
</Tabs>

#### Partitioning with integer buckets

If the `data_type` is specified as `int64`, then a `range` key must also
be provided in the `partition_by` dict. dbt will use the values provided in
the `range` dict to generate the partitioning clause for the table.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Compiled code', value: 'compiled', },
  ]
}>
<TabItem value="source">

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized='table',
    partition_by={
      "field": "user_id",
      "data_type": "int64",
      "range": {
        "start": 0,
        "end": 100,
        "interval": 10
      }
    }
)}}

select
  user_id,
  event_name,
  created_at

from {{ ref('events') }}
```

</File>

</TabItem>
<TabItem value="compiled">

<File name='bigquery_table.sql'>

```sql
create table analytics.bigquery_table
partition by range_bucket(
  user_id,
  generate_array(0, 100, 10)
)
as (

  select
    user_id,
    event_name,
    created_at

  from analytics.events

)
```

</File>

</TabItem>
</Tabs>

#### Additional partition configs

If your model has `partition_by` configured, you may optionally specify two additional configurations:

- `require_partition_filter` (boolean): If set to `true`, anyone querying this model _must_ specify a partition filter, otherwise their query will fail. This is recommended for very large tables with obvious partitioning schemes, such as event streams grouped by day. Note that this will affect other dbt models or tests that try to select from this model, too.

- `partition_expiration_days` (integer): If set for date- or timestamp-type partitions, the partition will expire that many days after the date it represents. E.g. A partition representing `2021-01-01`, set to expire after 7 days, will no longer be queryable as of `2021-01-08`, its storage costs zeroed out, and its contents will eventually be deleted. Note that [table expiration](/reference/resource-configs/bigquery-configs/controlling-table-expiration) will take precedence if specified.

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized = 'table',
    partition_by = {
      "field": "created_at",
      "data_type": "timestamp",
      "granularity": "day"
    },
    require_partition_filter = true,
    partition_expiration_days = 7
)}}

```

</File>

### Clustering clause

BigQuery tables can be [clustered](https://cloud.google.com/bigquery/docs/clustered-tables) to colocate related data.

Clustering on a single column:

<File name='bigquery_table.sql'>

```sql
{{
  config(
    materialized = "table",
    cluster_by = "order_id",
  )
}}

select * from ...
```

</File>

Clustering on multiple columns:

<File name='bigquery_table.sql'>

```sql
{{
  config(
    materialized = "table",
    cluster_by = ["customer_id", "order_id"],
  )
}}

select * from ...
```

</File>
