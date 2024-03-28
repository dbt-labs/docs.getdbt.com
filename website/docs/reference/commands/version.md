---
title: "About dbt --version"
sidebar_label: "version"
id: "version"
---

The `--version` command-line flag returns information about the currently installed version of dbt Core or the dbt Cloud CLI. This flag is not supported when invoking dbt in other dbt Cloud runtimes (for example, the IDE or scheduled runs).

- **dbt Core** &mdash; Returns the installed version of dbt-core and the adapters (which is one local bundle).
- **dbt Cloud CLI** &mdash; Returns the installed version of the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) and, for the other `dbt_version` values, the _latest_ version of the dbt runtime in dbt Cloud.


## Versioning
To learn more about release versioning for dbt Core, refer to [How dbt Core uses semantic versioning](docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning). 

If the [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version) setting is selected in dbt Cloud, then `dbt_version` will be the latest (continuous) release version. This also follows semantic versioning guidelines, in the format `YYYY.xx.yy`, with the major version representing the year (for example, `2024.04.1234`).

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
