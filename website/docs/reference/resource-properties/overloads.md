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
      - defined_in: <string>       # required, name of the SQL or Python file
        arguments:                 # optional
          - name: <arg name>       # required if arguments is specified
            data_type: <string>    # required if arguments is specified, warehouse-specific
            description: <markdown_string>
            default_value: <string | boolean | integer> # optional, Snowflake and Postgres only
        returns:                   # optional, inherits from root function if omitted
          data_type: <string>      # required if returns is specified, warehouse-specific
          description: <markdown_string>
      - defined_in: ...            # declare additional overloads

```

</File>

## Definition

:::info Beta feature
The `overloads` property is a beta feature in <Constant name="core" /> v1.12.
:::

The `overloads` property lets you define multiple argument signatures for the same [user-defined function UDF](/docs/build/udfs). This lets you call the same function name with different input types, without creating separate UDFs for each variant. The warehouse calls the right version based on the argument types. `overloads` is supported for SQL UDFs in Snowflake and Postgres, and Python UDFs in Snowflake.

Each overload references a separate file that contains its function body, with optional `arguments` and `returns`. All overloads are grouped into one DAG node (the root function), so they're built and selected together. On retry, dbt skips overloads that succeeded and reruns only those that failed.

## Behavior

dbt runs all overloads regardless of individual failures, so you get a complete picture of which overloads succeeded and which failed. The following behaviors apply:

- If any overload fails, dbt marks the function node as `PARTIAL_SUCCESS` and skips downstream nodes.
- [`dbt retry`](/reference/commands/retry) skips overloads that already succeeded and only re-runs the previously failed ones.
- [`state:modified`](/reference/node-selection/methods#the-state-method) detects changes to any overload's function body, arguments, or return type and marks the root function node as modified.

## Properties

Each entry in the `overloads` list supports the following properties.

### defined_in

The name of the file (without extension) that contains the overload's function body. The file must exist in the `functions/` directory. For example, `defined_in: null_if_empty_numeric` references `functions/null_if_empty_numeric.sql` for SQL UDFs or `functions/null_if_empty_numeric.py` for Python UDFs.

Each overload must reference a unique file. The root function's file and all `defined_in` values must be distinct.

dbt raises a parsing error if:
- A `defined_in` value matches the root function's own file.
- Two overloads reference the same file.
- The referenced file doesn't exist in the `functions/` directory.

### arguments

The argument list for the overload. Follows the same structure as [function arguments](/reference/resource-properties/function-arguments).

### returns

The return type for the overload. Follows the same structure as [returns](/reference/resource-properties/returns). If omitted, the overload inherits the return type of the root function.

## Example

<Tabs>
<TabItem value="SQL">

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
# syntax for Snowflake
CASE WHEN val = '' THEN NULL ELSE val END

# syntax for Postgres
SELECT CASE WHEN val = '' THEN NULL ELSE val END
```

</File>

<File name='functions/null_if_empty_numeric.sql'>

```sql
# syntax for Snowflake
CASE WHEN val = 0 THEN NULL ELSE val END

# syntax for Postgres
SELECT CASE WHEN val = 0 THEN NULL ELSE val END
```

</File>

</TabItem>
<TabItem value="Python">

<File name='functions/schema.yml'>

```yml
functions:
  - name: null_if_empty
    config:
      runtime_version: "3.11"
      entry_point: main
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

Create a separate Python file for each overload body. In this example, the base function handles empty strings, and the overload handles numeric values:

<File name='functions/null_if_empty.py'>

```python
def main(val):
    return None if val == '' else val
```

</File>

<File name='functions/null_if_empty_numeric.py'>

```python
def main(val):
    return None if val == 0 else val
```

</File>

</TabItem>
</Tabs>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
