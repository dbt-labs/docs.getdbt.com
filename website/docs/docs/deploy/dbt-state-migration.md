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

To migrate to dbt State, update your configs from `freshness.build_after` to the new `state` block. Refer to the [configuration changes](#configuration-changes) table for the full mapping.

## Configuration changes

Much of dbt State's configuration will feel familiar if you've used state-aware orchestration, but there is one significant difference: the `build_after` configs have moved out of the `freshness` block and into a new `state` block.

| State-aware orchestration | dbt State | Notes |
|---|---|---|
| `freshness.build_after.updates_on` | [`state.require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) | Same `any` and `all` options with the same behavior: <br/>- `any` (default): rebuilds when _any_ direct parent has fresh data <br/>- `all`: rebuilds only when _all_ direct parents have fresh data |
| `freshness.build_after.count` + `freshness.build_after.period` | [`state.lag_tolerance`](/reference/resource-configs/lag-tolerance) | Combined into a single field with shorthand values (for example, `1800s`, `30m`, `12h`, `1d`, `2w`) or Jinja expressions |

:::note Backwards compatibility in Fusion
In the <Constant name="fusion_engine" />, dbt State will automatically fall back to your existing `build_after` configs if `lag_tolerance` is not set. This means you can enable dbt State without updating your project configs first.
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

## Limitation

State aware orchestration’s Efficient Testing feature (private beta) is currently not available in dbt State.

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)