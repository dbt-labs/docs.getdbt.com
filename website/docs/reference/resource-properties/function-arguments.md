---
title: arguments (for functions)
sidebar_label: "arguments"
id: function-arguments
---
<VersionCallout version="1.11" /> 
import ArgumentsShared from '/snippets/_arguments-shared.md';

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <function name>
    arguments:
      - name: <arg name>
        data_type: <string> # warehouse-specific
        description: <markdown_string>
        default_value: <string | boolean | integer> # optional, available in Snowflake and Postgres

```

</File>

## Definition

<ArgumentsShared />

For **functions**, you can add `arguments` to a [function property](/reference/function-properties), which defines the parameters for user-defined functions (UDFs) in your warehouse. The `data_type` for function arguments is warehouse-specific (for example, `STRING`, `VARCHAR`, `INTEGER`) and should match the data types supported by your data platform.

## Properties

### name

The name of the argument. This is a required field if `arguments` is specified.

### data_type

The data type that the warehouse expects for this parameter. This is a required field if `arguments` is specified and must match the data types supported by your specific data platform.

:::important Warehouse-specific data types

The `data_type` values are warehouse-specific. Use the data type syntax that your warehouse requires:

- **Snowflake**: `STRING`, `NUMBER`, `BOOLEAN`, `TIMESTAMP_NTZ`, etc.
- **BigQuery**: `STRING`, `INT64`, `BOOL`, `TIMESTAMP`, `ARRAY<STRING>`, etc.
- **Redshift**: `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, etc.
- **Postgres**: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, etc.

Refer to your warehouse documentation for the complete list of supported data types.

:::

### description

An optional markdown string describing the argument. This is helpful for documentation purposes.

### default_value

Use the `default_value` property to make a function argument optional.
- When an argument isn't defined with a `default_value`, it becomes a required argument, and you must pass a value for them when you use the function. If a required argument isn’t passed, the function call fails.
- Arguments with a `default_value` are optional &mdash; if you don't pass a value for the argument, the warehouse uses the value you set in `default_value`.

This property is supported in [Snowflake](https://docs.snowflake.com/en/developer-guide/udf-stored-procedure-arguments#designating-an-argument-as-optional) and [Postgres](https://www.postgresql.org/docs/current/sql-createfunction.html). 

When you use `default_value`, the order of your arguments matter. Any required arguments (those without default values) have to come before optional ones. Here's an example with the correct order: 

<File name='functions/schema.yml'>

```yml
functions:
  - name: sum_2_values
    description: Add two values together
    arguments:
      - name: val1 # this argument comes first because it has no default value
        data_type: integer
        description: The first value
      - name: val2
        data_type: integer
        description: The second value
        default_value: 0 
    returns:
      data_type: integer
```
</File>

In this example:
- `val1` has no `default_value`, so it’s required.
- `val2` has a `default_value` of `0`, so it’s optional. If you don’t provide a value for `val2`, the function uses `0` instead.

See the following examples of calling the `sum_2_values` function:

```text
sum_2_values(5)                # val1 = 5, val2 = 0 (default value used since user did not specify val2)
sum_2_values(5, 10)            # val1 = 5, val2 = 10
sum_2_values()                 # ❌ error: val1 is required and must be passed
```



## Examples

### Simple function arguments

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    arguments:
      - name: a_string
        data_type: string
        description: "The string that I want to check if it's representing a positive integer (like '10')"
    returns:
      data_type: boolean
```

</File>

### Complex data types

<File name='functions/schema.yml'>

```yml

functions:
  - name: calculate_discount
    arguments:
      - name: original_price
        data_type: DECIMAL(10,2)
        description: "The original price before discount"
      - name: discount_percent
        data_type: INTEGER
        description: "The discount percentage to apply"
    returns:
      data_type: DECIMAL(10,2)
      description: "The discounted price"
```

</File>

### Array data types (BigQuery example)

<File name='functions/schema.yml'>

```yml

functions:
  - name: get_tags
    arguments:
      - name: tag_string
        data_type: STRING
        description: "Comma-separated string of tags"
    returns:
      data_type: ARRAY<STRING>
      description: "An array of individual tag strings"
```

</File>

## Related documentation

- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Arguments (for macros)](/reference/resource-properties/arguments)
- [Returns](/reference/resource-properties/returns)


