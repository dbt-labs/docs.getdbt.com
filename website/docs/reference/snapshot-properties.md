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

<VersionBlock firstVersion="1.9">

## Define snapshots in YAML

Defining a snapshot in YAML treats snapshots as a distinct resource type, separate from models, allowing for improved organization and consistency within your code.

They don't contain logic, similar to exposures, sources, and tests. To add extra logic to your snapshot, you can break it out into an ephemeral model for cleaner development and testing, and then create a snapshot of that model.

<File name='snapshots/<filename>.yml'>

```yml

# snapshots/my_snapshots.yml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      database: analytics
      unique_key: id
      strategy: timestamp
      updated_at: updated_at

```

</File>

<Expandable alt_header="Exceptions" >

To carry out light transformation on your source or add logic into your snapshot, incorporate the following:

- Types of logic: filters, deduplication, surrogate → unique key, and so on.
- Best practice: snapshot an ephemeral model that contains the logic.

This approach also speeds up development, as it lets you run the query directly without needing to run the snapshot every time.


</VersionBlock>

