---
title: lag_tolerance
description: "Configure lag_tolerance to prevent unnecessary node rebuilds when upstream data updates more frequently than your node needs to."
id: "lag-tolerance"
tags: ['dbt State']
---

# lag_tolerance

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      lag_tolerance: <duration_string>
```

</File>
</TabItem>

<TabItem value="property" label="Properties YAML file">

<File name="models/<filename>.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        lag_tolerance: <duration_string>
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "lag_tolerance": "<duration_string>"
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

Source systems may update more frequently than downstream models need to rebuild. For example, a model used for daily reporting doesn't need to refresh more than once per day, even if new upstream data is available hourly.

`lag_tolerance` lets you define how much time must pass since the last upstream data change before dbt triggers a rebuild. This acts as a compute-saving buffer that helps you stay aligned with data freshness [Service Level Agreements (SLAs)](https://www.getdbt.com/blog/data-slas-best-practices) without unnecessary rebuilds. It supports two key scenarios:

- **Aligning builds with SLA requirements**: `lag_tolerance` allows you to align model execution directly with data freshness SLA requirements, decoupling high-frequency upstream changes from downstream models that operate under wider, less demanding freshness requirements.
- **Protecting compute during upstream SLA breaches**: `lag_tolerance` protects your compute budget during freshness SLA breaches, preventing costly downstream rebuilds on static data when an upstream dependency fails its freshness SLA.

When dbt State evaluates whether to rebuild a node, it checks whether upstream parents have fresh data that exceeds the `lag_tolerance` threshold. If they haven't, dbt reuses the existing node rather than cloning or rebuilding it.

This config accepts two value types:

- **Duration strings** in the format `<number><unit>`:

  <SimpleTable>

  | Unit | Accepted values |
  |------|----------------|
  | Seconds | `s`, `second`, `seconds` |
  | Minutes | `m`, `minute`, `minutes` |
  | Hours | `h`, `hour`, `hours` |
  | Days | `d`, `day`, `days` |
  | Weeks | `w`, `week`, `weeks` |

  </SimpleTable>

- **Jinja expressions** - `lag_tolerance` is evaluated as a Jinja template, so you can use any dbt context variables (`target`, `var()`, `env_var()`) to set dynamic tolerances. This is useful for applying different tolerances per environment without duplicating config blocks:

  ```yaml
  lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
  ```

### When does `lag_tolerance` apply

`lag_tolerance` only applies to data freshness checks. A downstream model still rebuilds within its tolerance window if an upstream model's compiled SQL has changed since the last run, regardless of the `lag_tolerance` setting.

This often happens with incremental models. The first time an incremental model runs, it executes a full load with no `WHERE` clause. On subsequent runs, `is_incremental()` becomes true and a filter is appended, changing the compiled SQL. dbt State detects this as a query change on the upstream model and rebuilds all downstream models, even those whose `lag_tolerance` has not elapsed.

For example, `fct_orders` is an incremental model that `agg_orders_daily` depends on:

<File name="models/fct_orders.sql">

```sql
{{ config(materialized='incremental', unique_key='id') }}

select id, amount from {{ ref('raw_orders') }}
{% if is_incremental() %}
where id > (select max(id) from {{ this }})
{% endif %}
```

</File>

<File name="models/agg_orders_daily.sql">

```sql
{{ config(materialized='table', state={'lag_tolerance': '3h'}) }}

select date_trunc('day', created_at) as day, sum(amount) as total
from {{ ref('fct_orders') }}
group by 1
```

</File>

When `fct_orders` transitions from a full load to an incremental run, its compiled SQL changes. `agg_orders_daily` rebuilds on that run despite its 3-hour `lag_tolerance`.

## Default

`45m`. When `lag_tolerance` is not set, dbt State applies a default tolerance of 45 minutes.

## Examples

### Use different tolerances per environment

Use a Jinja expression to set a tight tolerance in production and a looser one everywhere else. This keeps production data fresh while reducing unnecessary rebuilds during development:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild only when upstream data is more than 4 hours old. In all other environments, models wait 7 days before rebuilding.

### Apply different tolerances per folder

Set different tolerances for different parts of your project by targeting folders:

<File name="dbt_project.yml">

```yaml
models:
  <your_project>:
    marts:
      +state:
        lag_tolerance: 1d
    staging:
      +state:
        lag_tolerance: 1h
```

</File>

### Override for a specific model

Override the project-level default for a single model:

<File name="models/my_model.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        lag_tolerance: 1h
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
