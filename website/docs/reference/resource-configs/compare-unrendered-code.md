---
title: compare_unrendered_code
description: "Controls whether dbt State checks both the Jinja template (unrendered code) and rendered SQL when deciding whether a model has changed."
id: "compare-unrendered-code"
tags: ['dbt State']
---

# compare_unrendered_code

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      compare_unrendered_code: true | false
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
        compare_unrendered_code: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "compare_unrendered_code": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

<SimpleTable>
| Value | Behavior |
|-------|----------|
| `false` (default) | dbt State compares only rendered SQL. Non-deterministic macros or env vars that change the rendered SQL on each run may trigger unnecessary rebuilds. |
| `true` | dbt State avoids unnecessary rebuilds by checking both the Jinja template and rendered SQL. A rebuild only occurs when both have changed. |
</SimpleTable>

By default, dbt State compares only rendered SQL and rebuilds when the output differs from the stored hash. How frequently that happens depends on how often the values change. For example:

- `{{ invocation_id() }}` resolves to a new value on every run, so it always triggers a rebuild.
- `{{ dbt_utils.get_column_values() }}` only changes if the underlying column values change or return in a different order, so it triggers rebuilds less predictably.
- `{{ modules.datetime.datetime.now().month }}` only resolves to a new value once a month, so it triggers a rebuild on the next run after the month changes.

Set `compare_unrendered_code: true` to avoid these unnecessary rebuilds. When enabled, dbt State also checks the unrendered Jinja template, and only rebuilds when both the unrendered code _and_ the rendered SQL have changed. This is useful for nodes with non-deterministic macros or environment variables (such as a macro that returns a UUID, or `{{ env_var('AIRFLOW_RUN_ID') }}`) that produce different rendered SQL on every run even when the template itself is unchanged.

## Interaction with `evaluate_volatile_sql`

When `compare_unrendered_code` is enabled, dbt State checks whether the unrendered Jinja template has changed. If the template is unchanged, dbt State skips SQL parsing entirely &mdash; volatile SQL functions are not evaluated and [`evaluate_volatile_sql`](/reference/resource-configs/evaluate-volatile-sql) has no effect. If the unrendered template has changed, dbt State proceeds to parse and compare the rendered SQL, and `evaluate_volatile_sql` applies.

## Examples

### Model with a non-deterministic environment variable

A model with a non-deterministic environment variable is reused as long as neither the model's own Jinja template nor the source of any macros it calls has changed, even if the environment variable (for example, AIRFLOW_RUN_ID) resolves to a different value at runtime:

<File name="models/fct_events.sql">

```sql
{{ config(state={"compare_unrendered_code": true}) }}

select
  event_id,
  user_id,
  event_type,
  occurred_at,
  '{{ env_var("AIRFLOW_RUN_ID") }}' as airflow_run_id
from {{ ref('stg_events') }}
```

</File>

### Model with dbt run metadata columns

A model that records which dbt run produced each row using [`invocation_id()`](/reference/dbt-jinja-functions/invocation_id) or [`run_started_at`](/reference/dbt-jinja-functions/run_started_at) is reused as long as the template hasn't changed, even though those values resolve differently on every run:

<File name="models/fct_orders.sql">

```sql
{{ config(state={"compare_unrendered_code": true}) }}

select
  *,
  '{{ invocation_id() }}' as dbt_invocation_id,
  '{{ run_started_at }}' as dbt_run_started_at
from {{ ref('stg_orders') }}
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
