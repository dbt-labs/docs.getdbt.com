---
title: "About dbt snapshot command"
sidebar_label: "snapshot"
id: "snapshot"
---

The `dbt snapshot` command executes the [Snapshots](/docs/build/snapshots) defined in your project.

dbt will looks for Snapshots in the `snapshot-paths` paths defined in your `dbt_project.yml` file. By default, the `snapshot-paths` path is `snapshots/`.

**Usage:**
```
$ dbt snapshot --help
usage: dbt snapshot [-h] [--profiles-dir PROFILES_DIR]
                                     [--profile PROFILE] [--target TARGET]
                                     [--vars VARS] [--bypass-cache]
                                     [--threads THREADS]
                                     [--select SELECTOR [SELECTOR ...]]
                                     [--exclude EXCLUDE [EXCLUDE ...]]

optional arguments:
  --select SELECTOR [SELECTOR ...]
                        Specify the snapshots to include in the run.
  --exclude EXCLUDE [EXCLUDE ...]
                        Specify the snapshots to exclude in the run.
```
