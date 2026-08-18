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

`lag_tolerance` controls when dbt State rebuilds a node _after_ its upstream data changes. dbt compares the upstream data timestamp from the node's last build with the latest upstream data timestamp. If the difference is greater than the configured `lag_tolerance`, dbt rebuilds the node. Otherwise, it reuses the existing node. This acts as a compute-saving buffer that helps you stay aligned with data freshness [Service Level Agreements (SLAs)](https://www.getdbt.com/blog/data-slas-best-practices) without unnecessary rebuilds. It supports two key scenarios:

- **Aligning builds with SLA requirements**: `lag_tolerance` allows you to align model execution directly with data freshness SLA requirements, decoupling high-frequency upstream changes from downstream models that operate under wider, less demanding freshness requirements.
- **Protecting compute during upstream SLA breaches**: `lag_tolerance` protects your compute budget during freshness SLA breaches, preventing costly downstream rebuilds on static data when an upstream dependency fails its freshness SLA.

When dbt State decides whether to rebuild a node, it doesn't watch the clock &mdash; instead it watches how far the source data has moved on. It compares the source's freshness timestamp from the last time the node was actually built against the source's freshness timestamp right now. If that gap is bigger than your `lag_tolerance`, dbt rebuilds the node. If not, it reuses the node. See [How `lag_tolerance` is calculated](#how-lag_tolerance-is-calculated) for details.

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
dbt State compares two source data timestamps, not clock times:

<SimpleTable>

| Timestamp | What it is |
| --- | --- |
| Source freshness at last build | How fresh the source was the last time dbt actually rebuilt this node |
| Source freshness now | How fresh the source is during this run |

</SimpleTable>

The best way to think about it is using the calculation:

```text
lag = source freshness now − source freshness at last build
```

If the lag exceeds `lag_tolerance`, dbt State rebuilds the node. Otherwise, it reuses the existing node.

Only a rebuild writes the baseline (source freshness at last build). A run that reuses the node leaves it untouched, so the next run subtracts against the same baseline:

```text
run → check lag (source now − baseline)
   ├─ if lag is less than lag_tolerance → reuse   → baseline unchanged
   └─ if lag is greater than lag_tolerance → rebuild → baseline = source now
```

:::info `lag_tolerance` measures timestamp differences 

`lag_tolerance` measures the difference between source data timestamps. It doesn't measure how long unprocessed data has been waiting or how much time has passed since the last dbt invocation.

Waiting longer without receiving additional source data doesn't increase the calculated lag — only newer source data does.

:::

#### Example

Let's say a scheduled job runs `dbt build` every hour. One model has a `lag_tolerance` of `45m`, and was last built at `08:00`, when the source's latest data timestamp was also `08:00`.

Each run, dbt reads the source's current freshness and compares it to the timestamp saved at the last build. New data landing in the source doesn't trigger anything on its own — dbt only evaluates lag during a run.

<SimpleTable>

| Time | What happens | Lag (source now − source at last build) | dbt State result |
| --- | --- | --- | --- |
| `08:00` | The hourly job runs and builds the model. dbt records a source timestamp of `08:00`. | Starting point | Build: baseline set to `08:00` |
| `08:30` | New data lands in the source. No job is running, so nothing is evaluated. | — | No run, no decision |
| `09:00` | The job runs. The source's latest timestamp is `08:30`. | `08:30 − 08:00 = 30m` | Reuse: 30m doesn't exceed `45m`, so baseline stays `08:00` |
| `10:00` | The job runs again. No new source data since `08:30`. | `08:30 − 08:00 = 30m` | Reuse: lag still 30m, baseline stays `08:00` |
| `10:30` | More data lands in the source. Still no job running. | — | No run, no decision |
| `11:00` | The job runs. The source's latest timestamp is now `10:30`. | `10:30 − 08:00 = 2h 30m` | Rebuild: lag exceeds `45m`, so baseline resets to `10:30` |

</SimpleTable>

Even though more than 45 minutes of wall-clock time passed between the `08:30` update and the `09:00` and `10:00` runs, the lag stayed at 30 minutes — because the source's data clock hadn't moved. The model only became eligible to rebuild once newer source data (`10:30`) pushed the gap past `45m`.

To rebuild a node whenever its upstream data changes, set:

```yaml
state:
  lag_tolerance: 0s
```
The following diagram shows how dbt State compares these timestamps to decide whether to reuse or rebuild a node:
<Lightbox src="/img/reference/lag-tolerance-diagram.png" title="How dbt State compares parent and model data dates against lag_tolerance" width="100%" />

dbt State compares the source timestamp saved at the last build with the source's latest timestamp during the run. When you run dbt doesn't affect the math — only how far the source data has advanced.

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

In this example, models in the `prod` target rebuild after their upstream data has advanced by more than 4 hours relative to the data incorporated during their last build. In all other environments, models rebuild after their upstream data has advanced by more than 7 days.

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
