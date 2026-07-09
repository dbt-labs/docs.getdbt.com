---
title: "Custom microbatch strategy"
id: "require_batched_execution_for_custom_microbatch_strategy"
sidebar_label: "require batched execution for custom microbatch strategy"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::



| require_batched_execution_for_custom_microbatch_strategy | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.11 | 1.9.0 |
| Matured (default → `true`) | Sep 1, 2026 | — |
| Removed | — | v2.0 |

The `require_batched_execution_for_custom_microbatch_strategy` flag is only relevant if you already have a custom `get_incremental_microbatch_sql` macro in your project. If you don't have a custom microbatch macro, you don't need to set this flag — dbt handles microbatching automatically for any model using the [microbatch strategy](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).

Set the flag to `true` if you have a custom microbatch macro set up in your project. When the flag is set to `true`, dbt will execute the custom microbatch strategy in batches.

If you have a custom microbatch macro and the flag is left as `false`, dbt will issue a deprecation warning.

Previously, users needed to set the `DBT_EXPERIMENTAL_MICROBATCH` environment variable to `true` to prevent unintended interactions with existing custom incremental strategies. Setting `DBT_EXPERIMENTAL_MICROBATCH` no longer has any effect on runtime functionality.

## Impact when the flag matures

This flag is only relevant if your project has a custom `get_incremental_microbatch_sql` macro. Projects without a custom microbatch macro are unaffected — the built-in macro already runs in batches.

If you have overridden `get_incremental_microbatch_sql` — typically to work around an adapter limitation or implement a custom partition strategy — your macro is invoked under a batched contract for which it was never written. Possible outcomes:

- The macro ignores the smaller `event_time_start` / `event_time_end` window and re-processes the full range every batch, leading to wasted compute, duplicate rows, or `MERGE`/`INSERT` conflicts.
- The macro errors because it expects a single invocation per run.
- Row counts in the destination table differ between flag values.

<Expandable alt_header="Recommended actions">

If a microbatch model errors mid-run, produces duplicate rows or `MERGE`/`INSERT` conflicts, or reprocesses the full date range for every batch, check whether the `get_incremental_microbatch_sql` macro filters by the `event_time_start` / `event_time_end` window. If it uses a hard-coded date filter (for example, `where event_ts >= current_date - interval '1 day'`) or reads only `_dbt_max_partition`, the macro ignores the per-batch window and reprocesses the full range on every iteration.

To fix, rewrite the macro to use the per-batch window:

```sql
{% macro get_incremental_microbatch_sql(arg_dict) %}
    {%- set target = arg_dict["target_relation"] -%}
    {%- set source = arg_dict["temp_relation"] -%}
    {%- set event_time = arg_dict["incremental_predicates"] -%}

    -- Use the per-batch window dbt passes via event_time_start/event_time_end
    -- (exposed through arg_dict["incremental_predicates"] or model.config.event_time_*),
    -- NOT a hard-coded date filter.
    insert into {{ target }}
    select * from {{ source }}
{% endmacro %}
```

To verify, run `dbt run --event-time-start <date> --event-time-end <date> -s <model>` for a single batch and confirm the row count matches that single day.

To opt out of this behavior, set the flag to `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_batched_execution_for_custom_microbatch_strategy: false
```

</File>

</Expandable>
