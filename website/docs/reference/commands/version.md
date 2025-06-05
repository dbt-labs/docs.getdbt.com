---
title: "About dbt --version"
sidebar_label: "version"
id: "version"
---

The `--version` command-line flag returns information about the currently installed version of <Constant name="core" /> or the <Constant name="cloud_cli" />. This flag is not supported when invoking dbt in other <Constant name="cloud" /> runtimes (for example, the IDE or scheduled runs).

- **<Constant name="core" />** &mdash; Returns the installed version of <Constant name="core" /> and the versions of all installed adapters.
- **<Constant name="cloud_cli" />** &mdash; Returns the installed version of the [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) and, for the other `dbt_version` values, the _latest_ version of the dbt runtime in <Constant name="cloud" />.


## Versioning
To learn more about release versioning for <Constant name="core" />, refer to [How <Constant name="core" /> uses semantic versioning](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning). 

If using a [<Constant name="cloud" /> release track](/docs/dbt-versions/cloud-release-tracks), which provide ongoing updates to dbt, then `dbt_version` represents the release version of dbt in <Constant name="cloud" />. This also follows semantic versioning guidelines, using the `YYYY.M.D+<suffix>` format. The year, month, and day represent the date the version was built (for example, `2024.10.8+996c6a8`). The suffix provides an additional unique identification for each build.

## Example usages

<Constant name="core" /> example: 
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

<Constant name="cloud" /> CLI example:

<File name='dbt CLI'>

```text
$ dbt --version
Cloud CLI - 0.35.7 (fae78a6f5f6f2d7dff3cab3305fe7f99bd2a36f3 2024-01-18T22:34:52Z)
```

</File>
