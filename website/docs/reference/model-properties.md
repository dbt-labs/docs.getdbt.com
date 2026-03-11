---
title: Model properties
---

Models properties can be declared in `.yml` files in your `models/` directory (as defined by the [`model-paths` config](/reference/project-configs/model-paths)).

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

## Available top-level model properties

|Property|	Type	|Required	|Description|
|--------|--------|---------|-----------|
|[name](/reference/resource-properties/model_name)	|string	|Yes	|The model name (must match the model filename).|
|[description](/reference/resource-properties/description)|	string	|No	|Documentation for the model.|
|[columns](/reference/resource-properties/columns) |	array	|No	|List of column definitions.|
|[config](/reference/resource-properties/config)	|object|	No	|Model configuration (materialization, tags, etc.).|
|[constraints](/reference/resource-properties/constraints)	|array	|No|	Model-level constraints (primary key, foreign key, etc.).|
|[data_tests](/reference/resource-properties/data-tests)|	array|	No	|Model-level data tests.|
|tests|	array|	No	|Legacy alias for data_tests.|
|[versions](/reference/resource-properties/versions)|	array	|No	|Model version definitions.|
|[latest_version](/reference/resource-properties/latest_version)|	string/float|	No	|The latest version of the model.|
|[deprecation_date](/reference/resource-properties/deprecation_date)|	string|	No	|Date when the model is deprecated.|
|[access](/reference/resource-configs/access)	|string|	No|	Access level: private, protected, or public. Supported at the top-level for backwards compatibility only. |
|[time_spine](/docs/build/metricflow-time-spine)|	object	|No	|Time spine configuration for the <Constant name="semantic_layer" />.|
|[semantic_model](/reference/semantic-model-properties)|	object	|No	|*Latest YAML spec only.* Enable semantic model configuration for the <Constant name="semantic_layer" /> with `enabled: true`. For other properties, refer to [Semantic model properties](/reference/semantic-model-properties).|
|[metrics](/reference/metric-properties)|	array	|No	|*Latest YAML spec only.* Metrics derived from this semantic model; list is alongside (not under) `semantic_model` and `columns`. For other properties, refer to [Metric properties](/reference/metric-properties).|

<VersionBlock lastVersion="1.11">

### Example file (legacy)

The following legacy YAML spec example does not include <Constant name="semantic_layer" /> properties. Select **<Constant name="dbt_platform" /> Latest** from the version menu to see an example latest YAML spec.

<File name='models/<filename>.yml'>

```yml

models:
  # Model name must match the filename of a model -- including case sensitivity
  - [name](/reference/resource-properties/model_name): model_name
    [description](/reference/resource-properties/description): <markdown_string>
    [latest_version](/reference/resource-properties/latest_version): <version_identifier>
    [deprecation_date](/reference/resource-properties/deprecation_date): <YAML_DateTime>
    [config](/reference/resource-properties/config):
      [<model_config>](/reference/model-configs): <config_value>
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
      [access](/reference/resource-configs/access): private | protected | public
    [constraints](/reference/resource-properties/constraints):
      - <constraint>
    [data_tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # declare additional data tests
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # required
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional data tests
        [config](/reference/resource-properties/config):
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]
        
        # only required in conjunction with time_spine key
        [granularity](/docs/build/metricflow-time-spine#creating-a-time-spine-table): <[any supported time granularity](/docs/build/dimensions?dimension=time_gran)> 

      - name: ... # declare properties of additional columns

    [time_spine](/docs/build/metricflow-time-spine):
      standard_granularity_column: <column_name>

    [versions](/reference/resource-properties/versions):
      - [v](/reference/resource-properties/versions#v): <version_identifier> # required
        [defined_in](/reference/resource-properties/versions#defined-in): <definition_file_name>
        [description](/reference/resource-properties/description): <markdown_string>
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [config](/reference/resource-properties/config):
          [<model_config>](/reference/model-configs): <config_value>
          [docs](/reference/resource-configs/docs):
            show: true | false
          [access](/reference/resource-configs/access): private | protected | public
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional data tests
        columns:
          # include/exclude columns from the top-level model properties
          - [include](/reference/resource-properties/versions#include): <include_value>
            [exclude](/reference/resource-properties/versions#include): <exclude_list>
          # specify additional columns
          - name: <column_name> # required
            [quote](/reference/resource-properties/columns#quote): true | false
            [constraints](/reference/resource-properties/constraints):
              - <constraint>
            [data_tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # declare additional data tests
            [tags](/reference/resource-configs/tags): [<string>]
        - v: ... # declare additional versions

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

### Example file (latest)

The latest YAML spec includes <Constant name="semantic_layer" /> properties: `semantic_model:`, top-level `agg_time_dimension` and `primary_entity`, and `metrics:`. Columns can include `entity:` and `dimension:` blocks and `granularity` for time dimensions. See [Semantic model properties](/reference/semantic-model-properties) and [Metric properties](/reference/metric-properties) for the full structure.

<File name='models/<filename>.yml'>

```yml

