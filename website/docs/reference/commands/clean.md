---
title: "About dbt clean command"
sidebar_label: "clean"
id: "clean"
---

`dbt clean` is a utility function that deletes the paths specified within the [`clean-targets`](/reference/project-configs/clean-targets) list in the `dbt_project.yml` file. It helps by removing unnecessary files or directories generated during the execution of other dbt commands, ensuring a clean state for the project.

## Example usage
```
dbt clean
```

## Supported flags

This section will briefly explain the following flags:

- [`--clean-project-files-only`](#--clean-project-files-only) (default)
- [`--no-clean-project-files-only`](#--no-clean-project-files-only)

To view the list of all supported flags for the `dbt clean` command in the terminal, use the `--help` flag, which will display detailed information about the available flags you can use, including its description and usage:

```shell
dbt clean --help
```

### --clean-project-files-only
By default, dbt deletes all the paths within the project directory specified in `clean-targets`.

:::note
Avoid using paths outside the dbt project; otherwise, you will see an error.
:::
  

#### Example usage
```shell
dbt clean --clean-project-files-only
```

### --no-clean-project-files-only
Deletes all the paths specified in the `clean-targets` list of `dbt_project.yml`, including those outside the current dbt project.

```shell
dbt clean --no-clean-project-files-only
```

## dbt clean with remote file system
To avoid complex permissions issues and potentially deleting crucial aspects of the remote file system without access to fix them, this command does not work when interfacing with the RPC server that powers the dbt Cloud IDE. Instead, when working in dbt Cloud, the `dbt deps` command cleans before it installs packages automatically. The `target` folder can be manually deleted from the sidebar file tree if needed.
