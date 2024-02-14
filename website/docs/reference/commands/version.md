---
title: "About dbt --version"
sidebar_label: "version"
id: "version"
---

The `--version` command-line flag returns information about the currently installed version of dbt Core or the dbt Cloud CLI.

This flag is not supported when invoking dbt in other dbt Cloud runtimes (for example, the IDE or scheduled runs).

<File name='dbt Core'>

```text
$ dbt --version
Core:
  - installed: 1.7.6
  - latest:    1.7.6 - Up to date!
Plugins:
  - snowflake: 1.7.1 - Up to date!
```

</File>

<File name='dbt Cloud CLI'>

```text
$ dbt --version
dbt Cloud CLI - 0.35.7 (fae78a6f5f6f2d7dff3cab3305fe7f99bd2a36f3 2024-01-18T22:34:52Z)
```

</File>
