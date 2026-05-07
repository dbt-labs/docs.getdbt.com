---
title: Function properties
---

<VersionCallout version="1.11" /> 

Function properties are the YAML properties you define for a [user-defined function (UDF)](/docs/build/udfs) in your project. In a properties YAML file (for example, `functions/schema.yml`), you name the function and specify information such as its description, configuration, arguments, and return type.

The properties YAML file works with the function body you define in a corresponding SQL or Python file under `functions/`. When you run `dbt build`, dbt uses both files together to generate the `CREATE FUNCTION` statement.

Declare function properties in a properties YAML file under the `functions:` key, with one list entry per function.

Define properties (including `config`) per function, under each `- name: ...` entry. If you declare multiple functions, repeat the relevant properties for each function. You can't declare a single `config` block at the `functions` level.

If multiple functions share the same `config` values, you can use YAML anchors and aliases to avoid repeating the same block.

We recommend that you put them in the `functions/` directory. You can name these files `schema.yml` or `whatever_you_want.yml`, and nest them in subfolders within that directory.

<File name='functions/file_name.yml'>

```yml

functions:
  - name: <string> # required
    [description](/reference/resource-properties/description): <markdown_string> # optional
    [config](/reference/resource-properties/config): # optional
      [<function_config>](/reference/function-configs): <config_value>
      [type](/reference/resource-configs/type): scalar | aggregate # optional, defaults to scalar.
      [volatility](/reference/resource-configs/volatility): deterministic | stable | non-deterministic # optional
      [runtime_version](/reference/resource-configs/runtime-version): <string> # required for Python UDFs
      [entry_point](/reference/resource-configs/entry-point): <string> # required for Python UDFs
      [packages](/reference/resource-configs/packages): [<string>] # optional, Python UDFs only
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [arguments](/reference/resource-properties/function-arguments): # optional
      - name: <string> # required if arguments is specified
        data_type: <string> # required if arguments is specified, warehouse-specific
        description: <markdown_string> # optional
        default_value: <string | boolean | integer> # optional, available in Snowflake and Postgres
      - name: ... # declare additional arguments
    [returns](/reference/resource-properties/returns): # required
      data_type: <string> # required, warehouse-specific
      description: <markdown_string> # optional
    [overloads](/reference/resource-properties/overloads): # optional, SQL UDFs (Snowflake and Postgres) and Python UDFs (Snowflake), available in v1.12+
      - defined_in: <string> # required, name of the SQL or Python file containing this overload's body
        arguments: # optional
          - name: <string> # required if arguments is specified
            data_type: <string> # required if arguments is specified, warehouse-specific
            description: <markdown_string> # optional
            default_value: <string | boolean | integer> # optional, available in Snowflake and Postgres
          - name: ... # declare additional arguments
        returns: # optional, inherits from root function if omitted
          data_type: <string> # required if returns is specified, warehouse-specific
          description: <markdown_string> # optional
      - defined_in: ... # declare additional overloads

  - name: ... # declare properties of additional functions
```
</File>

## Example

<File name='functions/schema.yml'>

```yml
functions:
  - name: is_positive_int
    description: Determines if a string represents a positive (+) integer
    config:
      type: scalar
      volatility: deterministic
      database: analytics
      schema: udf_schema
    arguments:
      - name: a_string
        data_type: string
        description: The string that I want to check if it's representing a positive integer (like "10")
    returns:
      data_type: boolean
      description: Returns true if the input string represents a positive integer, false otherwise
    overloads:
      - defined_in: is_positive_int_numeric
        arguments:
          - name: a_num
            data_type: numeric
            description: The number that I want to check if it's a positive integer
        returns:
          data_type: boolean
```
</File>
