---
title: Model properties
---

<Changelog>
    - **v0.21.0** introduced the `config` property, thereby allowing you to configure models in all `.yml` files
</Changelog>

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
    [config](resource-properties/config):
      [<model_config>](model-configs): <config_value>
    [tests](resource-properties/tests):
      - <test>
      - ... # declare additional tests
    columns:
      - name: <column_name> # required
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tests](resource-properties/tests):
          - <test>
          - ... # declare additional tests
        [tags](resource-configs/tags): [<string>]

      - name: ... # declare properties of additional columns

```

</File>

<!---
FAQs
- Do I need to declare every column for it to render in documentation?
--->
