---
title: "About dbt clean command"
sidebar_label: "clean"
id: "clean"
---

`dbt clean` is a utility function that deletes the paths specified within the [`clean-targets`](/reference/project-configs/clean-targets) section of the `dbt_project.yml` file. It helps to remove any unnecessary files or directories generated during the execution of other DBT commands, ensuring a clean state for the project.

**Usage**
```
dbt clean
```

## Supported flags
### --clean-project-files-only (default)
Deletes all the paths within the project directory that are specified in the `clean-targets` section.

> **NOTE:** If the `clean-targets` section contains paths outside the DBT project, this command will lead to a _Runtime Error_ to indicate the same.

**Usage:**
```
$ dbt clean --clean-project-files-only
```

### --no-clean-project-files-only
Deletes all the paths specified in the `clean-targets` section of `dbt_project.yml`, including those outside the current DBT project.

```
$ dbt clean --no-clean-project-files-only
```

## dbt clean with remote file system
To avoid complex permissions issues and potentially deleting crucial aspects of the remote file system without access to fix them, this command does not work when interfacing with the RPC server that powers the DBT Cloud IDE. Instead, when working in DBT Cloud, the `dbt deps` command cleans before it installs packages automatically. The `target` folder can be manually deleted from the sidebar file tree if needed.
