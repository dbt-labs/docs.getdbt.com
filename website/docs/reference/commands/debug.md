---
title: "About dbt debug command"
sidebar_label: "debug"
id: "debug"
---

<Changelog>
* **dbt v1.6**: The `dbt debug --connection` flag is introduced to _only_ test the data platform connection in your profile.
</Changelog>

<VersionBlock firstVersion="1.6">

`dbt debug` is a utility function to test the database connection and display information for debugging purposes, such as the validity of your project file and your installation of any requisite dependencies (like `git` when you run `dbt deps`).

To test the data platform connection _only_, add the `--connection` flag at the end of the command. For example, `dbt debug --connection` will only test the connection to the data platform and skip the other checks `dbt debug` looks for. 

*Note: Not to be confused with [debug-level logging](/reference/global-configs/about-global-configs#debug-level-logging) via the `--debug` option which increases verbosity.

The `--config-dir` option to `dbt debug` will show the configured location for the `profiles.yml` file and exit:

```text
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```

</VersionBlock>


<VersionBlock lastVersion="1.5">

`dbt debug` is a utility function to test the database connection and show information for debugging purposes.  

*Note: Not to be confused with [debug-level logging](/reference/global-configs/about-global-configs#debug-level-logging) via the `--debug` option which increases verbosity.

The `--config-dir` option to `dbt debug` will show the configured location for the `profiles.yml` file and exit:

```text
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```

</VersionBlock>
