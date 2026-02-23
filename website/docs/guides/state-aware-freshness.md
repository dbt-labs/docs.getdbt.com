---
title: "Configure freshness for state-aware orchestration"
description: "Learn how to configure source freshness, model freshness, and state-aware orchestration to optimize your dbt builds and reduce warehouse costs."
hoverSnippet: Learn how to configure freshness for state-aware orchestration to optimize builds and reduce costs.
id: state-aware-freshness
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt platform', 'Orchestration', 'SAO', 'freshness']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Introduction

[State-aware orchestration](/docs/deploy/state-aware-about) automatically determines which models to build by detecting changes in code or data. To optimize your builds and reduce warehouse costs, you can configure `freshness` settings that tell dbt when data is "fresh enough" and how often models should be rebuilt.

This guide walks you through configuring source and model freshness to get the most out of state-aware orchestration. You'll learn:

- How to configure source freshness at different levels
- How to control model rebuild frequency with `build_after`
- How to set project-wide defaults and override them where needed
- How to validate your configuration with a hands-on experiment checklist

By the end of this guide, you'll have a cost-efficient configuration that reduces unnecessary rebuilds while keeping your data fresh.

### Understanding freshness

Freshness tells state-aware orchestration when upstream data is fresh enough to trigger downstream model rebuilds. There are two types of freshness:

- [Source freshness](/reference/resource-properties/freshness): Defines when raw data from your sources is considered fresh. State-aware orchestration uses source freshness (combined with state and model rules) to decide whether downstream models should be rebuilt.
- [Model freshness](/reference/resource-configs/freshness): Controls how often a model can be rebuilt, even if upstream data changes frequently.

State-aware orchestration uses both together to make intelligent decisions about when to rebuild models, helping you avoid unnecessary compute costs.

## Prerequisites

Before configuring `freshness` for state-aware orchestration, make sure you have:

