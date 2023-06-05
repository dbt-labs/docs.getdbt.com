---
title: "Global CLI flags"
id: "global-cli-flags"
---

dbt commands, such as `run` or `test`, support their own command-specific CLI flags. In addition, the dbt command itself supports "global" flags applicable to *all* subcommands.

As of v1.0, the vast majority of global CLI flags map to [global configs](/reference/global-configs/about-global-configs), which can also be configured via environment variables or in the `profiles.yml`.

The `--version` and `--record-timing-info` flags remain available to the CLI only.

## Version

The `--version` flag returns information about the currently installed version of dbt.

<File name='Usage'>

```text
$ dbt --version
installed version: 0.15.1
   latest version: 0.15.1

Up to date!
```

</File>

## Record timing info

The `-r` or `--record-timing-info` flag saves performance profiling information to a file. This file can be visualized with `snakeviz` to understand the performance characteristics of a dbt invocation

<File name='Usage'>

```text
$ dbt -r timing.txt run
...

$ snakeviz timing.txt
```

</File>
