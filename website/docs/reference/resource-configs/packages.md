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

When creating Python UDFs, you can use the optional `packages` config to specify public third-party PyPI packages. You can list package names (for example, `numpy` and `pandas`) and pin versions (for example, `pandas==1.5.0`). The warehouse installs these packages when it creates the UDF, so your UDF can use functionality from external Python libraries.

On Snowflake, some packages are installed from the Anaconda repository, and you may need to [accept Anaconda's Terms of Service](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#using-third-party-packages-from-anaconda) before you can use them.

Python UDFs are currently supported in Snowflake and BigQuery. Each warehouse uses a different mechanism to specify packages. For example:

<Tabs
  defaultValue="snowflake"
  values={[
    { label: 'Snowflake', value: 'snowflake', },
    { label: 'BigQuery', value: 'bigquery', },
  ]
}>

<TabItem value="snowflake">

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

Compiled SQL:

```sql
CREATE OR REPLACE FUNCTION my_schema.is_positive_int(a_string STRING)
  RETURNS INTEGER
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.11'
  HANDLER = 'main'
  PACKAGES = ('numpy','pandas==1.5.0')
AS $$
def main(a_string):
    ...
$$
```

</TabItem>

<TabItem value="bigquery">

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

Compiled SQL:

```sql
CREATE OR REPLACE FUNCTION my_dataset.is_positive_int(a_string STRING)
  RETURNS INT64
  LANGUAGE python
  OPTIONS(
    runtime_version = "python-3.11",
    entry_point = "main",
    packages = ['numpy', 'pandas==1.5.0']
  )
AS r'''
def main(a_string):
    ...
'''
```

</TabItem>

</Tabs>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [runtime_version](/reference/resource-configs/runtime-version)
- [entry_point](/reference/resource-configs/entry-point)
- [type](/reference/resource-configs/type)
- [volatility](/reference/resource-configs/volatility)
- [arguments](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
