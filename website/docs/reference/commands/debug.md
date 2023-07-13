---
title: "About dbt debug command"
sidebar_label: "debug"
id: "debug"
---

<Changelog>
* **dbt v1.6**: The `dbt debug --connection` flag is introduced to test the data platform connection _only_.
</Changelog>

<VersionBlock firstVersion="1.6">

`dbt debug --connection` is a utility function that allows you to test the data platform connection _only_. To view information for debugging purposes, use `dbt debug` without the `--connection` flag.

*Note: This is not to be confused with [debug-level logging](/reference/global-configs/about-global-configs#debug-level-logging) via the `--debug` option which increases verbosity.

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
