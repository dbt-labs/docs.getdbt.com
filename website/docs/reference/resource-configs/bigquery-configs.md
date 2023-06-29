---
title: "BigQuery configurations"
description: "Read this guide to understand BigQuery configurations in dbt."
id: "bigquery-configs"
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
--->

## Use `project` and `dataset` in configurations

- `schema` is interchangeable with the BigQuery concept `dataset`
- `database` is interchangeable with the BigQuery concept of `project`

For our reference documentation, you can declare `project` in place of `database.` 
This will allow you to read and write from multiple BigQuery projects. Same for `dataset`.

## Using table partitioning and clustering

### Partition clause

<Changelog>

Before dbt v0.16.0, the `partition_by` configuration was supplied as string. While
the string specification syntax is still supported in dbt v0.16.0, it has been
deprecated and will be removed in a future release. **Note:** partitioning configs
using a range bucket *must* be supplied using the dictionary-style configuration as of
dbt v0.16.0.

Example usage for versions of dbt < 0.16.0:

```sql
-- Partitioning by a timestamp field
{{ config( materialized='table', partition_by="date(created_at)" ) }}

-- Partitioning by a date field
{{ config( materialized='table', partition_by="created_date" ) }}
```

</Changelog>

BigQuery supports the use of a [partition by](https://cloud.google.com/bigquery/docs/data-definition-language#specifying_table_partitioning_options) clause to easily partition a <Term id="table" /> by a column or expression. This option can help decrease latency and cost when querying large tables. Note that partition pruning [only works](https://cloud.google.com/bigquery/docs/querying-partitioned-tables#pruning_limiting_partitions) when partitions are filtered using literal values (so selecting partitions using a <Term id="subquery" /> won't improve performance).

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
<Changelog>Partitioning by hour, month or year is new in v0.19.0</Changelog>

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

<VersionBlock firstVersion="1.4">

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

</VersionBlock>

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
  customer_id,
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

<Changelog>

  - **v0.20.0:** Introduced `require_partition_filter` and `partition_expiration_days`

</Changelog>

If your model has `partition_by` configured, you may optionally specify two additional configurations:

- `require_partition_filter` (boolean): If set to `true`, anyone querying this model _must_ specify a partition filter, otherwise their query will fail. This is recommended for very large tables with obvious partitioning schemes, such as event streams grouped by day. Note that this will affect other dbt models or tests that try to select from this model, too.

- `partition_expiration_days` (integer): If set for date- or timestamp-type partitions, the partition will expire that many days after the date it represents. E.g. A partition representing `2021-01-01`, set to expire after 7 days, will no longer be queryable as of `2021-01-08`, its storage costs zeroed out, and its contents will eventually be deleted. Note that [table expiration](#controlling-table-expiration) will take precedence if specified.

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

### Clustering Clause

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

Clustering on a multiple columns:

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

## Managing KMS Encryption

[Customer managed encryption keys](https://cloud.google.com/bigquery/docs/customer-managed-encryption) can be configured for BigQuery tables using the `kms_key_name` model configuration.

### Using KMS Encryption

To specify the KMS key name for a model (or a group of models), use the `kms_key_name` model configuration. The following example sets the `kms_key_name` for all of the models in the `encrypted/` directory of your dbt project.

<File name='dbt_project.yml'>

```yaml

name: my_project
version: 1.0.0

...

models:
  my_project:
    encrypted:
      +kms_key_name: 'projects/PROJECT_ID/locations/global/keyRings/test/cryptoKeys/quickstart'
```

</File>

## Labels and Tags

### Specifying labels

dbt supports the specification of BigQuery labels for the tables and <Term id="view">views</Term> that it creates. These labels can be specified using the `labels` model config.

The `labels` config can be provided in a model config, or in the `dbt_project.yml` file, as shown below.
  
<Changelog>

  - **v1.5.0:** BigQuery key-value pair entries for labels larger than 63 characters are truncated.

</Changelog>

**Configuring labels in a model file**

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    labels = {'contains_pii': 'yes', 'contains_pie': 'no'}
  )
}}

select * from {{ ref('another_model') }}
```

</File>

**Configuring labels in dbt_project.yml**

<File name='dbt_project.yml'>

```yaml

models:
  my_project:
    snowplow:
      +labels:
        domain: clickstream
    finance:
      +labels:
        domain: finance
```

</File>



<Lightbox src="/img/docs/building-a-dbt-project/building-models/73eaa8a-Screen_Shot_2020-01-20_at_12.12.54_PM.png" title="Viewing labels in the BigQuery console"/>

### Specifying tags
BigQuery table and view *tags* can be created by supplying an empty string for the label value.

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    labels = {'contains_pii': ''}
  )
}}

select * from {{ ref('another_model') }}
```

</File>

