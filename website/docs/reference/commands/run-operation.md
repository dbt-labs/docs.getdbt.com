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

## Running a macro for each selected source

:::note Draft for review
This syntax describes an unreleased feature in <Constant name="fusion" />.
:::

Use `--per-node` with `--select` or a named YAML `--selector` to call a macro once for each selected source table. dbt passes the source as the `node` argument and runs the SQL that the macro returns. Use `--threads` to limit how many source operations run at once.

The following macro runs a small read against each selected source table. Add it to your project and replace `source:snowplow` with a source selector that matches your project.

<File name="macros/probe_source.sql">

```jinja
{% macro probe_source(node) %}
  {% set sql %}
    select 1 from {{ source(node.source_name, node.name) }} limit 1
  {% endset %}
  {% do return(sql) %}
{% endmacro %}
```

</File>

```bash
dbt run-operation probe_source --per-node --select source:snowplow --threads 4
```

Declare `node` on the macro and pass any additional arguments with `--args`. dbt reserves `node` for the selected source. Return a SQL string or a list of SQL strings. dbt executes the SQL in the order you return it. Return an empty list with `{% do return([]) %}` to explicitly skip a source. A missing or invalid return is an error for that source. Each source operation should be independent because operations on different sources can run concurrently.

Use `--exclude` to narrow the selection. You can also use a [state selector](/reference/node-selection/methods#state) with `--state` pointing to a local directory containing `manifest.json`. `--per-node` requires a named macro and cannot be combined with `--sql`, `--defer`, `--defer-state`, or `--favor-state`.

dbt reports each source by its unique ID in `run_results.json`. If a source operation fails, dbt finishes the other operations and exits with an error. Add `--fail-fast` to skip operations that have yet to start while allowing active operations to finish.

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
