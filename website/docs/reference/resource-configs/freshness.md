---
title: freshness
description: "Read this guide to understand the `freshness` configuration in dbt."
id: "freshness"
availability:
  access: free
---

import SaoDeprecated from '/snippets/_sao-deprecated.md';
import SourceFreshnessLegacy from '/snippets/_source-freshness-legacy.md';

# freshness

Use the `freshness` config to declare how fresh your [source](#source-freshness) or [model](#model-freshness) data should be.

<VersionBlock firstVersion="2.0">

Run [`dbt freshness`](/reference/commands/freshness) to check every source and model with freshness configured.

<SourceFreshnessLegacy />

</VersionBlock>

<VersionBlock lastVersion="1.99">

Run [`dbt source freshness`](/reference/commands/source) to check your sources. Model freshness configuration is only available in dbt v2. Refer to [Source freshness](#source-freshness) for more information.

</VersionBlock>

## Configuration

Use the following fields to configure freshness for sources and models unless otherwise noted:

<SimpleTable>
| Field | Description |
|---|---|
| `warn_after` | How old the most recent data can be before a freshness check reports a warning. Requires both `count` and `period`. |
| `error_after` | How old the most recent data can be before a freshness check reports an error. Same format as `warn_after`. |
| `loaded_at_field` | Column dbt queries to determine the most recent loaded timestamp. Required when adapter metadata is unavailable. |
| `loaded_at_query` | A SQL expression that returns the most recent loaded timestamp. Alternative to `loaded_at_field`. Setting both `loaded_at_query` and `loaded_at_field` on the same resource is a parse error. Available in dbt v1.10 and later. |
| `filter` | Adds a `WHERE` clause to the freshness query to limit data scanned. Useful for BigQuery partitioned tables or large tables on Snowflake, Databricks, or Spark. Does not affect other uses of the source or model. Does not apply to `loaded_at_query`. |
</SimpleTable>

One or both of `warn_after` and `error_after` can be provided. If neither is set, dbt will not check freshness for that resource. Each of `warn_after` and `error_after` requires both `count` and `period`; setting only one issues a parse warning but causes an error when `dbt freshness` runs.

## Source freshness

<Tabs>
<TabItem value="project" label="Project file">

<File name="dbt_project.yml">

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      warn_after:
        count: <positive_integer>
        period: minute | hour | day
```

</File>
</TabItem>

<TabItem value="property" label="Property file">

<File name='models/<filename>.yml'>

```yaml
sources:
  - name: <source_name>
    config:
      freshness: # changed to config in v1.9
        warn_after:
          count: <positive_integer>
          period: minute | hour | day
        error_after:
          count: <positive_integer>
          period: minute | hour | day
        filter: <boolean_sql_expression>
      # changed to config in v1.10
      loaded_at_field: <column_name_or_expression>
      # or use loaded_at_query in v1.10 or higher
      loaded_at_query: <sql_expression>

    tables:
      - name: <table_name>
        config:
          # source.table.config.freshness overrides source.config.freshness
          freshness:
            warn_after:
              count: <positive_integer>
              period: minute | hour | day
            error_after:
              count: <positive_integer>
              period: minute | hour | day
            filter: <boolean_sql_expression>
          loaded_at_field: <column_name_or_expression>
          loaded_at_query: <sql_expression>
```

</File>
</TabItem>
</Tabs>

Freshness blocks are applied hierarchically:
- A `freshness` and `loaded_at_field` set on a source apply to all tables in that source.
- A `freshness` and `loaded_at_field` set on a source _table_ override the source-level values.

To exclude a source from freshness calculations, explicitly set `freshness: null`.

If a source has a `freshness:` block, dbt will attempt to calculate freshness for that source:
- If `loaded_at_field` is provided, dbt calculates freshness via a select query.
- If `loaded_at_field` is _not_ provided, dbt calculates freshness via warehouse metadata tables when possible.

<VersionBlock lastVersion="1.99">

Currently, calculating freshness from warehouse metadata tables is supported on the following adapters:
- [Snowflake](/reference/resource-configs/snowflake-configs)
- [Redshift](/reference/resource-configs/redshift-configs)
- [BigQuery](/reference/resource-configs/bigquery-configs) (requires [`dbt-bigquery`](https://github.com/dbt-labs/dbt-bigquery) version 1.7.3 or higher)
- [Databricks](/reference/resource-configs/databricks-configs)

</VersionBlock>

<VersionBlock firstVersion="1.12">
:::note Wildcard table identifiers
On BigQuery, metadata-based freshness checks are not reliable for sources defined with wildcard table identifiers (for example, `events_*`).

To prevent incorrect freshness results, enable the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) flag in your `dbt_project.yml`. When enabled, dbt raises an error if metadata-based freshness is used with a wildcard table identifier.

To calculate freshness for wildcard tables, configure `loaded_at_field` to use query-based freshness checks instead.
:::
</VersionBlock>

### Examples

#### Using `loaded_at_field`

```yml
sources:
  - name: jaffle_shop
    # Cast a date field to timestamp
    loaded_at_field: "completed_date::timestamp"

    tables:
      - name: orders
        # Cast a non-UTC timestamp to UTC
        loaded_at_field: "convert_timezone('Australia/Sydney', 'UTC', created_at_local)"
        config:
          freshness:
            warn_after: {count: 12, period: hour}
```

#### Using `loaded_at_query`

<VersionBlock firstVersion="1.10">

```yaml
sources:
  - name: jaffle_shop
    tables:
      - name: orders
        loaded_at_query: |
          select max(_sdc_batched_at) from (
            select * from {{ this }}
            where _sdc_batched_at > dateadd(day, -7, current_date)
            qualify count(*) over (partition by _sdc_batched_at::date) > 2000
          )
        config:
          freshness:
            warn_after: {count: 12, period: hour}
```

</VersionBlock>

<VersionBlock lastVersion="1.9">

`loaded_at_query` is available in dbt v1.10 and later.

</VersionBlock>


#### Complete example

<File name='models/<filename>.yml'>

```yaml
sources:
  - name: jaffle_shop
    database: raw
    config:
      freshness: # default freshness for all tables
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
      loaded_at_field: _etl_loaded_at

    tables:
      - name: customers # uses the freshness defined above

      - name: orders
        config:
          freshness: # more strict for orders
            warn_after: {count: 6, period: hour}
            error_after: {count: 12, period: hour}
            filter: datediff('day', _etl_loaded_at, current_timestamp) < 2

      - name: product_skus
        config:
          freshness: null # do not check freshness for this table
```

</File>

<VersionBlock firstVersion="2.0">

When running [`dbt freshness`](/reference/commands/freshness), the following query will be run against the `orders` table:

</VersionBlock>

<VersionBlock lastVersion="1.99">

When running [`dbt source freshness`](/reference/commands/source), the following query will be run against the `orders` table:

</VersionBlock>

<Tabs
  defaultValue="compiled"
  values={[
    { label: 'Compiled SQL', value: 'compiled', },
    { label: 'Jinja SQL', value: 'jinja', },
  ]
}>
<TabItem value="compiled">

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as snapshotted_at
from raw.jaffle_shop.orders
where datediff('day', _etl_loaded_at, current_timestamp) < 2
```

</TabItem>

<TabItem value="jinja">

```sql
select
  max({{ loaded_at_field }}) as max_loaded_at,
  {{ current_timestamp() }} as snapshotted_at
from {{ source }}
{% if filter %}
where {{ filter }}
{% endif %}
```

_[Source code](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/src/dbt/include/global_project/macros/adapters/freshness.sql#L5-L16)_

</TabItem>
</Tabs>

<VersionBlock firstVersion="2.0">

## Model freshness <Lifecycle status="beta" />

Use the `freshness` config on a model to:

- **Set a freshness threshold**: Set `warn_after` and `error_after` thresholds to declare how stale a model's data can get, then run `dbt freshness` to check each model against its thresholds and report a warning or an error.
- **Schedule builds (`build_after`)**: Control how often a model rebuilds when new upstream data is available. Available on dbt platform Enterprise tiers only. `build_after` is part of state-aware orchestration, which has been deprecated and is now [dbt State](/docs/deploy/dbt-state-about).

<Tabs>
<TabItem value="project" label="Project file">

<File name="dbt_project.yml">

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)loaded_at_field: <column_name>    # or loaded_at_query
    [+](/reference/resource-configs/plus-prefix)loaded_at_query: <sql_expression> # alternative to loaded_at_field
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      warn_after: {count: <positive_integer>, period: minute | hour | day}
      error_after: {count: <positive_integer>, period: minute | hour | day}
```

</File>
</TabItem>

<TabItem value="property" label="Property file">

<File name="models/<filename>.yml">

```yml
models:
  - name: stg_orders
    config:
      loaded_at_field: updated_at    # or loaded_at_query
      freshness:
        warn_after: {count: 24, period: hour}
        error_after: {count: 48, period: hour}
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">
<File name="models/<filename>.sql">

```sql
{{
    config(
      loaded_at_field="updated_at",
      freshness={
        "warn_after": {"count": 24, "period": "hour"},
        "error_after": {"count": 48, "period": "hour"}
      }
    )
}}
```

</File>
</TabItem>
</Tabs>

Not all materializations support freshness checks the same way. dbt validates your config at parse time and raises an error for invalid combinations.

<SimpleTable>
| Materialization | `loaded_at_field` / `loaded_at_query` | Behavior |
|---|---|---|
| `table`, `incremental`, `materialized_view`, `dynamic_table` | Optional | If unset, dbt falls back to adapter metadata (for example, the table's last modified time). |
| `view`, `external` | Required | Views don't expose row-level metadata. Set `loaded_at_field` or `loaded_at_query` to measure freshness. An empty string (`loaded_at_field: ""`) is treated the same as unset and raises a parse error. |
| `ephemeral` | Not supported | Nothing is materialized to measure. Raises a parse error. |
</SimpleTable>

An incomplete freshness rule (for example, `warn_after` with `count` but no `period`) issues a warning at parse time for all materializations; `dbt run` and `dbt build` warn but still succeed. Only `dbt freshness` treats it as an error. Separately, `view` and `external` models require l`oaded_at_field` or `loaded_at_query` &mdash; omitting both is a parse error that fails `dbt run`, `dbt build`, and `dbt freshness`, regardless of whether the freshness rule is complete.

### Cross-project freshness

For public models in a [dbt Mesh](/docs/mesh/about-mesh), dbt stores the freshness config so downstream projects can check upstream model freshness without running the upstream project.

For example, `project_a` owns a public model `orders` with freshness configured:

```yaml
# project_a: models/orders.yml
models:
  - name: orders
    access: public
    config:
      loaded_at_field: updated_at
      freshness:
        warn_after: {count: 24, period: hour}
        error_after: {count: 48, period: hour}
```

`project_b` depends on `orders`. To check whether `orders` data is fresh, run `dbt freshness` from `project_b` &mdash; no need to re-run `project_a`:

```bash
# run from project_b
dbt freshness --select project_a.orders
```

### Examples

#### Using `warn_after` only

```yaml
models:
  - name: stg_orders
    config:
      materialized: table
      freshness:
        warn_after: {count: 24, period: hour}
```

#### Using `loaded_at_query`

```yaml
models:
  - name: stg_events
    config:
      materialized: table
      freshness:
        warn_after: {count: 6, period: hour}
        error_after: {count: 12, period: hour}
      loaded_at_query: "select max(_loaded_at) from {{ this }} where _batch_complete = true"
```

### Scheduling builds

<SaoDeprecated />

<Tabs>
<TabItem value="project" label="Project file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      [build_after](#scheduling-builds): # Available only on dbt platform Enterprise tiers
        count: <positive_integer>
        period: minute | hour | day
        updates_on: any | all # optional, default is `any`
```

</File>
</TabItem>

<TabItem value="property" label="Property file">

<File name="models/<filename>.yml">

```yml
models:
  - name: stg_orders
    config:
      freshness:
        [build_after](#scheduling-builds):  # Available only on dbt platform Enterprise tiers
          count: <positive_integer>
          period: minute | hour | day
          updates_on: any | all # optional, default is `any`
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">
<File name="models/<filename>.sql">

```sql
{{
    config(
      freshness={
        "build_after": {
          "count": <positive_integer>,
          "period": "minute" | "hour" | "day",
          "updates_on": "any" | "all"
        }
      }
    )
}}
```

</File>
</TabItem>
</Tabs>

The `build_after` config powers state-aware orchestration by rebuilding models _only when new source or upstream data is available_. This is useful for models that depend on other models but only need to be updated periodically.

`freshness` works alongside dbt job orchestration by helping you determine when models should be rebuilt in a scheduled job. When a job runs, dbt makes sure models run only when needed, which helps avoid overbuilding models unnecessarily. dbt does this by:

- Checking if there's new data available for the model
- Ensuring enough time has passed since the last build, based on `count` and `period`

For sources and upstream models (for mesh), dbt considers data "new" based on custom freshness calculations (if configured). If a source's freshness goes past its warning/error threshold, dbt raises a warning/error during the build.

The configuration consists of the following parts:

| Configuration | Description |
|--------------|-------------|
| `build_after` | Available on dbt platform Enterprise tiers only. Config nested under `freshness`. Used to determine whether a model should be rebuilt when new data is present, based on whether the specified count and period have passed since the model was last built. Although dbt checks for new data every time the job runs, `build_after` ensures the model is only rebuilt if enough time has passed and new data is available. |
| `count` and `period` | Specify how often dbt should check for new data. For example, `count: 4, period: hour` means dbt will check every 4 hours. Both `count` and `period` are required when configuring `build_after`. |
| `updates_on` | Optional. Default is `any`. Determines when upstream data changes should trigger a job build. Use the following values:<br /> - `any` (default): The model will build once _any_ direct upstream node has new data since the last build. Faster and may increase spend.<br /> - `all`: The model will only build when _all_ direct upstream nodes have new data since the last build. Less spend and more requirements. |

If you're using [dbt State](/docs/deploy/dbt-state-about), the `build_after` configs have moved out of the `freshness` block and into the `state` block:

| State-aware orchestration | dbt State |
|---|---|
| `freshness.build_after.count` + `freshness.build_after.period` | [`state.lag_tolerance`](/reference/resource-configs/lag-tolerance) |
| `freshness.build_after.updates_on` | [`state.require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) |

For more information, refer to [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration).

#### Default

Default for the `build_after` key is:

```yaml
build_after:
  count: 0
  period: minute
  updates_on: any
```

The default for `updates_on` is `any`. This means that by default, the model will be built every time a scheduled job runs for any amount of new data.

#### Examples

The following examples show how to configure models to run less frequently, more frequently, or on a custom frequency.

##### Less frequent

You can build a model that runs less frequently (which reduces spend) by configuring the model to only build no more often than every X amount of time, as long as it has new data.

```yaml
models:
  - name: stg_wizards
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
  - name: stg_worlds
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
```

When the state-aware orchestration job triggers, dbt checks for two things:

- Whether new source data is available on all upstream models
- Whether the models `stg_wizards` and `stg_worlds` were built more than 4 hours ago

When _both_ conditions are met, dbt builds the model. In this case, the `updates_on: all` config is set. If the `raw.wizards` source has new data, but `stg_wizards` and `stg_worlds` were last built 3 hours ago, then nothing would be built.

##### More frequent

If you want to build a model that runs more frequently, you can configure the model to build as soon as _any_ dependency has new data instead of waiting for all dependencies.

```yaml
models:
  - name: stg_wizards
    config:
      freshness:
        build_after:
          count: 1
          period: hour
          updates_on: any
  - name: stg_worlds
    config:
      freshness:
        build_after:
          count: 1
          period: hour
          updates_on: any
```

When the state-aware orchestration job runs, dbt checks two things:

- If new source data is available on at least one upstream model.
- If `stg_wizards` or `stg_worlds` wasn't built in the last hour.

If _both_ conditions are met, dbt rebuilds the model. If neither model has new data, nothing will be built.

In this example, because `updates_on: any` is set, even if only the `raw.wizards` source has new data and only `stg_wizards` was built in the last hour (while `stg_worlds` hasn't been updated), dbt will still build the model because it only needs one source update and one eligible (stale) model.

##### Custom frequency

You can also use custom logic with `build_after` to set different frequencies for different days, or to skip builds during a specific period (for example, on a weekend).

<Tabs>
<TabItem value="yml" label="Project file">

<File name="dbt_project.yml">

```yaml
+freshness:
  build_after:
    # wait at least 48 hours before building again, if Saturday or Sunday
    # otherwise, wait at least 1 hour before building again
    count: "{{ 48 if modules.datetime.datetime.today().weekday() in (5, 6) else 1 }}"
    period: hour
    updates_on: any
```
</File>
</TabItem>

<TabItem value="sql" label="SQL file config">
<File name="models/<filename>.sql">

```sql
{{
    config(
      freshness={
        "build_after": {
          "count": 48 if modules.datetime.datetime.today().weekday() in (5, 6) else 1,
          "period": "hour",
          "updates_on": "any"
        }
      }
    )
}}
```

</File>
</TabItem>
</Tabs>

</VersionBlock>
