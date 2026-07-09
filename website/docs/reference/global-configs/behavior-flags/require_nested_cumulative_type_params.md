---
title: "Cumulative metrics"
id: "require_nested_cumulative_type_params"
sidebar_label: "require nested cumulative type params"
---



| require_nested_cumulative_type_params | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.11 | 1.9.0 |
| Matured (default → `true`) | Sep 1, 2026 | — |
| Removed | — | — |

[Cumulative-type metrics](/docs/build/cumulative#parameters) are nested under the `cumulative_type_params` field in [the <Constant name="dbt" /> **Latest** release track](/docs/dbt-versions/dbt-release-tracks), dbt Core v1.9 and newer. Currently, dbt will warn users if they have cumulative metrics improperly nested. To enforce the new format (resulting in an error instead of a warning), set the `require_nested_cumulative_type_params` to `true`.

Use the following metric configured with the syntax before v1.9 as an example:

```yaml
    type: cumulative
    type_params:
      measure: order_count
      window: 7 days
```

If you run `dbt parse` with that syntax on Core v1.9 or [the <Constant name="dbt" /> **Latest** release track](/docs/dbt-versions/dbt-release-tracks), you will receive a warning like:

```bash
15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.com/reference/global-configs/behavior-changes
```

If you set `require_nested_cumulative_type_params` to `true` and re-run `dbt parse` you will now receive an error like:

```bash
21:39:18  Cumulative fields `type_params.window` and `type_params.grain_to_date` should be nested under `type_params.cumulative_type_params.window` and `type_params.cumulative_type_params.grain_to_date`. Invalid metrics: orders_last_7_days. See documentation on behavior changes: https://docs.getdbt.com/reference/global-configs/behavior-changes.
```

Once the metric is updated, it will work as expected:

```yaml
    type: cumulative
    type_params:
      measure:
        name: order_count
      cumulative_type_params:
        window: 7 days
```

## Impact when the flag matures

Any project with a cumulative metric still using the un-nested syntax stops parsing entirely on the first command. Because parsing fails, the error affects every dbt command: `run`, `build`, `test`, `compile`, `docs generate`, the <Constant name="semantic_layer" />, and more.

<Expandable alt_header="Recommended actions">

If `dbt parse` fails with `Semantic Manifest validation failed` referencing one or more cumulative metrics, migrate the metrics by moving `window` and `grain_to_date` from `type_params` into `type_params.cumulative_type_params`. Alternatively, you can migrate to the [latest YAML spec](/docs/build/latest-metrics-spec#type_params), which removes `type_params` entirely.

```yaml
# Legacy
metrics:
  - name: weekly_active_users
    type: cumulative
    type_params:
      measure: distinct_users
      window: 7 days

# Nested
metrics:
  - name: weekly_active_users
    type: cumulative
    type_params:
      measure: distinct_users
      cumulative_type_params:
        window: 7 days

# Latest spec
metrics:
  - name: weekly_active_users
    type: cumulative
    input_metric: distinct_users
    window: 7 days
```

Re-run `dbt parse` to confirm the manifest validates.

To opt out of this behavior, set the flag to `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_nested_cumulative_type_params: false
```

</File>

</Expandable>
