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

Source systems may update more frequently than some downstream models need to rebuild. For example, a model used for daily reporting doesn't need to refresh more than once per day, even if new upstream data is available hourly, while the model powering customer facing metrics that uses some of the same sources may need to update every 30 minutes.

`lag_tolerance` sets how long dbt State waits before rebuilding a node once its upstream data changes. A node rebuilds only when _both_ are true: its last build is older than the `lag_tolerance` window, and its upstream data has changed since that build. This acts as a compute-saving buffer that helps you stay aligned with data freshness [Service Level Agreements (SLAs)](https://www.getdbt.com/blog/data-slas-best-practices) without unnecessary rebuilds. It supports two key scenarios:


- **Aligning builds with SLA requirements**: `lag_tolerance` allows you to align model execution directly with data freshness SLA requirements, decoupling high-frequency upstream changes from downstream models that operate under wider, less demanding freshness requirements.
- **Protecting compute during upstream SLA breaches**: `lag_tolerance` protects your compute budget during freshness SLA breaches, preventing costly downstream rebuilds on static data when an upstream dependency fails its freshness SLA.

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

### When a node rebuilds

dbt State rebuilds a node only when _both_ conditions are met.  If either is false, it reuses the existing node:

<SimpleTable>

| Condition | What it means |
| --- | --- |
| The tolerance has elapsed | The time since the node's last build exceeds its `lag_tolerance`. |
| Upstream data has changed | At least one upstream dependency has new data since that build. |

</SimpleTable>

:::info `lag_tolerance` sets a minimum time between rebuilds

`lag_tolerance` controls how often a node can rebuild, not how fresh its upstream data has to be.

:::

#### Example

Let's say you have a job that runs every 30 minutes, your model has a `45m` tolerance, and it last built at `08:00`. New upstream data arrived at `08:20`.

<SimpleTable>

| Job run | Time since last build | New upstream data since last build? | Result |
| --- | --- | --- | --- |
| `08:30` | `30m` | Yes | Reuse: tolerance hasn't elapsed. |
| `09:00` | `60m` | Yes | Rebuild: both conditions are met. |
| `09:30` | `30m` | No | Reuse: tolerance hasn't elapsed and upstream data hasn't changed. |
| `10:00` | `60m` | No | Reuse: upstream data hasn't changed since `09:00`. |

</SimpleTable>

The `08:20` data waited until `09:00` to be picked up. This was the first run where the build was older than `45m` *and* upstream data had changed. At `10:00`, the build was old enough, but because no new upstream data had arrived since `09:00`, dbt reused the node.

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

import LagToleranceRecommendationsTip from '/snippets/_lag-tolerance-recommendations-tip.md';

<LagToleranceRecommendationsTip />

## Default

If you don't set `lag_tolerance`, dbt State uses `45m` (45 minutes).

## Examples

### Use different tolerances per environment

Use a Jinja expression to set a shorter tolerance in production and a longer tolerance elsewhere. This keeps production data fresh while reducing unnecessary rebuilds during development:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild once their last build is more than 4 hours old and their upstream data has changed. In all other environments, models rebuild once their last build is more than 7 days old and their upstream data has changed.

### Vary tolerance by day of the week

Use a Jinja expression to evaluate the day of the week and apply a tighter tolerance on weekdays than on weekends:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '24h' if modules.datetime.datetime.today().weekday() in (5, 6) else '1h' }}"
```

</File>

In this example, models rebuild once their last build is more than 1 hour old (Monday to Friday) or more than 24 hours old (Saturday to Sunday) and their upstream data has changed.

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
- [Monitor dbt State activity](/docs/deploy/dbt-state-interface)
