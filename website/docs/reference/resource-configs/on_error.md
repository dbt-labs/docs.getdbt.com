---
title: on_error
description: "Use the `on_error` config to control whether downstream models are skipped when a model fails."
id: "on_error"
resource_types: [models]
datatype: string
---

<VersionCallout version="1.12" /> 

# on_error<Lifecycle status="beta" />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'SQL config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)on_error: skip_children | continue
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      on_error: skip_children | continue
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```sql
{{ config(
    on_error="skip_children" | "continue"
) }}
```

</File>

</TabItem>

</Tabs>

## Definition

:::info Beta feature
The `on_error` config is a beta feature in <Constant name="core" /> v1.12.
:::

The `on_error` config controls what happens to downstream (child) models when a model fails during a run. This config accepts two values:

- `skip_children` (default): All downstream models are skipped when the model fails.
- `continue`: Downstream models continue running when the model fails, instead of being skipped.

## Example

Set `on_error: continue` when downstream models can still run meaningfully even if an upstream model fails (for example, when they have fallback logic or independent data sources).

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized='table',
    on_error='continue'
) }}

select 1 as id
```

</File>

When `on_error` is set to `continue` on a model that fails, dbt runs its downstream models rather than skipping them. The failed model itself still appears as an error in the run results.

The [`--fail-fast`](/reference/global-configs/failing-fast) flag takes precedence over `on_error: continue`. When `--fail-fast` is set, dbt stops at the first failure and skips all remaining models, regardless of their `on_error` configuration. 

## Behavior with multiple upstream models

When a model has multiple upstream models, `skip_children` takes precedence over `continue`. If any failed upstream model uses `skip_children`, the downstream model is skipped &mdash; even if other failed upstream models use `continue`.

For example, consider a DAG where `model_c` depends on both `model_a` and `model_b`:

- `model_a` uses `on_error: skip_children`
- `model_b` uses `on_error: continue`

The following table shows how `model_c` behaves based on the outcome of its upstream models:

<SimpleTable>

| `model_a` result (`skip_children`) | `model_b` result (`continue`) | `model_c` behavior |
|---|---|---|
| Success | Success | Runs |
| Error | Success | Skipped |
| Success | Error | Runs |
| Error | Error | Skipped |

</SimpleTable>
<br/>

When `model_a` errors, `model_c` is always skipped because `model_a` uses `skip_children`. When only `model_b` errors, `model_c` still runs because `model_b` uses `continue`, which does not block downstream models.