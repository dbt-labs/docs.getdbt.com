---
title: "About dbt clean command"
sidebar_label: "clean"
id: "clean"
---

`dbt clean` is a utility function that deletes all folders specified in the [`clean-targets`](/reference/project-configs/clean-targets) list specified in `dbt_project.yml`. You can use this to delete the `dbt_packages` and `target` directories.

To avoid complex permissions issues and potentially deleting crucial aspects of the remote file system without access to fix them, this command does not work when interfacing with the RPC server that powers the dbt Cloud IDE. Instead, when working in dbt Cloud, the `dbt deps` command cleans before it installs packages automatically. The `target` folder can be manually deleted from the sidebar file tree if needed.
