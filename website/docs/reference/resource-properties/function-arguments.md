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


