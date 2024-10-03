---
title: Snapshot properties
description: "Read this guide to learn about using source properties in dbt."
---

<VersionBlock firstVersion="1.9">

In Versionless and dbt v1.9 and later, snapshots are defined and configured in YAML files within your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths)). Snapshot properties are declared within these YAML files, allowing you to define both the snapshot configurations and properties in one place.

</VersionBlock>

<VersionBlock lastVersion="1.8">

Snapshots properties can be declared in `.yml` files in:
- your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths)).
- your `models/` directory (as defined by the [`model-paths` config](/reference/project-configs/model-paths))

Note, in Versionless and dbt v1.9 and later, snapshots are defined in an updated syntax using a YAML file within your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths)). For faster and more efficient management, consider the updated snapshot YAML syntax, [available in Versionless](/docs/dbt-versions/versionless-cloud) or [dbt Core v1.9 and later](/docs/dbt-versions/core).

</VersionBlock>

We recommend that you put them in the `snapshots/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `snapshots/` or `models/` directory.

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [meta](/reference/resource-configs/meta): {<dictionary>}
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional tests
      - ... # declare properties of additional columns

    - name: ... # declare properties of additional snapshots

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [meta](/reference/resource-configs/meta): {<dictionary>}
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional tests
      - ... # declare properties of additional columns

    - name: ... # declare properties of additional snapshots

```
</File>
</VersionBlock>
