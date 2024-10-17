---
title: Model properties
---

Models properties can be declared in `.yml` files in your `models/` directory (as defined by the [`model-paths` config](/reference/project-configs/model-paths)).

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - [name](/reference/resource-properties/model_name): <model name>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [latest_version](/reference/resource-properties/latest_version): <version_identifier>
    [deprecation_date](/reference/resource-properties/deprecation_date): <YAML_DateTime>
    [access](/reference/resource-configs/access): private | protected | public
    [config](/reference/resource-properties/config):
      [<model_config>](/reference/model-configs): <config_value>
    [constraints](/reference/resource-properties/constraints):
      - <constraint>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # declare additional data tests
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # required
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional data tests
        [tags](/reference/resource-configs/tags): [<string>]
        
        # only required in conjunction with time_spine key
        granularity: <[any supported time granularity](/docs/build/dimensions?dimension=time_gran)> 

      - name: ... # declare properties of additional columns

    [time_spine](/docs/build/metricflow-time-spine):
      standard_granularity_column: <column_name>

    [versions](/reference/resource-properties/versions):
      - [v](/reference/resource-properties/versions#v): <version_identifier> # required
        [defined_in](/reference/resource-properties/versions#defined-in): <definition_file_name>
        [description](/reference/resource-properties/description): <markdown_string>
        [docs](/reference/resource-configs/docs):
          show: true | false
        [access](/reference/resource-configs/access): private | protected | public
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [config](/reference/resource-properties/config):
          [<model_config>](/reference/model-configs): <config_value>
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional data tests
        columns:
          # include/exclude columns from the top-level model properties
          - [include](/reference/resource-properties/include-exclude): <include_value>
            [exclude](/reference/resource-properties/include-exclude): <exclude_list>
          # specify additional columns
          - name: <column_name> # required
            [quote](/reference/resource-properties/quote): true | false
            [constraints](/reference/resource-properties/constraints):
              - <constraint>
            [tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # declare additional data tests
            [tags](/reference/resource-configs/tags): [<string>]
        - v: ... # declare additional versions

```

</File>

