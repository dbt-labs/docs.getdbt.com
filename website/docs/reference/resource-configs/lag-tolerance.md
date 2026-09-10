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

`lag_tolerance` sets how long dbt State waits before rebuilding a node once its upstream data changes. A node rebuilds only when **both** are true: its last build is older than the `lag_tolerance` window, and its upstream data has changed since that build. This acts as a compute-saving buffer that helps you stay aligned with data freshness [Service Level Agreements (SLAs)](https://www.getdbt.com/blog/data-slas-best-practices) without unnecessary rebuilds. It supports two key scenarios:

- **Aligning builds with SLA requirements**: `lag_tolerance` allows you to align model execution directly with data freshness SLA requirements, decoupling high-frequency upstream changes from downstream models that operate under wider, less demanding freshness requirements.
- **Protecting compute during upstream SLA breaches**: `lag_tolerance` protects your compute budget during freshness SLA breaches, preventing costly downstream rebuilds on static data when an upstream dependency fails its freshness SLA.

When dbt State decides whether to rebuild a node, it checks two things: how long ago the node was last built, and whether its upstream data has changed since then. If the last build is older than `lag_tolerance` **and** the upstream data has changed, dbt rebuilds the node. If either isn't true, dbt reuses the existing node rather than cloning or rebuilding it. See [How `lag_tolerance` is calculated](#how-lag_tolerance-is-calculated) for details.

The `lag_tolerance` config accepts two value types:

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

### How `lag_tolerance` is calculated

dbt State rebuilds a node only when **both** of these are true:

<SimpleTable>

| Condition | What it means |
| --- | --- |
| The build is old enough | The node's last build is older than its `lag_tolerance`, measured from when the node last built to now. |
| Upstream data changed | At least one of the node's upstream dependencies has new data since that last build. Any change counts. |

</SimpleTable>

If both are true, dbt State rebuilds the node. If either is false, it reuses the existing node.

```text
run → is the node's last build older than lag_tolerance?
   ├─ no  → reuse
   └─ yes → has any upstream data changed since that build?
              ├─ no  → reuse
              └─ yes → rebuild
```

:::info `lag_tolerance` sets a minimum time between rebuilds

`lag_tolerance` controls how often a node can rebuild, not how fresh its upstream data must be. Even if upstream data changes constantly, a node won't rebuild until its previous build is older than the `lag_tolerance` window. And if nothing upstream has changed, the node won't rebuild no matter how old it is.

:::

#### Example

Let's say a scheduled job runs `dbt build` every 30 minutes. One model has a `lag_tolerance` of `45m` and was last built at `08:00`.

<SimpleTable>

| Time | What happens | Age of last build | Upstream changed since last build? | dbt State result |
| --- | --- | --- | --- | --- |
| `08:00` | The job builds the model. | — | — | Build |
| `08:20` | New upstream data lands. No job is running. | — | — | No run, no decision |
| `08:30` | The job runs. The last build was at `08:00`. | `30m` (under `45m`) | Yes | Reuse: too soon — the build isn't older than `45m` yet |
| `09:00` | The job runs. The last build is still `08:00`. | `60m` (over `45m`) | Yes | Rebuild: both conditions met. New build recorded at `09:00` |
| `09:30` | The job runs. The last build was at `09:00`. | `30m` (under `45m`) | No | Reuse: too soon, and nothing new upstream |
| `10:00` | The job runs. The last build is still `09:00`. | `60m` (over `45m`) | No | Reuse: old enough, but no upstream change to pull in |

</SimpleTable>

The `08:20` data waited until `09:00` to be picked up — the first run where the build was older than `45m` *and* upstream data had changed. At `10:00`, the build was old enough, but because no new upstream data had arrived since `09:00`, dbt reused the node.

To rebuild a node whenever its upstream data changes, set `lag_tolerance` to `0s`:

```yaml
state:
  lag_tolerance: 0s
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

In this example, models in the `prod` target rebuild once their last build is more than 4 hours old and their upstream data has changed. In all other environments, models rebuild once their last build is more than 7 days old and their upstream data has changed.

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
