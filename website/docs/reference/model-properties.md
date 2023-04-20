---
title: Model properties
---

Models properties can be declared in `.yml` files in your `models/` directory (as defined by the [`model-paths` config](/reference/project-configs/model-paths)).

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - [name](model_name): <model name>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    [config](resource-properties/config):
      [<model_config>](/reference/model-configs): <config_value>
    [tests](/reference/resource-properties/tests):
      - <test>
      - ... # declare additional tests
    columns:
      - name: <column_name> # required
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tests](/reference/resource-properties/tests):
          - <test>
          - ... # declare additional tests
        [tags](/reference/resource-configs/tags): [<string>]

      - name: ... # declare properties of additional columns

```

</File>

<!---
FAQs
- Do I need to declare every column for it to render in documentation?
--->
