---
title: "About dbt debug command"
sidebar_label: "debug"
id: "debug"
---


`dbt debug` is a utility function to test the database connection and display information for debugging purposes, such as the validity of your project file, the [dbt version](/reference/dbt-jinja-functions/dbt_version), and your installation of any requisite dependencies (like `git` when you run `dbt deps`).

*Note: Not to be confused with [debug-level logging](/reference/global-configs/logs#debug-level-logging) via the `--debug` option which increases verbosity.

## Example usage

Only test the connection to the data platform and skip the other checks `dbt debug` looks for:

```shell
$ dbt debug --connection
```

Show the configured location for the `profiles.yml` file and exit:

```text
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```
