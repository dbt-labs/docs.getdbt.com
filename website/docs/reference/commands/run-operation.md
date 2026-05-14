---
title: "About dbt run-operation command"
sidebar_label: "run-operation"
description: "Read this guide on how dbt's run-operation command can be used to invoke a macro or execute SQL directly."
id: "run-operation"
---

## Overview

The `dbt run-operation` command is used to invoke a macro or execute a SQL or Jinja string directly against the target database. For usage information on macro-based operations, refer to [operations](/docs/build/hooks-operations#about-operations).

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
                        Available in dbt Core v1.12+.
```

## Using the `--sql` flag <Lifecycle status="beta" />

:::info Beta feature
The `--sql` flag for `dbt run-operation` is a beta feature in <Constant name="core" /> v1.12.
:::

Starting <Constant name="core" /> v1.12, you can use the `--sql` flag to run SQL or Jinja directly against your target database &mdash; no macro definition required. This means you can use dbt's full Jinja context (for example, `ref()`, `source()`, `var()`, and `target`) directly in your SQL string. When your SQL contains no Jinja, dbt skips manifest compilation entirely, making execution faster.

For example, to drop a table in the warehouse:

```bash
dbt run-operation --sql "DROP TABLE IF EXISTS my_schema.old_table"
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

  # Use Jinja context variables
  dbt run-operation --sql "GRANT SELECT ON {{ target.schema }} TO reporter"

  # Grant select on a dbt model using ref()
  dbt run-operation --sql "GRANT SELECT ON {{ ref('my_model') }} TO reporter"
  ```
