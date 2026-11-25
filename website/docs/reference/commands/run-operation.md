---
title: "About dbt run-operation command"
sidebar_label: "run-operation"
description: "Read this guide on how dbt's run-operation command can be used to invoke a macro or execute SQL directly."
id: "run-operation"
---

## Overview

The `dbt run-operation` command is used to invoke a macro or execute a SQL or Jinja string directly against the target database. For usage information on macro-based operations, refer to [operations](/docs/build/hooks-operations#about-operations).

<VersionBlock firstVersion="1.12">

When a macro is invoked with `dbt run-operation`, dbt doesn't enforce model [access](/reference/resource-configs/access) or [group](/reference/resource-configs/group) controls, so it can use `ref()` to reference all models (including `private` and `protected` ones).

For example, a macro can reference a private model:

```jinja
{% macro example_macro() %}
  {{ ref('my_private_model') }}
{% endmacro %}
```

You can then run that macro using `dbt run-operation`:

```bash
dbt run-operation example_macro
```

</VersionBlock>

## Usage

```
$ dbt run-operation [macro] --args '{args}'
$ dbt run-operation --sql '{sql}'
 
  [macro]               Specify the macro to invoke. dbt will call this macro
                        with the supplied arguments and then exit. Required
                        unless --sql is provided. Cannot be used with --sql.
 
  --args ARGS           Supply arguments to the macro. This dictionary will be
                        mapped to the keyword arguments defined in the
                        selected macro. This argument should be a YAML string,
                        eg. '{my_variable: my_value}'. Cannot be used with --sql.
 
  --sql SQL             Execute a SQL or Jinja string directly against the
                        target database, without requiring a macro definition.
                        Cannot be combined with a macro name or --args.
                        Available in dbt v1.12+.
```

## Using the `--sql` flag

Starting <Constant name="dbt" /> v1.12, you can use the `--sql` flag to execute ad hoc database statements directly against your warehouse, without defining a macro. This flag is useful for one-off operations like dropping or altering a table, applying grants, or running a data fix. The statement runs through the full Jinja compilation pipeline, so you have access to `ref()`, `source()`, `var()`, `target`, and all other context variables. When your SQL contains no Jinja, dbt skips manifest compilation entirely, making execution faster.

For example:

```bash
# Drop a table in the warehouse
dbt run-operation --sql "DROP TABLE IF EXISTS my_schema.old_table"

# Use Jinja context variables in the statement
dbt run-operation --sql "GRANT SELECT ON {{ target.schema }}.my_table TO reporter"
```

dbt prints status lines to the terminal as the operation runs:

```
1 of 1 START executing inline_query ........... [RUN]
1 of 1 OK executed inline_query ............... [SELECT 1 in 0.05s]
```

The operation is named `inline_query` in logs. If the operation fails, the status line shows `ERROR` instead of `OK`.

Note that you cannot combine the `--sql` flag with a macro name or `--args`.

### When to use `--sql` instead of a macro

`--sql` is useful for quick, one-off operations that don't warrant a macro file (for example, granting permissions, dropping a table, or running a data fix).

If you need to reuse the operation across environments or share it with your team, write a [macro](/docs/build/jinja-macros) instead so it's version-controlled and testable.

<VersionBlock firstVersion="2.0">

## Running a macro for each selected node

:::note Draft for review
This syntax describes an unreleased feature in <Constant name="fusion" />.
:::

Use `--per-node` with `--select` or a named YAML `--selector` to call a macro once for each selected node. dbt passes the selected resource's metadata as the `node` argument. Use `--threads` to limit how many node operations run at once.

The following macro logs each selected node's unique ID and returns an empty list to skip SQL execution for that node.

<File name="macros/inspect_node.sql">

```jinja
{% macro inspect_node(node) %}
  {% do log(node.unique_id, info=true) %}
  {% do return([]) %}
{% endmacro %}
```

</File>

```bash
dbt run-operation inspect_node --per-node --select tag:nightly source:snowplow --threads 4
```

Replace `tag:nightly source:snowplow` with selectors that match your project.

Declare `node` as a macro parameter. Every key you pass with `--args` must match a declared macro parameter. dbt reserves `node` for the selected resource. For nodes that represent warehouse relations, such as source tables and persisted models, use `{{ this }}` to reference the selected relation in SQL. For nodes without a relation, `this` is `none`.

The macro can render a non-empty SQL string or return a non-empty SQL string or a list of non-empty SQL strings. dbt executes the SQL in the order you provide it. Keep statements that depend on the same session or transaction in one SQL string because adapters can release the session between strings.

Return an empty list with `{% do return([]) %}` when dbt has no SQL to execute after the macro. dbt records the operation as `skipped` in `run_results.json`, even if the macro already ran a query or logged output. Empty or whitespace-only output, `none`, and unsupported types are errors for that node. Each node operation should be independent because operations on different nodes can run concurrently.

By default, selecting a model or source doesn't also select its tests. Select tests explicitly with a selector such as `--select test_type:data`, or choose an [indirect selection mode](/reference/node-selection/test-selection-examples#indirect-selection) such as `--indirect-selection=eager` to include associated tests.

For per-node operations, `--indirect-selection` takes precedence over the `indirect_selection` setting in `selectors.yml`. The default is `empty`, even when the YAML selector sets another mode.

Use `--exclude` to narrow the selection. You can use a [state selector](/reference/node-selection/methods#state) with `--state` pointing to a local directory containing `manifest.json`. `--per-node` requires a named macro and cannot be combined with `--sql`, `--defer`, `--defer-state`, or `--favor-state`.

dbt reports each macro operation by the selected node's unique ID in `run_results.json`, including operations on test nodes. If a node operation fails, dbt finishes the other operations and exits with an error. Add `--fail-fast` to skip operations that have yet to start while allowing active operations to finish.

dbt emits a warning when the selection matches no enabled nodes. Use `--warn-error` to make that warning fail the command.

### Package examples

Use a project macro to adapt an existing package macro to the `node` argument. For macros that log a result or use `run_query()` to read rows, return `[]` after handling the output.

#### Stage Snowflake external tables

Use the proposed `stage` macro from the `dbt-external-tables` package draft to create or refresh configured Snowflake external tables. Set up your external stages and target schemas first. Select sources that map to distinct external tables. [Snowflake package draft](https://github.com/dbt-labs/dbt-external-tables/pull/418)

```bash
dbt run-operation dbt_external_tables.stage --per-node \
  --select source:snowplow --threads 8
```

#### Inspect query plans for selected models

Pass `node.unique_id` to `get_execution_plan` to look up a plan from query history for each selected model. Set up query history for your adapter, tag the models `profile`, and run them before profiling. The wrapper logs each result with its node ID and marks the profiling query so the package can exclude it from future lookups. [dbt Query Profiler setup](https://github.com/dbt-labs/dbt-query-profiler#readme)

<File name="macros/profile_selected.sql">

```jinja
{% macro profile_selected(node) %}
  {% if node.resource_type != 'model' %}
    {% do return([]) %}
  {% endif %}

  {% set sql %}
    /* {{ dbt_query_profiler._self_identifier() }} */
    {{ dbt_query_profiler.get_execution_plan(node_id=node.unique_id) }}
  {% endset %}
  {% set plan = run_query(sql) %}

  {% set rows = [] %}
  {% for row in plan.rows %}
    {% do rows.append(row | list) %}
  {% endfor %}
  {% do log(tojson({'node_id': node.unique_id, 'columns': plan.column_names | list, 'rows': rows}), info=true) %}
  {% do return([]) %}
{% endmacro %}
```

</File>

```bash
dbt run-operation profile_selected --per-node \
  --select 'tag:profile,resource_type:model' --threads 2
```

#### Apply Snowflake masking policies to selected tables

This project macro uses `dbt_snow_mask` to read column policies from a selected table model. Set `config.meta.masking_policy` on each column to the policy name, such as `mask_email`. Create the single-column policies first in a shared schema and run with a role that can apply them. Tag the built table models `apply_masking`. [Snowflake masking package](https://hub.getdbt.com/entechlog/dbt_snow_mask/latest/)

<File name="macros/apply_selected_masks.sql">

```jinja
{% macro apply_selected_masks(node, policy_namespace) %}
  {% if node.resource_type != 'model' or node.config.materialized != 'table' %}
    {% do return([]) %}
  {% endif %}

  {% set statements = [] %}
  {% set columns = dbt_snow_mask.get_meta_objects(node.unique_id, 'masking_policy') %}
  {% for column, policy, conditional_columns in columns %}
    {% if conditional_columns | length > 0 %}
      {% do exceptions.raise_compiler_error('This operation requires a policy without conditional columns') %}
    {% endif %}
    {% set column_name = adapter.quote(column) if node.columns.get(column, {}).get('quote', false) else column %}
    {% set sql %}
      alter table {{ this }} modify column {{ column_name }}
        set masking policy {{ policy_namespace }}.{{ policy }}
    {% endset %}
    {% do statements.append(sql) %}
  {% endfor %}
  {% do return(statements) %}
{% endmacro %}
```

</File>

```bash
dbt run-operation apply_selected_masks --per-node \
  --select tag:apply_masking \
  --args '{policy_namespace: SECURITY.POLICIES}' --threads 4
```

#### Audit migration row counts

Use Audit Helper to compare each selected model against a same-named table in a baseline schema in the same database. Tag the migrated table models `migration_audit` and create a dedicated output schema. Use distinct model identifiers because each audit writes a report table named after the selected model. [Audit Helper package](https://hub.getdbt.com/dbt-labs/audit_helper/latest/)

<File name="macros/audit_migration.sql">

```jinja
{% macro audit_migration(node, baseline_schema, audit_schema) %}
  {% if this is none %}
    {% do return([]) %}
  {% endif %}

  {% set baseline = this.incorporate(path={"schema": baseline_schema}) %}
  {% set report = this.incorporate(path={"schema": audit_schema}) %}

  {% set sql %}
    create or replace table {{ report }} as
    {{ audit_helper.compare_row_counts(baseline, this) }}
  {% endset %}
  {% do return(sql) %}
{% endmacro %}
```

</File>

```bash
dbt run-operation audit_migration --per-node \
  --select 'tag:migration_audit,config.materialized:table' \
  --args '{baseline_schema: baseline, audit_schema: migration_audit}' --threads 2
```

Query a report table such as `migration_audit.orders` to see the row counts for the current and baseline relations.

#### Generate YAML for selected models

Pass one model name at a time to Codegen. Use selectors that identify built models with unambiguous names. Copy the YAML documents from the logs and combine their model entries if you want a single YAML file. [Codegen package](https://hub.getdbt.com/dbt-labs/codegen/latest/)

<File name="macros/generate_selected_model_yaml.sql">

```jinja
{% macro generate_selected_model_yaml(node) %}
  {% if node.resource_type != 'model' or this is none %}
    {% do return([]) %}
  {% endif %}
  {% do codegen.generate_model_yaml(model_names=[node.name]) %}
  {% do return([]) %}
{% endmacro %}
```

</File>

```bash
dbt run-operation generate_selected_model_yaml --per-node \
  --select 'tag:document,resource_type:model' --threads 2
```

</VersionBlock>

## Command line examples

- Invoke a macro:

  ```bash
  # Pass a single argument to a macro
  dbt run-operation grant_select --args '{role: reporter}'

  # Pass multiple arguments to a macro
  dbt run-operation clean_stale_models --args '{days: 7, dry_run: True}'
  ```

- Use the `--sql` flag:

  ```bash
  # Execute DDL
  dbt run-operation --sql "CREATE TABLE my_schema.my_table (id int)"

  # Grant select on a dbt model using ref()
  dbt run-operation --sql "GRANT SELECT ON {{ ref('my_model') }} TO reporter"
  ```