models:
  # Model name must match the filename of a model -- including case sensitivity
  - [name](/reference/resource-properties/model_name): model_name
    [description](/reference/resource-properties/description): <markdown_string>
    [latest_version](/reference/resource-properties/latest_version): <version_identifier>
    [deprecation_date](/reference/resource-properties/deprecation_date): <YAML_DateTime>
    [config](/reference/resource-properties/config):
      [<model_config>](/reference/model-configs): <config_value>
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
      [access](/reference/resource-configs/access): private | protected | public
    [constraints](/reference/resource-properties/constraints):
      - <constraint>
    [data_tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # declare additional data tests
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # required
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional data tests
        [config](/reference/resource-properties/config):
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]
        
        # only required in conjunction with time_spine key
        [granularity](/docs/build/metricflow-time-spine#creating-a-time-spine-table): <[any supported time granularity](/docs/build/dimensions?dimension=time_gran)>
        # In the latest YAML spec, a column can optionally include an entity or dimension block for Semantic Layer.
        #
        # entity:
        #   type: primary | foreign | unique | natural
        #   name: <entity_name>
        # dimension:
        #   type: time | categorical
        #   name: <dimension_name>

      - name: ... # declare properties of additional columns

    [time_spine](/docs/build/metricflow-time-spine):
      standard_granularity_column: <column_name>

    # Latest YAML spec only: semantic model and metrics on the model
    [semantic_model](/reference/semantic-model-properties):
      enabled: true
      name: <semantic_model_name>
    agg_time_dimension: <time_dimension_name>   # top-level; references dimension name
    primary_entity: <primary_entity_name>       # optional; use when no column has type: primary
    [metrics](/reference/metric-properties):
      - name: <metric_name>
        type: simple | cumulative | ratio | derived | conversion
        # ... type-specific properties; see Metric properties

    [versions](/reference/resource-properties/versions):
      - [v](/reference/resource-properties/versions#v): <version_identifier> # required
        [defined_in](/reference/resource-properties/versions#defined-in): <definition_file_name>
        [description](/reference/resource-properties/description): <markdown_string>
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [config](/reference/resource-properties/config):
          [<model_config>](/reference/model-configs): <config_value>
          [docs](/reference/resource-configs/docs):
            show: true | false
          [access](/reference/resource-configs/access): private | protected | public
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional data tests
        columns:
          # include/exclude columns from the top-level model properties
          - [include](/reference/resource-properties/versions#include): <include_value>
            [exclude](/reference/resource-properties/versions#include): <exclude_list>
          # specify additional columns
          - name: <column_name> # required
            [quote](/reference/resource-properties/columns#quote): true | false
            [constraints](/reference/resource-properties/constraints):
              - <constraint>
            [data_tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # declare additional data tests
            [tags](/reference/resource-configs/tags): [<string>]
        - v: ... # declare additional versions

```

</File>

</VersionBlock>

