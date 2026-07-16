---
title: "Migrating from state-aware orchestration to dbt State"
sidebar_label: "Migrate from state-aware orchestration"
description: "Step-by-step guide for migrating from state-aware orchestration to dbt State."
id: "dbt-state-migration"
tags: ['dbt State'] 
---

import DbtStateVsSao from '/snippets/_dbt-state-vs-sao.md';

# Migrating from state-aware orchestration to dbt State <Lifecycle status="preview" />

<DbtStateVsSao />

## Migrating your configuration

Much of dbt State's configuration will feel familiar if you've used state-aware orchestration, but there is one significant difference: the `build_after` configs have moved out of the `freshness` block and into a new `state` block.

To migrate to dbt State, move your configs from `freshness.build_after` to the new `state` block. Refer to the following table for the full mapping.

| State-aware orchestration | dbt State | Notes |
|---|---|---|
| `freshness.build_after.updates_on` | [`state.require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) | Same `any` and `all` options with the same behavior: <br/>- `any` (default): rebuilds when _any_ direct parent has fresh data <br/>- `all`: rebuilds only when _all_ direct parents have fresh data |
| `freshness.build_after.count` + `freshness.build_after.period` | [`state.lag_tolerance`](/reference/resource-configs/lag-tolerance) | Combined into a single field with shorthand values (for example, `1800s`, `30m`, `12h`, `1d`, `2w`) or Jinja expressions |

:::note Backward compatibility in Fusion
In the <Constant name="fusion_engine" />, you can enable dbt State without updating your project configs first.

- If `lag_tolerance` and `require_fresh_data_from` are not set, dbt State falls back to your existing `build_after` configs until `build_after` is deprecated.
- If neither `build_after` nor the `state` configs exist, dbt State uses its [default configs](/reference/resource-configs/dbt-state-configs): `lag_tolerance: 45m` and `require_fresh_data_from: any`.

dbt Labs will communicate a migration timeline for state-aware orchestration users when dbt State reaches general availability.
:::

### Examples

You can set these configs at the project level in `dbt_project.yml` or at the model level in a `.yml` file.

**Project-level:**

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

**Before (state-aware orchestration)**

<File name="dbt_project.yml">

```yaml
models:
  +freshness:
    build_after:
      count: 1
      period: day
      updates_on: any
```

</File>

</div>

<div>

**After (dbt State)**

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: 1d
    require_fresh_data_from: any
```

</File>

</div>

</div>

**Model-level:**

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

**Before (state-aware orchestration)**

<File name="models/my_model.yml">

```yaml
models:
  - name: my_model
    config:
      freshness:
        build_after:
          count: 1
          period: day
          updates_on: any
```

</File>

</div>

<div>

**After (dbt State)**

<File name="models/my_model.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        lag_tolerance: 1d
        require_fresh_data_from: any
```

</File>

</div>

</div>

## Testing the migration

You can run both configs side by side while validating. State-aware orchestration reads `freshness.build_after` and dbt State reads the `state` block, so they won't interfere with each other. Once you're confident everything looks right, remove the `build_after` configs.

<File name="dbt_project.yml">

```yaml
models:
  +freshness:
    build_after:            # state-aware orchestration (remove once migrated)
      count: 1
      period: day
      updates_on: any
  +state:                   # dbt State
    lag_tolerance: 1d
    require_fresh_data_from: any
```

</File>

## Known differences from state-aware orchestration

State-aware orchestration and dbt State differ in a few ways:

- **More models rebuilding than expected**: If you notice more rebuilds after you migrate, the most common causes are:
  - **Views with `select *`**: dbt State can't determine which columns `select *` resolves to without querying the upstream schema, so it always rebuilds these views rather than risk reusing a stale result.
  - **Non-determinism in Jinja-templated SQL**: Macros like `dbt_utils.get_relations_by_pattern` with `dbt_utils.union_relations` can return relations in a different order on each run, which produces different compiled SQL. dbt State detects a new hash and rebuilds the model. If that model has downstream dependencies, those models rebuild, too.

  Refer to [Why is my model being rebuilt instead of reused?](/faqs/State/views-rebuilt) for details on each cause and how to diagnose them.

- **`build_after` vs `lag_tolerance`**: Both configs reduce how often a model runs when upstream data is frequently fresh, but they work differently:
  - `freshness.build_after` (for example, `{count: 4, period: hour}`) skips the model unless the configured interval has elapsed _and_ upstream sources have new data since the last run. A SQL change alone does not trigger a rebuild; both conditions must be met.
  - `state.lag_tolerance` (for example, `4h`) skips the model unless upstream data is newer than the model's last run by at least the configured interval. Unlike `build_after`, a detected SQL change triggers a rebuild.
- **Efficient Testing not yet available**: State-aware orchestration offers Efficient Testing (private beta); dbt State doesn't support it yet.

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)