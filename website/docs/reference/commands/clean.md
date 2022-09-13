---
title: "clean"
id: "clean"
---

<Changelog>

- **v1.0.0:** `dbt_modules` has been replaced by `dbt_packages` by default for the [clean-target](clean-targets) for packages.

</Changelog>

`dbt clean` is a utility function that deletes all folders specified in the `clean-targets` list specified in `dbt_project.yml`. You can use this to delete the `dbt_packages` and `target` directories.

To avoid complex permissions issues and potentially deleting crucial aspects of the remote file system without access to fix them, this command does not work when interfacing with the RPC server that powers the dbt Cloud IDE. Instead, when working in dbt Cloud, the `dbt deps` command cleans before it installs pacakges automatically. The `target` folder can be manually deleted from the sidbear file tree if needed.
