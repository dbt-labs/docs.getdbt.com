---
title: "BigQuery configurations"
description: "Reference guide for Big Query configurations in dbt."
id: "bigquery-configs"
tags: ['BigQuery', 'dbt Fusion', 'dbt Core']
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

## Managing KMS encryption

[Customer managed encryption keys](https://cloud.google.com/bigquery/docs/customer-managed-encryption) can be configured for BigQuery tables using the `kms_key_name` model configuration.

### Using KMS encryption

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

## Labels and tags

### Specifying labels

dbt supports the specification of BigQuery labels for the tables and <Term id="view">views</Term> that it creates. These labels can be specified using the `labels` model config.

The `labels` config can be provided in a model config, or in the `dbt_project.yml` file, as shown below.

  BigQuery key-value pair entries for labels larger than 63 characters are truncated.

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

You can create a new label with no value or remove a value from an existing label key.

A label with a key that has an empty value can also be referred to as a [tag](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value) in BigQuery. However, this is different from a [BigQuery tag](https://cloud.google.com/bigquery/docs/tags), which conditionally applies IAM policies to BigQuery tables and datasets. For more information, see the [Tags documentation](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

### Resource tags

[BigQuery tags](https://cloud.google.com/bigquery/docs/tags) enable conditional IAM access control for BigQuery tables and views. You can apply these BigQuery tags using the `resource_tags` configuration. This section contains guidelines for using the `resource_tags` configuration parameter. 

Resource tags are key-value pairs that must follow BigQuery's tag format: `{google_cloud_project_id}/{key_name}: value`. Unlike labels, BigQuery tags are primarily designed for IAM access control using conditional policies, allowing organizations to:

- **Implement conditional access control**: Apply IAM policies conditionally based on BigQuery tags (for example, granting access only to tables tagged with `environment:production`).
- **Enforce data governance**: Use BigQuery tags with IAM policies to protect sensitive data.
- **Control access at scale**: Manage access patterns consistently across different projects and environments.

#### Prerequisites
- [Create tag keys and values](https://cloud.google.com/bigquery/docs/tags#create_tag_keys_and_values) in advance before using them in dbt.
- Grant the [required IAM permissions](https://cloud.google.com/bigquery/docs/tags#required_permissions) to apply tags to resources.

#### Configuring tags in a model file
To configure tags in a model file, refer to the following example:
<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    resource_tags = {
      "my-project-id/environment": "production",
      "my-project-id/data_classification": "sensitive",
      "my-project-id/access_level": "restricted"
    }
  )
}}

select * from {{ ref('another_model') }}
```

</File>

#### Configuring tags in `dbt_project.yml`
To configure tags in a `dbt_project.yml` file, refer to the following example:
<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    production:
      +resource_tags:
        my-project-id/environment: production
        my-project-id/data_classification: sensitive
    staging:
      +resource_tags:
        my-project-id/environment: staging
        my-project-id/data_classification: internal
```

</File>

#### Using both dbt tags and BigQuery tags

You can use dbt's existing `tags` configuration alongside BigQuery's `resource_tags`:

<File name='model.sql'>

```sql
{{
  config(
    materialized = "materialized_view",
    tags = ["reporting", "daily"],  # dbt tags for internal organization
    resource_tags = {  # BigQuery tags for IAM access control
      "my-project-id/environment": "production",
      "my-project-id/data_classification": "sensitive"
    }
  )
}}

select * from {{ ref('my_table') }}
```

</File>

For more information on setting up IAM conditional policies with BigQuery tags, see BigQuery's documentation on [tags](https://cloud.google.com/bigquery/docs/tags).

### Policy tags
BigQuery enables [column-level security](https://cloud.google.com/bigquery/docs/column-level-security-intro) by setting [policy tags](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) on specific columns.

dbt enables this feature as a column resource property, `policy_tags` (_not_ a node config).

<File name='models/<filename>.yml'>

```yaml

models:
- name: policy_tag_table
  columns:
    - name: field
      policy_tags:
        - 'projects/<gcp-project>/locations/<location>/taxonomies/<taxonomy>/policyTags/<tag>'
```

</File>

Please note that in order for policy tags to take effect, [column-level `persist_docs`](/reference/resource-configs/persist_docs) must be enabled for the model, seed, or snapshot. Consider using [variables](/docs/build/project-variables) to manage taxonomies and make sure to add the required security [roles](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles) to your BigQuery service account key.

## Merge behavior (incremental models)

The [`incremental_strategy` config](/docs/build/incremental-strategy) controls how dbt builds incremental models. dbt uses a [merge statement](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) on BigQuery to refresh incremental tables.

The `incremental_strategy` config can be set to one of the following values:
- `merge` (default)
- `insert_overwrite`
- [`microbatch`](/docs/build/incremental-microbatch)

### Performance and cost

The operations performed by dbt while building a BigQuery incremental model can
be made cheaper and faster by using a [clustering clause](#clustering-clause) in your
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

Think of this as "full control" mode. You must ensure that expressions or literal values in the `partitions` config have proper quoting when templated, and that they match the `partition_by.data_type` (`timestamp`, `datetime`, `date`, or `int64`). Otherwise, the filter in the incremental `merge` statement will raise an error.

#### Dynamic partitions

If no `partitions` configuration is provided, dbt will instead:

1. Create a temporary table for your model SQL
2. Query the temporary table to find the distinct partitions to be overwritten
3. Query the destination table to find the _max_ partition in the database

When building your model SQL, you can take advantage of the introspection performed
by dbt to filter for only _new_ data. The maximum value in the partitioned field in the destination table
will be available using the `_dbt_max_partition` BigQuery scripting variable. **Note:**
this is a BigQuery SQL variable, not a dbt Jinja variable, so no Jinja brackets are
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

#### Copying partitions

If you are replacing entire partitions in your incremental runs, you can opt to do so with the [copy table API](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) and partition decorators rather than a `merge` statement. While this mechanism doesn't offer the same visibility and ease of debugging as the SQL `merge` statement, it can yield significant savings in time and cost for large datasets because the copy table API does not incur any costs for inserting the data - it's equivalent to the `bq cp` gcloud command line interface (CLI) command.

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
[0m16:03:13.017641 [debug] [Thread-3 (]: BigQuery adapter: Copying table(s) "/projects/projectname/datasets/analytics/tables/bigquery_table__dbt_tmp$20230112" to "/projects/projectname/datasets/analytics/tables/bigquery_table$20230112" with disposition: "WRITE_TRUNCATE"
...
```

</File>

## Controlling table expiration

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

## Authorized views

If the `grant_access_to` config is specified for a model materialized as a
view, dbt will grant the view model access to select from the list of datasets
provided. See [BQ docs on authorized views](https://cloud.google.com/bigquery/docs/share-access-views)
for more details.

<Snippet path="grants-vs-access-to" />

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

## Materialized views

The BigQuery adapter supports [materialized views](https://cloud.google.com/bigquery/docs/materialized-views-intro)
with the following configuration parameters:

| Parameter                                                                        | Type                   | Required | Default | Change Monitoring Support |
|----------------------------------------------------------------------------------|------------------------|----------|---------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`             | no       | `apply` | n/a                       |
| [`cluster_by`](#clustering-clause)                                               | `[<string>]`           | no       | `none`  | drop/create               |
| [`partition_by`](#partition-clause)                                              | `{<dictionary>}`       | no       | `none`  | drop/create               |
| [`enable_refresh`](#auto-refresh)                                                | `<boolean>`            | no       | `true`  | alter                     |
| [`refresh_interval_minutes`](#auto-refresh)                                      | `<float>`              | no       | `30`    | alter                     |
| [`max_staleness`](#auto-refresh) (in Preview)                                    | `<interval>`           | no       | `none`  | alter                     |
| [`description`](/reference/resource-properties/description)                      | `<string>`             | no       | `none`  | alter                     |
| [`labels`](#specifying-labels)                                                   | `{<string>: <string>}` | no       | `none`  | alter                     |
| [`resource_tags`](#resource-tags)                                                | `{<string>: <string>}` | no       | `none`  | alter                     |
| [`hours_to_expiration`](#controlling-table-expiration)                           | `<integer>`            | no       | `none`  | alter                     |
| [`kms_key_name`](#using-kms-encryption)                                          | `<string>`             | no       | `none`  | alter                     |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>


<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): materialized_view
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#clustering-clause): <field-name> | [<field-name>]
    [+](/reference/resource-configs/plus-prefix)[partition_by](#partition-clause):
      - field: <field-name>
      - data_type: timestamp | date | datetime | int64
        # only if `data_type` is not 'int64'
      - granularity: hour | day | month | year
        # only if `data_type` is 'int64'
      - range:
        - start: <integer>
        - end: <integer>
        - interval: <integer>
    [+](/reference/resource-configs/plus-prefix)[enable_refresh](#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[refresh_interval_minutes](#auto-refresh): <float>
    [+](/reference/resource-configs/plus-prefix)[max_staleness](#auto-refresh): <interval>
    [+](/reference/resource-configs/plus-prefix)[description](/reference/resource-properties/description): <string>
    [+](/reference/resource-configs/plus-prefix)[labels](#specifying-labels): {<label-name>: <label-value>}
    [+](/reference/resource-configs/plus-prefix)[resource_tags](#resource-tags): {<tag-key>: <tag-value>}
    [+](/reference/resource-configs/plus-prefix)[hours_to_expiration](#acontrolling-table-expiration): <integer>
    [+](/reference/resource-configs/plus-prefix)[kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): materialized_view
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [cluster_by](#clustering-clause): <field-name> | [<field-name>]
      [partition_by](#partition-clause):
        - field: <field-name>
        - data_type: timestamp | date | datetime | int64
          # only if `data_type` is not 'int64'
        - granularity: hour | day | month | year
          # only if `data_type` is 'int64'
        - range:
          - start: <integer>
          - end: <integer>
          - interval: <integer>
      [enable_refresh](#auto-refresh): true | false
      [refresh_interval_minutes](#auto-refresh): <float>
      [max_staleness](#auto-refresh): <interval>
      [description](/reference/resource-properties/description): <string>
      [labels](#specifying-labels): {<label-name>: <label-value>}
      [resource_tags](#resource-tags): {<tag-key>: <tag-value>}
      [hours_to_expiration](#acontrolling-table-expiration): <integer>
      [kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)='materialized_view',
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [cluster_by](#clustering-clause)="<field-name>" | ["<field-name>"],
    [partition_by](#partition-clause)={
        "field": "<field-name>",
        "data_type": "timestamp" | "date" | "datetime" | "int64",

        # only if `data_type` is not 'int64'
        "granularity": "hour" | "day" | "month" | "year,

        # only if `data_type` is 'int64'
        "range": {
            "start": <integer>,
            "end": <integer>,
            "interval": <integer>,
        }
    },

    # auto-refresh options
    [enable_refresh](#auto-refresh)= true | false,
    [refresh_interval_minutes](#auto-refresh)=<float>,
    [max_staleness](#auto-refresh)="<interval>",

    # additional options
    [description](/reference/resource-properties/description)="<description>",
    [labels](#specifying-labels)={
        "<label-name>": "<label-value>",
    },
    [resource_tags](#resource-tags)={
        "<tag-key>": "<tag-value>",
    },
    [hours_to_expiration](#acontrolling-table-expiration)=<integer>,
    [kms_key_name](##using-kms-encryption)="<path_to_key>",
) }}
```

</File>

</TabItem>

</Tabs>

Many of these parameters correspond to their table counterparts and have been linked above.
The set of parameters unique to materialized views covers [auto-refresh functionality](#auto-refresh).

Learn more about these parameters in BigQuery's docs:
- [CREATE MATERIALIZED VIEW statement](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_materialized_view_statement)
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)

### Auto-refresh

| Parameter                    | Type         | Required | Default | Change Monitoring Support |
|------------------------------|--------------|----------|---------|---------------------------|
| `enable_refresh`             | `<boolean>`  | no       | `true`  | alter                     |
| `refresh_interval_minutes`   | `<float>`    | no       | `30`    | alter                     |
| `max_staleness` (in Preview) | `<interval>` | no       | `none`  | alter                     |

BigQuery supports [automatic refresh](https://cloud.google.com/bigquery/docs/materialized-views-manage#automatic_refresh) configuration for materialized views.
By default, a materialized view will automatically refresh within 5 minutes of changes in the base table, but not more frequently than once every 30 minutes.
BigQuery only officially supports the configuration of the frequency (the "once every 30 minutes" frequency);
however, there is a feature in preview that allows for the configuration of the staleness (the "5 minutes" refresh).
dbt will monitor these parameters for changes and apply them using an `ALTER` statement.

Learn more about these parameters in BigQuery's docs:
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)
- [max_staleness](https://cloud.google.com/bigquery/docs/materialized-views-create#max_staleness)

### Limitations

As with most data platforms, there are limitations associated with materialized views. Some worth noting include:

- Materialized view SQL has a [limited feature set](https://cloud.google.com/bigquery/docs/materialized-views-create#supported-mvs).
- Materialized view SQL cannot be updated; the materialized view must go through a `--full-refresh` (DROP/CREATE).
- The `partition_by` clause on a materialized view must match that of the underlying base table.
- While materialized views can have descriptions, materialized view *columns* cannot.
- Recreating/dropping the base table requires recreating/dropping the materialized view.

Find more information about materialized view limitations in Google's BigQuery [docs](https://cloud.google.com/bigquery/docs/materialized-views-intro#limitations).

## Python model configuration

**Submission methods:**
BigQuery supports a few different mechanisms to submit Python code, each with relative advantages. The `dbt-bigquery` adapter uses BigQuery DataFrames (BigFrames) or Dataproc. This process reads data from BigQuery, computes it either natively with BigQuery DataFrames or Dataproc, and writes the results back to BigQuery.

<Tabs
  defaultValue="dataframes"
  values={[
    { label: 'BigQuery DataFrames', value: 'dataframes', },
    { label: 'Dataproc', value: 'dataproc', },
  ]
}>
<TabItem value="dataframes">

BigQuery DataFrames can execute pandas and scikit-learn. There's no need to manage infrastructure and leverages BigQuery-distributed query engines. It's great for analysts, data scientists, and machine learning engineers who want to manipulate big data using a pandas-like syntax.

**Note:** BigQuery DataFrames run on Google Colab's default runtime. If no `default` runtime template is available, the adapter will automatically create one for you and mark it `default` for next time usage (assuming it has the right permissions).

**BigQuery DataFrames setup:**

```bash
# IAM permission if using service account

#Create Service Account
gcloud iam service-accounts create dbt-bigframes-sa
#Grant BigQuery User Role
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
#Grant BigQuery Data Editor role. This can be restricted at dataset level
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
#Grant Service Account user 
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
#Grant Colab Entperprise User
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
```

<File name='dbt_project.yml'>

```yaml
models:
  my_dbt_project:
    submission_method: bigframes
```

</File>

<File name='profiles.yml'>

```yaml
my_dbt_project_sa:
  outputs:
    dev:
      compute_region: us-central1
      dataset: <BIGQUERY_DATESET>
      gcs_bucket: <GCS BUCKET USED FOR BIGFRAME LOGS>
      job_execution_timeout_seconds: 300
      job_retries: 1
      keyfile: <SERVICE ACCOUNT KEY FILE>
      location: US
      method: service-account
      priority: interactive
      project: <BIGQUERY_PROJECT>
      threads: 1
      type: bigquery
  target: dev
```
</File>

</TabItem>

<TabItem value="dataproc">

Dataproc (`serverless` or pre-configured `cluster`) can execute Python models as PySpark jobs, reading from and writing to BigQuery. `serverless` is simpler but slower with limited configuration and pre-installed packages (`pandas`, `numpy`, `scikit-learn`), while `cluster` offers full control and faster runtimes. Good for complex, long-running batch pipelines and legacy Hadoop/Spark workflows but often slower for ad-hoc or interactive workloads.

**Dataproc setup:**
- Create or use an existing [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).
- Enable Dataproc APIs for your project and region.
- If using the `cluster` submission method: Create or use an existing [Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) with the [Spark BigQuery connector initialization action](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google recommends copying the action into your own Cloud Storage bucket, rather than using the example version shown in the screenshot.)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Add the Spark BigQuery connector as an initialization action"/>

The following configurations are needed to run Python models on Dataproc. You can add these to your [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) or configure them on specific Python models:
- `gcs_bucket`: Storage bucket to which dbt will upload your model's compiled PySpark code.
- `dataproc_region`: GCP region in which you have enabled Dataproc (for example `us-central1`).
- `dataproc_cluster_name`: Name of Dataproc cluster to use for running Python model (executing PySpark job). Only required if `submission_method: cluster`.

```python
def model(dbt, session):
    dbt.config(
        submission_method="cluster",
        dataproc_cluster_name="my-favorite-cluster"
    )
    ...
```
```yml
models:
  - name: my_python_model
    config:
      submission_method: serverless
```

Python models running on Dataproc Serverless can be further configured in your [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Any user or service account that runs dbt Python models will need the following permissions, in addition to the required BigQuery permissions:
```
dataproc.batches.create
dataproc.clusters.use
dataproc.jobs.create
dataproc.jobs.get
dataproc.operations.get
dataproc.operations.list
storage.buckets.get
storage.objects.create
storage.objects.delete
```
For more information, refer to [Dataproc IAM roles and permissions](https://cloud.google.com/dataproc/docs/concepts/iam/iam).

**Installing packages:** 

Installation of third-party packages on Dataproc varies depending on whether it's a [cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) or [serverless](https://cloud.google.com/dataproc-serverless/docs).  

- **Dataproc Cluster** &mdash; Google recommends installing Python packages while creating the cluster via initialization actions:  
    - [How initialization actions are used](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)  
    - [Actions for installing via `pip` or `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

    You can also install packages at cluster creation time by [defining cluster properties](https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` or `dataproc:conda.packages`.  

- **Dataproc Serverless** &mdash; Google recommends using a [custom docker image](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers) to install thrid-party packages. The image needs to be hosted in [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs). It can then be used by providing the image path in dbt profiles:
    
    <File name='profiles.yml'>
    ```yml
    my-profile:
        target: dev
        outputs:
            dev:
            type: bigquery
            method: oauth
            project: abc-123
            dataset: my_dataset
            
            # for dbt Python models to be run on Dataproc Serverless
            gcs_bucket: dbt-python
            dataproc_region: us-central1
            submission_method: serverless
            dataproc_batch:
                runtime_config:
                    container_image: {HOSTNAME}/{PROJECT_ID}/{IMAGE}:{TAG}
    ```


    </File>

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-pip-packages.png" title="Adding packages to install via pip at cluster startup"/>

</TabItem>
</Tabs>

### Additional parameters

The BigQuery Python models also have the following additional configuration parameters:

| Parameter               | Type        | Required | Default   | Valid values     |
| :---------------------- | :---------- | :------- | :-------- | :--------------- |
| `enable_list_inference` | `<boolean>` | no       | `True`    | `True`, `False`  |
| `intermediate_format`   | `<string>`  | no       | `parquet` | `parquet`, `orc` |
| `submission_method`     | `<string>`  | no       | ``        | `serverless`, `bigframes`, `cluster` |
| `notebook_template_id`  | `<Integer>` | no       | ``        | `<NOTEBOOK RUNTIME TEMPLATE_ID>` |
| `compute_region`        | `<string>`  | no       | ``        | `<COMPUTE_REGION>` |
| `gcs_bucket`            | `<string>`  | no       | ``        | `<GCS_BUCKET>` |
| `packages`              | `<string>`  | no       | ``        | `['numpy<=1.1.1', 'pandas', 'mlflow']` |
| `enable_change_history` | `<boolean>` | no       | ``        | `True`, `False`   |

- The `enable_list_inference` parameter
  - The `enable_list_inference` parameter enables a PySpark data frame to read multiple records in the same operation. By default, this is set to `True` to support the default `intermediate_format` of `parquet`.

- The `intermediate_format` parameter
  - The `intermediate_format` parameter specifies which file format to use when writing records to a table. The default is `parquet`.

- The `submission_method` parameter
  - The `submission_method` parameter specifies whether the job will run on BigQuery DataFrames or Serverless Spark. `submission_method` is not required when `dataproc_cluster_name` is declared.

- The `notebook_template_id` parameter
  - The `notebook_template_id` parameter specifies runtime template in Colab Enterprise.

- The `compute_region` parameter
  - The `compute_region` parameter specifies the region of the job.

- The `gcs_bucket` parameter
  - The `gcs_bucket` parameter specifies the GCS bucket used for storing artifacts for the job.

- The `enable_change_history` parameter
  - The `enable_change_history` parameter enables [BigQuery's change history feature](https://cloud.google.com/bigquery/docs/change-history) which tracks changes made to a BigQuery table. When enabled, you can use the change history to audit and debug the behavior of your incremental models.

**Related docs:**

- [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Create a Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Create a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)


## Unit test limitations

You must specify all fields in a BigQuery `STRUCT` for [unit tests](/docs/build/unit-tests). You cannot use only a subset of fields in a `STRUCT`.

