---
title: type
sidebar_label: "type"
id: type
---

<File name='functions/<filename>.yml'>

```yml

version: 2

functions:
  - name: <function name>
    type: scalar | aggregate | table

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
version: 2

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

**Example use cases:**
- Custom aggregation logic
- Weighted averages
- Custom statistical functions

### table

Table functions return a table (multiple rows and columns) rather than a single value.

:::note Coming soon
Support for table functions is planned for a future release.
:::

**Example use cases:**
- Unpacking complex data structures
- Generating multiple rows from a single input
- Custom table transformations

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)

