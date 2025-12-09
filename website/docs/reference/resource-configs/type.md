---
title: type
sidebar_label: "type"
id: type
description: "The type config specifies the type of user-defined function you're creating."
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: function_name
    config:
      type: scalar | aggregate 
```

</File>

In the future, we're considering adding support for `table` type. Refer to [this issue](https://github.com/dbt-labs/dbt-core/issues/11917) to track the progress and provide any feedback.

## Definition

The `type` config specifies the type of user-defined function (UDF) you're creating. This config is optional and defaults to `scalar` if not specified.

## Supported function types

The following function types are supported:
<!-- no toc -->
- [scalar (default)](#scalar-default)
- [aggregate](#aggregate)

Support for `type` differs based on the warehouse and language (SQL or Python) you're using:

| Adapter	| scalar SQL	| scalar Python	| aggregate SQL	| aggregate Python |
| --- | --- | --- | --- | --- |
| dbt-bigquery	| ✅	| ✅	| ✅	| ❌ |
| dbt-snowflake	| ✅	| ✅	| ❌	| ✅ |
| dbt-databricks	| ✅	| ❌	| ❌	| ❌ |
| dbt-postgres	| ✅	| ❌	| ❌	| ❌ |
| dbt-redshift	| ✅	| ❌	| ❌	| ❌ |

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
    config:
      type: scalar
    arguments:
      - name: input_string
        data_type: STRING
    returns:
      data_type: BOOLEAN
```

</File>

### aggregate

Aggregate functions operate on multiple rows and return a single value &mdash; for example, they sum values or calculate an average for a group. Queries use these functions in `GROUP BY` operations.

Aggregate functions are currently supported only for:
- Python functions on Snowflake
- SQL functions on BigQuery


**Example use cases:**
- Calculating totals or averages for groups of data (for example, total sales per customer)
- Aggregating data over time (for example, daily, monthly, or yearly totals)

<File name='functions/schema.yml'>

```yml
functions:
  - name: double_total
    description: Sums values and doubles the result
    config:
      type: aggregate
    arguments:
      - name: values
        data_type: FLOAT
        description: A sequence of numbers to aggregate
    returns:
      data_type: FLOAT
```

</File>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Volatility](/reference/resource-configs/volatility)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
