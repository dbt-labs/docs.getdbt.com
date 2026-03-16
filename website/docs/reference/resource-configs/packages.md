---
title: packages
sidebar_label: "packages"
id: packages
---

# packages<Lifecycle status="beta" />

<VersionCallout version="1.12" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      packages: [<string>] # optional, Python UDFs only
```

</File>

## Definition

When creating Python UDFs, you can specify public third-party Python packages for your Python UDF using the optional `packages` config. In this config, you can list package names (for example, `numpy`, `pandas`) and you can pin versions (for example, `pandas==1.5.0`). The warehouse installs these packages when creating the UDF, allowing your UDF to use functionality from external Python libraries.

On Snowflake, some packages are installed from the Anaconda repository, and you may need to [accept Anaconda's Terms of Service](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#using-third-party-packages-from-anaconda) before using them.

Python UDFs are currently supported in Snowflake and BigQuery. Each warehouse uses a different mechanism for specifying packages. The following table shows how they're used:

| Warehouse  | How `packages` is used |
| -- | -- |
| Snowflake | Becomes the `PACKAGES` clause in `CREATE FUNCTION ... LANGUAGE PYTHON` (for example, `PACKAGES = ('numpy', 'pandas==1.5.0')`) |
| BigQuery  | Becomes the `libraries` option in `OPTIONS(...)` (for example, `libraries=["numpy", "pandas==1.5.0"]`) |

## Example

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Returns 1 if a_string matches ^[0-9]+$, else 0
    config:
      runtime_version: "3.11"
      entry_point: main
      packages:
        - numpy
        - pandas==1.5.0
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: integer
```
</File>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [runtime_version](/reference/resource-configs/runtime-version)
- [entry_point](/reference/resource-configs/entry-point)
- [Type](/reference/resource-configs/type)
- [Volatility](/reference/resource-configs/volatility)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
