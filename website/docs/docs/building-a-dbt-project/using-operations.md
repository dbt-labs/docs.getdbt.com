---
title: "Operations"
id: "using-operations"
---


<Callout type="info" title="New in dbt v0.14.0">

This functionality is new in dbt v0.14.0. For upgrading instructions, check out [the docs](cli-installation).

</Callout>

## Overview
The effective maintenance of a data warehouse sometimes requires manual or automated "operational" queries to be run. While these operations frequently vary by organization, they might include:
- Vacuuming tables on Redshift
- Creating partitions in Redshift Spectrum external tables
- Resuming/pausing/resizing warehouses in Snowflake
- Refreshing a Pipe in Snowflake

To support these use-cases, dbt provides a `run-operation` command. This command will invoke a macro with any specified arguments. Inside of this macro, you can use a [statement block](statement-blocks) to run a query.

## Usage
```
$ dbt run-operation {macro} --args {args}
  macro                 Specify the macro to invoke. dbt will call this macro
                        with the supplied arguments and then exit
  --args ARGS           Supply arguments to the macro. This dictionary will be
                        mapped to the keyword arguments defined in the
                        selected macro. This argument should be a YAML string,
                        eg. '{my_variable: my_value}'
```

**Note:** queries must be enclosed inside of `statement` blocks -- dbt will not run the string contents of a macro directly. Any value returned from a macro invoked via `run-operation` is discarded.

## Context

The compilation context for macros is limited. Because macros are not graph-aware, context methods like `ref` and `source` are unavailable, though this may change in a future release. The following context variables are supported:

| Jinja context | Type | Available |
| ------------- | ---- | --------- |
| [target](target) | Variable | ✅ |
| [env_var](env_var) | Variable | ✅ |
| [var](var) | Variable | Limited to CLI `--vars` |
| [exceptions](exceptions) | Macro | ✅ |
| [log](log) | Macro | ✅ |
| Other macros in your project | Macro | ✅ |
| Other macros in your packages | Macro | ✅ |

## Operations Guide

### Creating an operation

Create a macro in your project. This macro should call a [statement](statement-blocks) which runs some useful SQL query. This macro makes use of the built-in [run_query](run_query) macro.

<File name='macros/operations/resize_warehouse.sql'>

```sql
{% macro say_hi(name) %}

  {% set sql %}
      select 'hello, {{ name }}' as name
  {% endset %}

  {% set table = run_query(sql) %}
  {% do table.print_table() %}

{% endmacro %}
```

</File>

### Running an operation

Run the macro from the command line, providing arguments as a YAML string.

```shell
$ dbt run-operation say_hi --args '{name: world}'
```

### Exit codes

dbt will exit with a nonzero exit code if an error is encountered while running an operation. If the macro executes successfully, dbt will exit with a `0` exit code.
