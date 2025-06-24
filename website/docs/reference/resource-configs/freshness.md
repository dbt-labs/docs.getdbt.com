---
title: freshness
description: "Read this guide to understand the `freshness` configuration in dbt."
id: "freshness"
---
# freshness <Lifecycle status="beta,managed,managed_plus" />
 
<VersionCallout version="1.10" />

<Tabs>
<TabItem value="yml" label="Project file">

<File name="dbt_project.yml">
  
```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      build_after:  # build this model no more often than every X amount of time, as long as as it has new data
        count: <positive_integer>
        period: minute | hour | day
        updates_on: any | all # optional config
```
  
</File>
</TabItem>

<TabItem value="project" label="Model YAML">

<File name="models/<filename>.yml">
  
```yml
models:
  - name: stg_orders
    config:
      freshness:
        build_after:  # build this model no more often than every X amount of time, as long as as it has new data
          count: <positive_integer>
          period: minute | hour | day
          updates_on: any | all # optional config
```
  
</File>
</TabItem>

<TabItem value="sql" label="Config block">
<File name="models/<filename>.sql">
  
```sql
{{
    config(
      freshness={
        "build_after": {     # build this model no more often than every X amount of time, as long as as it has new data
        "count": <positive_integer>,
        "period": "minute" | "hour" | "day",
        "updates_on": "any" | "all" # optional config
        } 
      }
    )
}}
```

</File>
</TabItem>
</Tabs>

<VersionBlock lastVersion="1.9">

This configuration is only available for the dbt Fusion engine.

</VersionBlock>

## Definition

The model `freshness` config powers state-aware orchestration by rebuilding models _only when new source or upstream data is available_, helping you reduce unnecessary rebuilds and optimize spend. This is useful for models that depend on other models but only need to be updated periodically.

`freshness` works alongside dbt job orchestration by helping you determine when models should be rebuilt in a scheduled job. When a job runs, dbt makes sure models run only when needed, which helps avoid overbuilding models unnecessarily. dbt does this by:

- Checking if there's new data available for the model
- Ensuring enough time has passed since the last build, based on `count` and `period`

For sources and upstream models (for mesh), dbt considers data "new" based on custom freshness calculations (if configured). If a source's freshness goes past its warning/error threshold, dbt raises a warning/error during the build.

The configuration consists of the following parts:

| Configuration | Description |
|--------------|-------------|
| `build_after` | Config nested under `freshness`. Used to determine whether a model should be rebuilt when new data is present, based on whether the specified count and period have passed since the model was last built. Although dbt checks for new data every time the job runs, `build_after` ensures the model is only rebuilt if enough time has passed and new data is available. |
| `count` and `period` | Specify how often dbt should check for new data. For example, `count: 4, period: hour` means dbt will check every 4 hours.<br /><br /> Note that for every `freshness` config, you're required to either set values for both `count` and `period`, or set `freshness: null`.|
| `updates_on` | Optional. Determines when upstream data changes should trigger a job build. Use the following values:<br /> - `any`: The model will build once _any_ direct upstream node has new data since the last build. Faster and may increase spend.<br /> - `all`: The model will only build when _all_ direct upstream nodes have new data since the last build. Less spend and more requirements. |

## Default

Default for the `build_after` key is:

```yaml
build_after:
  count: 0
  period: minute
  updates_on: any
```

This means that by default, the model will be built every time a scheduled job runs for any amount of new data.

## Examples

The following examples show how to configure models to run less frequently and more frequently.

You can configure the `freshness` YAML to skip models during the build process *unless* new data is available *and* a specified time interval has passed.

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

In this example, because `updates_on: any` is set in, even if only the `raw.wizards` source has new data and only `stg_wizards` was built in the last hour (while `stg_worlds` hasn’t been updated), dbt will still build the model because it only needs one source update and one eligible (stale) model.
