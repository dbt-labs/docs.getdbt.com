---
title: type
sidebar_label: "type"
id: type
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml


functions:
  - name: <function name>
    type: scalar | aggregate | table  # aggregate and table coming soon

```

</File>

## Definition

The `type` property specifies the type of user-defined function (UDF) you're creating. This property is optional and defaults to `scalar` if not specified.

## Supported function types

### scalar (default)

A scalar function returns a single value for each row of input. This is the most common type of UDF.

**Example use cases:**
- Data validation (checking if a string matches a pattern)
- Data transformation (converting formats, cleaning strings)
- Custom calculations (complex mathematical operations)

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    description: Determines if a string represents a positive integer
    type: scalar
    arguments:
      - name: input_string
        data_type: STRING
    returns:
      data_type: BOOLEAN
```

</File>

### aggregate

Aggregate functions operate on multiple rows and return a single value. These functions are used in `GROUP BY` operations.
:::note Coming soon
Support for aggregate functions is planned for a future release.
:::


**Example:**

<File name='functions/schema.yml'>

```yml

functions:
  - name: double_total
    description: Sums values and doubles the result
    type: aggregate
    arguments:
      - name: values
        data_type: FLOAT
        description: A sequence of numbers to aggregate
    returns:
      data_type: FLOAT
```

</File>

### table

Table functions return a table (multiple rows and columns) rather than a single value.

:::note Coming soon
Support for table functions is planned for a future release.
:::


## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)

