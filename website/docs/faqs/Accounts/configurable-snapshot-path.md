---
title: Can I store my snapshots in a directory other than the `snapshot` directory in my project?
description: "You can see how to change snapshots directory in your project"
sidebar_label: 'Store snapshot in other directory'
id: configurable-snapshot-path
---
By default, dbt expects your snapshot files to be located in the `snapshots` subdirectory of your project.

To change this, update the [snapshot-paths](reference/project-configs/snapshot-paths.md) configuration in your `dbt_project.yml`
file, like so:

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["snapshots"]
```

</File>

Note that you cannot co-locate snapshots and models in the same directory.
