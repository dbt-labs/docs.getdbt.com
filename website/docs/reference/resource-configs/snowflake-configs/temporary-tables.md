---
title: "Temporary tables"
sidebar_label: "Temporary tables"
description: "Control whether Snowflake incremental builds use a view, table, or transient temporary relation with the tmp_relation_type config."
---

To save compile time and avoid the database write step initiated by a temporary table, incremental table merges for Snowflake prefer to utilize a `view` rather than a `temporary table` .

Sometimes a temporary table achieves results faster or more safely. You can opt in to temporary or transient tables for incremental builds by using the `tmp_relation_type` configuration  This is defined as part of the model configuration.

To guarantee accuracy, an incremental model using the `delete+insert` strategy with a `unique_key` defined requires a temporary table; trying to change this to a view will result in an error.

`tmp_relation_type` accepts these values:

- `view` (default): Skips intermediate step of creating a temporary physical table for the tmp relation; fastest but not suitable for all strategies.
- `table`: A session-scoped temporary table; not visible in the Snowflake catalog and isolated per session.
- `transient`: A transient table; persists in the catalog, enabling [Snowflake native lineage tracking](https://docs.snowflake.com/en/user-guide/ui-snowsight-lineage), while avoiding the 7-day fail-safe storage costs of permanent tables.
  **Note:** This value is distinct from the separate model-level `transient` config described later, which controls the final model relation. 

Defined in the project YAML:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
    +tmp_relation_type: table | view | transient ## If not defined, view is the default.
  
```

</File>

In the configuration format for the model SQL file:

<File name='dbt_model.sql'>

```sql

{{ config(
    tmp_relation_type="table | view | transient", 
    -- If not defined, view is the default.
) }}

```

</File>

:::warning Concurrent run conflicts with `transient`

When `tmp_relation_type` is set to `transient`, the tmp relation becomes a real table that persists in the target schema under a deterministic name. If multiple runs of the same incremental model execute concurrently in the same schema, they can overwrite each other's tmp relation, causing data duplication or incorrect results. For example, this might happen when developers share a target schema or when CI and production runs overlap.

This risk depends on how you configure schemas and databases for your dbt models. To prevent conflicts, use `snowflake__resolve_incremental_tmp_relation` to route tmp relations to a schema that is unique per run or environment. For more information, refer to [Avoiding tmp relation conflicts](/reference/resource-configs/snowflake-configs/temporary-tables#avoiding-tmp-relation-conflicts).

:::

### Avoiding tmp relation conflicts

To prevent name collisions across concurrent runs, override the `snowflake__resolve_incremental_tmp_relation` dispatch macro to redirect the tmp relation to a dedicated schema:

<File name='macros/snowflake_incremental.sql'>

```sql
{% macro snowflake__resolve_incremental_tmp_relation(tmp_relation) %}
  {{ return(tmp_relation.incorporate(schema='scratch')) }}
{% endmacro %}
```

</File>

This macro receives the default tmp relation object and returns a modified version. Common overrides include appending a developer username, a CI job ID, or a target name to the schema to ensure isolation across concurrent runs. 

To append a target name to the schema:

<File name='macros/snowflake_incremental.sql'>

```sql
{% macro snowflake__resolve_incremental_tmp_relation(tmp_relation) %}
  {%- set scratch_schema = target.schema ~ '_scratch_' ~ env_var('DBT_JOB_ID', target.name) -%}
  {{ return(tmp_relation.incorporate(schema=scratch_schema)) }}
{% endmacro %}
```

</File>
