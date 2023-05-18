---
title: "BigQuery: Creating date-partitioned tables"
id: "creating-date-partitioned-tables"
---


:::caution Deprecated

The functionality described below was introduced in dbt Core v0.10 (March 2018). In v1.0 (December 2021), it was deprecated in favor of [column-based partitioning](/reference/resource-configs/bigquery-configs#partition-clause) and [incremental modeling](/docs/build/incremental-models).

:::

dbt supports the creation of [date partitioned tables](https://cloud.google.com/bigquery/docs/partitioned-tables) in BigQuery.

To configure a dbt model as a date partitioned <Term id="table" />, use the `materialized='table'` model configuration in conjunction with a list of `partitions`. dbt will execute your model query once for each specified partition. For example:

<File name='partitioned.sql'>

```sql
{{
    config(
        materialized='table',
        partitions=[20180101, 20180102],
        verbose=True
    )
}}

/*

dbt will interpolate each `partition` wherever it finds [DBT__PARTITION_DATE]
in your model code. This model will create a single table with two partitions:
 1. 20180101
 2. 20180102
 
These partitions will be created by running the following query against
each of the following date-sharded tables:

 1. `snowplow`.`events_20180101`
 2. `snowplow`.`events_20180102`

*/

select *
from `snowplow`.`events_[DBT__PARTITION_DATE]`
```

</File>

To make this model more dynamic, we can use the `dbt.partition_range` macro to generate a list of 8-digit dates in a specified range. Further, dbt provides a handy macro, `date_sharded_table`, for getting a date-sharded <Term id="table" /> by its prefix for a given date. Together, this looks like:

<File name='partitioned_range.sql'>

```sql
{{
    config(
        materialized='table',
        partitions=dbt.partition_range('20180101, 20180201'),
        verbose=True
    )
}}

-- This model creates a date-partitioned table. There will be one
-- partition for each day between 20180101 and 20180201, inclusive.
-- The `date_sharded_table` macro below is sugar around [DBT__PARTITION_DATE]

select *
from `snowplow`.`{{ date_sharded_table('events_') }}`
```

</File>

Finally, it's frequently desirable to only update a date partitioned table for the last day of received data. This can be implemented using the above configurations in conjunction with a clever macro and some [command line variables](/docs/build/project-variables).

First, the macro:

<File name='macros/yesterday.sql'>

```sql
{% macro yesterday() %}

  {% set today = modules.datetime.date.today() %}
  {% set one_day = modules.datetime.timedelta(days=1) %}
  {% set yesterday = (today - one_day) %}
  
  {{ return(yesterday.strftime("%Y%m%d")) }}

{% endmacro %}
```

</File>

Next, use it in the model:

<File name='partitioned_yesterday.sql'>

```sql
{{
    config(
        materialized='table',
        partitions=dbt.partition_range(var('dates', default=yesterday())),
        verbose=True
    )
}}

select *
from `snowplow`.`{{ date_sharded_table('events_') }}`
```

</File>

If a `dates` variable is provided (eg. on the command line with `--vars`), then dbt will create the partitions for that date range. Otherwise, dbt will create a partition for `yesterday`, overwriting it if it already exists.

Here's an example of running this model for the first 3 days of 2018 as a part of a backfill:

```
dbt run --select partitioned_yesterday --vars 'dates: "20180101, 20180103"'
```