- A <Constant name="cloud" /> [Enterprise or Enterprise+ account](https://www.getdbt.com/signup/)
- [State-aware orchestration enabled](/docs/deploy/state-aware-setup) in your environment
- A dbt project using the <Constant name="fusion_engine" />

## Configure source freshness

[Source freshness](/reference/resource-properties/freshness) defines when upstream raw data is considered fresh. You can configure it at the source level (applies to all tables) or at the table level (overrides source settings).

Freshness requires specifying both `count` and `period` unless setting `freshness: null`.

### Step 1: Add source-level freshness

Configure freshness at the source level. This applies to all tables in that source unless you override it at the table level.

```yaml
sources:
  - name: raw
    loaded_at_field: _etl_loaded_at
    config:
      freshness:
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
```

This configuration:
- Uses `_etl_loaded_at` as the timestamp column to check freshness
- Warns if data is older than 12 hours
- Errors if data is older than 24 hours

### Step 2: Override freshness at the table level (optional)

For tables that need different freshness rules, you can override the source-level settings:

```yaml
sources:
  - name: raw
    tables:
      - name: orders
        config:
          freshness:
            warn_after: {count: 6, period: hour}
            filter: datediff('day', _etl_loaded_at, current_timestamp) < 2
```

Key notes:
- Table-level freshness overrides source-level settings.
- Use `filter:` to reduce warehouse scan costs for large or partitioned tables.
- `filter:` does _not_ apply if you're using `loaded_at_query`.

### Step 3: Use custom SQL for complex freshness logic

When your ingestion is partial, delayed, or requires custom logic, use `loaded_at_query`.

```yaml
sources:
  - name: raw
    tables:
      - name: orders
        loaded_at_query: |
          select max(_sdc_batched_at) from {{ this }}
```

Use `loaded_at_query` when:
- You have late-arriving data and need to account for a lookback window.
- You want to check freshness based on row volume thresholds.
- Your freshness logic requires custom SQL.

Note that `loaded_at_query` overrides `loaded_at_field` if both are defined. It also ignores `filter` settings.

### Step 4: Use metadata-based freshness (optional)

If you omit `loaded_at_field` and your adapter supports it, dbt uses warehouse metadata to detect freshness. This is supported on the following adapters:

- Snowflake
- Redshift
- BigQuery (dbt-bigquery ≥ 1.7.3)
- Databricks

## Configure model freshness

Model freshness controls _how often_ a model may be rebuilt, even if upstream data changes frequently. A model is eligible for rebuild when:

- Upstream sources/models have new data.
- Enough time has passed since the model was last built (`count` + `period`).
- The `updates_on` condition is satisfied.

### Step 1: Add `build_after` to a model

Configure freshness on a single model:

```yaml
models:
  - name: stg_orders
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
```


This tells dbt to only rebuild this model if it has been at least 4 hours since the last build _and_ all upstream dependencies have new data.

### Step 2: Understand `updates_on` options

The `updates_on` setting controls when upstream changes trigger a rebuild:

| Value | Behavior | Use case |
|-------|----------|----------|
| `any` (default) | Model rebuilds when _any one_ upstream has new data. | Fresher data, but more cost. |
| `all` | Model rebuilds only when _all_ upstreams have new data. | Fewer builds, lower cost. |

## Set project-level defaults

Instead of configuring each model individually, you can set defaults at the project level in `dbt_project.yml`. You can then override these defaults at the folder or model level when needed.

### Step 1: Set a project-level default


```yaml
models:
  +freshness:
    build_after:
      count: 4
      period: hour
      updates_on: all
```

This configuration applies to all models in your project. You can still override at the folder or model level when needed.

### Step 2: Override defaults for specific folders

Override project defaults for specific model folders that need different refresh intervals.


```yaml
models:
  +freshness:
    build_after:
      count: 4
      period: hour
      updates_on: all
  marts:
    +freshness:
      build_after:
        count: 1
        period: hour
        updates_on: any
```

This configuration:
- Sets a 4-hour default for all models.
- Overrides to 1 hour for models in the `marts` folder.
- Uses `any` for `marts` (fresher data), and `all` for everything else.

### Step 3: Disable freshness for specific models

For models that should always rebuild when code or data changes, you can disable `freshness`.

```yaml
models:
  - name: product_skus
    config:
      freshness: null
```

Disabling freshness returns the model to state-aware orchestration's default behavior: rebuild when code or upstream data changes, with no time-gating.

## Recommended starting configuration

Here's a balanced, cost-efficient configuration that works well for most teams:

### Sources configuration

```yaml
sources:
  - name: raw
    loaded_at_field: _etl_loaded_at
    config:
      freshness:
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
```

### Models configuration

```yaml
models:
  +freshness:
    build_after:
      count: 4
      period: hour
      updates_on: all
```

### High-priority models override

```yaml
models:
  - name: fact_orders
    config:
      freshness:
        build_after:
          count: 1
          period: hour
          updates_on: any
```

## Validate your configuration

Use the following lists to understand how state-aware orchestration behaves under different conditions and validate your configuration is working as expected.

### Source freshness

- [ ] Add source-level `warn_after` and `error_after`.
- [ ] Add `loaded_at_field` at the source level.
- [ ] Remove `loaded_at_field` to test metadata-based freshness.
- [ ] Add table-level freshness override.
- [ ] Add a `filter:` to reduce scanned partitions.
- [ ] Add a `loaded_at_query` and observe behavior.
- [ ] Compare compiled SQL under each configuration.

### Model freshness

- [ ] Add `build_after` to one model.
- [ ] Run a job and confirm it builds.
- [ ] Run the job again immediately and confirm it skips (time-gated).
- [ ] Change `updates_on` to `any` and observe rebuild behavior.
- [ ] Change `updates_on` to `all` and observe gating behavior.
- [ ] Set project-level freshness defaults.
- [ ] Override freshness at folder level.
- [ ] Override at model level.
- [ ] Disable freshness for one model using `freshness: null`.

### State-aware orchestration

- [ ] Run a job twice with no data/code changes and confirm state-aware orchestration skips builds.
- [ ] Modify upstream source data and confirm state-aware orchestration rebuilds.
- [ ] Modify model SQL and confirm rebuild regardless of freshness.
- [ ] Mix fresh and stale upstreams. Observe differences between `any` and `all`.
- [ ] Change job frequency (for example, 30 minutes). Observe how `build_after` is enforced.

### Edge cases

- [ ] Clear environment cache and confirm rebuild on next run.
- [ ] Temporarily disable state-aware orchestration and confirm forced rebuild behavior.
- [ ] Add sources that are warehouse views. Observe "always fresh" warning.


## Limitations

- State-aware orchestration is only available in deploy jobs. Continuous integration (CI) and merge jobs are currently not supported.

## Next steps

Now that you've configured `freshness` for state-aware orchestration:

- Review [Setting up state-aware orchestration](/docs/deploy/state-aware-setup) for more advanced configurations.
- Learn about the [state-aware orchestration interface](/docs/deploy/state-aware-interface) to monitor your builds.

</div>
