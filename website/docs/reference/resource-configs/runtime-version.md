---
title: runtime_version
sidebar_label: "runtime_version"
id: runtime-version
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      runtime_version: <string> # required for Python UDFs
```

</File>

## Definition

When creating Python UDFs, specify the Python version to run in `runtime_version`.

## Supported values

- [Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction): `3.10`, `3.11`, `3.12`, and `3.13`
- [BigQuery](https://cloud.google.com/bigquery/docs/user-defined-functions-python): `3.11`

## Example
In this example, we're using the Python version `3.11` for the UDF.

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    config:
      runtime_version: "3.11"
```
</File>
## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Volatility](/reference/resource-configs/volatility)
- [entry_point](/reference/resource-configs/entry-point)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
