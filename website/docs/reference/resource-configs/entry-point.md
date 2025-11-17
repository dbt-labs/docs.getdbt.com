---
title: entry_point
sidebar_label: "entry_point"
id: entry-point
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      entry_point: <string> # required for Python UDFs
```

</File>

## Definition

When creating Python UDFs, specify the Python function to be called in `entry_point`.

Python UDFs are currently supported in Snowflake and BigQuery. Each warehouse uses a different name for the entry point function. The following table shows what they’re called:

| Warehouse  | How `entry_point` is used | 
| -- | -- | 
| Snowflake | Becomes the `HANDLER` name in `LANGUAGE PYTHON UDF` | 
| BigQuery |  Becomes the `entry_point` in `OPTIONS(...)` |  

## Example
For example, if you have a Python UDF in `functions/my_function.py` with the following code which uses the function `main` as the entry point:

<File name='functions/my_function.py'>

```python
import re

def _digits_only(s: str) -> bool:
    return bool(re.search(r'^[0-9]+$', s or ''))

def _to_flag(is_match: bool) -> int:
    return 1 if is_match else 0

def main(a_string: str) -> int:
    """
    This is used as the entry point for the UDF.
    Returns 1 if a_string represents a positive integer (e.g., "10"),
    else 0.
    """
    return _to_flag(_digits_only(a_string))
```

</File>

After defining the UDF, you can specify `main` as the `entry_point` in the YAML file. `entry_point: main` points to the `main` function as the entry point for the UDF, while `_digits_only` and `_to_flag` are helper functions.

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Returns 1 if a_string matches ^[0-9]+$, else 0
    config:
      runtime_version: "3.11"    # required
      entry_point: main          # required: points to the function above
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
- [Type](/reference/resource-configs/type)
- [Volatility](/reference/resource-configs/volatility)
- [runtime_version](/reference/resource-configs/runtime-version)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
