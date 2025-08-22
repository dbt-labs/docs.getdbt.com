---
title: Snapshot properties
description: "Read this guide to learn about using source properties in dbt."
intro_text: "Define snapshot properties in YAML to document snapshots, configure settings, add tests, and describe columns."
---

import CourseCallout from '/snippets/_materialization-video-callout.md';

<VersionBlock firstVersion="1.9">

In dbt v1.9 and later, snapshots are defined and configured in YAML files within your `snapshots/` directory (as defined by the [`snapshot-paths` config](/reference/project-configs/snapshot-paths)). Snapshot properties are declared within these YAML files, allowing you to define both the snapshot configurations and properties in one place.

</VersionBlock>

We recommend that you put them in the `snapshots/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `snapshots/` or `models/` directory.

<CourseCallout resource="Snapshots" 
url="https://learn.getdbt.com/courses/snapshots"
course="Snapshots"
/>

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
    [data_tests](/reference/resource-properties/data-tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional tests
        [config](/reference/resource-properties/config):
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]
      - ... # declare properties of additional columns

    - name: ... # declare properties of additional snapshots

```
</File>
</VersionBlock>

