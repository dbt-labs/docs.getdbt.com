---
title: Model properties
---

Models properties can be declared in `.yml` files in your `models/` directory (as defined by the [`model-paths` config](model-paths)).

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - [name](model_name): <model name>
    [description](description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    [latest_version](resource-properties/latest-version): <version_identifier>
    [access](resource-properties/access): private | protected | public
    [config](resource-properties/config):
      [<model_config>](model-configs): <config_value>
    [constraints](resource-properties/constraints):
      - <constraint>
    [tests](resource-properties/tests):
      - <test>
      - ... # declare additional tests
    [columns](resource-properties/columns):
      - name: <column_name> # required
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [constraints](resource-properties/constraints):
          - <constraint>
        [tests](resource-properties/tests):
          - <test>
          - ... # declare additional tests
        [tags](resource-configs/tags): [<string>]

      - name: ... # declare properties of additional columns

    [versions](resource-properties/versions):
      - [v](resource-properties/versions#v): <version_identifier> # required
        [defined_in](resource-properties/versions#defined-in): <definition_file_name>
        [description](description): <markdown_string>
        [docs](/reference/resource-configs/docs):
          show: true | false
        [access](resource-properties/access): private | protected | public
        [constraints](resource-properties/constraints):
          - <constraint>
        [config](resource-properties/config):
          [<model_config>](model-configs): <config_value>
        [tests](resource-properties/tests):
          - <test>
          - ... # declare additional tests
        columns:
          # include/exclude columns from the top-level model properties
          - [include](resource-properties/include-exclude): <include_value>
            [exclude](resource-properties/include-exclude): <exclude_list>
          # specify additional columns
          - name: <column_name> # required
            [quote](quote): true | false
            [constraints](resource-properties/constraints):
              - <constraint>
            [tests](resource-properties/tests):
              - <test>
              - ... # declare additional tests
            [tags](resource-configs/tags): [<string>]
        - v: ... # declare additional versions

```

</File>

<!---
FAQs
- Do I need to declare every column for it to render in documentation?
--->