### Policy tags
BigQuery enables [column-level security](https://cloud.google.com/bigquery/docs/column-level-security-intro) by setting [policy tags](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) on specific columns.

dbt enables this feature as a column resource property, `policy_tags` (_not_ a node config).

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
- name: policy_tag_table
  columns:
    - name: field
      policy_tags:
        - 'projects/<gcp-project>/locations/<location>/taxonomies/<organization>/policyTags/<tag>'
```

</File>

Please note that in order for policy tags to take effect, [column-level `persist_docs`](/reference/resource-configs/persist_docs) must be enabled for the model, seed, or snapshot. Consider using [variables](/docs/build/project-variables) to manage taxonomies and make sure to add the required security [roles](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles) to your BigQuery service account key.

## Merge behavior (incremental models)

The [`incremental_strategy` config](/docs/build/incremental-models#about-incremental_strategy) controls how dbt builds incremental models. dbt uses a [merge statement](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) on BigQuery to refresh incremental tables.

The `incremental_strategy` config can be set to one of two values:
 - `merge` (default)
 - `insert_overwrite`

### Performance and cost

The operations performed by dbt while building a BigQuery incremental model can
be made cheaper and faster by using [clustering keys](#clustering-keys) in your
model configuration. See [this guide](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981) for more information on performance tuning for BigQuery incremental models.

**Note:** These performance and cost benefits are applicable to incremental models
built with either the `merge` or the `insert_overwrite` incremental strategy.

### The `merge` strategy
 The `merge` incremental strategy will generate a `merge` statement that looks
 something like:

```merge
merge into {{ destination_table }} DEST
using ({{ model_sql }}) SRC
on SRC.{{ unique_key }} = DEST.{{ unique_key }}

when matched then update ...
when not matched then insert ...
```

The 'merge' approach automatically updates new data in the destination incremental table but requires scanning all source tables referenced in the model SQL, as well as destination tables. This can be slow and expensive for large data volumes. [Partitioning and clustering](#using-table-partitioning-and-clustering) techniques mentioned earlier can help mitigate these issues.

**Note:** The `unique_key` configuration is required when the `merge` incremental
strategy is selected.

### The `insert_overwrite` strategy

<Changelog>

  - **v0.16.0:** Introduced `insert_overwrite` incremental strategy

</Changelog>

The `insert_overwrite` strategy generates a merge statement that replaces entire partitions
in the destination table. **Note:** this configuration requires that the model is configured
with a [Partition clause](#partition-clause). The `merge` statement that dbt generates
when the `insert_overwrite` strategy is selected looks something like:

```sql
/*
  Create a temporary table from the model SQL
*/
create temporary table {{ model_name }}__dbt_tmp as (
  {{ model_sql }}
);

/*
  If applicable, determine the partitions to overwrite by
  querying the temp table.
*/

declare dbt_partitions_for_replacement array<date>;
set (dbt_partitions_for_replacement) = (
    select as struct
        array_agg(distinct date(max_tstamp))
    from `my_project`.`my_dataset`.{{ model_name }}__dbt_tmp
);

/*
  Overwrite partitions in the destination table which match
  the partitions in the temporary table
*/
merge into {{ destination_table }} DEST
using {{ model_name }}__dbt_tmp SRC
on FALSE

when not matched by source and {{ partition_column }} in unnest(dbt_partitions_for_replacement)
then delete

when not matched then insert ...
```

For a complete writeup on the mechanics of this approach, see
[this explainer post](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982).

#### Determining partitions to overwrite

dbt is able to determine the partitions to overwrite dynamically from the values
present in the temporary table, or statically using a user-supplied configuration.

The "dynamic" approach is simplest (and the default), but the "static" approach
will reduce costs by eliminating multiple queries in the model build script.

#### Static partitions

To supply a static list of partitions to overwrite, use the `partitions` configuration.

<File name="models/session.sql">

```sql
{% set partitions_to_replace = [
  'timestamp(current_date)',
  'timestamp(date_sub(current_date, interval 1 day))'
] %}

{{
  config(
    materialized = 'incremental',
    incremental_strategy = 'insert_overwrite',
    partition_by = {'field': 'session_start', 'data_type': 'timestamp'},
    partitions = partitions_to_replace
  )
}}

with events as (

    select * from {{ref('events')}}

    {% if is_incremental() %}
        -- recalculate yesterday + today
        where timestamp_trunc(event_timestamp, day) in ({{ partitions_to_replace | join(',') }})
    {% endif %}

),

... rest of model ...
```

</File>

This example model serves to replace the data in the destination table for both
_today_ and _yesterday_ every day that it is run. It is the fastest and cheapest
way to incrementally update a table using dbt. If we wanted this to run more dynamically—
let’s say, always for the past 3 days—we could leverage dbt’s baked-in [datetime macros](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/core/dbt/include/global_project/macros/etc/datetime.sql) and write a few of our own.

<Changelog>

  - **v0.19.0:** With the advent of truncated timestamp partitions in BigQuery, `timestamp`-type partitions are now treated as timestamps instead of dates for the purposes of filtering. Update `partitions_to_replace` accordingly.

</Changelog>

Think of this as "full control" mode. You must ensure that expressions or literal values in the the `partitions` config have proper quoting when templated, and that they match the `partition_by.data_type` (`timestamp`, `datetime`, `date`, or `int64`). Otherwise, the filter in the incremental `merge` statement will raise an error.

#### Dynamic partitions

If no `partitions` configuration is provided, dbt will instead:

1. Create a temporary table for your model SQL
2. Query the temporary table to find the distinct partitions to be overwritten
3. Query the destination table to find the _max_ partition in the database

When building your model SQL, you can take advantage of the introspection performed
by dbt to filter for only _new_ data. The max partition in the destination table
will be available using the `_dbt_max_partition` BigQuery scripting variable. **Note:**
this is a BigQuery SQL variable, not a dbt Jinja variable, so no jinja brackets are
required to access this variable.

**Example model SQL:**

```sql
{{
  config(
    materialized = 'incremental',
    partition_by = {'field': 'session_start', 'data_type': 'timestamp'},
    incremental_strategy = 'insert_overwrite'
  )
}}

with events as (

  select * from {{ref('events')}}

  {% if is_incremental() %}

    -- recalculate latest day's data + previous
    -- NOTE: The _dbt_max_partition variable is used to introspect the destination table
    where date(event_timestamp) >= date_sub(date(_dbt_max_partition), interval 1 day)

{% endif %}

),

... rest of model ...
```

<VersionBlock firstVersion="1.4">

#### Copying ingestion-time partitions

If you have configured your incremental model to use "ingestion"-based partitioning (`partition_by.time_ingestion_partitioning: True`), you can opt to use a legacy mechanism for inserting and overwriting partitions. While this mechanism doesn't offer the same visibility and ease of debugging as the SQL `merge` statement, it can yield significant savings in time and cost for large datasets. Behind the scenes, dbt will add or replace each partition via the [copy table API](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) and partition decorators.

You can enable this by switching on `copy_partitions: True` in the `partition_by` configuration. This approach works only in combination with "dynamic" partition replacement.

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="insert_overwrite",
    partition_by={
      "field": "created_date",
      "data_type": "timestamp",
      "granularity": "day",
      "time_ingestion_partitioning": true,
      "copy_partitions": true
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

<File name='logs/dbt.log'>

```
...
[0m16:03:13.017641 [debug] [Thread-3 (]: BigQuery adapter: Copying table(s) "/projects/projectname/datasets/analytics/tables/bigquery_table$20230112" to "/projects/projectname/datasets/analytics/tables/bigquery_table$20230112" with disposition: "WRITE_TRUNCATE"
...
```

</File>

</VersionBlock>

## Controlling table expiration
<Changelog>New in v0.18.0</Changelog>

By default, dbt-created tables never expire. You can configure certain model(s)
to expire after a set number of hours by setting `hours_to_expiration`.

:::info Note
The `hours_to_expiration` only applies to initial creation of the underlying table. It doesn't reset for incremental models when they do another run.
:::

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +hours_to_expiration: 6

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    hours_to_expiration = 6
) }}

select ...

```

</File>

## Authorized Views

<Changelog>New in v0.18.0</Changelog>

If the `grant_access_to` config is specified for a model materialized as a
view, dbt will grant the view model access to select from the list of datasets
provided. See [BQ docs on authorized views](https://cloud.google.com/bigquery/docs/share-access-views)
for more details.

<Snippet src="grants-vs-access-to" />

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +grant_access_to:
      - project: project_1
        dataset: dataset_1
      - project: project_2
        dataset: dataset_2
```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    grant_access_to=[
      {'project': 'project_1', 'dataset': 'dataset_1'},
      {'project': 'project_2', 'dataset': 'dataset_2'}
    ]
) }}
```

</File>

Views with this configuration will be able to select from objects in `project_1.dataset_1` and `project_2.dataset_2`, even when they are located elsewhere and queried by users who do not otherwise have access to `project_1.dataset_1` and `project_2.dataset_2`.

#### Limitations

The `grant_access_to` config is not thread-safe when multiple views need to be authorized for the same dataset. The initial `dbt run` operation after a new `grant_access_to` config is added should therefore be executed in a single thread. Subsequent runs using the same configuration will not attempt to re-apply existing access grants, and can make use of multiple threads.

## Materialized view

The BigQuery adapter supports [materialized views](https://cloud.google.com/bigquery/docs/materialized-views-intro) and refreshes them for every subsequent `dbt run` you execute. For more information, see [Refresh Materialized Views](https://cloud.google.com/bigquery/docs/materialized-views-manage#refresh) in the Google docs.

Materialized views support the optional configuration `on_configuration_change` with the following values: 
- `apply` (default) &mdash; attempts to update the existing database object if possible, avoiding a complete rebuild. The following changes can be applied without the need to rebuild the materialized view:
  - enable_refresh 
  - refresh_interval_minutes 
  - max_staleness
- `skip` &mdash; allows runs to continue while also providing a warning that the model was skipped
- `fail` &mdash; forces runs to fail if a change is detected in a materialized view 

You can create a materialized view by editing _one_ of these files:
- the SQL file for your model
- the `dbt_project.yml` configuration file

The following examples create a materialized view: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'materialized_view',
    on_configuration_change = 'apply',
  )
}}
```

</File>


<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: materialized_view
```
</File>