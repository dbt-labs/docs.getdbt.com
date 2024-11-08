---
title: "About dbt --version"
sidebar_label: "version"
id: "version"
---

The `--version` command-line flag returns information about the currently installed version of dbt Core or the dbt Cloud CLI. This flag is not supported when invoking dbt in other dbt Cloud runtimes (for example, the IDE or scheduled runs).

- **dbt Core** &mdash; Returns the installed version of dbt-core and the versions of all installed adapters.
- **dbt Cloud CLI** &mdash; Returns the installed version of the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) and, for the other `dbt_version` values, the _latest_ version of the dbt runtime in dbt Cloud.


## Versioning
To learn more about release versioning for dbt Core, refer to [How dbt Core uses semantic versioning](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning). 

If using [versionless dbt Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless), then `dbt_version` uses the latest (continuous) release version. This also follows semantic versioning guidelines, using the `YYYY.MM.DD+<suffix>` format. The year, month, and day represent the date the version was built (for example, `2024.10.28+996c6a8`). The suffix provides an additional unique identification for each build.

## Example usages

dbt Core example: 
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

dbt Cloud CLI example:

<File name='dbt Cloud CLI'>

```text
$ dbt --version
dbt Cloud CLI - 0.35.7 (fae78a6f5f6f2d7dff3cab3305fe7f99bd2a36f3 2024-01-18T22:34:52Z)
```

</File>
