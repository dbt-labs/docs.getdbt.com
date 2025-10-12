---
title: returns
sidebar_label: "returns"
id: returns
---

<File name='functions/<filename>.yml'>

```yml

version: 2

functions:
  - name: <function name>
    returns:
      data_type: <string> # required, warehouse-specific
      description: <markdown_string> # optional

```

</File>

## Definition

The `returns` property defines the output of a user-defined function (UDF). This is a required property for all functions and specifies what data type the function will return when executed.

## Properties

### data_type (required)

The `data_type` field specifies the data type that the function returns. This is a required field and must match the data types supported by your specific data platform.

:::important Warehouse-specific data types
The `data_type` values are warehouse-specific. Use the data type syntax that your warehouse requires:
- **Snowflake**: `STRING`, `NUMBER`, `BOOLEAN`, `TIMESTAMP_NTZ`, `VARIANT`, etc.
- **BigQuery**: `STRING`, `INT64`, `BOOL`, `TIMESTAMP`, `ARRAY<STRING>`, `STRUCT`, etc.
- **Redshift**: `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, `SUPER`, etc.
- **Postgres**: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, `JSONB`, etc.

Refer to your warehouse documentation for the complete list of supported data types and their syntax.
:::

### description

An optional markdown string describing what the function returns. This is helpful for documentation purposes.

## Examples

### Simple scalar function

<File name='functions/schema.yml'>

```yml
version: 2

functions:
  - name: is_valid_email
    description: Validates if a string is a properly formatted email address
    arguments:
      - name: email_string
        data_type: STRING
        description: The email address to validate
    returns:
      data_type: BOOLEAN
      description: Returns true if the string is a valid email format, false otherwise
```

</File>

### Function with complex return type

<File name='functions/schema.yml'>

```yml
version: 2

functions:
  - name: calculate_metrics
    description: Calculates revenue and profit metrics
    arguments:
      - name: revenue
        data_type: DECIMAL(18,2)
      - name: cost
        data_type: DECIMAL(18,2)
    returns:
      data_type: DECIMAL(18,2)
      description: The calculated profit margin as a percentage
```

</File>

### BigQuery function with ARRAY return type

<File name='functions/schema.yml'>

```yml
version: 2

functions:
  - name: split_tags
    description: Splits a comma-separated string into an array of tags
    arguments:
      - name: tag_string
        data_type: STRING
    returns:
      data_type: ARRAY<STRING>
      description: An array of individual tag strings
```

</File>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Arguments](/reference/resource-properties/function-arguments)

