---
title: Function properties
---

<VersionCallout version="1.11" /> 

Function properties can be declared in `.yml` files under a `functions` key.

We recommend that you put them in the `functions/` directory. You can name these files `schema.yml` or `whatever_you_want.yml`, and nest them in subfolders within that directory.

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <string> # required
    [description](/reference/resource-properties/description): <markdown_string> # optional
    [type](/reference/resource-properties/type): scalar  # optional, defaults to scalar. Eventually will include aggregate | table
    [config](/reference/resource-properties/config): # optional
      [<function_config>](/reference/function-configs): <config_value>
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [arguments](/reference/resource-properties/function-arguments): # optional
      - name: <string> # required if arguments is specified
        data_type: <string> # required if arguments is specified, warehouse-specific
        description: <markdown_string> # optional
      - name: ... # declare additional arguments
    [returns](/reference/resource-properties/returns): # required
      data_type: <string> # required, warehouse-specific
      description: <markdown_string> # optional

  - name: ... # declare properties of additional functions
```
</File>

## Example

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    description: Determines if a string represents a positive (+) integer
    type: scalar
    config:
      database: analytics
      schema: udf_schema
    arguments:
      - name: a_string
        data_type: string
        description: The string that I want to check if it's representing a positive integer (like "10")
    returns:
      data_type: boolean
      description: Returns true if the input string represents a positive integer, false otherwise
```
</File>
