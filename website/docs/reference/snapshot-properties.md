---
title: Snapshot properties
description: "Read this guide to learn about using source properties in dbt."
---

Snapshots properties can be declared in `.yml` files in:
- your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths))
- your `models/` directory (as defined by the [`model-paths` config](/reference/project-configs/model-paths))

We recommend that you put them in the `snapshots/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `snapshots/` or `models/` directory.

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [meta](/reference/resource-configs/meta): {<dictionary>}
    [docs](/reference/resource-configs/docs):
      show: true | false
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
    [tests](/reference/resource-properties/tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/tests):
          - <test>
          - ... # declare additional tests
      - ... # declare properties of additional columns

    - name: ... # declare properties of additional snapshots

```
</File>
