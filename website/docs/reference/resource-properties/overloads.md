---
title: overloads
sidebar_label: "overloads"
id: overloads
---

# overloads <Lifecycle status="beta" />

<VersionCallout version="1.12" />

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <function name>
    arguments:
      - name: <arg name>
        data_type: <string>
    returns:
      data_type: <string>
    overloads:
      - defined_in: <string>       # required, name of the SQL file (without extension)
        arguments:                 # optional
          - name: <arg name>       # required if arguments is specified
            data_type: <string>    # required if arguments is specified, warehouse-specific
            description: <markdown_string>
            default_value: <string | boolean | integer> # optional, Snowflake and Postgres only
        returns:                   # required
          data_type: <string>      # required, warehouse-specific
          description: <markdown_string>
      - defined_in: ...            # declare additional overloads

```

</File>

## Definition

:::info Beta feature
The `overloads` property is a beta feature in <Constant name="core" /> v1.12.
:::

The `overloads` property lets you define multiple signatures for the same SQL UDF. The database dispatches to the correct version based on the argument types passed at call time.

Each overload references a separate SQL file that contains its function body, and specifies its own `arguments` and `returns`. All overloads are grouped into one DAG node (the root function), so they're built, retried, and selected together.

`overloads` is only supported for SQL UDFs. Python UDFs do not support overloads.

## Behavior

dbt runs all overloads regardless of individual failures, so you get a complete picture of which overloads succeeded and which failed. The following behaviors apply:

- If any overload fails, dbt marks the function node as `PARTIAL_SUCCESS` and skips downstream nodes.
- [`dbt retry`](/reference/commands/retry) skips overloads that already succeeded and only re-runs the previously failed ones.
- [`state:modified`](/reference/node-selection/methods#the-state-method) detects changes to any overload's SQL body, arguments, or return type and marks the root function node as modified.

## Properties

### defined_in

The name of the SQL file that contains this overload's function body, without the file extension. The file must exist in the `functions/` directory (or wherever your [`function-paths`](/reference/project-configs/function-paths) are configured).

For example, `defined_in: null_if_empty_numeric` references `functions/null_if_empty_numeric.sql`.

Each overload must reference a unique SQL file. The root function's SQL file and all `defined_in` values must be distinct.

### arguments

The argument list for this overload. Follows the same structure as [function arguments](/reference/resource-properties/function-arguments). Required if the overload accepts arguments.

### returns

The return type for this overload. Follows the same structure as [returns](/reference/resource-properties/returns). Required for every overload.

## Example

<File name='functions/schema.yml'>

```yml
functions:
  - name: null_if_empty
    arguments:
      - name: val
        data_type: varchar
    returns:
      data_type: varchar
    overloads:
      - defined_in: null_if_empty_numeric
        arguments:
          - name: val
            data_type: numeric
        returns:
          data_type: numeric
```

</File>

Create a separate SQL file for each overload body. In this example, the base function handles empty strings, and the overload handles numeric values:

<File name='functions/null_if_empty.sql'>

```sql
CASE WHEN val = '' THEN NULL ELSE val END
```

</File>

<File name='functions/null_if_empty_numeric.sql'>

```sql
CASE WHEN val = 0 THEN NULL ELSE val END
```

</File>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
