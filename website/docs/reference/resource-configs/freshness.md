---
title: freshness
description: "Read this guide to understand the `freshness` configuration in dbt."
id: "freshness"
availability:
  engine: v2
  access: free
---

import SaoDeprecated from '/snippets/_sao-deprecated.md';
import FreshnessFields from '/snippets/_freshness-fields.md';

# freshness <Lifecycle status="beta" />

<VersionBlock lastVersion="1.99">

:::note dbt v2 only
Freshness model configurations are only available for the dbt Fusion engine. Refer to [Source data freshness](/docs/build/sources#source-data-freshness) when using dbt v1.
:::

</VersionBlock>

Use the `freshness` config on a model to:

- **Set a freshness threshold**: You can set `warn_after` and `error_after` thresholds to declare how stale a model's data can get, then run [`dbt freshness`](/reference/commands/freshness) to check each model against its thresholds and report a warning or an error.
- **Schedule builds** (`build_after`): You can control how often a model rebuilds when new upstream data is available. Available on dbt platform Enterprise tiers only. `build_after` is part of state-aware orchestration, which has been deprecated and is now dbt State.

## Setting model freshness

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)loaded_at_field: <column_name>    # required for view/external; optional for table/incremental
    [+](/reference/resource-configs/plus-prefix)loaded_at_query: <sql_expression> # alternative to loaded_at_field
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      warn_after: {count: <positive_integer>, period: minute | hour | day}
      error_after: {count: <positive_integer>, period: minute | hour | day}
```

</File>
</TabItem>

<TabItem value="property" label="Properties YAML file">

<File name="models/<filename>.yml">

```yml
models:
  - name: stg_orders
    config:
      loaded_at_field: updated_at    # or loaded_at_query; required for view/external, optional for table/incremental
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

### Definition

Model freshness lets you say how recent a model’s data should be. Run `dbt freshness`](/reference/commands/freshness) to check every model and source you've configured and find out which ones are falling behind.

For public models in a [dbt Mesh](/docs/mesh/about-mesh), dbt stores the freshness config in `publication.json` so downstream projects can check upstream model freshness without running the upstream project.

<FreshnessFields />

### Materialization rules

Not all materializations support freshness checks the same way. dbt validates your config at parse time and raises an error for invalid combinations.

| Materialization | `loaded_at_field` / `loaded_at_query` | Behavior |
|---|---|---|
| `table`, `incremental`, `materialized_view`, `dynamic_table` | Optional | If unset, dbt falls back to adapter metadata (for example, the table’s last modified time). |
| `view`, `external` | Required | Views don’t expose row-level metadata. Set `loaded_at_field` or `loaded_at_query` to measure freshness. An empty string (`loaded_at_field: ""`) is treated the same as unset and raises a parse error. |
| `ephemeral` | Not supported | Nothing is materialized to measure. Raises a parse error. |

If a freshness rule is incomplete (for example, `warn_after` with `count` but no `period`), dbt warns but still runs the command.

### Examples

#### Using `warn_after`

You can set `warn_after` on its own if you want dbt to flag stale data without failing the run. For example, if you want a warning when no new orders come in after 24 hours:

```yaml
models:
  - name: stg_orders
    config:
      materialized: table
      freshness:
        warn_after: {count: 24, period: hour}
```

#### Using `loaded_at_query`

Use `loaded_at_query` when you need custom SQL to determine the most recent timestamp (for example, to check only fully loaded records):

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

---

## Scheduling builds

<SaoDeprecated />

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness):
      build_after: # Available only on dbt platform Enterprise tiers
        count: <positive_integer>
        period: minute | hour | day
        updates_on: any | all # optional, default is `any`
```

</File>
</TabItem>

<TabItem value="property" label="Properties YAML file">

<File name="models/<filename>.yml">

```yml
models:
  - name: stg_orders
    config:
      freshness:
        build_after:  # Available only on dbt platform Enterprise tiers.
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
| `count` and `period` | Specify how often dbt should check for new data. For example, `count: 4, period: hour` means dbt will check every 4 hours.<br /><br /> Note that for every `freshness` config, you're required to either set values for both `count` and `period`, or set `freshness: null`.|
| `updates_on` | Optional. Default is `any`. Determines when upstream data changes should trigger a job build. Use the following values:<br /> - `any` (default): The model will build once _any_ direct upstream node has new data since the last build. Faster and may increase spend.<br /> - `all`: The model will only build when _all_ direct upstream nodes have new data since the last build. Less spend and more requirements. |

If you're using [dbt State](/docs/deploy/dbt-state-about), the `build_after` configs have moved out of the `freshness` block and into the `state` block:

| State-aware orchestration | dbt State |
|---|---|
| `freshness.build_after.count` + `freshness.build_after.period` | [`state.lag_tolerance`](/reference/resource-configs/lag-tolerance) |
| `freshness.build_after.updates_on` | [`state.require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) |

For more information, refer to [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration).

## Default

Default for the `build_after` key is:

```yaml
build_after:
  count: 0
  period: minute
  updates_on: any
```

The default for `updates_on` is `any`. This means that by default, the model will be built every time a scheduled job runs for any amount of new data.

## Examples

The following examples show how to configure models to run less frequently, more frequently, or on a custom frequency.

### Less frequent

You can build a model that runs less frequently (which reduces spend) by configuring the model to only build no more often than every X amount of time, as long as as it has new data.

Add the `freshness` configuration to the model with `count: 4` and `period: hour`:

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

If `updates_on: any` had been set in the previous example, then when `raw.wizards` source has new data, dbt would build the model unless it had been built within the last 4 hours.

### More frequent

If you want to build a model that runs more frequently (which might increase spend), you can configure the model to build as soon as _any_ dependency has new data instead of waiting for all dependencies.

Add the `build_after` freshness configuration to the model with `count: 1` and `period: hour`:

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
- If `stg_wizards` or `stg_worlds` wasn’t built in the last hour.

If _both_ conditions are met, dbt rebuilds the model. This also means if either model (`stg_wizards` _or_ `stg_worlds`) has new data, dbt rebuilds the model. If neither model has new data, nothing will be built.

In this example, because `updates_on: any` is set, even if only the `raw.wizards` source has new data and only `stg_wizards` was built in the last hour (while `stg_worlds` hasn’t been updated), dbt will still build the model because it only needs one source update and one eligible (stale) model.

### Custom frequency

You can also use custom logic with `build_after` to set different frequencies for different days, or to skip builds during a specific period (for example, on a weekend).

If you want to build every hour on just weekdays (Monday to Friday), you can use Jinja expressions in your YAML and SQL files by using [Python functions](https://docs.python.org/3/library/datetime.html#datetime.date.weekday) such as `weekday()` where Monday is `0` and Sunday is `6`. For example:


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


