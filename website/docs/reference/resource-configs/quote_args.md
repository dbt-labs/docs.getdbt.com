---
title: quote_args
description: "Control whether Snowflake quotes argument names when dbt creates a JavaScript user-defined function (UDF), which determines their casing."
sidebar_label: "quote_args"
id: quote_args
---
<VersionCallout version="1.12" />

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      snowflake:
        quote_args: true | false  # optional, default: true
```

</File>

## Definition

When creating JavaScript user-defined functions (UDFs) on Snowflake, `quote_args` controls whether argument names are quoted in the `CREATE FUNCTION` statement. Defaults to `true`.

When `quote_args` is `true`, Snowflake quotes argument names, which preserves their exact casing. Inside the function body, reference arguments using the same case as defined in the YAML (for example, `a_string`).

When `quote_args` is `false`, argument names are not quoted. Snowflake uppercases them automatically, so you must reference them in uppercase inside the function body (for example, `A_STRING`).

This config applies to JavaScript UDFs on Snowflake only. It has no effect on other adapters or languages.

## Example

In this example, `quote_args` is set to `false` so argument names are not quoted in the generated `CREATE FUNCTION` statement:

<File name='functions/is_positive_int.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Returns 1 if a string represents a positive integer, else 0
    config:
      snowflake:
        quote_args: false
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: integer
```
</File>

<File name='functions/is_positive_int.js'>

```js
return /^[0-9]+$/.test(A_STRING) ? 1 : 0;
```
</File>

With `quote_args: false`, dbt generates:

```sql
CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
RETURNS INTEGER
LANGUAGE JAVASCRIPT
AS $$
return /^[0-9]+$/.test(A_STRING) ? 1 : 0;
$$;
```

With the default `quote_args: true`, dbt generates:

```sql
CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int("a_string" STRING)
RETURNS INTEGER
LANGUAGE JAVASCRIPT
AS $$
return /^[0-9]+$/.test(a_string) ? 1 : 0;
$$;
```

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [volatility](/reference/resource-configs/volatility)
- [type](/reference/resource-configs/type)
- [arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
