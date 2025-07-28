---
title: Seed properties
---

Seed properties can be declared in `.yml` files under a `seed` key.

We recommend that you put them in the `seeds/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within that directory.

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <string>
    [description](/reference/resource-properties/description): <markdown_string>
    [config](/reference/resource-properties/config):
      [<seed_config>](/reference/seed-configs): <config_value>
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # declare additional tests
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional tests
        [config](/reference/resource-properties/config):
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]

      - name: ... # declare properties of additional columns

  - name: ... # declare properties of additional seeds
```
</File>
