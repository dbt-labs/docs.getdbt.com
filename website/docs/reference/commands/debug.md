---
title: "About dbt debug command"
sidebar_label: "debug"
id: "debug"
---

<Changelog>
* dbt v1.6: The <code>dbt debug --connection</code> flag is introduced to only test the data platform connection in your profile.
</Changelog>

`dbt debug` is a utility function to test the database connection and display information for debugging purposes, such as the validity of your project file and your installation of any requisite dependencies (like `git` when you run `dbt deps`).

*Note: Not to be confused with [debug-level logging](/reference/global-configs/about-global-configs#debug-level-logging) via the `--debug` option which increases verbosity.

<VersionBlock firstVersion="1.6">

### `--connection` option

To test the data platform connection _only_, add the `--connection` flag at the end of the command. For example, `dbt debug --connection` will only test the connection to the data platform and skip the other checks `dbt debug` looks for. 

</VersionBlock>

### `--config-dir` option

The `--config-dir` option to `dbt debug` will show the configured location for the `profiles.yml` file and exit:

```text
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```
