---
title: "About dbt snapshot command"
sidebar_label: "snapshot"
id: "snapshot"
---

The `dbt snapshot` command executes the [Snapshots](/docs/build/snapshots) defined in your project. Snapshots record changes to your source data over time by implementing [type-2 Slowly Changing Dimensions](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row). Run `dbt snapshot` on a schedule (for example, daily) to capture changes in your source tables.

Define snapshots in YAML with a strategy and `unique_key`; refer to [Snapshot configurations](/reference/snapshot-configs) for details on how to set them up. You can also run snapshots as part of [dbt build](/reference/commands/build).

dbt looks for snapshots in the directories listed in `snapshot-paths` in your `dbt_project.yml` file. By default, dbt uses the `snapshots/` directory. You can specify multiple paths if you organize snapshots in more than one folder.

## Usage

To view the full list of supported options in your terminal, run:

```
dbt snapshot --help
```
Use `--select` or `--exclude` to choose which snapshots run. For selection syntax, refer to [Node selection syntax](/reference/node-selection/syntax). For other flags (such as `--threads`, `--target`, and logging options), see [About flags (global configs)](/reference/global-configs/about-global-configs).

import SnapshotCompiledSql from '/snippets/_snapshot-compiled-sql.md';

<SnapshotCompiledSql />

